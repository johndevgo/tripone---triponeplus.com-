-- TripOne+ operations core: packages, customers, bookings, availability and resources.
--
-- Purpose
--   Add the day-to-day operating layer around the existing website CMS without
--   replacing experiences, rental products, taxonomies or immutable publishing.
--
-- Upgrade behavior
--   All changes are additive. Existing leads are normalized into the expanded
--   pipeline, existing sites gain empty operational collections, and publication
--   snapshots are enriched by triggers without replacing public.publish_site().
--
-- Rollback considerations
--   Application rollback is safe because old decoders ignore new snapshot keys.
--   Database rollback would require intentionally exporting operational records
--   before dropping the new tables; this migration never deletes legacy data.
--
-- Existing-data compatibility
--   Legacy experiences and rentals remain canonical. Packages reference those
--   records, and the new Products & Services UI composes them at read time.

create type public.booking_status as enum (
  'draft', 'pending', 'awaiting_confirmation', 'confirmed',
  'cancelled', 'completed', 'no_show'
);
create type public.booking_source as enum (
  'website', 'manual', 'phone', 'whatsapp', 'walk_in',
  'email', 'ota', 'partner', 'other'
);
create type public.departure_status as enum ('open', 'closed', 'cancelled');
create type public.resource_status as enum (
  'available', 'unavailable', 'maintenance', 'archived'
);

create table public.packages (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 140),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  short_description text not null default '' check (char_length(short_description) <= 280),
  description text not null default '',
  duration_days integer check (duration_days > 0),
  price_from numeric(12,2) check (price_from >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  pricing_label text,
  booking_mode text not null default 'request'
    check (booking_mode in ('request', 'enquiry', 'external')),
  booking_url text,
  booking_button_label text not null default 'Request this package'
    check (char_length(booking_button_label) between 1 and 60),
  featured_image_url text,
  gallery jsonb not null default '[]'::jsonb,
  details jsonb not null default '{}'::jsonb,
  highlights jsonb not null default '[]'::jsonb,
  inclusions jsonb not null default '[]'::jsonb,
  exclusions jsonb not null default '[]'::jsonb,
  itinerary jsonb not null default '[]'::jsonb,
  faqs jsonb not null default '[]'::jsonb,
  policies jsonb not null default '[]'::jsonb,
  seo_settings jsonb not null default '{}'::jsonb,
  sections_override jsonb,
  featured boolean not null default false,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, slug),
  unique (id, site_id)
);

create table public.package_items (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null,
  site_id uuid not null,
  experience_id uuid,
  rental_product_id uuid,
  day_number integer check (day_number > 0),
  title text not null check (char_length(title) between 1 and 160),
  description text not null default '',
  optional boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  foreign key (package_id, site_id)
    references public.packages(id, site_id) on delete cascade,
  foreign key (experience_id, site_id)
    references public.experiences(id, site_id) on delete restrict,
  foreign key (rental_product_id, site_id)
    references public.rental_products(id, site_id) on delete restrict,
  check (num_nonnulls(experience_id, rental_product_id) <= 1)
);
create index package_items_package_idx on public.package_items(package_id);
create index package_items_experience_idx on public.package_items(experience_id)
  where experience_id is not null;
create index package_items_rental_idx on public.package_items(rental_product_id)
  where rental_product_id is not null;
create index package_items_site_idx on public.package_items(site_id);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  email text,
  email_normalized text generated always as (lower(trim(email))) stored,
  phone text,
  whatsapp text,
  country text,
  source text not null default 'manual' check (source in (
    'website','website_booking','phone','whatsapp','instagram','facebook',
    'email','google','referral','walk_in','ota','partner','manual','other'
  )),
  notes text not null default '' check (char_length(notes) <= 10000),
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, site_id)
);
create unique index customers_site_email_idx
  on public.customers(site_id, email_normalized)
  where email_normalized is not null and email_normalized <> '';
create index customers_site_created_idx
  on public.customers(site_id, created_at desc);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  resource_type text not null check (resource_type in (
    'vehicle','motorcycle','jet_ski','boat','yacht','atv','buggy','bicycle',
    'jeep','equipment','guide','driver','captain','instructor','capacity_pool','other'
  )),
  identifier text,
  status public.resource_status not null default 'available',
  capacity integer not null default 1 check (capacity > 0),
  notes text not null default '' check (char_length(notes) <= 10000),
  image_url text,
  specifications jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, site_id),
  unique (site_id, identifier)
);
create index resources_site_status_idx on public.resources(site_id, status, name);

create table public.availability_rules (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  experience_id uuid,
  rental_product_id uuid,
  package_id uuid,
  name text not null check (char_length(name) between 2 and 120),
  schedule_type text not null check (schedule_type in (
    'recurring','fixed_departures','date_range','on_request'
  )),
  starts_on date,
  ends_on date,
  days_of_week smallint[] not null default '{}',
  start_time time,
  end_time time,
  slot_interval_minutes integer check (slot_interval_minutes between 5 and 1440),
  blackout_dates date[] not null default '{}',
  capacity integer check (capacity > 0),
  minimum_participants integer check (minimum_participants > 0),
  minimum_notice_hours integer not null default 0 check (minimum_notice_hours >= 0),
  cutoff_hours integer not null default 0 check (cutoff_hours >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (experience_id, site_id)
    references public.experiences(id, site_id) on delete cascade,
  foreign key (rental_product_id, site_id)
    references public.rental_products(id, site_id) on delete cascade,
  foreign key (package_id, site_id)
    references public.packages(id, site_id) on delete cascade,
  check (num_nonnulls(experience_id, rental_product_id, package_id) = 1),
  check (starts_on is null or ends_on is null or ends_on >= starts_on),
  check (days_of_week <@ array[0,1,2,3,4,5,6]::smallint[])
);
create index availability_rules_experience_idx
  on public.availability_rules(experience_id) where experience_id is not null;
create index availability_rules_rental_idx
  on public.availability_rules(rental_product_id) where rental_product_id is not null;
create index availability_rules_package_idx
  on public.availability_rules(package_id) where package_id is not null;
create index availability_rules_site_active_idx
  on public.availability_rules(site_id, active);

create table public.departures (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  experience_id uuid,
  rental_product_id uuid,
  package_id uuid,
  starts_at timestamptz not null,
  ends_at timestamptz,
  capacity integer check (capacity > 0),
  minimum_participants integer check (minimum_participants > 0),
  status public.departure_status not null default 'open',
  notes text not null default '' check (char_length(notes) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, site_id),
  foreign key (experience_id, site_id)
    references public.experiences(id, site_id) on delete cascade,
  foreign key (rental_product_id, site_id)
    references public.rental_products(id, site_id) on delete cascade,
  foreign key (package_id, site_id)
    references public.packages(id, site_id) on delete cascade,
  check (num_nonnulls(experience_id, rental_product_id, package_id) = 1),
  check (ends_at is null or ends_at > starts_at)
);
create index departures_site_start_idx on public.departures(site_id, starts_at);
create index departures_open_start_idx on public.departures(site_id, starts_at)
  where status = 'open';
create index departures_experience_idx on public.departures(experience_id)
  where experience_id is not null;
create index departures_rental_idx on public.departures(rental_product_id)
  where rental_product_id is not null;
create index departures_package_idx on public.departures(package_id)
  where package_id is not null;

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  reference text not null check (reference ~ '^TP-[A-Z0-9-]{8,24}$'),
  customer_id uuid not null,
  experience_id uuid,
  rental_product_id uuid,
  package_id uuid,
  departure_id uuid,
  status public.booking_status not null default 'pending',
  source public.booking_source not null default 'website',
  starts_at timestamptz not null,
  ends_at timestamptz,
  adults integer not null default 1 check (adults >= 0),
  children integer not null default 0 check (children >= 0),
  guests integer generated always as (adults + children) stored,
  quantity integer not null default 1 check (quantity > 0),
  quoted_total numeric(12,2) check (quoted_total >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  customer_notes text not null default '' check (char_length(customer_notes) <= 5000),
  internal_notes text not null default '' check (char_length(internal_notes) <= 10000),
  details jsonb not null default '{}'::jsonb,
  idempotency_key text not null check (char_length(idempotency_key) between 16 and 128),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, reference),
  unique (site_id, idempotency_key),
  unique (id, site_id),
  foreign key (customer_id, site_id)
    references public.customers(id, site_id) on delete restrict,
  foreign key (experience_id, site_id)
    references public.experiences(id, site_id) on delete restrict,
  foreign key (rental_product_id, site_id)
    references public.rental_products(id, site_id) on delete restrict,
  foreign key (package_id, site_id)
    references public.packages(id, site_id) on delete restrict,
  foreign key (departure_id, site_id)
    references public.departures(id, site_id) on delete restrict,
  check (num_nonnulls(experience_id, rental_product_id, package_id) = 1),
  check (adults + children > 0),
  check (ends_at is null or ends_at > starts_at)
);
create index bookings_site_start_idx on public.bookings(site_id, starts_at);
create index bookings_site_status_start_idx
  on public.bookings(site_id, status, starts_at);
