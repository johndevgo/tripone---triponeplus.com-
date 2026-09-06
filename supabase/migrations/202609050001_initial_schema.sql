-- TripOne+ Part 1: schema, ownership helpers, RLS and transactional generation.
create extension if not exists pgcrypto;

create type public.business_type as enum ('jetski','boat_rental','day_tour','tour_operator','travel_agency','safari','trekking','hiking','diving','snorkelling','rafting','atv_buggy','adventure_activity','local_guide','multi_day_tour','excursion','water_sports','other');
create type public.site_status as enum ('draft','published','archived');
create type public.page_type as enum ('home','experiences','experience_detail_system','about','contact','gallery','faq','locations','location_detail_system','custom');
create type public.content_status as enum ('draft','published','archived');
create type public.domain_type as enum ('subdomain','custom');
create type public.verification_status as enum ('pending','verified','failed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '', avatar_url text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.businesses (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 100), slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'), business_type public.business_type not null,
  short_description text not null default '', full_description text not null default '', country text not null, city text not null, region text, address text,
  latitude double precision check (latitude between -90 and 90), longitude double precision check (longitude between -180 and 180),
  timezone text not null, currency text not null check (currency ~ '^[A-Z]{3}$'), phone text, whatsapp text, email text not null,
  website_url text, instagram_url text, facebook_url text, youtube_url text, tripadvisor_url text, google_maps_url text, logo_url text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(owner_id, slug)
);
create table public.sites (
  id uuid primary key default gen_random_uuid(), business_id uuid not null references public.businesses(id) on delete cascade, owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null, slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'), status public.site_status not null default 'draft', theme_id text not null,
  theme_settings jsonb not null default '{}', global_settings jsonb not null default '{}', navigation jsonb not null default '[]', footer_settings jsonb not null default '{}',
  favicon_url text, default_og_image_url text, published_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.pages (
  id uuid primary key default gen_random_uuid(), site_id uuid not null references public.sites(id) on delete cascade,
  title text not null, slug text not null default '', page_type public.page_type not null, status public.content_status not null default 'draft',
  sections jsonb not null default '[]', seo_settings jsonb not null default '{}', sort_order integer not null default 0, show_in_navigation boolean not null default true,
  navigation_label text, parent_page_id uuid references public.pages(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(site_id, slug)
);
create table public.experiences (
  id uuid primary key default gen_random_uuid(), site_id uuid not null references public.sites(id) on delete cascade, business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null, slug text not null, experience_type text not null, short_description text not null default '', description text not null default '',
  price_from numeric(12,2) check (price_from >= 0), currency text not null check (currency ~ '^[A-Z]{3}$'), pricing_label text,
  duration_value numeric(8,2) check (duration_value > 0), duration_unit text, location_name text, meeting_point text,
  latitude double precision check (latitude between -90 and 90), longitude double precision check (longitude between -180 and 180),
  max_guests integer check (max_guests > 0), min_guests integer check (min_guests > 0), minimum_age integer check (minimum_age >= 0), difficulty text,
  cancellation_policy text, booking_url text, booking_button_label text not null default 'Book now', featured_image_url text,
  gallery jsonb not null default '[]', highlights jsonb not null default '[]', inclusions jsonb not null default '[]', exclusions jsonb not null default '[]', itinerary jsonb not null default '[]', faqs jsonb not null default '[]', extra_details jsonb not null default '{}',
  featured boolean not null default false, status public.content_status not null default 'draft', sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(site_id, slug)
);
create table public.locations (
  id uuid primary key default gen_random_uuid(), site_id uuid not null references public.sites(id) on delete cascade, business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null, slug text not null, description text not null default '', city text, region text, country text, latitude double precision, longitude double precision, image_url text, seo_settings jsonb not null default '{}',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(site_id, slug)
);
create table public.testimonials (
  id uuid primary key default gen_random_uuid(), site_id uuid not null references public.sites(id) on delete cascade, author_name text not null, author_location text,
  rating smallint check (rating between 1 and 5), quote text not null, source text, source_url text, avatar_url text, status public.content_status not null default 'draft', sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.media (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id) on delete cascade, site_id uuid references public.sites(id) on delete cascade,
  storage_path text not null unique, public_url text not null, mime_type text not null, file_size bigint not null check (file_size between 1 and 10485760), width integer, height integer, alt_text text,
  created_at timestamptz not null default now()
);
create table public.leads (
  id uuid primary key default gen_random_uuid(), site_id uuid not null references public.sites(id) on delete cascade, experience_id uuid references public.experiences(id) on delete set null,
  name text not null, email text not null, phone text, desired_date date, guests integer check (guests > 0), message text, source_page text, status text not null default 'new', created_at timestamptz not null default now()
);
create table public.site_versions (
  id uuid primary key default gen_random_uuid(), site_id uuid not null references public.sites(id) on delete cascade, version_number integer not null check (version_number > 0), snapshot jsonb not null, created_by uuid not null references auth.users(id), created_at timestamptz not null default now(), label text, unique(site_id, version_number)
);
create table public.domains (
  id uuid primary key default gen_random_uuid(), site_id uuid not null references public.sites(id) on delete cascade, hostname text not null unique, domain_type public.domain_type not null, verification_status public.verification_status not null default 'pending', is_primary boolean not null default false, created_at timestamptz not null default now(), verified_at timestamptz
);
create table public.redirects (
  id uuid primary key default gen_random_uuid(), site_id uuid not null references public.sites(id) on delete cascade, source_path text not null, destination_path text not null, status_code smallint not null check (status_code in (301,302,307,308)), created_at timestamptz not null default now(), unique(site_id, source_path)
);

create index sites_owner_idx on public.sites(owner_id); create index sites_business_idx on public.sites(business_id);
create index pages_site_idx on public.pages(site_id); create index experiences_site_idx on public.experiences(site_id);
create index leads_site_idx on public.leads(site_id); create index media_site_idx on public.media(site_id);

create function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end $$;
create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger businesses_updated before update on public.businesses for each row execute function public.set_updated_at();
create trigger sites_updated before update on public.sites for each row execute function public.set_updated_at();
create trigger pages_updated before update on public.pages for each row execute function public.set_updated_at();
create trigger experiences_updated before update on public.experiences for each row execute function public.set_updated_at();
create trigger locations_updated before update on public.locations for each row execute function public.set_updated_at();
create trigger testimonials_updated before update on public.testimonials for each row execute function public.set_updated_at();

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin insert into public.profiles(id, full_name) values(new.id, coalesce(new.raw_user_meta_data->>'full_name','')); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create function public.owns_site(target_site uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.sites s where s.id = target_site and s.owner_id = auth.uid())
$$;
create function public.site_is_public(target_site uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.sites s where s.id = target_site and s.status = 'published')
$$;
revoke all on function public.owns_site(uuid) from public; grant execute on function public.owns_site(uuid) to authenticated;
revoke all on function public.site_is_public(uuid) from public; grant execute on function public.site_is_public(uuid) to anon, authenticated;

alter table public.profiles enable row level security; alter table public.businesses enable row level security; alter table public.sites enable row level security;
alter table public.pages enable row level security; alter table public.experiences enable row level security; alter table public.locations enable row level security;
alter table public.testimonials enable row level security; alter table public.media enable row level security; alter table public.leads enable row level security;
alter table public.site_versions enable row level security; alter table public.domains enable row level security; alter table public.redirects enable row level security;

create policy "profiles own select" on public.profiles for select using (id = auth.uid()); create policy "profiles own update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "business owner all" on public.businesses for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "published business public" on public.businesses for select to anon, authenticated using (exists(select 1 from public.sites s where s.business_id = businesses.id and s.status = 'published'));
create policy "site owner all" on public.sites for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid() and exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));
create policy "published sites public" on public.sites for select to anon, authenticated using (status = 'published');

