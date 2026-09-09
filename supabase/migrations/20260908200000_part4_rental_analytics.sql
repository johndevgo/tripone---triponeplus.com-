-- TripOne+ Part 4: first-class rental product analytics.

alter table public.analytics_events
  add column rental_product_id uuid references public.rental_products(id) on delete set null;

create index analytics_events_rental_product_idx
  on public.analytics_events(rental_product_id)
  where rental_product_id is not null;

alter table public.analytics_events
  drop constraint analytics_events_event_name_check,
  add constraint analytics_events_event_name_check check (event_name in (
    'page_view','experience_view','rental_view','booking_click','whatsapp_click',
    'phone_click','lead_submit','cta_click'
  ));

create or replace function public.submit_analytics_event(payload jsonb, fingerprint text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  target_site uuid;
  target_experience uuid;
  target_rental uuid;
  current_count integer;
  clean_hostname text := lower(trim(trailing '.' from coalesce(payload->>'hostname', '')));
  clean_path text := left(coalesce(payload->>'pagePath', '/'), 500);
  clean_slug text := lower(coalesce(payload->>'siteSlug', ''));
  clean_referrer text := nullif(left(lower(coalesce(payload->>'referrerDomain', '')), 253), '');
begin
  if fingerprint is null or length(fingerprint) not between 16 and 128 then raise exception 'Invalid event'; end if;
  if coalesce(payload->>'eventName', '') not in ('page_view','experience_view','rental_view','booking_click','whatsapp_click','phone_click','lead_submit','cta_click') then raise exception 'Invalid event'; end if;
  if clean_path not like '/%' or clean_path like '//%' then raise exception 'Invalid path'; end if;
  if length(coalesce(payload->>'sessionId', '')) not between 16 and 128 then raise exception 'Invalid session'; end if;
  if coalesce(payload->>'deviceCategory', '') not in ('mobile','tablet','desktop') then raise exception 'Invalid device'; end if;

  if payload->>'deliveryMode' = 'fallback' then
    if clean_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' or clean_path not like ('/s/' || clean_slug || '%') then raise exception 'Invalid fallback website'; end if;
    select s.id into target_site from public.sites s
    where s.slug = clean_slug and s.status = 'published' and s.published_snapshot is not null limit 1;
  else
    select s.id into target_site from public.domains d join public.sites s on s.id = d.site_id
    where d.hostname = clean_hostname and d.verification_status = 'verified'
      and s.status = 'published' and s.published_snapshot is not null limit 1;
  end if;
  if target_site is null then raise exception 'Website unavailable'; end if;

  insert into private.analytics_rate_limits(site_id, fingerprint, window_start, submissions)
  values(target_site, fingerprint, date_trunc('hour', now()), 1)
  on conflict on constraint analytics_rate_limits_pkey
  do update set submissions = private.analytics_rate_limits.submissions + 1
  where private.analytics_rate_limits.submissions < 240
  returning submissions into current_count;
  if current_count is null then raise exception 'Too many events'; end if;

  if nullif(payload->>'experienceId', '') is not null then
    select id into target_experience from public.experiences
    where id = (payload->>'experienceId')::uuid and site_id = target_site and status = 'published';
    if target_experience is null then raise exception 'Invalid experience'; end if;
  end if;
  if nullif(payload->>'rentalProductId', '') is not null then
    select id into target_rental from public.rental_products
    where id = (payload->>'rentalProductId')::uuid and site_id = target_site and status = 'published';
    if target_rental is null then raise exception 'Invalid rental product'; end if;
  end if;
  if payload->>'eventName' = 'experience_view' and target_experience is null then raise exception 'Experience required'; end if;
  if payload->>'eventName' = 'rental_view' and target_rental is null then raise exception 'Rental product required'; end if;

  insert into public.analytics_events(site_id,event_name,page_path,experience_id,rental_product_id,referrer_domain,session_id,device_category)
  values(target_site,payload->>'eventName',clean_path,target_experience,target_rental,clean_referrer,payload->>'sessionId',payload->>'deviceCategory');
end $$;
revoke all on function public.submit_analytics_event(jsonb, text) from public;
grant execute on function public.submit_analytics_event(jsonb, text) to anon, authenticated;
