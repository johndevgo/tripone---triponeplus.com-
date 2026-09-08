-- TripOne+ Part 4 milestone 3: revision-safe template editing, record
-- overrides, and immutable publication of the complete template graph.

-- Keep initial experiences and rental products in the same idempotent website
-- generation transaction. Older clients that omit rentals remain compatible.
create or replace function public.create_generated_site(payload jsonb)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  business_id uuid;
  new_site_id uuid;
  rental_id uuid;
  page jsonb;
  experience jsonb;
  rental jsonb;
  selected_capabilities text[];
begin
  if uid is null then raise exception 'Authentication required'; end if;
  perform pg_advisory_xact_lock(hashtext(uid::text || ':' || (payload->>'slug')));
  select id into new_site_id
  from public.sites where owner_id = uid and slug = payload->>'slug';
  if new_site_id is not null then return new_site_id; end if;

  insert into public.businesses(
    owner_id,name,slug,business_type,short_description,country,city,region,
    address,timezone,currency,phone,whatsapp,email,google_maps_url,logo_url
  ) values (
    uid,payload->>'name',payload->>'slug',
    (payload->>'businessType')::public.business_type,
    payload->>'shortDescription',payload->>'country',payload->>'city',
    nullif(payload->>'region',''),nullif(payload->>'address',''),
    payload->>'timezone',payload->>'currency',nullif(payload->>'phone',''),
    nullif(payload->>'whatsapp',''),payload->>'email',
    nullif(payload->>'googleMapsUrl',''),nullif(payload->>'logoUrl','')
  ) returning id into business_id;

  select coalesce(array_agg(value), array[payload->>'businessType'])
  into selected_capabilities
  from jsonb_array_elements_text(
    coalesce(payload->'capabilities', jsonb_build_array(payload->>'businessType'))
  ) values_list(value);
  perform public.set_business_capabilities(
    business_id, selected_capabilities, payload->>'businessType'
  );

  insert into public.sites(
    business_id,owner_id,name,slug,theme_id,theme_settings,global_settings,
    navigation,footer_settings
  ) values (
    business_id,uid,payload->>'name',payload->>'slug',payload->>'themeId',
    payload->'generated'->'theme',payload->'generated'->'globalSettings',
    payload->'generated'->'navigation',payload->'generated'->'footer'
  ) returning id into new_site_id;

  for page in select * from jsonb_array_elements(payload->'generated'->'pages') loop
    insert into public.pages(
      site_id,title,slug,page_type,sections,seo_settings,sort_order,
      show_in_navigation
    ) values (
      new_site_id,page->>'title',page->>'slug',
      (page->>'pageType')::public.page_type,page->'sections',
      page->'seoSettings',(page->>'sortOrder')::integer,
      (page->>'showInNavigation')::boolean
    );
  end loop;

  for experience in
    select * from jsonb_array_elements(coalesce(payload->'experiences','[]'))
  loop
    insert into public.experiences(
      site_id,business_id,name,slug,experience_type,short_description,
      price_from,currency,duration_value,duration_unit,location_name,
      booking_url,featured_image_url,extra_details,featured
    ) values (
      new_site_id,business_id,experience->>'name',experience->>'slug',
      experience->>'experienceType',experience->>'shortDescription',
      nullif(experience->>'priceFrom','')::numeric,experience->>'currency',
      nullif(experience->>'durationValue','')::numeric,
      nullif(experience->>'durationUnit',''),nullif(experience->>'locationName',''),
      nullif(experience->>'bookingUrl',''),
      nullif(experience->>'featuredImageUrl',''),
      coalesce(experience->'extraDetails','{}'),true
    );
  end loop;

  for rental in
    select * from jsonb_array_elements(coalesce(payload->'rentals','[]'))
  loop
    insert into public.rental_products(
      site_id,business_id,name,slug,rental_type,short_description,currency,
      quote_only,location_name,booking_url,booking_button_label,
      featured_image_url,featured
    ) values (
      new_site_id,business_id,rental->>'name',rental->>'slug',
      (rental->>'rentalType')::public.rental_product_type,
      rental->>'shortDescription',rental->>'currency',
      coalesce((rental->>'quoteOnly')::boolean,false),
      nullif(rental->>'locationName',''),nullif(rental->>'bookingUrl',''),
      'Request rental',nullif(rental->>'featuredImageUrl',''),true
    ) returning id into rental_id;

    if nullif(rental->>'rateAmount','') is not null then
      insert into public.rental_rates(
        rental_product_id,site_id,label,amount,currency,pricing_unit,sort_order
      ) values (
        rental_id,new_site_id,'Starting rate',
        (rental->>'rateAmount')::numeric,rental->>'currency',
        (rental->>'rateUnit')::public.pricing_unit,0
      );
    end if;
  end loop;

  insert into public.site_versions(
    site_id,version_number,snapshot,created_by,label
  ) values (
    new_site_id,1,
    payload->'generated' || jsonb_build_object(
      'experiences',coalesce(payload->'experiences','[]'::jsonb),
      'rentals',coalesce(payload->'rentals','[]'::jsonb)
    ),
    uid,'Initial website'
  );
  return new_site_id;