create policy "pages owner all" on public.pages for all to authenticated using (public.owns_site(site_id)) with check (public.owns_site(site_id));
create policy "published pages public" on public.pages for select to anon, authenticated using (status = 'published' and public.site_is_public(site_id));
create policy "experiences owner all" on public.experiences for all to authenticated using (public.owns_site(site_id)) with check (public.owns_site(site_id));
create policy "published experiences public" on public.experiences for select to anon, authenticated using (status = 'published' and public.site_is_public(site_id));
create policy "locations owner all" on public.locations for all to authenticated using (public.owns_site(site_id)) with check (public.owns_site(site_id));
create policy "published locations public" on public.locations for select to anon, authenticated using (public.site_is_public(site_id));
create policy "testimonials owner all" on public.testimonials for all to authenticated using (public.owns_site(site_id)) with check (public.owns_site(site_id));
create policy "published testimonials public" on public.testimonials for select to anon, authenticated using (status = 'published' and public.site_is_public(site_id));
create policy "media owner all" on public.media for all to authenticated using (owner_id = auth.uid() and (site_id is null or public.owns_site(site_id))) with check (owner_id = auth.uid() and (site_id is null or public.owns_site(site_id)));
create policy "published media public" on public.media for select to anon, authenticated using (site_id is not null and public.site_is_public(site_id));
create policy "leads site owner select" on public.leads for select to authenticated using (public.owns_site(site_id));
create policy "leads site owner update" on public.leads for update to authenticated using (public.owns_site(site_id)) with check (public.owns_site(site_id));
create policy "public lead insert" on public.leads for insert to anon, authenticated with check (public.site_is_public(site_id));
create policy "versions owner all" on public.site_versions for all to authenticated using (public.owns_site(site_id)) with check (public.owns_site(site_id) and created_by = auth.uid());
create policy "domains owner all" on public.domains for all to authenticated using (public.owns_site(site_id)) with check (public.owns_site(site_id));
create policy "redirects owner all" on public.redirects for all to authenticated using (public.owns_site(site_id)) with check (public.owns_site(site_id));

