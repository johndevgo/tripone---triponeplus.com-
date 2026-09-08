-- TripOne+ Part 4 milestones 3-4: typed detail templates, saved sections and
-- optimistic page revisions. All public access continues through snapshots.

create type public.template_kind as enum (
  'experience_detail', 'rental_detail', 'taxonomy_landing', 'location_detail'
);
create type public.saved_section_mode as enum ('copy', 'linked');

create table public.site_templates (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  template_kind public.template_kind not null,
  subtype text not null default 'default' check (char_length(subtype) between 1 and 80),
  name text not null check (char_length(name) between 2 and 120),
  sections jsonb not null default '[]'::jsonb,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, template_kind, subtype),
  unique (id, site_id)
);
create index site_templates_site_idx
  on public.site_templates(site_id, template_kind, subtype);
create trigger site_templates_updated before update on public.site_templates
for each row execute function public.set_updated_at();

create table public.saved_sections (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  section_type text not null check (char_length(section_type) between 2 and 80),
  variant text not null check (char_length(variant) between 1 and 80),
  settings jsonb not null default '{}'::jsonb,
  save_mode public.saved_section_mode not null default 'copy',
  revision integer not null default 1 check (revision > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index saved_sections_site_idx on public.saved_sections(site_id, updated_at desc);
create trigger saved_sections_updated before update on public.saved_sections
for each row execute function public.set_updated_at();

alter table public.pages add column revision bigint not null default 1 check (revision > 0);
alter table public.experiences
  add column template_id uuid,
  add column template_version integer check (template_version is null or template_version > 0),
  add column sections_override jsonb,
  add foreign key (template_id, site_id)
    references public.site_templates(id, site_id) on delete restrict;
alter table public.rental_products
  add column template_id uuid,
  add column template_version integer check (template_version is null or template_version > 0),
  add foreign key (template_id, site_id)
    references public.site_templates(id, site_id) on delete restrict;
alter table public.taxonomy_terms
  add column template_id uuid,
  add column template_version integer check (template_version is null or template_version > 0),
  add foreign key (template_id, site_id)
    references public.site_templates(id, site_id) on delete restrict;

create index experiences_template_idx on public.experiences(template_id) where template_id is not null;
create index rental_products_template_idx on public.rental_products(template_id) where template_id is not null;
create index taxonomy_terms_template_idx on public.taxonomy_terms(template_id) where template_id is not null;

create or replace function public.bump_page_revision()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.revision = old.revision then new.revision := old.revision + 1; end if;
  return new;
end
$$;
create trigger pages_bump_revision before update on public.pages
for each row execute function public.bump_page_revision();

create or replace function public.save_page_draft(
  target_site uuid, target_page uuid, expected_revision bigint, new_sections jsonb
)
returns table(revision bigint, saved_at timestamptz)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not (select public.owns_site(target_site)) then raise exception 'Not authorized'; end if;
  if jsonb_typeof(new_sections) <> 'array' or jsonb_array_length(new_sections) > 60 then
    raise exception 'Invalid page sections';
  end if;
  update public.pages
  set sections = new_sections
  where id = target_page and site_id = target_site and pages.revision = expected_revision
  returning pages.revision, pages.updated_at into revision, saved_at;
  if not found then
    if not exists(select 1 from public.pages where id = target_page and site_id = target_site) then
      raise exception 'Page not found';
    end if;
    raise exception 'This page changed in another tab. Refresh before saving again.';
  end if;
  return next;
end
$$;
revoke all on function public.save_page_draft(uuid, uuid, bigint, jsonb) from public;
grant execute on function public.save_page_draft(uuid, uuid, bigint, jsonb) to authenticated;

alter table public.site_templates enable row level security;
alter table public.saved_sections enable row level security;
create policy "site templates owner all" on public.site_templates for all to authenticated
using ((select public.owns_site(site_id))) with check ((select public.owns_site(site_id)));
create policy "saved sections owner all" on public.saved_sections for all to authenticated
using ((select public.owns_site(site_id))) with check ((select public.owns_site(site_id)));
revoke all on table public.site_templates, public.saved_sections from anon, authenticated;
grant select, insert, update, delete on table public.site_templates, public.saved_sections to authenticated;

-- Create safe defaults once per site; callers can customize these without
-- duplicating the production renderer.
insert into public.site_templates(site_id, template_kind, subtype, name, sections)
select s.id, seed.kind, 'default', seed.name, seed.sections
from public.sites s
cross join lateral (values
  ('experience_detail'::public.template_kind, 'Default experience detail',
    '[{"id":"template-experience-hero","type":"hero","variant":"cinematic","visible":true,"settings":{"title":"{{experience.name}}"}},{"id":"template-experience-content","type":"richText","variant":"editorial","visible":true,"settings":{"title":"About this experience"}}]'::jsonb),
  ('rental_detail'::public.template_kind, 'Default rental detail',
    '[{"id":"template-rental-hero","type":"hero","variant":"product","visible":true,"settings":{"title":"{{rental.name}}"}},{"id":"template-rental-content","type":"features","variant":"specifications","visible":true,"settings":{"title":"Rental details"}}]'::jsonb),
  ('taxonomy_landing'::public.template_kind, 'Default taxonomy landing',
    '[{"id":"template-taxonomy-hero","type":"hero","variant":"destination","visible":true,"settings":{"title":"{{term.name}}"}},{"id":"template-taxonomy-listing","type":"experienceGrid","variant":"cards","visible":true,"settings":{"title":"Explore"}}]'::jsonb),
  ('location_detail'::public.template_kind, 'Default location detail',
    '[{"id":"template-location-hero","type":"hero","variant":"destination","visible":true,"settings":{"title":"{{location.name}}"}},{"id":"template-location-listing","type":"experienceGrid","variant":"cards","visible":true,"settings":{"title":"Available experiences"}}]'::jsonb)
) seed(kind, name, sections)
on conflict (site_id, template_kind, subtype) do nothing;

create or replace function public.ensure_new_site_templates()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.site_templates(site_id, template_kind, subtype, name, sections)
  values
    (new.id, 'experience_detail', 'default', 'Default experience detail',
      '[{"id":"template-experience-hero","type":"hero","variant":"cinematic","visible":true,"settings":{"title":"{{experience.name}}"}}]'::jsonb),
    (new.id, 'rental_detail', 'default', 'Default rental detail',
      '[{"id":"template-rental-hero","type":"hero","variant":"product","visible":true,"settings":{"title":"{{rental.name}}"}}]'::jsonb),
    (new.id, 'taxonomy_landing', 'default', 'Default taxonomy landing',
      '[{"id":"template-taxonomy-hero","type":"hero","variant":"destination","visible":true,"settings":{"title":"{{term.name}}"}}]'::jsonb),
    (new.id, 'location_detail', 'default', 'Default location detail',
      '[{"id":"template-location-hero","type":"hero","variant":"destination","visible":true,"settings":{"title":"{{location.name}}"}}]'::jsonb);
  return new;
end
$$;
create trigger sites_create_templates after insert on public.sites
for each row execute function public.ensure_new_site_templates();
revoke all on function public.ensure_new_site_templates() from public;
