-- TripOne+ Part 4 milestone 2: multi-service businesses, rentals and taxonomies.
-- Additive by design: legacy business_type, locations and snapshot shapes remain valid.

create type public.taxonomy_type as enum (
  'activity', 'destination', 'travel_style', 'package_category', 'product_category'
);
create type public.rental_product_type as enum (
  'motorcycle', 'scooter', 'jet_ski', 'boat', 'buggy', 'jeep', 'bicycle', 'equipment', 'other'
);
create type public.pricing_unit as enum ('hour', 'day', 'week', 'person', 'group', 'fixed');

create or replace function public.owns_business(target_business uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.businesses b
    where b.id = target_business and b.owner_id = (select auth.uid())
  )
$$;
revoke all on function public.owns_business(uuid) from public;
grant execute on function public.owns_business(uuid) to authenticated;

create table public.business_capabilities (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  capability text not null check (capability in (
    'jetski','boat_rental','day_tour','tour_operator','travel_agency','safari',
    'trekking','hiking','diving','snorkelling','rafting','atv_buggy',
    'adventure_activity','local_guide','multi_day_tour','excursion','water_sports',
    'motorcycle_tour','motorcycle_rental','vehicle_rental','equipment_rental','other'
  )),
  is_primary boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  unique (business_id, capability)
);
create unique index business_capabilities_one_primary_idx
  on public.business_capabilities(business_id) where is_primary;
create index business_capabilities_business_idx
  on public.business_capabilities(business_id, sort_order);

insert into public.business_capabilities(business_id, capability, is_primary)
select id, business_type::text, true from public.businesses
on conflict (business_id, capability) do update set is_primary = true;

create or replace function public.ensure_new_business_capability()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.business_capabilities(business_id, capability, is_primary)
  values (new.id, new.business_type::text, true)
  on conflict (business_id, capability) do nothing;
  return new;
end
$$;
create trigger businesses_create_primary_capability
after insert on public.businesses
for each row execute function public.ensure_new_business_capability();

create table public.taxonomies (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  taxonomy_type public.taxonomy_type not null,
  name text not null check (char_length(name) between 2 and 80),
  singular_name text not null check (char_length(singular_name) between 2 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, taxonomy_type),
  unique (id, site_id)
);
create index taxonomies_site_idx on public.taxonomies(site_id);
create trigger taxonomies_updated before update on public.taxonomies
for each row execute function public.set_updated_at();

alter table public.locations add constraint locations_id_site_unique unique (id, site_id);

create table public.taxonomy_terms (
  id uuid primary key default gen_random_uuid(),
  taxonomy_id uuid not null,
  site_id uuid not null,
  parent_id uuid,
  source_location_id uuid,
  name text not null check (char_length(name) between 1 and 120),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '',
  hero_image_url text,
  sections jsonb not null default '[]'::jsonb,
  seo_settings jsonb not null default '{}'::jsonb,
  listing_mode text not null default 'automatic'
    check (listing_mode in ('automatic', 'manual')),
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (taxonomy_id, slug),
  unique (id, site_id),
  foreign key (taxonomy_id, site_id)
    references public.taxonomies(id, site_id) on delete cascade,
  foreign key (source_location_id, site_id)
    references public.locations(id, site_id) on delete restrict,
  foreign key (parent_id, site_id)
    references public.taxonomy_terms(id, site_id) on delete restrict
);
create unique index taxonomy_terms_source_location_idx
  on public.taxonomy_terms(source_location_id) where source_location_id is not null;
create index taxonomy_terms_taxonomy_idx
  on public.taxonomy_terms(taxonomy_id, parent_id, sort_order);
create index taxonomy_terms_site_status_idx
  on public.taxonomy_terms(site_id, status);
create trigger taxonomy_terms_updated before update on public.taxonomy_terms
for each row execute function public.set_updated_at();

