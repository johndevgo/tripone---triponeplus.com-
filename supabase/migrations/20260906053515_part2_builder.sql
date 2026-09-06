-- TripOne+ Part 2: private drafts, immutable publish snapshots and safe public leads.
alter table public.sites
  add column if not exists published_snapshot jsonb,
  add column if not exists seo_settings jsonb not null default '{}',
  add column if not exists cro_settings jsonb not null default '{"stickyMobileCta":true,"whatsappEnabled":true,"phoneEnabled":true}';

alter table public.leads add column if not exists updated_at timestamptz not null default now();
alter table public.media add column if not exists updated_at timestamptz not null default now();
alter table public.experiences add column if not exists seo_settings jsonb not null default '{}';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'leads_status_check' and conrelid = 'public.leads'::regclass
  ) then
    alter table public.leads add constraint leads_status_check
      check (status in ('new','contacted','qualified','won','closed'));
  end if;
end $$;

create trigger leads_updated before update on public.leads
for each row execute function public.set_updated_at();
create trigger media_updated before update on public.media
for each row execute function public.set_updated_at();

-- PostgreSQL does not create indexes for foreign-key columns automatically.
create index if not exists pages_parent_page_idx on public.pages(parent_page_id);
create index if not exists experiences_business_idx on public.experiences(business_id);
create index if not exists locations_site_idx on public.locations(site_id);
create index if not exists locations_business_idx on public.locations(business_id);
create index if not exists testimonials_site_idx on public.testimonials(site_id);
create index if not exists leads_experience_idx on public.leads(experience_id) where experience_id is not null;
create index if not exists site_versions_site_idx on public.site_versions(site_id);
create index if not exists site_versions_created_by_idx on public.site_versions(created_by);
create index if not exists domains_site_idx on public.domains(site_id);
create index if not exists redirects_site_idx on public.redirects(site_id);
create index if not exists experiences_site_status_idx on public.experiences(site_id, status, sort_order);
create index if not exists pages_site_status_idx on public.pages(site_id, status, sort_order);

-- Public visitors read only the consistent published snapshot, never working rows.
drop policy if exists "published business public" on public.businesses;
drop policy if exists "published sites public" on public.sites;
drop policy if exists "published pages public" on public.pages;
drop policy if exists "published experiences public" on public.experiences;
drop policy if exists "published locations public" on public.locations;
drop policy if exists "published testimonials public" on public.testimonials;
drop policy if exists "published media public" on public.media;

revoke all on table public.businesses, public.sites, public.pages, public.experiences,
  public.locations, public.testimonials, public.media from anon;

