-- TripOne+ Part 3: production domains, tenant resolution and privacy-first analytics.

alter table public.domains
  add column if not exists provider_data jsonb not null default '{}',
  add column if not exists last_checked_at timestamptz,
  add column if not exists last_error text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'domains_hostname_format_check'
      and conrelid = 'public.domains'::regclass
  ) then
    alter table public.domains add constraint domains_hostname_format_check
      check (
        hostname = lower(hostname)
        and char_length(hostname) between 4 and 253
        and hostname ~ '^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])$'
        and hostname !~ '\.\.'
      );
  end if;
end $$;

create index if not exists domains_verified_hostname_idx
  on public.domains(hostname, site_id) where verification_status = 'verified';

-- Every site always has a verified TripOne+ fallback hostname.
insert into public.domains(site_id, hostname, domain_type, verification_status, is_primary, verified_at)
select s.id, s.slug || '.triponeplus.com', 'subdomain', 'verified',
  not exists (select 1 from public.domains d where d.site_id = s.id and d.is_primary), now()
from public.sites s
on conflict (hostname) do nothing;

create or replace function public.ensure_site_subdomain()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' and old.slug <> new.slug then
    update public.domains
    set hostname = new.slug || '.triponeplus.com'
    where site_id = new.id and domain_type = 'subdomain';
  else
    insert into public.domains(site_id, hostname, domain_type, verification_status, is_primary, verified_at)
    values(new.id, new.slug || '.triponeplus.com', 'subdomain', 'verified', true, now())
    on conflict (hostname) do nothing;
  end if;
  return new;
end $$;
revoke all on function public.ensure_site_subdomain() from public;

drop trigger if exists sites_ensure_subdomain on public.sites;
create trigger sites_ensure_subdomain
after insert or update of slug on public.sites
for each row execute function public.ensure_site_subdomain();

create table public.analytics_events (
  id bigint generated always as identity primary key,
  site_id uuid not null references public.sites(id) on delete cascade,
  event_name text not null check (event_name in (
    'page_view','experience_view','booking_click','whatsapp_click',
    'phone_click','lead_submit','cta_click'
  )),
  page_path text not null check (
    char_length(page_path) between 1 and 500 and page_path like '/%'
  ),
  experience_id uuid references public.experiences(id) on delete set null,
  referrer_domain text,
  session_id text not null check (char_length(session_id) between 16 and 128),
  device_category text check (device_category in ('mobile','tablet','desktop')),
  created_at timestamptz not null default now()
);

create index analytics_events_site_time_idx
  on public.analytics_events(site_id, created_at desc);
create index analytics_events_site_name_time_idx
  on public.analytics_events(site_id, event_name, created_at desc);
create index analytics_events_experience_idx
  on public.analytics_events(experience_id) where experience_id is not null;
create index analytics_events_session_idx
  on public.analytics_events(site_id, session_id, created_at desc);

alter table public.analytics_events enable row level security;
create policy "analytics owner select" on public.analytics_events
for select to authenticated
using ((select public.owns_site(site_id)));
grant select on public.analytics_events to authenticated;
revoke insert, update, delete on public.analytics_events from anon, authenticated;

create table if not exists private.analytics_rate_limits (
  site_id uuid not null references public.sites(id) on delete cascade,
  fingerprint text not null,
  window_start timestamptz not null default date_trunc('hour', now()),
  submissions integer not null default 1 check (submissions between 1 and 240),
  primary key(site_id, fingerprint, window_start)
);
create index if not exists analytics_rate_limits_window_idx
  on private.analytics_rate_limits(window_start);

create or replace function public.get_published_site_by_hostname(input_hostname text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'snapshot', s.published_snapshot,
    'requestedHostname', d.hostname,
    'primaryHostname', coalesce(
      (select primary_domain.hostname from public.domains primary_domain
       where primary_domain.site_id = s.id
         and primary_domain.is_primary
         and primary_domain.verification_status = 'verified'
       limit 1),
      s.slug || '.triponeplus.com'
    )
  )
  from public.domains d
  join public.sites s on s.id = d.site_id
  where d.hostname = lower(trim(trailing '.' from input_hostname))
    and d.verification_status = 'verified'
    and s.status = 'published'
    and s.published_snapshot is not null
  limit 1
$$;
revoke all on function public.get_published_site_by_hostname(text) from public;
grant execute on function public.get_published_site_by_hostname(text) to anon, authenticated;

create or replace function public.get_tenant_redirect(input_hostname text, input_path text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'destination', r.destination_path,
    'statusCode', r.status_code
  )
  from public.domains d
  join public.sites s on s.id = d.site_id
  join public.redirects r on r.site_id = s.id
  where d.hostname = lower(trim(trailing '.' from input_hostname))
    and d.verification_status = 'verified'
    and s.status = 'published'
    and r.source_path = input_path
  limit 1
$$;
revoke all on function public.get_tenant_redirect(text, text) from public;
grant execute on function public.get_tenant_redirect(text, text) to anon, authenticated;