create or replace function public.reject_taxonomy_term_cycle()
returns trigger
language plpgsql
set search_path = ''
as $$
declare cycle_found boolean;
begin
  if new.parent_id is null then return new; end if;
  if new.parent_id = new.id then raise exception 'A taxonomy term cannot be its own parent'; end if;
  if not exists (
    select 1 from public.taxonomy_terms parent
    where parent.id = new.parent_id and parent.site_id = new.site_id
      and parent.taxonomy_id = new.taxonomy_id
  ) then
    raise exception 'A parent term must use the same site and taxonomy';
  end if;

  with recursive ancestors(id, parent_id) as (
    select t.id, t.parent_id
    from public.taxonomy_terms t
    where t.id = new.parent_id and t.site_id = new.site_id
    union all
    select t.id, t.parent_id
    from public.taxonomy_terms t
    join ancestors a on t.id = a.parent_id
    where t.site_id = new.site_id
  )
  select exists(select 1 from ancestors where id = new.id) into cycle_found;
  if cycle_found then raise exception 'Taxonomy hierarchy cannot contain a cycle'; end if;
  return new;
end
$$;
create trigger taxonomy_terms_reject_cycle
before insert or update of parent_id, site_id on public.taxonomy_terms
for each row execute function public.reject_taxonomy_term_cycle();