create or replace function public.get_published_site_snapshot(identifier text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select s.published_snapshot
  from public.sites s
  where s.status = 'published'
    and s.published_snapshot is not null
    and (s.slug = identifier or s.id::text = identifier)
  limit 1
$$;
revoke all on function public.get_published_site_snapshot(text) from public;
grant execute on function public.get_published_site_snapshot(text) to anon, authenticated;

-- Versions are append-only history.
drop policy if exists "versions owner all" on public.site_versions;
create policy "versions owner select" on public.site_versions for select to authenticated
using ((select public.owns_site(site_id)));
create policy "versions owner insert" on public.site_versions for insert to authenticated
with check ((select public.owns_site(site_id)) and created_by = (select auth.uid()));
revoke update, delete on table public.site_versions from authenticated;

create or replace function public.publish_site(target_site uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  next_version integer;
  next_snapshot jsonb;
begin
  if not (select public.owns_site(target_site)) then
    raise exception 'Not authorized';
  end if;

  perform pg_advisory_xact_lock(hashtext('publish:' || target_site::text));
  update public.pages set status = 'published' where site_id = target_site and status = 'draft';
  update public.experiences set status = 'published' where site_id = target_site and status = 'draft';

  select jsonb_build_object(
    'site', jsonb_build_object(
      'id', s.id, 'name', s.name, 'slug', s.slug, 'themeId', s.theme_id,
      'theme', s.theme_settings, 'globalSettings', s.global_settings,
      'navigation', s.navigation, 'footer', s.footer_settings,
      'seoSettings', s.seo_settings, 'croSettings', s.cro_settings,
      'defaultOgImageUrl', s.default_og_image_url
    ),
    'business', (
      select to_jsonb(b) - 'owner_id' - 'created_at' - 'updated_at'
      from public.businesses b where b.id = s.business_id
    ),
    'pages', (
      select coalesce(jsonb_agg(to_jsonb(p) order by p.sort_order), '[]'::jsonb)
      from public.pages p where p.site_id = s.id and p.status = 'published'
    ),
    'experiences', (
      select coalesce(jsonb_agg(to_jsonb(e) order by e.sort_order), '[]'::jsonb)
      from public.experiences e where e.site_id = s.id and e.status = 'published'
    ),
    'locations', (
      select coalesce(jsonb_agg(to_jsonb(l) order by l.name), '[]'::jsonb)
      from public.locations l where l.site_id = s.id
    ),
    'testimonials', (
      select coalesce(jsonb_agg(to_jsonb(t) order by t.sort_order), '[]'::jsonb)
      from public.testimonials t where t.site_id = s.id and t.status = 'published'
    ),
    'publishedAt', now()
  ) into next_snapshot
  from public.sites s where s.id = target_site;

  if next_snapshot is null then raise exception 'Website not found'; end if;

  update public.sites
  set status = 'published', published_at = now(), published_snapshot = next_snapshot
  where id = target_site;

  select coalesce(max(version_number), 0) + 1 into next_version
  from public.site_versions where site_id = target_site;

  insert into public.site_versions(site_id, version_number, snapshot, created_by, label)
  values(target_site, next_version, next_snapshot, (select auth.uid()), 'Published version');
end $$;
revoke all on function public.publish_site(uuid) from public;
grant execute on function public.publish_site(uuid) to authenticated;

-- The only anonymous write path. It validates data and limits repeated submissions.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table if not exists private.lead_rate_limits (
  site_id uuid not null references public.sites(id) on delete cascade,
  fingerprint text not null,
  window_start timestamptz not null default date_trunc('hour', now()),
  submissions integer not null default 1 check (submissions between 1 and 5),
  primary key(site_id, fingerprint, window_start)
);
create index if not exists lead_rate_limits_window_idx on private.lead_rate_limits(window_start);

drop policy if exists "public lead insert" on public.leads;
revoke insert on table public.leads from anon, authenticated;

create or replace function public.submit_public_lead(payload jsonb, fingerprint text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_site uuid;
  target_experience uuid;
  created_lead uuid;
  current_count integer;
  clean_email text := lower(trim(payload->>'email'));
begin
  if coalesce(payload->>'website', '') <> '' then raise exception 'Submission rejected'; end if;
  if fingerprint is null or length(fingerprint) < 16 or length(fingerprint) > 128 then raise exception 'Invalid submission'; end if;
  target_site := (payload->>'siteId')::uuid;
  if not exists (select 1 from public.sites where id = target_site and status = 'published') then raise exception 'Website unavailable'; end if;
  if length(trim(payload->>'name')) not between 2 and 100 then raise exception 'Enter your name'; end if;
  if clean_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then raise exception 'Enter a valid email'; end if;
  if length(coalesce(payload->>'message', '')) > 3000 then raise exception 'Message is too long'; end if;

  insert into private.lead_rate_limits(site_id, fingerprint, window_start, submissions)
  values(target_site, fingerprint, date_trunc('hour', now()), 1)
  on conflict(site_id, fingerprint, window_start)
  do update set submissions = private.lead_rate_limits.submissions + 1
  where private.lead_rate_limits.submissions < 5
  returning submissions into current_count;
  if current_count is null then raise exception 'Too many enquiries. Please try again later.'; end if;

  if nullif(payload->>'experienceId', '') is not null then
    select id into target_experience from public.experiences
    where id = (payload->>'experienceId')::uuid and site_id = target_site and status = 'published';
    if target_experience is null then raise exception 'Invalid experience'; end if;
  end if;

  insert into public.leads(site_id, experience_id, name, email, phone, desired_date, guests, message, source_page)
  values(target_site, target_experience, trim(payload->>'name'), clean_email,
    nullif(trim(payload->>'phone'), ''), nullif(payload->>'desiredDate', '')::date,
    nullif(payload->>'guests', '')::integer, nullif(trim(payload->>'message'), ''),
    left(coalesce(payload->>'sourcePage', '/'), 300))
  returning id into created_lead;
  return created_lead;
end $$;
revoke all on function public.submit_public_lead(jsonb, text) from public;
grant execute on function public.submit_public_lead(jsonb, text) to anon, authenticated;

grant select, insert, update, delete on table public.businesses, public.sites, public.pages,
  public.experiences, public.locations, public.testimonials, public.media,
  public.domains, public.redirects to authenticated;
grant select, update on table public.leads to authenticated;
grant select, insert on table public.site_versions to authenticated;