create index bookings_customer_idx on public.bookings(customer_id, starts_at desc);
create index bookings_departure_idx on public.bookings(departure_id)
  where departure_id is not null;
create index bookings_experience_idx on public.bookings(experience_id)
  where experience_id is not null;
create index bookings_rental_idx on public.bookings(rental_product_id)
  where rental_product_id is not null;
create index bookings_package_idx on public.bookings(package_id)
  where package_id is not null;

create table public.booking_resources (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  booking_id uuid not null,
  resource_id uuid not null,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (booking_id, resource_id),
  foreign key (booking_id, site_id)
    references public.bookings(id, site_id) on delete cascade,
  foreign key (resource_id, site_id)
    references public.resources(id, site_id) on delete restrict
);
create index booking_resources_resource_idx
  on public.booking_resources(resource_id, booking_id);
create index booking_resources_site_idx on public.booking_resources(site_id);

create table public.booking_activities (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  booking_id uuid not null,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null check (char_length(action) between 2 and 80),
  from_status public.booking_status,
  to_status public.booking_status,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  foreign key (booking_id, site_id)
    references public.bookings(id, site_id) on delete cascade
);
create index booking_activities_booking_idx
  on public.booking_activities(booking_id, created_at desc);
create index booking_activities_site_idx on public.booking_activities(site_id);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'leads_id_site_unique'
      and conrelid = 'public.leads'::regclass
  ) then
    alter table public.leads add constraint leads_id_site_unique unique (id, site_id);
  end if;
end;
$$;

alter table public.leads
  drop constraint if exists leads_status_check,
  add constraint leads_status_check check (
    status in ('new','contacted','qualified','proposal','won','lost','closed')
  ),
  add column customer_id uuid,
  add column rental_product_id uuid,
  add column package_id uuid,
  add column requested_destination text check (char_length(requested_destination) <= 200),
  add column interests text[] not null default '{}',
  add column budget_range text check (char_length(budget_range) <= 120),
  add column source text not null default 'website_form' check (source in (
    'website_form','website_booking','phone','whatsapp','instagram','facebook',
    'email','google','referral','walk_in','ota','partner','manual','other'
  )),
  add column estimated_value numeric(12,2) check (estimated_value >= 0),
  add column currency text check (currency is null or currency ~ '^[A-Z]{3}$'),
  add column assigned_to uuid references auth.users(id) on delete set null,
  add column follow_up_at timestamptz,
  add column lost_reason text,
  add constraint leads_customer_site_fkey foreign key (customer_id, site_id)
    references public.customers(id, site_id) on delete set null,
  add constraint leads_rental_site_fkey foreign key (rental_product_id, site_id)
    references public.rental_products(id, site_id) on delete set null,
  add constraint leads_package_site_fkey foreign key (package_id, site_id)
    references public.packages(id, site_id) on delete set null;
alter table public.bookings
  add column lead_id uuid,
  add constraint bookings_lead_site_fkey foreign key (lead_id, site_id)
    references public.leads(id, site_id) on delete set null;
create index leads_customer_idx on public.leads(customer_id) where customer_id is not null;
create index leads_rental_idx on public.leads(rental_product_id)
  where rental_product_id is not null;
create index leads_package_idx on public.leads(package_id)
  where package_id is not null;
create index leads_assigned_to_idx on public.leads(assigned_to)
  where assigned_to is not null;
create index leads_follow_up_idx on public.leads(site_id, follow_up_at)
  where follow_up_at is not null and status not in ('won','lost','closed');
create index leads_status_updated_idx on public.leads(site_id, status, updated_at desc);
create index bookings_lead_idx on public.bookings(lead_id) where lead_id is not null;

create table public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  lead_id uuid not null,
  actor_id uuid references auth.users(id) on delete set null,
  activity_type text not null check (activity_type in (
    'created','stage_changed','note','follow_up','converted_to_customer',
    'converted_to_booking','details_updated'
  )),
  body text not null default '' check (char_length(body) <= 5000),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  foreign key (lead_id, site_id)
    references public.leads(id, site_id) on delete cascade
);
create index lead_activities_lead_idx
  on public.lead_activities(lead_id, created_at desc);
create index lead_activities_site_idx on public.lead_activities(site_id);

create trigger packages_updated before update on public.packages
for each row execute function public.set_updated_at();
create trigger customers_updated before update on public.customers
for each row execute function public.set_updated_at();
create trigger resources_updated before update on public.resources
for each row execute function public.set_updated_at();
create trigger availability_rules_updated before update on public.availability_rules
for each row execute function public.set_updated_at();
create trigger departures_updated before update on public.departures
for each row execute function public.set_updated_at();
create trigger bookings_updated before update on public.bookings
for each row execute function public.set_updated_at();

alter table public.packages enable row level security;
alter table public.package_items enable row level security;
alter table public.customers enable row level security;
alter table public.resources enable row level security;
alter table public.availability_rules enable row level security;
alter table public.departures enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_resources enable row level security;
alter table public.booking_activities enable row level security;
alter table public.lead_activities enable row level security;

revoke all on table public.packages, public.package_items, public.customers,
  public.resources, public.availability_rules, public.departures, public.bookings,
  public.booking_resources, public.booking_activities, public.lead_activities
  from anon, authenticated;
grant select, insert, update, delete on table public.packages, public.package_items,
  public.customers, public.resources, public.availability_rules, public.departures,
  public.bookings, public.booking_resources, public.booking_activities,
  public.lead_activities to authenticated;
grant insert, delete on table public.leads to authenticated;

-- Operational records are always private. Each operation has an explicit owner policy.
create policy "packages owner select" on public.packages for select to authenticated
  using ((select public.owns_site(site_id)));
create policy "packages owner insert" on public.packages for insert to authenticated
  with check ((select public.owns_site(site_id)));
create policy "packages owner update" on public.packages for update to authenticated
  using ((select public.owns_site(site_id))) with check ((select public.owns_site(site_id)));
create policy "packages owner delete" on public.packages for delete to authenticated
  using ((select public.owns_site(site_id)));

create policy "package items owner select" on public.package_items for select to authenticated
  using ((select public.owns_site(site_id)));
create policy "package items owner insert" on public.package_items for insert to authenticated
  with check ((select public.owns_site(site_id)));
create policy "package items owner update" on public.package_items for update to authenticated
  using ((select public.owns_site(site_id))) with check ((select public.owns_site(site_id)));
create policy "package items owner delete" on public.package_items for delete to authenticated
  using ((select public.owns_site(site_id)));

create policy "customers owner select" on public.customers for select to authenticated
  using ((select public.owns_site(site_id)));
