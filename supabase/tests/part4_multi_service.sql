-- Part 4 multi-service, rental and taxonomy integration assertions.
-- Run after the Part 4 core migration. All fixtures are rolled back.
begin;

insert into auth.users(id, raw_user_meta_data) values
  ('8ea5eb2a-bdd6-48e5-8a33-1efea1557801', '{}'::jsonb),
  ('1828f180-cbeb-427b-a823-e1c63076b802', '{}'::jsonb);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"8ea5eb2a-bdd6-48e5-8a33-1efea1557801","role":"authenticated"}', true);

do $test$
declare
  owner_a constant uuid := '8ea5eb2a-bdd6-48e5-8a33-1efea1557801';
  owner_b constant uuid := '1828f180-cbeb-427b-a823-e1c63076b802';
  business_a uuid;
  site_a uuid;
  activity_taxonomy uuid;
  parent_term uuid;
  child_term uuid;
  experience_a uuid;
  rental_a uuid;
  rejected boolean;
begin
  insert into public.businesses(owner_id, name, slug, business_type, country, city, timezone, currency, email)
  values(owner_a, 'Nepal Multi Service Test', 'nepal-multi-service-test', 'trekking', 'Nepal', 'Kathmandu', 'Asia/Kathmandu', 'NPR', 'test@example.invalid')
  returning id into business_a;
  insert into public.sites(business_id, owner_id, name, slug, theme_id)
  values(business_a, owner_a, 'Nepal Multi Service Test', 'nepal-multi-service-test', 'summit')
  returning id into site_a;

  if (select count(*) from public.taxonomies where site_id = site_a) <> 5 then
    raise exception 'New site did not receive five controlled taxonomies';
  end if;
  perform public.set_business_capabilities(
    business_a,
    array['trekking','motorcycle_tour','equipment_rental'],
    'trekking'
  );
  if (select count(*) from public.business_capabilities where business_id = business_a) <> 3
    or (select capability from public.business_capabilities where business_id = business_a and is_primary) <> 'trekking' then
    raise exception 'Multi-service capability update failed';
  end if;

  select id into activity_taxonomy from public.taxonomies
  where site_id = site_a and taxonomy_type = 'activity';
  insert into public.taxonomy_terms(taxonomy_id, site_id, name, slug, description)
  values(activity_taxonomy, site_a, 'Outdoor adventures', 'outdoor-adventures', repeat('Useful category content. ', 6))
  returning id into parent_term;
  insert into public.taxonomy_terms(taxonomy_id, site_id, parent_id, name, slug)
  values(activity_taxonomy, site_a, parent_term, 'Motorcycle adventures', 'motorcycle-adventures')
  returning id into child_term;

  rejected := false;
  begin
    update public.taxonomy_terms set parent_id = child_term where id = parent_term;
  exception when others then
    rejected := sqlerrm = 'Taxonomy hierarchy cannot contain a cycle';
  end;
  if not rejected then raise exception 'Taxonomy cycle was not rejected'; end if;

  insert into public.experiences(site_id, business_id, name, slug, experience_type, short_description, currency)
  values(site_a, business_a, 'Kathmandu ride', 'kathmandu-ride', 'motorcycle_tour', 'A test motorcycle route around Kathmandu.', 'NPR')
  returning id into experience_a;
  insert into public.experience_taxonomy_terms(site_id, experience_id, term_id)
  values(site_a, experience_a, child_term);

  rental_a := public.save_rental_product(jsonb_build_object(
    'siteId', site_a, 'id', '', 'name', 'Protective riding set',
    'slug', 'protective-riding-set', 'rentalType', 'equipment', 'status', 'draft',
    'shortDescription', 'Demo-safe protective equipment for a confirmed ride.',
    'description', '', 'brand', '', 'model', '', 'capacity', '', 'minimumAge', '',
    'licenseRequired', false, 'securityDeposit', '', 'currency', 'NPR',
    'pricingLabel', '', 'locationName', 'Kathmandu', 'bookingUrl', '',
    'bookingButtonLabel', 'Request rental', 'quoteOnly', false, 'featured', true,
    'featuredImageUrl', '', 'gallery', '[]'::jsonb,
    'specifications', jsonb_build_array(jsonb_build_object('label','Sizes','value','S to XL')),
    'inclusions', '[]'::jsonb, 'exclusions', '[]'::jsonb, 'rentalTerms', '[]'::jsonb,
    'seoSettings', '{}'::jsonb,
    'rates', jsonb_build_array(jsonb_build_object(
      'label','Full day','amount','1800','currency','NPR','pricingUnit','day',
      'minimumQuantity','1','maximumQuantity','','sortOrder',0
    ))
  ));
  if rental_a is null or (select count(*) from public.rental_rates where rental_product_id = rental_a) <> 1 then
    raise exception 'Atomic rental and rate save failed';
  end if;
  insert into public.rental_product_taxonomy_terms(site_id, rental_product_id, term_id)
  values(site_a, rental_a, child_term);

  perform set_config('request.jwt.claims', jsonb_build_object('sub', owner_b, 'role', 'authenticated')::text, true);
  if exists(select 1 from public.rental_products where id = rental_a)
    or exists(select 1 from public.taxonomy_terms where id = child_term) then
    raise exception 'Another tenant can read private multi-service records';
  end if;
  rejected := false;
  begin
    insert into public.rental_product_taxonomy_terms(site_id, rental_product_id, term_id)
    values(site_a, rental_a, parent_term);
  exception when others then rejected := true;
  end;
  if not rejected then raise exception 'Cross-tenant assignment write was not rejected'; end if;
end
$test$;

reset role;
rollback;
