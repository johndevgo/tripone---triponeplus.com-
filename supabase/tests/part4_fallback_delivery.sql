-- Published fallback forms and first-party analytics must resolve the intended
-- tenant without a verified hostname. All fixtures roll back.
begin;
insert into auth.users(id, raw_user_meta_data)
values ('395d32df-507b-4f8e-9c7a-c9fe92285c86', '{}'::jsonb);
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"395d32df-507b-4f8e-9c7a-c9fe92285c86","role":"authenticated"}',
  true
);

do $test$
declare
  owner_id constant uuid := '395d32df-507b-4f8e-9c7a-c9fe92285c86';
  business_id uuid;
  target_site uuid;
  target_rental uuid;
  lead_id uuid;
begin
  insert into public.businesses(
    owner_id,name,slug,business_type,country,city,timezone,currency,email
  ) values (
    owner_id,'Fallback Test','fallback-delivery-test','tour_operator',
    'Nepal','Pokhara','Asia/Kathmandu','NPR','fallback@example.invalid'
  ) returning id into business_id;
  insert into public.sites(business_id,owner_id,name,slug,theme_id)
  values(business_id,owner_id,'Fallback Test','fallback-delivery-test','horizon')
  returning id into target_site;
  update public.sites
  set status = 'published', published_snapshot = '{"schemaVersion":3}'::jsonb
  where id = target_site;
  insert into public.rental_products(
    site_id,business_id,name,slug,rental_type,currency,status
  ) values (
    target_site,business_id,'Fallback Boat','fallback-boat','boat','NPR','published'
  ) returning id into target_rental;

  set local role anon;
  if not exists (
    select 1 from public.list_published_site_slugs()
    where slug = 'fallback-delivery-test'
  ) then raise exception 'Published fallback sitemap was not discoverable'; end if;
  perform public.submit_analytics_event(
    jsonb_build_object(
      'deliveryMode','fallback','siteSlug','fallback-delivery-test',
      'hostname','tools.neurerohan.com.np','eventName','page_view',
      'pagePath','/s/fallback-delivery-test','sessionId','fallbacksession1234',
      'deviceCategory','desktop'
    ),
    'fallback-fingerprint-analytics'
  );
  perform public.submit_analytics_event(
    jsonb_build_object(
      'deliveryMode','fallback','siteSlug','fallback-delivery-test',
      'hostname','tools.neurerohan.com.np','eventName','rental_view',
      'rentalProductId',target_rental,
      'pagePath','/s/fallback-delivery-test/rentals/fallback-boat',
      'sessionId','fallbacksession1234','deviceCategory','desktop'
    ),
    'fallback-fingerprint-rental'
  );
  lead_id := public.submit_public_lead(
    jsonb_build_object(
      'deliveryMode','fallback','siteSlug','fallback-delivery-test',
      'hostname','tools.neurerohan.com.np','siteId',target_site,
      'name','Fallback Visitor','email','visitor@example.invalid',
      'sourcePage','/contact','website',''
    ),
    'fallback-fingerprint-lead'
  );
  reset role;
  if not exists (
    select 1 from public.analytics_events
    where analytics_events.site_id = target_site and event_name = 'page_view'
  ) then raise exception 'Fallback analytics event was not stored'; end if;
  if not exists (
    select 1 from public.analytics_events
    where analytics_events.site_id = target_site
      and event_name = 'rental_view'
      and rental_product_id = target_rental
  ) then raise exception 'Fallback rental view was not stored'; end if;
  if not exists (
    select 1 from public.leads
    where id = lead_id and leads.site_id = target_site
  ) then raise exception 'Fallback enquiry was not stored'; end if;
end
$test$;
rollback;