create policy "customers owner insert" on public.customers for insert to authenticated
  with check ((select public.owns_site(site_id)));
create policy "customers owner update" on public.customers for update to authenticated
  using ((select public.owns_site(site_id))) with check ((select public.owns_site(site_id)));
create policy "customers owner delete" on public.customers for delete to authenticated
  using ((select public.owns_site(site_id)));

create policy "resources owner select" on public.resources for select to authenticated
  using ((select public.owns_site(site_id)));
create policy "resources owner insert" on public.resources for insert to authenticated
  with check ((select public.owns_site(site_id)));
create policy "resources owner update" on public.resources for update to authenticated
  using ((select public.owns_site(site_id))) with check ((select public.owns_site(site_id)));
create policy "resources owner delete" on public.resources for delete to authenticated
  using ((select public.owns_site(site_id)));

create policy "availability owner select" on public.availability_rules for select to authenticated
  using ((select public.owns_site(site_id)));
create policy "availability owner insert" on public.availability_rules for insert to authenticated
  with check ((select public.owns_site(site_id)));
create policy "availability owner update" on public.availability_rules for update to authenticated
  using ((select public.owns_site(site_id))) with check ((select public.owns_site(site_id)));
create policy "availability owner delete" on public.availability_rules for delete to authenticated
  using ((select public.owns_site(site_id)));

create policy "departures owner select" on public.departures for select to authenticated
  using ((select public.owns_site(site_id)));
create policy "departures owner insert" on public.departures for insert to authenticated
  with check ((select public.owns_site(site_id)));
create policy "departures owner update" on public.departures for update to authenticated
  using ((select public.owns_site(site_id))) with check ((select public.owns_site(site_id)));
create policy "departures owner delete" on public.departures for delete to authenticated
  using ((select public.owns_site(site_id)));

create policy "bookings owner select" on public.bookings for select to authenticated
  using ((select public.owns_site(site_id)));
create policy "bookings owner insert" on public.bookings for insert to authenticated
  with check ((select public.owns_site(site_id)));
create policy "bookings owner update" on public.bookings for update to authenticated
  using ((select public.owns_site(site_id))) with check ((select public.owns_site(site_id)));
create policy "bookings owner delete" on public.bookings for delete to authenticated
  using ((select public.owns_site(site_id)));

create policy "booking resources owner select" on public.booking_resources for select to authenticated
  using ((select public.owns_site(site_id)));
create policy "booking resources owner insert" on public.booking_resources for insert to authenticated
  with check ((select public.owns_site(site_id)));
create policy "booking resources owner update" on public.booking_resources for update to authenticated
  using ((select public.owns_site(site_id))) with check ((select public.owns_site(site_id)));
create policy "booking resources owner delete" on public.booking_resources for delete to authenticated
  using ((select public.owns_site(site_id)));

create policy "booking activities owner select" on public.booking_activities for select to authenticated
  using ((select public.owns_site(site_id)));
create policy "booking activities owner insert" on public.booking_activities for insert to authenticated
  with check ((select public.owns_site(site_id)));
create policy "booking activities owner update" on public.booking_activities for update to authenticated
  using ((select public.owns_site(site_id))) with check ((select public.owns_site(site_id)));
create policy "booking activities owner delete" on public.booking_activities for delete to authenticated
  using ((select public.owns_site(site_id)));

create policy "lead activities owner select" on public.lead_activities for select to authenticated
  using ((select public.owns_site(site_id)));
create policy "lead activities owner insert" on public.lead_activities for insert to authenticated
  with check ((select public.owns_site(site_id)));
create policy "lead activities owner update" on public.lead_activities for update to authenticated
  using ((select public.owns_site(site_id))) with check ((select public.owns_site(site_id)));
create policy "lead activities owner delete" on public.lead_activities for delete to authenticated
using ((select public.owns_site(site_id)));

create policy "leads owner insert" on public.leads for insert to authenticated
with check ((select public.owns_site(site_id)));
create policy "leads owner delete" on public.leads for delete to authenticated
using ((select public.owns_site(site_id)));

-- The reusable audit trigger records operator changes and releases cancelled inventory.
create or replace function public.audit_booking_change()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if old.status is distinct from new.status then
    if not (
      (old.status = 'draft' and new.status in ('pending','cancelled')) or
      (old.status = 'pending' and new.status in ('awaiting_confirmation','confirmed','cancelled')) or
      (old.status = 'awaiting_confirmation' and new.status in ('confirmed','cancelled')) or
      (old.status = 'confirmed' and new.status in ('completed','no_show','cancelled'))
    ) then raise exception 'That booking status change is not allowed'; end if;
    insert into public.booking_activities(
      site_id, booking_id, actor_id, action, from_status, to_status
    ) values (
      new.site_id, new.id, (select auth.uid()), 'status_changed', old.status, new.status
    );
    if new.status = 'cancelled' then
      delete from public.booking_resources where booking_id = new.id;
    end if;
  elsif old.starts_at is distinct from new.starts_at
    or old.ends_at is distinct from new.ends_at then
    insert into public.booking_activities(site_id, booking_id, actor_id, action)
    values (new.site_id, new.id, (select auth.uid()), 'schedule_changed');
  end if;
  return new;
end;
$$;
create trigger bookings_audit after update on public.bookings
for each row execute function public.audit_booking_change();

-- Preserve the legacy business_type preset while allowing every supported
-- capability (including motorcycle and equipment operations) to be primary.
-- The nested generator and capability update share one database transaction.
create or replace function public.create_generated_site_v2(payload jsonb)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare
  target_site uuid;
  target_business uuid;
  selected_capabilities text[];
  primary_capability text := coalesce(
    nullif(payload->>'primaryCapability',''),
    payload->>'businessType'
  );
begin
  target_site := public.create_generated_site(payload);
  select business_id into target_business from public.sites
  where id = target_site and owner_id = (select auth.uid());
  if target_business is null then raise exception 'Website not found'; end if;
  select coalesce(array_agg(value),array[primary_capability])
  into selected_capabilities
  from jsonb_array_elements_text(
    coalesce(payload->'capabilities',jsonb_build_array(primary_capability))
  ) values_list(value);
  perform public.set_business_capabilities(
    target_business,selected_capabilities,primary_capability
  );
  return target_site;
end;
$$;
revoke all on function public.create_generated_site_v2(jsonb) from public;
grant execute on function public.create_generated_site_v2(jsonb) to authenticated;

create or replace function public.save_package(payload jsonb)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare
  target_site uuid := (payload->>'siteId')::uuid;
  target_package uuid;
  package_item jsonb;