create or replace function public.ensure_site_taxonomies(target_site uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.taxonomies(site_id, taxonomy_type, name, singular_name)
  values
    (target_site, 'activity', 'Activities', 'Activity'),
    (target_site, 'destination', 'Destinations', 'Destination'),
    (target_site, 'travel_style', 'Travel styles', 'Travel style'),
    (target_site, 'package_category', 'Package categories', 'Package category'),
    (target_site, 'product_category', 'Product categories', 'Product category')
  on conflict (site_id, taxonomy_type) do nothing;
end
$$;
revoke all on function public.ensure_site_taxonomies(uuid) from public;
grant execute on function public.ensure_site_taxonomies(uuid) to authenticated;

create or replace function public.ensure_new_site_taxonomies()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.ensure_site_taxonomies(new.id);
  return new;
end
$$;
create trigger sites_create_taxonomies
after insert on public.sites
for each row execute function public.ensure_new_site_taxonomies();

do $$
declare existing_site uuid;
begin
  for existing_site in select id from public.sites loop
    perform public.ensure_site_taxonomies(existing_site);
  end loop;
end
$$;

create table public.rental_products (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  rental_type public.rental_product_type not null,
  short_description text not null default '',
  description text not null default '',
  brand text,
  model text,
  capacity integer check (capacity > 0),
  minimum_age integer check (minimum_age >= 0),
  license_required boolean not null default false,
  security_deposit numeric(12,2) check (security_deposit >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  pricing_label text,
  location_name text,
  booking_url text,
  booking_button_label text not null default 'Request rental',
  quote_only boolean not null default false,
  featured_image_url text,
  gallery jsonb not null default '[]'::jsonb,
  specifications jsonb not null default '[]'::jsonb,
  inclusions jsonb not null default '[]'::jsonb,
  exclusions jsonb not null default '[]'::jsonb,
  rental_terms jsonb not null default '[]'::jsonb,
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
create index rental_products_business_idx on public.rental_products(business_id);
create index rental_products_site_status_idx
  on public.rental_products(site_id, status, sort_order);
create trigger rental_products_updated before update on public.rental_products
for each row execute function public.set_updated_at();

create table public.rental_rates (
  id uuid primary key default gen_random_uuid(),
  rental_product_id uuid not null,
  site_id uuid not null,
  label text not null check (char_length(label) between 1 and 100),
  amount numeric(12,2) check (amount >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  pricing_unit public.pricing_unit not null,
  minimum_quantity numeric(8,2) check (minimum_quantity > 0),
  maximum_quantity numeric(8,2) check (
    maximum_quantity is null or minimum_quantity is null or maximum_quantity >= minimum_quantity
  ),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (rental_product_id, site_id)
    references public.rental_products(id, site_id) on delete cascade
);
create index rental_rates_product_idx
  on public.rental_rates(rental_product_id, sort_order);
create index rental_rates_site_idx on public.rental_rates(site_id);
create trigger rental_rates_updated before update on public.rental_rates
for each row execute function public.set_updated_at();

alter table public.experiences add constraint experiences_id_site_unique unique (id, site_id);

create table public.experience_taxonomy_terms (
  site_id uuid not null,
  experience_id uuid not null,
  term_id uuid not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (experience_id, term_id),
  foreign key (experience_id, site_id)
    references public.experiences(id, site_id) on delete cascade,
  foreign key (term_id, site_id)
    references public.taxonomy_terms(id, site_id) on delete cascade
);
create index experience_taxonomy_terms_term_idx
  on public.experience_taxonomy_terms(term_id, experience_id);
create index experience_taxonomy_terms_site_idx
  on public.experience_taxonomy_terms(site_id);

create table public.rental_product_taxonomy_terms (
  site_id uuid not null,
  rental_product_id uuid not null,
  term_id uuid not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (rental_product_id, term_id),
  foreign key (rental_product_id, site_id)
    references public.rental_products(id, site_id) on delete cascade,
  foreign key (term_id, site_id)
    references public.taxonomy_terms(id, site_id) on delete cascade
);
create index rental_product_taxonomy_terms_term_idx
  on public.rental_product_taxonomy_terms(term_id, rental_product_id);
create index rental_product_taxonomy_terms_site_idx
  on public.rental_product_taxonomy_terms(site_id);

-- Keep locations as the canonical location records while exposing them as destination terms.
create or replace function public.sync_location_destination_term()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare destination_taxonomy uuid;
begin
  select id into destination_taxonomy from public.taxonomies
  where site_id = new.site_id and taxonomy_type = 'destination';
  if destination_taxonomy is null then
    perform public.ensure_site_taxonomies(new.site_id);
    select id into destination_taxonomy from public.taxonomies
    where site_id = new.site_id and taxonomy_type = 'destination';
  end if;
  insert into public.taxonomy_terms(
    taxonomy_id, site_id, source_location_id, name, slug, description,
    hero_image_url, seo_settings, status
  ) values (
    destination_taxonomy, new.site_id, new.id, new.name, new.slug,
    new.description, new.image_url, new.seo_settings,
    case when char_length(trim(new.description)) >= 120 then 'published'::public.content_status
      else 'draft'::public.content_status end
  )
  on conflict (source_location_id) where source_location_id is not null
  do update set name = excluded.name, slug = excluded.slug,
    description = excluded.description, hero_image_url = excluded.hero_image_url,
    seo_settings = excluded.seo_settings, status = excluded.status;
  return new;
end
$$;
create trigger locations_sync_destination_term
after insert or update of name, slug, description, image_url, seo_settings on public.locations
for each row execute function public.sync_location_destination_term();

do $$
begin
  insert into public.taxonomy_terms(
    taxonomy_id, site_id, source_location_id, name, slug, description,
    hero_image_url, seo_settings, status
  )
  select t.id, l.site_id, l.id, l.name, l.slug, l.description, l.image_url,
    l.seo_settings,
    case when char_length(trim(l.description)) >= 120 then 'published'::public.content_status
      else 'draft'::public.content_status end
  from public.locations l
  join public.taxonomies t on t.site_id = l.site_id and t.taxonomy_type = 'destination'
  on conflict (source_location_id) where source_location_id is not null do nothing;
end
$$;

alter table public.business_capabilities enable row level security;
alter table public.taxonomies enable row level security;
alter table public.taxonomy_terms enable row level security;
alter table public.rental_products enable row level security;
alter table public.rental_rates enable row level security;
alter table public.experience_taxonomy_terms enable row level security;
alter table public.rental_product_taxonomy_terms enable row level security;

create policy "business capabilities owner all" on public.business_capabilities
for all to authenticated
using ((select public.owns_business(business_id)))
with check ((select public.owns_business(business_id)));
create policy "taxonomies owner all" on public.taxonomies
for all to authenticated
using ((select public.owns_site(site_id)))
with check ((select public.owns_site(site_id)));
create policy "taxonomy terms owner all" on public.taxonomy_terms
for all to authenticated
using ((select public.owns_site(site_id)))
with check ((select public.owns_site(site_id)));
create policy "rental products owner all" on public.rental_products
for all to authenticated
using ((select public.owns_site(site_id)))
with check (
  (select public.owns_site(site_id)) and exists (
    select 1 from public.sites s
    where s.id = rental_products.site_id and s.business_id = rental_products.business_id
  )
);
create policy "rental rates owner all" on public.rental_rates
for all to authenticated
using ((select public.owns_site(site_id)))
with check ((select public.owns_site(site_id)));
create policy "experience terms owner all" on public.experience_taxonomy_terms
for all to authenticated
using ((select public.owns_site(site_id)))
with check ((select public.owns_site(site_id)));
create policy "rental terms owner all" on public.rental_product_taxonomy_terms
for all to authenticated
using ((select public.owns_site(site_id)))
with check ((select public.owns_site(site_id)));

revoke all on table public.business_capabilities, public.taxonomies,
  public.taxonomy_terms, public.rental_products, public.rental_rates,
  public.experience_taxonomy_terms, public.rental_product_taxonomy_terms
  from anon, authenticated;
grant select, insert, update, delete on table public.business_capabilities,
  public.taxonomies, public.taxonomy_terms, public.rental_products,
  public.rental_rates, public.experience_taxonomy_terms,
  public.rental_product_taxonomy_terms to authenticated;

create or replace function public.set_business_capabilities(
  target_business uuid, selected_capabilities text[], primary_capability text
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare capability_name text;
begin
  if not (select public.owns_business(target_business)) then raise exception 'Not authorized'; end if;
  if coalesce(array_length(selected_capabilities, 1), 0) = 0 then
    raise exception 'Select at least one service';
  end if;
  if not (primary_capability = any(selected_capabilities)) then
    raise exception 'Primary service must be selected';
  end if;
  if exists (
    select 1 from unnest(selected_capabilities) selected(value)
    where value not in (
      'jetski','boat_rental','day_tour','tour_operator','travel_agency','safari',
      'trekking','hiking','diving','snorkelling','rafting','atv_buggy',
      'adventure_activity','local_guide','multi_day_tour','excursion','water_sports',
      'motorcycle_tour','motorcycle_rental','vehicle_rental','equipment_rental','other'
    )
  ) then raise exception 'Unknown service capability'; end if;

  delete from public.business_capabilities where business_id = target_business;
  foreach capability_name in array selected_capabilities loop
    insert into public.business_capabilities(business_id, capability, is_primary, sort_order)
    values (
      target_business, capability_name, capability_name = primary_capability,
      array_position(selected_capabilities, capability_name) - 1
    );
  end loop;
  update public.businesses set business_type =
    case when primary_capability in (
      'jetski','boat_rental','day_tour','tour_operator','travel_agency','safari',
      'trekking','hiking','diving','snorkelling','rafting','atv_buggy',
      'adventure_activity','local_guide','multi_day_tour','excursion','water_sports','other'
    ) then primary_capability::public.business_type else 'other'::public.business_type end
  where id = target_business;
end
$$;
revoke all on function public.set_business_capabilities(uuid, text[], text) from public;
grant execute on function public.set_business_capabilities(uuid, text[], text) to authenticated;

create or replace function public.save_rental_product(payload jsonb)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  target_site uuid := (payload->>'siteId')::uuid;
  target_business uuid;
  target_product uuid;
  rate jsonb;
begin
  if not (select public.owns_site(target_site)) then raise exception 'Not authorized'; end if;
  select business_id into target_business from public.sites where id = target_site;
  if nullif(payload->>'id', '') is not null then
    target_product := (payload->>'id')::uuid;
    update public.rental_products set
      name = payload->>'name', slug = payload->>'slug',
      rental_type = (payload->>'rentalType')::public.rental_product_type,
      short_description = coalesce(payload->>'shortDescription', ''),
      description = coalesce(payload->>'description', ''),
      brand = nullif(payload->>'brand', ''), model = nullif(payload->>'model', ''),
      capacity = nullif(payload->>'capacity', '')::integer,
      minimum_age = nullif(payload->>'minimumAge', '')::integer,
      license_required = coalesce((payload->>'licenseRequired')::boolean, false),
      security_deposit = nullif(payload->>'securityDeposit', '')::numeric,
      currency = payload->>'currency', pricing_label = nullif(payload->>'pricingLabel', ''),
      location_name = nullif(payload->>'locationName', ''),
      booking_url = nullif(payload->>'bookingUrl', ''),
      booking_button_label = payload->>'bookingButtonLabel',
      quote_only = coalesce((payload->>'quoteOnly')::boolean, false),
      featured_image_url = nullif(payload->>'featuredImageUrl', ''),
      gallery = coalesce(payload->'gallery', '[]'::jsonb),
      specifications = coalesce(payload->'specifications', '[]'::jsonb),
      inclusions = coalesce(payload->'inclusions', '[]'::jsonb),
      exclusions = coalesce(payload->'exclusions', '[]'::jsonb),
      rental_terms = coalesce(payload->'rentalTerms', '[]'::jsonb),
      seo_settings = coalesce(payload->'seoSettings', '{}'::jsonb),
      featured = coalesce((payload->>'featured')::boolean, false),
      status = (payload->>'status')::public.content_status
    where id = target_product and site_id = target_site;
    if not found then raise exception 'Rental product not found'; end if;
  else
    insert into public.rental_products(
      site_id, business_id, name, slug, rental_type, short_description, description,
      brand, model, capacity, minimum_age, license_required, security_deposit,
      currency, pricing_label, location_name, booking_url, booking_button_label,
      quote_only, featured_image_url, gallery, specifications, inclusions, exclusions,
      rental_terms, seo_settings, featured, status
    ) values (
      target_site, target_business, payload->>'name', payload->>'slug',
      (payload->>'rentalType')::public.rental_product_type,
      coalesce(payload->>'shortDescription', ''), coalesce(payload->>'description', ''),
      nullif(payload->>'brand', ''), nullif(payload->>'model', ''),
      nullif(payload->>'capacity', '')::integer, nullif(payload->>'minimumAge', '')::integer,
      coalesce((payload->>'licenseRequired')::boolean, false),
      nullif(payload->>'securityDeposit', '')::numeric, payload->>'currency',
      nullif(payload->>'pricingLabel', ''), nullif(payload->>'locationName', ''),
      nullif(payload->>'bookingUrl', ''), payload->>'bookingButtonLabel',
      coalesce((payload->>'quoteOnly')::boolean, false), nullif(payload->>'featuredImageUrl', ''),
      coalesce(payload->'gallery', '[]'::jsonb), coalesce(payload->'specifications', '[]'::jsonb),
      coalesce(payload->'inclusions', '[]'::jsonb), coalesce(payload->'exclusions', '[]'::jsonb),
      coalesce(payload->'rentalTerms', '[]'::jsonb), coalesce(payload->'seoSettings', '{}'::jsonb),
      coalesce((payload->>'featured')::boolean, false),
      (payload->>'status')::public.content_status
    ) returning id into target_product;
  end if;

  delete from public.rental_rates where rental_product_id = target_product;
  for rate in select * from jsonb_array_elements(coalesce(payload->'rates', '[]'::jsonb)) loop
    insert into public.rental_rates(
      rental_product_id, site_id, label, amount, currency, pricing_unit,
      minimum_quantity, maximum_quantity, sort_order
    ) values (
      target_product, target_site, rate->>'label', nullif(rate->>'amount', '')::numeric,
      rate->>'currency', (rate->>'pricingUnit')::public.pricing_unit,
      nullif(rate->>'minimumQuantity', '')::numeric,
      nullif(rate->>'maximumQuantity', '')::numeric,
      coalesce((rate->>'sortOrder')::integer, 0)
    );
  end loop;
  return target_product;
end
$$;
revoke all on function public.save_rental_product(jsonb) from public;
grant execute on function public.save_rental_product(jsonb) to authenticated;

-- Version 2 snapshots contain the complete multi-service graph. Existing version 1
-- snapshots remain readable by the application decoder until a site republishes.
create or replace function public.publish_site(target_site uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare next_version integer; next_snapshot jsonb;
begin
  if not (select public.owns_site(target_site)) then raise exception 'Not authorized'; end if;
  perform pg_advisory_xact_lock(hashtext('publish:' || target_site::text));
  update public.pages set status = 'published' where site_id = target_site and status = 'draft';
  update public.experiences set status = 'published' where site_id = target_site and status = 'draft';
  update public.rental_products set status = 'published' where site_id = target_site and status = 'draft';

  select jsonb_build_object(
    'schemaVersion', 2,
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
    'businessCapabilities', (
      select coalesce(jsonb_agg(to_jsonb(c) - 'business_id' - 'created_at' order by c.sort_order), '[]'::jsonb)
      from public.business_capabilities c where c.business_id = s.business_id
    ),
    'pages', (
      select coalesce(jsonb_agg(to_jsonb(p) order by p.sort_order), '[]'::jsonb)
      from public.pages p where p.site_id = s.id and p.status = 'published'
    ),
    'experiences', (
      select coalesce(jsonb_agg(to_jsonb(e) order by e.sort_order), '[]'::jsonb)
      from public.experiences e where e.site_id = s.id and e.status = 'published'
    ),
    'rentals', (
      select coalesce(jsonb_agg(to_jsonb(r) order by r.sort_order), '[]'::jsonb)
      from public.rental_products r where r.site_id = s.id and r.status = 'published'
    ),
    'rentalRates', (
      select coalesce(jsonb_agg(to_jsonb(rr) order by rr.rental_product_id, rr.sort_order), '[]'::jsonb)
      from public.rental_rates rr join public.rental_products rp on rp.id = rr.rental_product_id
      where rr.site_id = s.id and rp.status = 'published'
    ),
    'taxonomies', (
      select coalesce(jsonb_agg(to_jsonb(tx) order by tx.taxonomy_type), '[]'::jsonb)
      from public.taxonomies tx where tx.site_id = s.id
    ),
    'taxonomyTerms', (
      select coalesce(jsonb_agg(to_jsonb(tt) order by tt.taxonomy_id, tt.sort_order), '[]'::jsonb)
      from public.taxonomy_terms tt where tt.site_id = s.id and tt.status = 'published'
        and (char_length(trim(tt.description)) >= 80 or exists (
          select 1 from public.experience_taxonomy_terms et where et.term_id = tt.id
          union all
          select 1 from public.rental_product_taxonomy_terms rt where rt.term_id = tt.id
        ))
    ),
    'experienceTaxonomyTerms', (
      select coalesce(jsonb_agg(to_jsonb(et)), '[]'::jsonb)
      from public.experience_taxonomy_terms et
      join public.experiences e on e.id = et.experience_id
      join public.taxonomy_terms tt on tt.id = et.term_id
      where et.site_id = s.id and e.status = 'published' and tt.status = 'published'
    ),
    'rentalTaxonomyTerms', (
      select coalesce(jsonb_agg(to_jsonb(rt)), '[]'::jsonb)
      from public.rental_product_taxonomy_terms rt
      join public.rental_products rp on rp.id = rt.rental_product_id
      join public.taxonomy_terms tt on tt.id = rt.term_id
      where rt.site_id = s.id and rp.status = 'published' and tt.status = 'published'
    ),
    'locations', (
      select coalesce(jsonb_agg(to_jsonb(l) order by l.name), '[]'::jsonb)
      from public.locations l where l.site_id = s.id and char_length(trim(l.description)) >= 120
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
end
$$;
revoke all on function public.publish_site(uuid) from public;
grant execute on function public.publish_site(uuid) to authenticated;

comment on table public.business_capabilities is
  'Normalized multi-service capabilities; businesses.business_type remains the legacy primary category.';
comment on table public.rental_products is
  'Rental inventory is separate from experiences so availability and pricing remain structurally correct.';