end
$$;
revoke all on function public.create_generated_site(jsonb) from public;
grant execute on function public.create_generated_site(jsonb) to authenticated;

alter table public.rental_products
  add column if not exists sections_override jsonb;
alter table public.taxonomy_terms
  add column if not exists sections_override jsonb;
alter table public.locations
  add column if not exists template_id uuid,
  add column if not exists template_version integer
    check (template_version is null or template_version > 0),
  add column if not exists sections_override jsonb;

alter table public.locations
  add constraint locations_template_site_fk
  foreign key (template_id, site_id)
  references public.site_templates(id, site_id) on delete restrict;

create index if not exists locations_template_idx
  on public.locations(template_id) where template_id is not null;

create or replace function public.save_site_template_draft(
  target_site uuid,
  target_template uuid,
  expected_version integer,
  new_sections jsonb
)
returns table(version integer, saved_at timestamptz)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not (select public.owns_site(target_site)) then
    raise exception 'Not authorized';
  end if;
  if jsonb_typeof(new_sections) <> 'array' or jsonb_array_length(new_sections) > 60 then
    raise exception 'Invalid template sections';
  end if;

  update public.site_templates
  set sections = new_sections, version = site_templates.version + 1
  where id = target_template
    and site_id = target_site
    and site_templates.version = expected_version
  returning site_templates.version, site_templates.updated_at
  into version, saved_at;

  if not found then
    if not exists (
      select 1 from public.site_templates
      where id = target_template and site_id = target_site
    ) then
      raise exception 'Template not found';
    end if;
    raise exception 'This template changed in another tab. Refresh before saving again.';
  end if;
  return next;
end
$$;
revoke all on function public.save_site_template_draft(uuid, uuid, integer, jsonb)
  from public;
grant execute on function public.save_site_template_draft(uuid, uuid, integer, jsonb)
  to authenticated;

-- Version 3 adds templates and record overrides without mutating older snapshots.
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
    'schemaVersion', 3,
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
      from public.rental_rates rr
      join public.rental_products rp on rp.id = rr.rental_product_id
      where rr.site_id = s.id and rp.status = 'published'
    ),
    'taxonomies', (
      select coalesce(jsonb_agg(to_jsonb(tx) order by tx.taxonomy_type), '[]'::jsonb)
      from public.taxonomies tx where tx.site_id = s.id
    ),
    'taxonomyTerms', (
      select coalesce(jsonb_agg(to_jsonb(tt) order by tt.taxonomy_id, tt.sort_order), '[]'::jsonb)
      from public.taxonomy_terms tt
      where tt.site_id = s.id and tt.status = 'published'
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
      from public.locations l
      where l.site_id = s.id and char_length(trim(l.description)) >= 120
    ),
    'testimonials', (
      select coalesce(jsonb_agg(to_jsonb(t) order by t.sort_order), '[]'::jsonb)
      from public.testimonials t where t.site_id = s.id and t.status = 'published'
    ),
    'redirects', (
      select coalesce(jsonb_agg(to_jsonb(r) order by r.source_path), '[]'::jsonb)
      from public.redirects r where r.site_id = s.id
    ),
    'siteTemplates', (
      select coalesce(jsonb_agg(to_jsonb(st) order by st.template_kind, st.subtype), '[]'::jsonb)
      from public.site_templates st where st.site_id = s.id
    ),
    'savedSections', (
      select coalesce(jsonb_agg(to_jsonb(ss) order by ss.updated_at), '[]'::jsonb)
      from public.saved_sections ss where ss.site_id = s.id and ss.save_mode = 'linked'
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