begin
  if not (select public.owns_site(target_site)) then raise exception 'Not authorized'; end if;
  if nullif(payload->>'id', '') is not null then
    target_package := (payload->>'id')::uuid;
    update public.packages set
      name = trim(payload->>'name'), slug = payload->>'slug',
      short_description = coalesce(payload->>'shortDescription',''),
      description = coalesce(payload->>'description',''),
      duration_days = nullif(payload->>'durationDays','')::integer,
      price_from = nullif(payload->>'priceFrom','')::numeric,
      currency = payload->>'currency', pricing_label = nullif(payload->>'pricingLabel',''),
      booking_mode = payload->>'bookingMode', booking_url = nullif(payload->>'bookingUrl',''),
      booking_button_label = payload->>'bookingButtonLabel',
      featured_image_url = nullif(payload->>'featuredImageUrl',''),
      gallery = coalesce(payload->'gallery','[]'::jsonb),
      details = coalesce(payload->'details','{}'::jsonb),
      highlights = coalesce(payload->'highlights','[]'::jsonb),
      inclusions = coalesce(payload->'inclusions','[]'::jsonb),
      exclusions = coalesce(payload->'exclusions','[]'::jsonb),
      itinerary = coalesce(payload->'itinerary','[]'::jsonb),
      faqs = coalesce(payload->'faqs','[]'::jsonb),
      policies = coalesce(payload->'policies','[]'::jsonb),
      seo_settings = coalesce(payload->'seoSettings','{}'::jsonb),
      featured = coalesce((payload->>'featured')::boolean,false),
      status = (payload->>'status')::public.content_status
    where id = target_package and site_id = target_site;
    if not found then raise exception 'Package not found'; end if;
  else
    insert into public.packages(
      site_id,name,slug,short_description,description,duration_days,price_from,
      currency,pricing_label,booking_mode,booking_url,booking_button_label,
      featured_image_url,gallery,details,highlights,inclusions,exclusions,itinerary,faqs,policies,
      seo_settings,featured,status
    ) values (
      target_site,trim(payload->>'name'),payload->>'slug',
      coalesce(payload->>'shortDescription',''),coalesce(payload->>'description',''),
      nullif(payload->>'durationDays','')::integer,nullif(payload->>'priceFrom','')::numeric,
      payload->>'currency',nullif(payload->>'pricingLabel',''),payload->>'bookingMode',
      nullif(payload->>'bookingUrl',''),payload->>'bookingButtonLabel',
      nullif(payload->>'featuredImageUrl',''),coalesce(payload->'gallery','[]'::jsonb),
      coalesce(payload->'details','{}'::jsonb),coalesce(payload->'highlights','[]'::jsonb),
      coalesce(payload->'inclusions','[]'::jsonb),coalesce(payload->'exclusions','[]'::jsonb),
      coalesce(payload->'itinerary','[]'::jsonb),coalesce(payload->'faqs','[]'::jsonb),
      coalesce(payload->'policies','[]'::jsonb),coalesce(payload->'seoSettings','{}'::jsonb),
      coalesce((payload->>'featured')::boolean,false),
      (payload->>'status')::public.content_status
    ) returning id into target_package;
  end if;

  delete from public.package_items where package_id = target_package;
  for package_item in
    select * from jsonb_array_elements(coalesce(payload->'items','[]'::jsonb))
  loop
    insert into public.package_items(
      package_id,site_id,experience_id,rental_product_id,day_number,title,
      description,optional,sort_order
    ) values (
      target_package,target_site,nullif(package_item->>'experienceId','')::uuid,
      nullif(package_item->>'rentalProductId','')::uuid,
      nullif(package_item->>'dayNumber','')::integer,package_item->>'title',
      coalesce(package_item->>'description',''),
      coalesce((package_item->>'optional')::boolean,false),
      coalesce((package_item->>'sortOrder')::integer,0)
    );
  end loop;
  return target_package;
end;
$$;
revoke all on function public.save_package(jsonb) from public;
grant execute on function public.save_package(jsonb) to authenticated;

create or replace function public.duplicate_package(target_package uuid)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare
  source_package public.packages%rowtype;
  new_package uuid;
  suffix text := lower(substr(replace(gen_random_uuid()::text,'-',''),1,6));
begin
  select * into source_package from public.packages where id = target_package;
  if not found or not (select public.owns_site(source_package.site_id)) then
    raise exception 'Package not found';
  end if;
  insert into public.packages(
    site_id,name,slug,short_description,description,duration_days,price_from,
    currency,pricing_label,booking_mode,booking_url,booking_button_label,
    featured_image_url,gallery,details,highlights,inclusions,exclusions,itinerary,faqs,
    policies,seo_settings,sections_override,featured,status,sort_order
  ) select
    site_id,left(name || ' copy',140),left(slug,132) || '-' || suffix,
    short_description,description,duration_days,price_from,currency,pricing_label,
    booking_mode,booking_url,booking_button_label,featured_image_url,gallery,
    details,highlights,inclusions,exclusions,itinerary,faqs,policies,seo_settings,
    sections_override,false,'draft',sort_order
  from public.packages where id = target_package
  returning id into new_package;
  insert into public.package_items(
    package_id,site_id,experience_id,rental_product_id,day_number,title,
    description,optional,sort_order
  ) select
    new_package,site_id,experience_id,rental_product_id,day_number,title,
    description,optional,sort_order
  from public.package_items where package_id = target_package;
  return new_package;
end;
$$;
revoke all on function public.duplicate_package(uuid) from public;
grant execute on function public.duplicate_package(uuid) to authenticated;

create or replace function public.create_booking(payload jsonb)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare
  target_site uuid := (payload->>'siteId')::uuid;
  target_customer uuid;
  target_booking uuid;
  target_lead uuid := nullif(payload->>'leadId','')::uuid;
  target_departure public.departures%rowtype;
  requested_guests integer := coalesce((payload->>'adults')::integer,1)
    + coalesce((payload->>'children')::integer,0);
  allocated integer;
  inserted boolean;
  clean_email text := nullif(lower(trim(payload->>'email')),'');
begin
  if not (select public.owns_site(target_site)) then raise exception 'Not authorized'; end if;
  select id into target_booking from public.bookings
  where site_id = target_site and idempotency_key = payload->>'idempotencyKey';
  if found then return target_booking; end if;
  if nullif(payload->>'departureId','') is not null then
    select * into target_departure from public.departures
    where id = (payload->>'departureId')::uuid and site_id = target_site for update;
    if not found or target_departure.status <> 'open' then raise exception 'Departure is not available'; end if;
    if target_departure.capacity is not null then
      select coalesce(sum(guests),0) into allocated from public.bookings
      where departure_id = target_departure.id
        and status in ('pending','awaiting_confirmation','confirmed');
      if allocated + requested_guests > target_departure.capacity then
        raise exception 'Not enough capacity remains for this departure';
      end if;
    end if;
  end if;

  if clean_email is not null then
    insert into public.customers(site_id,name,email,phone,source)
    values(target_site,trim(payload->>'customerName'),clean_email,
      nullif(trim(payload->>'phone'),''),coalesce(nullif(payload->>'customerSource',''),'manual'))
    on conflict (site_id,email_normalized)
      where email_normalized is not null and email_normalized <> ''
    do update set name = excluded.name,
      phone = coalesce(excluded.phone,public.customers.phone)
    returning id into target_customer;
  else
    insert into public.customers(site_id,name,phone,source)
    values(target_site,trim(payload->>'customerName'),nullif(trim(payload->>'phone'),''),
      coalesce(nullif(payload->>'customerSource',''),'manual'))
    returning id into target_customer;
  end if;

  insert into public.bookings(
    site_id,reference,customer_id,experience_id,rental_product_id,package_id,lead_id,
    departure_id,status,source,starts_at,ends_at,adults,children,quantity,
    quoted_total,currency,customer_notes,internal_notes,idempotency_key,created_by
  ) values (
    target_site,'TP-' || to_char(clock_timestamp(),'YYMMDD') || '-' ||
      upper(substr(replace(gen_random_uuid()::text,'-',''),1,8)),target_customer,
    nullif(payload->>'experienceId','')::uuid,
    nullif(payload->>'rentalProductId','')::uuid,
    nullif(payload->>'packageId','')::uuid,target_lead,
    nullif(payload->>'departureId','')::uuid,
    coalesce(nullif(payload->>'status',''),'pending')::public.booking_status,
    coalesce(nullif(payload->>'source',''),'manual')::public.booking_source,
    (payload->>'startsAt')::timestamptz,nullif(payload->>'endsAt','')::timestamptz,
    coalesce((payload->>'adults')::integer,1),coalesce((payload->>'children')::integer,0),
    coalesce((payload->>'quantity')::integer,1),nullif(payload->>'quotedTotal','')::numeric,
    payload->>'currency',coalesce(payload->>'customerNotes',''),
    coalesce(payload->>'internalNotes',''),payload->>'idempotencyKey',(select auth.uid())
  ) on conflict (site_id,idempotency_key) do update
    set idempotency_key = excluded.idempotency_key
  returning id, (xmax = 0) into target_booking, inserted;
  if inserted then
    insert into public.booking_activities(site_id,booking_id,actor_id,action,to_status)
    values(target_site,target_booking,(select auth.uid()),'created',
      coalesce(nullif(payload->>'status',''),'pending')::public.booking_status);
    if target_lead is not null then
      update public.leads set customer_id = target_customer, status = 'won'
      where id = target_lead and site_id = target_site;
      if not found then raise exception 'Lead not found'; end if;
      insert into public.lead_activities(
        site_id,lead_id,actor_id,activity_type,body,details
      ) values (
        target_site,target_lead,(select auth.uid()),'converted_to_booking',
        'Converted into booking',jsonb_build_object('bookingId',target_booking)
      );
    end if;
  end if;
  return target_booking;