-- The client validates this payload with Zod; the function rechecks ownership and creates one atomic snapshot.
create function public.create_generated_site(payload jsonb) returns uuid language plpgsql security invoker set search_path = '' as $$
declare uid uuid := auth.uid(); business_id uuid; new_site_id uuid; page jsonb; experience jsonb;
begin
  if uid is null then raise exception 'Authentication required'; end if;
  perform pg_advisory_xact_lock(hashtext(uid::text || ':' || payload->>'slug'));
  select id into new_site_id from public.sites where owner_id = uid and slug = payload->>'slug';
  if new_site_id is not null then return new_site_id; end if;
  insert into public.businesses(owner_id,name,slug,business_type,short_description,country,city,region,address,timezone,currency,phone,whatsapp,email,google_maps_url,logo_url)
  values(uid,payload->>'name',payload->>'slug',(payload->>'businessType')::public.business_type,payload->>'shortDescription',payload->>'country',payload->>'city',nullif(payload->>'region',''),nullif(payload->>'address',''),payload->>'timezone',payload->>'currency',nullif(payload->>'phone',''),nullif(payload->>'whatsapp',''),payload->>'email',nullif(payload->>'googleMapsUrl',''),nullif(payload->>'logoUrl','')) returning id into business_id;
  insert into public.sites(business_id,owner_id,name,slug,theme_id,theme_settings,global_settings,navigation,footer_settings)
  values(business_id,uid,payload->>'name',payload->>'slug',payload->>'themeId',payload->'generated'->'theme',payload->'generated'->'globalSettings',payload->'generated'->'navigation',payload->'generated'->'footer') returning id into new_site_id;
  for page in select * from jsonb_array_elements(payload->'generated'->'pages') loop
    insert into public.pages(site_id,title,slug,page_type,sections,seo_settings,sort_order,show_in_navigation)
    values(new_site_id,page->>'title',page->>'slug',(page->>'pageType')::public.page_type,page->'sections',page->'seoSettings',(page->>'sortOrder')::integer,(page->>'showInNavigation')::boolean);
  end loop;
  for experience in select * from jsonb_array_elements(coalesce(payload->'experiences','[]')) loop
    insert into public.experiences(site_id,business_id,name,slug,experience_type,short_description,price_from,currency,duration_value,duration_unit,location_name,booking_url,featured_image_url,extra_details,featured)
    values(new_site_id,business_id,experience->>'name',experience->>'slug',experience->>'experienceType',experience->>'shortDescription',nullif(experience->>'priceFrom','')::numeric,experience->>'currency',nullif(experience->>'durationValue','')::numeric,nullif(experience->>'durationUnit',''),nullif(experience->>'locationName',''),nullif(experience->>'bookingUrl',''),nullif(experience->>'featuredImageUrl',''),coalesce(experience->'extraDetails','{}'),true);
  end loop;
  insert into public.site_versions(site_id,version_number,snapshot,created_by,label) values(new_site_id,1,payload->'generated',uid,'Initial website');
  return new_site_id;
end $$;
revoke all on function public.create_generated_site(jsonb) from public; grant execute on function public.create_generated_site(jsonb) to authenticated;