create or replace function public.set_primary_domain(target_domain uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare target_site uuid;
begin
  select d.site_id into target_site from public.domains d
  where d.id = target_domain and d.verification_status = 'verified';
  if target_site is null or not (select public.owns_site(target_site)) then
    raise exception 'Verified domain not found';
  end if;
  perform pg_advisory_xact_lock(hashtext('primary-domain:' || target_site::text));
  update public.domains set is_primary = false where site_id = target_site and is_primary;
  update public.domains set is_primary = true where id = target_domain and site_id = target_site;
end $$;
revoke all on function public.set_primary_domain(uuid) from public;
grant execute on function public.set_primary_domain(uuid) to authenticated;

create or replace function public.submit_analytics_event(payload jsonb, fingerprint text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_site uuid;
  target_experience uuid;
  current_count integer;
  clean_hostname text := lower(trim(trailing '.' from coalesce(payload->>'hostname', '')));
  clean_path text := left(coalesce(payload->>'pagePath', '/'), 500);
  clean_referrer text := nullif(left(lower(coalesce(payload->>'referrerDomain', '')), 253), '');
begin
  if fingerprint is null or length(fingerprint) not between 16 and 128 then
    raise exception 'Invalid event';
  end if;
  if coalesce(payload->>'eventName', '') not in (
    'page_view','experience_view','booking_click','whatsapp_click',
    'phone_click','lead_submit','cta_click'
  ) then raise exception 'Invalid event'; end if;
  if clean_path not like '/%' or clean_path like '//%' then raise exception 'Invalid path'; end if;
  if length(coalesce(payload->>'sessionId', '')) not between 16 and 128 then raise exception 'Invalid session'; end if;
  if coalesce(payload->>'deviceCategory', '') not in ('mobile','tablet','desktop') then raise exception 'Invalid device'; end if;

  select s.id into target_site
  from public.domains d join public.sites s on s.id = d.site_id
  where d.hostname = clean_hostname and d.verification_status = 'verified'
    and s.status = 'published' and s.published_snapshot is not null
  limit 1;
  if target_site is null then raise exception 'Website unavailable'; end if;

  insert into private.analytics_rate_limits(site_id, fingerprint, window_start, submissions)
  values(target_site, fingerprint, date_trunc('hour', now()), 1)
  on conflict(site_id, fingerprint, window_start)
  do update set submissions = private.analytics_rate_limits.submissions + 1
  where private.analytics_rate_limits.submissions < 240
  returning submissions into current_count;
  if current_count is null then raise exception 'Too many events'; end if;

  if nullif(payload->>'experienceId', '') is not null then
    select id into target_experience from public.experiences
    where id = (payload->>'experienceId')::uuid and site_id = target_site;
    if target_experience is null then raise exception 'Invalid experience'; end if;
  end if;

  insert into public.analytics_events(
    site_id,event_name,page_path,experience_id,referrer_domain,
    session_id,device_category
  ) values (
    target_site,payload->>'eventName',clean_path,target_experience,clean_referrer,
    payload->>'sessionId',payload->>'deviceCategory'
  );
end $$;
revoke all on function public.submit_analytics_event(jsonb, text) from public;
grant execute on function public.submit_analytics_event(jsonb, text) to anon, authenticated;

create or replace function public.submit_public_lead(payload jsonb, fingerprint text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_site uuid;
  requested_site uuid;
  target_experience uuid;
  created_lead uuid;
  current_count integer;
  clean_email text := lower(trim(payload->>'email'));
  clean_hostname text := lower(trim(trailing '.' from coalesce(payload->>'hostname', '')));
begin
  if coalesce(payload->>'website', '') <> '' then raise exception 'Submission rejected'; end if;
  if fingerprint is null or length(fingerprint) not between 16 and 128 then raise exception 'Invalid submission'; end if;
  requested_site := (payload->>'siteId')::uuid;
  select s.id into target_site from public.domains d join public.sites s on s.id = d.site_id
  where d.hostname = clean_hostname and d.verification_status = 'verified'
    and s.id = requested_site and s.status = 'published' and s.published_snapshot is not null
  limit 1;
  if target_site is null then raise exception 'Website unavailable'; end if;
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

-- Replace publish_site so the immutable public snapshot includes brand assets,
-- production settings and only sufficiently complete locations.
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
  if not (select public.owns_site(target_site)) then raise exception 'Not authorized'; end if;
  perform pg_advisory_xact_lock(hashtext('publish:' || target_site::text));
  update public.pages set status = 'published' where site_id = target_site and status = 'draft';
  update public.experiences set status = 'published' where site_id = target_site and status = 'draft';

  select jsonb_build_object(
    'site', jsonb_build_object(
      'id', s.id, 'name', s.name, 'slug', s.slug, 'themeId', s.theme_id,
      'theme', s.theme_settings, 'globalSettings', s.global_settings,
      'navigation', s.navigation, 'footer', s.footer_settings,
      'seoSettings', s.seo_settings, 'croSettings', s.cro_settings,
      'faviconUrl', s.favicon_url, 'defaultOgImageUrl', s.default_og_image_url
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
        and char_length(trim(l.description)) >= 120
    ),
    'testimonials', (
      select coalesce(jsonb_agg(to_jsonb(t) order by t.sort_order), '[]'::jsonb)
      from public.testimonials t where t.site_id = s.id and t.status = 'published'
    ),
    'redirects', (
      select coalesce(jsonb_agg(to_jsonb(r) order by r.source_path), '[]'::jsonb)
      from public.redirects r where r.site_id = s.id
    ),
    'publishedAt', now()
  ) into next_snapshot from public.sites s where s.id = target_site;
  if next_snapshot is null then raise exception 'Website not found'; end if;

  update public.sites set status = 'published', published_at = now(),
    published_snapshot = next_snapshot where id = target_site;
  select coalesce(max(version_number), 0) + 1 into next_version
  from public.site_versions where site_id = target_site;
  insert into public.site_versions(site_id, version_number, snapshot, created_by, label)
  values(target_site, next_version, next_snapshot, (select auth.uid()), 'Published version');
end $$;
revoke all on function public.publish_site(uuid) from public;
grant execute on function public.publish_site(uuid) to authenticated;

-- Housekeeping can be scheduled later with Supabase Cron; indexes keep it cheap.
comment on table public.analytics_events is
  'Privacy-conscious first-party events. No IP addresses or lead payloads are stored.';