end;
$$;
revoke all on function public.create_booking(jsonb) from public;
grant execute on function public.create_booking(jsonb) to authenticated;

create or replace function public.update_booking(payload jsonb)
returns void language plpgsql security invoker set search_path = '' as $$
declare
  selected_booking public.bookings%rowtype;
  selected_departure public.departures%rowtype;
  assigned record;
  allocated integer;
  requested_guests integer := coalesce((payload->>'adults')::integer,0)
    + coalesce((payload->>'children')::integer,0);
  new_start timestamptz := (payload->>'startsAt')::timestamptz;
  new_end timestamptz := nullif(payload->>'endsAt','')::timestamptz;
begin
  select * into selected_booking from public.bookings
  where id = (payload->>'bookingId')::uuid
    and site_id = (payload->>'siteId')::uuid for update;
  if not found or not (select public.owns_site(selected_booking.site_id)) then
    raise exception 'Booking not found';
  end if;
  if selected_booking.status in ('cancelled','completed','no_show') then
    raise exception 'Closed bookings cannot be edited';
  end if;
  if requested_guests < 1 or requested_guests > 2000
    or coalesce((payload->>'quantity')::integer,0) not between 1 and 1000
    or (new_end is not null and new_end <= new_start)
    then raise exception 'Invalid booking schedule or party size'; end if;

  if selected_booking.departure_id is not null then
    select * into selected_departure from public.departures
    where id = selected_booking.departure_id for update;
    if selected_departure.capacity is not null then
      select coalesce(sum(guests),0) into allocated from public.bookings
      where departure_id = selected_departure.id
        and status in ('pending','awaiting_confirmation','confirmed')
        and id <> selected_booking.id;
      if allocated + requested_guests > selected_departure.capacity then
        raise exception 'Not enough capacity remains for this departure';
      end if;
    end if;
  end if;

  -- Lock resources in a consistent order before checking the proposed time.
  perform 1 from public.resources r
  join public.booking_resources br on br.resource_id = r.id
  where br.booking_id = selected_booking.id
  order by r.id for update of r;
  for assigned in
    select r.id, r.capacity, br.quantity from public.resources r
    join public.booking_resources br on br.resource_id = r.id
    where br.booking_id = selected_booking.id order by r.id
  loop
    select coalesce(sum(br.quantity),0) into allocated
    from public.booking_resources br
    join public.bookings b on b.id = br.booking_id
    where br.resource_id = assigned.id and b.id <> selected_booking.id
      and b.status in ('pending','awaiting_confirmation','confirmed')
      and tstzrange(b.starts_at,coalesce(b.ends_at,b.starts_at + interval '1 hour'),'[)')
        && tstzrange(new_start,coalesce(new_end,new_start + interval '1 hour'),'[)');
    if allocated + assigned.quantity > assigned.capacity then
      raise exception 'An assigned resource is unavailable at the new time';
    end if;
  end loop;

  update public.bookings set
    starts_at = new_start,
    ends_at = new_end,
    adults = (payload->>'adults')::integer,
    children = (payload->>'children')::integer,
    quantity = (payload->>'quantity')::integer,
    quoted_total = nullif(payload->>'quotedTotal','')::numeric,
    currency = upper(payload->>'currency'),
    customer_notes = coalesce(payload->>'customerNotes',''),
    internal_notes = case when trim(coalesce(payload->>'internalNote','')) = ''
      then internal_notes else concat_ws(E'\n',nullif(internal_notes,''),trim(payload->>'internalNote')) end,
    details = details || jsonb_build_object(
      'requirements',coalesce(payload->>'requirements',''),
      'addOns',coalesce(payload->'addOns','[]'::jsonb)
    )
  where id = selected_booking.id;
  insert into public.booking_activities(site_id,booking_id,actor_id,action,details)
  values(selected_booking.site_id,selected_booking.id,(select auth.uid()),'details_updated',
    jsonb_build_object('startsAt',new_start,'endsAt',new_end,'guests',requested_guests));
end;
$$;
revoke all on function public.update_booking(jsonb) from public;
grant execute on function public.update_booking(jsonb) to authenticated;

create or replace function public.convert_lead_to_customer(target_lead uuid)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare
  selected_lead public.leads%rowtype;
  target_customer uuid;
begin
  select * into selected_lead from public.leads where id = target_lead for update;
  if not found or not (select public.owns_site(selected_lead.site_id)) then
    raise exception 'Lead not found';
  end if;
  if selected_lead.customer_id is not null then return selected_lead.customer_id; end if;
  insert into public.customers(site_id,name,email,phone,source)
  values(selected_lead.site_id,selected_lead.name,selected_lead.email,
    selected_lead.phone,case selected_lead.source
      when 'website_form' then 'website' else selected_lead.source end)
  on conflict (site_id,email_normalized)
    where email_normalized is not null and email_normalized <> ''
  do update set name = excluded.name,
    phone = coalesce(excluded.phone,public.customers.phone)
  returning id into target_customer;
  update public.leads set customer_id = target_customer where id = target_lead;
  insert into public.lead_activities(
    site_id,lead_id,actor_id,activity_type,body,details
  ) values (
    selected_lead.site_id,target_lead,(select auth.uid()),'converted_to_customer',
    'Converted into customer',jsonb_build_object('customerId',target_customer)
  );
  return target_customer;
end;
$$;
revoke all on function public.convert_lead_to_customer(uuid) from public;
grant execute on function public.convert_lead_to_customer(uuid) to authenticated;

create or replace function public.transition_booking(
  target_booking uuid, next_status public.booking_status, note text default ''
)
returns void language plpgsql security invoker set search_path = '' as $$
declare current_booking public.bookings%rowtype;
begin
  select * into current_booking from public.bookings
  where id = target_booking for update;
  if not found or not (select public.owns_site(current_booking.site_id)) then
    raise exception 'Booking not found';
  end if;
  if not (
    (current_booking.status = 'draft' and next_status in ('pending','cancelled')) or
    (current_booking.status = 'pending' and next_status in ('awaiting_confirmation','confirmed','cancelled')) or
    (current_booking.status = 'awaiting_confirmation' and next_status in ('confirmed','cancelled')) or
    (current_booking.status = 'confirmed' and next_status in ('completed','no_show','cancelled')) or
    current_booking.status = next_status
  ) then raise exception 'That booking status change is not allowed'; end if;
  update public.bookings set status = next_status,
    internal_notes = case when trim(note) = '' then internal_notes
      else concat_ws(E'\n',nullif(internal_notes,''),trim(note)) end
  where id = target_booking;
end;
$$;
revoke all on function public.transition_booking(uuid, public.booking_status, text) from public;
grant execute on function public.transition_booking(uuid, public.booking_status, text) to authenticated;

create or replace function public.assign_booking_resource(
  target_booking uuid, target_resource uuid, requested_quantity integer default 1
)
returns void language plpgsql security invoker set search_path = '' as $$
declare
  selected_booking public.bookings%rowtype;
  selected_resource public.resources%rowtype;
  already_allocated integer;
begin
  select * into selected_booking from public.bookings where id = target_booking for update;
  if not found or not (select public.owns_site(selected_booking.site_id)) then
    raise exception 'Booking not found';
  end if;
  if selected_booking.status in ('cancelled','completed','no_show') then
    raise exception 'Resources cannot be assigned to a closed booking';
  end if;
  select * into selected_resource from public.resources
  where id = target_resource and site_id = selected_booking.site_id for update;
  if not found or selected_resource.status <> 'available' then
    raise exception 'Resource is unavailable';
  end if;
  if requested_quantity < 1 then raise exception 'Quantity must be positive'; end if;

  select coalesce(sum(br.quantity),0) into already_allocated
  from public.booking_resources br
  join public.bookings b on b.id = br.booking_id
  where br.resource_id = target_resource
    and b.status in ('pending','awaiting_confirmation','confirmed')
    and tstzrange(b.starts_at,coalesce(b.ends_at,b.starts_at + interval '1 hour'),'[)')
      && tstzrange(selected_booking.starts_at,
        coalesce(selected_booking.ends_at,selected_booking.starts_at + interval '1 hour'),'[)')
    and b.id <> selected_booking.id;
  if already_allocated + requested_quantity > selected_resource.capacity then
    raise exception 'Resource is already allocated for that time';
  end if;
  insert into public.booking_resources(site_id,booking_id,resource_id,quantity)
  values(selected_booking.site_id,target_booking,target_resource,requested_quantity)
  on conflict (booking_id,resource_id) do update set quantity = excluded.quantity;
  insert into public.booking_activities(site_id,booking_id,actor_id,action,details)
  values(selected_booking.site_id,target_booking,(select auth.uid()),'resource_assigned',
    jsonb_build_object('resourceId',target_resource,'quantity',requested_quantity));
end;
$$;
revoke all on function public.assign_booking_resource(uuid, uuid, integer) from public;
grant execute on function public.assign_booking_resource(uuid, uuid, integer) to authenticated;

create or replace function public.unassign_booking_resource(
  target_booking uuid, target_resource uuid
)
returns void language plpgsql security invoker set search_path = '' as $$
declare selected_booking public.bookings%rowtype;
begin
  select * into selected_booking from public.bookings
  where id = target_booking for update;
  if not found or not (select public.owns_site(selected_booking.site_id)) then
    raise exception 'Booking not found';
  end if;
  delete from public.booking_resources
  where booking_id = target_booking and resource_id = target_resource;
  if not found then raise exception 'Resource assignment not found'; end if;
  insert into public.booking_activities(site_id,booking_id,actor_id,action,details)
  values(selected_booking.site_id,target_booking,(select auth.uid()),'resource_unassigned',
    jsonb_build_object('resourceId',target_resource));
end;
$$;
revoke all on function public.unassign_booking_resource(uuid, uuid) from public;
grant execute on function public.unassign_booking_resource(uuid, uuid) to authenticated;

create table private.booking_rate_limits (
  site_id uuid not null,
  fingerprint text not null,
  window_start timestamptz not null,
  submissions integer not null default 1,
  primary key(site_id,fingerprint,window_start)
);
revoke all on private.booking_rate_limits from public, anon, authenticated;

create or replace function public.submit_public_booking(payload jsonb, fingerprint text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  target_site uuid;
  requested_site uuid := (payload->>'siteId')::uuid;
  target_customer uuid;
  target_booking uuid;
  current_count integer;
  clean_email text := lower(trim(payload->>'email'));
  clean_hostname text := lower(trim(trailing '.' from coalesce(payload->>'hostname','')));
  clean_slug text := lower(coalesce(payload->>'siteSlug',''));
  target_kind text := payload->>'targetType';
  target_id uuid := (payload->>'targetId')::uuid;
  target_experience uuid;
  target_rental uuid;
  target_package uuid;
  target_departure public.departures%rowtype;
  target_currency text;
  target_timezone text;
  requested_start timestamptz;
  requested_end timestamptz;
  inserted boolean;
begin
  if coalesce(payload->>'website','') <> '' then raise exception 'Submission rejected'; end if;
  if fingerprint is null or length(fingerprint) not between 16 and 128 then raise exception 'Invalid request'; end if;
  if length(coalesce(payload->>'idempotencyKey','')) not between 16 and 128 then raise exception 'Invalid request'; end if;
  if payload->>'deliveryMode' = 'fallback' then
    if clean_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then raise exception 'Invalid website'; end if;
    select s.id into target_site from public.sites s
    where s.id = requested_site and s.slug = clean_slug and s.status = 'published'
      and s.published_snapshot is not null limit 1;
  else
    select s.id into target_site from public.domains d join public.sites s on s.id = d.site_id
    where d.hostname = clean_hostname and d.verification_status = 'verified'
      and s.id = requested_site and s.status = 'published'
      and s.published_snapshot is not null limit 1;
  end if;
  if target_site is null then raise exception 'Website unavailable'; end if;
  select coalesce(nullif(b.timezone,''),'UTC') into target_timezone
  from public.sites s join public.businesses b on b.id = s.business_id
  where s.id = target_site;
  if length(trim(payload->>'name')) not between 2 and 100 then raise exception 'Enter your name'; end if;
  if clean_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then raise exception 'Enter a valid email'; end if;
  if length(coalesce(payload->>'phone','')) > 40
    or length(coalesce(payload->>'message','')) > 3000 then raise exception 'Invalid request'; end if;
  if (payload->>'requestedDate')::date < current_date then raise exception 'Choose today or a future date'; end if;
  if nullif(payload->>'requestedEndDate','') is not null
    and (payload->>'requestedEndDate')::date < (payload->>'requestedDate')::date
    then raise exception 'Return date must follow the start date'; end if;
  if coalesce(payload->>'startTime','') !~ '^$|^([01][0-9]|2[0-3]):[0-5][0-9]$'
    or coalesce(payload->>'endTime','') !~ '^$|^([01][0-9]|2[0-3]):[0-5][0-9]$'
    then raise exception 'Invalid booking time'; end if;
  if length(coalesce(payload->>'pickupLocation','')) > 200
    or length(coalesce(payload->>'dropoffLocation','')) > 200
    or length(coalesce(payload->>'luggage','')) > 120
    or length(coalesce(payload->>'roomPreference','')) > 200
    then raise exception 'Invalid booking details'; end if;
  if coalesce((payload->>'adults')::integer,0) + coalesce((payload->>'children')::integer,0) < 1
    then raise exception 'Select at least one guest'; end if;
  if coalesce((payload->>'adults')::integer,0) > 1000
    or coalesce((payload->>'children')::integer,0) > 1000
    or coalesce((payload->>'quantity')::integer,1) not between 1 and 1000
    then raise exception 'Invalid party size'; end if;

  if target_kind = 'experience' then
    select item->>'currency' into target_currency from public.sites s,
      jsonb_array_elements(coalesce(s.published_snapshot->'experiences','[]'::jsonb)) item
    where s.id = target_site and item->>'id' = target_id::text
    limit 1;
    if target_currency is not null then target_experience := target_id; end if;
  elsif target_kind = 'rental' then
    select item->>'currency' into target_currency from public.sites s,
      jsonb_array_elements(coalesce(s.published_snapshot->'rentals','[]'::jsonb)) item
    where s.id = target_site and item->>'id' = target_id::text
    limit 1;
    if target_currency is not null then target_rental := target_id; end if;
  elsif target_kind = 'package' then
    select item->>'currency' into target_currency from public.sites s,
      jsonb_array_elements(coalesce(s.published_snapshot->'packages','[]'::jsonb)) item
    where s.id = target_site and item->>'id' = target_id::text
    limit 1;
    if target_currency is not null then target_package := target_id; end if;
  end if;
  if num_nonnulls(target_experience,target_rental,target_package) <> 1 then
    raise exception 'Offering is unavailable';
  end if;

  select id into target_booking from public.bookings
  where site_id = target_site and idempotency_key = payload->>'idempotencyKey';
  if found then return target_booking; end if;

  if nullif(payload->>'departureId','') is not null then
    select * into target_departure from public.departures d
    where d.id = (payload->>'departureId')::uuid and d.site_id = target_site
      and d.status = 'open' and d.starts_at >= now()
      and d.experience_id is not distinct from target_experience
      and d.rental_product_id is not distinct from target_rental
      and d.package_id is not distinct from target_package
      and exists (
        select 1 from public.sites s,
          jsonb_array_elements(coalesce(s.published_snapshot->'departures','[]'::jsonb)) item
        where s.id = target_site and item->>'id' = d.id::text
      )
    for update;
    if not found then raise exception 'Departure is unavailable'; end if;
    if target_departure.capacity is not null then
      select coalesce(sum(guests),0) into current_count from public.bookings
      where departure_id = target_departure.id
        and status in ('pending','awaiting_confirmation','confirmed');
      if current_count + coalesce((payload->>'adults')::integer,0)
        + coalesce((payload->>'children')::integer,0) > target_departure.capacity
        then raise exception 'Not enough capacity remains for this departure'; end if;
    end if;
  end if;

  if target_departure.id is not null then
    requested_start := target_departure.starts_at;
    requested_end := target_departure.ends_at;
  else
    requested_start := (
      (payload->>'requestedDate') || ' ' ||
      coalesce(nullif(payload->>'startTime',''),'00:00')
    )::timestamp at time zone target_timezone;
  end if;
  if target_departure.id is null and nullif(payload->>'requestedEndDate','') is not null then
    requested_end := (
      (payload->>'requestedEndDate') || ' ' ||
      coalesce(nullif(payload->>'endTime',''),'23:59')
    )::timestamp at time zone target_timezone;
  elsif target_departure.id is null and nullif(payload->>'endTime','') is not null then
    requested_end := (
      (payload->>'requestedDate') || ' ' || (payload->>'endTime')
    )::timestamp at time zone target_timezone;
  end if;
  if requested_end is not null and requested_end <= requested_start then
    raise exception 'End time must follow the start time';
  end if;

  insert into private.booking_rate_limits(site_id,fingerprint,window_start,submissions)
  values(target_site,fingerprint,date_trunc('hour',now()),1)
  on conflict on constraint booking_rate_limits_pkey do update
    set submissions = private.booking_rate_limits.submissions + 1
    where private.booking_rate_limits.submissions < 4
  returning submissions into current_count;
  if current_count is null then raise exception 'Too many requests. Please try again later.'; end if;

  insert into public.customers(site_id,name,email,phone,source)
  values(target_site,trim(payload->>'name'),clean_email,nullif(trim(payload->>'phone'),''),'website_booking')
  on conflict (site_id,email_normalized)
    where email_normalized is not null and email_normalized <> ''
  do update set name = excluded.name,
    phone = coalesce(excluded.phone,public.customers.phone)
  returning id into target_customer;

  insert into public.bookings(
    site_id,reference,customer_id,experience_id,rental_product_id,package_id,departure_id,
    status,source,starts_at,ends_at,adults,children,quantity,currency,customer_notes,
    details,idempotency_key
  ) values (
    target_site,'TP-' || to_char(clock_timestamp(),'YYMMDD') || '-' ||
      upper(substr(replace(gen_random_uuid()::text,'-',''),1,8)),target_customer,
    target_experience,target_rental,target_package,target_departure.id,'pending','website',
    requested_start,requested_end,
    coalesce((payload->>'adults')::integer,1),coalesce((payload->>'children')::integer,0),
    coalesce((payload->>'quantity')::integer,1),target_currency,
    coalesce(payload->>'message',''),jsonb_strip_nulls(jsonb_build_object(
      'startTime',nullif(payload->>'startTime',''),
      'endTime',nullif(payload->>'endTime',''),
      'pickupLocation',nullif(payload->>'pickupLocation',''),
      'dropoffLocation',nullif(payload->>'dropoffLocation',''),
      'luggage',nullif(payload->>'luggage',''),
      'roomPreference',nullif(payload->>'roomPreference','')
    )),payload->>'idempotencyKey'
  ) on conflict (site_id,idempotency_key) do update
    set idempotency_key = excluded.idempotency_key
  returning id, (xmax = 0) into target_booking, inserted;
  if inserted then
    insert into public.booking_activities(site_id,booking_id,action,to_status,details)
    values(target_site,target_booking,'website_request_created','pending',
      jsonb_build_object('sourcePage',left(coalesce(payload->>'sourcePage','/'),300)));
  end if;
  return target_booking;
end;
$$;
revoke all on function public.submit_public_booking(jsonb,text) from public;
grant execute on function public.submit_public_booking(jsonb,text) to anon, authenticated;

-- The public enquiry accessor is repeated here to support custom-trip intent
-- while keeping all management columns private behind RLS.
create or replace function public.submit_public_lead(payload jsonb, fingerprint text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  target_site uuid;
  requested_site uuid := (payload->>'siteId')::uuid;
  target_experience uuid;
  created_lead uuid;
  current_count integer;
  clean_email text := lower(trim(payload->>'email'));
  clean_hostname text := lower(trim(trailing '.' from coalesce(payload->>'hostname','')));
  clean_slug text := lower(coalesce(payload->>'siteSlug',''));
begin
  if coalesce(payload->>'website','') <> '' then raise exception 'Submission rejected'; end if;
  if fingerprint is null or length(fingerprint) not between 16 and 128 then raise exception 'Invalid submission'; end if;
  if payload->>'deliveryMode' = 'fallback' then
    if clean_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then raise exception 'Invalid website'; end if;
    select s.id into target_site from public.sites s
    where s.id = requested_site and s.slug = clean_slug and s.status = 'published'
      and s.published_snapshot is not null limit 1;
  else
    select s.id into target_site from public.domains d join public.sites s on s.id = d.site_id
    where d.hostname = clean_hostname and d.verification_status = 'verified'
      and s.id = requested_site and s.status = 'published'
      and s.published_snapshot is not null limit 1;
  end if;
  if target_site is null then raise exception 'Website unavailable'; end if;
  if length(trim(payload->>'name')) not between 2 and 100 then raise exception 'Enter your name'; end if;
  if clean_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then raise exception 'Enter a valid email'; end if;
  if length(coalesce(payload->>'phone','')) > 40
    or length(coalesce(payload->>'message','')) > 3000
    or length(coalesce(payload->>'requestedDestination','')) > 200
    or length(coalesce(payload->>'interests','')) > 500
    or length(coalesce(payload->>'budgetRange','')) > 120
    then raise exception 'Invalid enquiry'; end if;
  if nullif(payload->>'desiredDate','') is not null
    and (payload->>'desiredDate')::date < current_date
    then raise exception 'Choose today or a future date'; end if;
  if nullif(payload->>'guests','') is not null
    and (payload->>'guests')::integer not between 1 and 1000
    then raise exception 'Invalid party size'; end if;

  insert into private.lead_rate_limits(site_id,fingerprint,window_start,submissions)
  values(target_site,fingerprint,date_trunc('hour',now()),1)
  on conflict on constraint lead_rate_limits_pkey do update
    set submissions = private.lead_rate_limits.submissions + 1
    where private.lead_rate_limits.submissions < 5
  returning submissions into current_count;
  if current_count is null then raise exception 'Too many enquiries. Please try again later.'; end if;

  if nullif(payload->>'experienceId','') is not null then
    select id into target_experience from public.experiences
    where id = (payload->>'experienceId')::uuid and site_id = target_site
      and status = 'published';
    if target_experience is null then raise exception 'Invalid experience'; end if;
  end if;
  insert into public.leads(
    site_id,experience_id,name,email,phone,desired_date,guests,message,source_page,
    source,requested_destination,interests,budget_range
  ) values (
    target_site,target_experience,trim(payload->>'name'),clean_email,
    nullif(trim(payload->>'phone'),''),nullif(payload->>'desiredDate','')::date,
    nullif(payload->>'guests','')::integer,nullif(trim(payload->>'message'),''),
    left(coalesce(payload->>'sourcePage','/'),300),'website_form',
    nullif(trim(payload->>'requestedDestination'),''),
    case when trim(coalesce(payload->>'interests','')) = '' then '{}'::text[]
      else regexp_split_to_array(trim(payload->>'interests'),'\s*,\s*') end,
    nullif(trim(payload->>'budgetRange'),'')
  ) returning id into created_lead;
  return created_lead;
end;
$$;
revoke all on function public.submit_public_lead(jsonb,text) from public;
grant execute on function public.submit_public_lead(jsonb,text) to anon, authenticated;

-- Enrich the existing immutable publishing transaction without rewriting it.
create or replace function private.with_operations_snapshot(target_site uuid, base_snapshot jsonb)
returns jsonb language sql stable security definer set search_path = '' as $$
  select coalesce(base_snapshot,'{}'::jsonb) || jsonb_build_object(
    'schemaVersion',4,
    'packages',(
      select coalesce(jsonb_agg(to_jsonb(p) order by p.sort_order),'[]'::jsonb)
      from public.packages p where p.site_id = target_site and p.status = 'published'
    ),
    'packageItems',(
      select coalesce(jsonb_agg(to_jsonb(pi) order by pi.package_id,pi.sort_order),'[]'::jsonb)
      from public.package_items pi join public.packages p on p.id = pi.package_id
      where pi.site_id = target_site and p.status = 'published'
    ),
    'departures',(
      select coalesce(jsonb_agg(to_jsonb(d) order by d.starts_at),'[]'::jsonb)
      from public.departures d where d.site_id = target_site and d.status = 'open'
        and d.starts_at >= now()
    )
  )
$$;
revoke all on function private.with_operations_snapshot(uuid,jsonb)
  from public, anon, authenticated;

create or replace function private.augment_site_publish()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  new.published_snapshot := private.with_operations_snapshot(new.id,new.published_snapshot);
  return new;
end;
$$;
revoke all on function private.augment_site_publish() from public, anon, authenticated;
create trigger sites_operations_publish
before update of published_snapshot on public.sites
for each row when (new.published_snapshot is distinct from old.published_snapshot)
execute function private.augment_site_publish();

create or replace function private.augment_version_snapshot()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  new.snapshot := private.with_operations_snapshot(new.site_id,new.snapshot);
  return new;
end;
$$;
revoke all on function private.augment_version_snapshot() from public, anon, authenticated;
create trigger site_versions_operations_snapshot
before insert on public.site_versions
for each row execute function private.augment_version_snapshot();

-- Public analytics gains truthful booking/package events. The public RPC is
-- replaced below so all event validation remains in one allowlist.
alter table public.analytics_events
  add column package_id uuid references public.packages(id) on delete set null;
create index analytics_events_package_idx on public.analytics_events(package_id)
  where package_id is not null;
alter table public.analytics_events
  drop constraint analytics_events_event_name_check,
  add constraint analytics_events_event_name_check check (event_name in (
    'page_view','experience_view','rental_view','package_view','booking_started',
    'booking_submitted','booking_click','enquiry_started','whatsapp_click',
    'phone_click','lead_submit','cta_click'
  ));

-- Keep the public analytics RPC in sync with the expanded event and target
-- model. Target identifiers are accepted only when they belong to the resolved
-- published site, and no private operational data is returned.
create or replace function public.submit_analytics_event(payload jsonb, fingerprint text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  target_site uuid;
  target_experience uuid;
  target_rental uuid;
  target_package uuid;
  current_count integer;
  event_name text := coalesce(payload->>'eventName','');
  clean_hostname text := lower(trim(trailing '.' from coalesce(payload->>'hostname','')));
  clean_path text := left(coalesce(payload->>'pagePath','/'),500);
  clean_slug text := lower(coalesce(payload->>'siteSlug',''));
  clean_referrer text := nullif(left(lower(coalesce(payload->>'referrerDomain','')),253),'');
begin
  if fingerprint is null or length(fingerprint) not between 16 and 128 then raise exception 'Invalid event'; end if;
  if event_name not in (
    'page_view','experience_view','rental_view','package_view','booking_started',
    'booking_submitted','booking_click','enquiry_started','whatsapp_click',
    'phone_click','lead_submit','cta_click'
  ) then raise exception 'Invalid event'; end if;
  if clean_path not like '/%' or clean_path like '//%' then raise exception 'Invalid path'; end if;
  if length(coalesce(payload->>'sessionId','')) not between 16 and 128 then raise exception 'Invalid session'; end if;
  if coalesce(payload->>'deviceCategory','') not in ('mobile','tablet','desktop') then raise exception 'Invalid device'; end if;

  if payload->>'deliveryMode' = 'fallback' then
    if clean_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
      or not (clean_path = '/s/' || clean_slug or clean_path like ('/s/' || clean_slug || '/%'))
    then raise exception 'Invalid fallback website'; end if;
    select s.id into target_site from public.sites s
    where s.slug = clean_slug and s.status = 'published'
      and s.published_snapshot is not null limit 1;
  else
    select s.id into target_site from public.domains d
    join public.sites s on s.id = d.site_id
    where d.hostname = clean_hostname and d.verification_status = 'verified'
      and s.status = 'published' and s.published_snapshot is not null limit 1;
  end if;
  if target_site is null then raise exception 'Website unavailable'; end if;

  insert into private.analytics_rate_limits(site_id,fingerprint,window_start,submissions)
  values(target_site,fingerprint,date_trunc('hour',now()),1)
  on conflict on constraint analytics_rate_limits_pkey do update
    set submissions = private.analytics_rate_limits.submissions + 1
    where private.analytics_rate_limits.submissions < 240
  returning submissions into current_count;
  if current_count is null then raise exception 'Too many events'; end if;

  if nullif(payload->>'experienceId','') is not null then
    select id into target_experience from public.experiences
    where id = (payload->>'experienceId')::uuid and site_id = target_site
      and status = 'published';
    if target_experience is null then raise exception 'Invalid experience'; end if;
  end if;
  if nullif(payload->>'rentalProductId','') is not null then
    select id into target_rental from public.rental_products
    where id = (payload->>'rentalProductId')::uuid and site_id = target_site
      and status = 'published';
    if target_rental is null then raise exception 'Invalid rental product'; end if;
  end if;
  if nullif(payload->>'packageId','') is not null then
    select id into target_package from public.packages
    where id = (payload->>'packageId')::uuid and site_id = target_site
      and status = 'published';
    if target_package is null then raise exception 'Invalid package'; end if;
  end if;
  if event_name = 'experience_view' and target_experience is null then raise exception 'Experience required'; end if;
  if event_name = 'rental_view' and target_rental is null then raise exception 'Rental product required'; end if;
  if event_name = 'package_view' and target_package is null then raise exception 'Package required'; end if;

  insert into public.analytics_events(
    site_id,event_name,page_path,experience_id,rental_product_id,package_id,
    referrer_domain,session_id,device_category
  ) values (
    target_site,event_name,clean_path,target_experience,target_rental,target_package,
    clean_referrer,payload->>'sessionId',payload->>'deviceCategory'
  );
end;
$$;
revoke all on function public.submit_analytics_event(jsonb,text) from public;
grant execute on function public.submit_analytics_event(jsonb,text) to anon, authenticated;

comment on table public.packages is
  'First-class travel packages composed from existing offerings without content duplication.';
comment on table public.bookings is
  'Payment-free reservations and booking requests with tenant scope and idempotency.';
comment on table public.resources is
  'Capacity-constrained fulfilment resources such as guides, vehicles and equipment.';
comment on function public.submit_public_booking(jsonb,text) is
  'Validated public booking-request boundary; direct table access remains private.';
