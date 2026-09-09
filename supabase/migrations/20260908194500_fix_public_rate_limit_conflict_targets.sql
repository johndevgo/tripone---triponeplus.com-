-- PostgreSQL treats the input parameter named fingerprint as ambiguous inside
-- ON CONFLICT inference. Name the existing primary-key constraints explicitly.

create or replace function public.submit_analytics_event(payload jsonb, fingerprint text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  target_site uuid; target_experience uuid; current_count integer;
  clean_hostname text := lower(trim(trailing '.' from coalesce(payload->>'hostname', '')));
  clean_path text := left(coalesce(payload->>'pagePath', '/'), 500);
  clean_slug text := lower(coalesce(payload->>'siteSlug', ''));
  clean_referrer text := nullif(left(lower(coalesce(payload->>'referrerDomain', '')), 253), '');
begin
  if fingerprint is null or length(fingerprint) not between 16 and 128 then raise exception 'Invalid event'; end if;
  if coalesce(payload->>'eventName', '') not in ('page_view','experience_view','booking_click','whatsapp_click','phone_click','lead_submit','cta_click') then raise exception 'Invalid event'; end if;
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
  insert into public.analytics_events(site_id,event_name,page_path,experience_id,referrer_domain,session_id,device_category)
  values(target_site,payload->>'eventName',clean_path,target_experience,clean_referrer,payload->>'sessionId',payload->>'deviceCategory');
end $$;
revoke all on function public.submit_analytics_event(jsonb, text) from public;
grant execute on function public.submit_analytics_event(jsonb, text) to anon, authenticated;

create or replace function public.submit_public_lead(payload jsonb, fingerprint text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  target_site uuid; requested_site uuid; target_experience uuid; created_lead uuid; current_count integer;
  clean_email text := lower(trim(payload->>'email'));
  clean_hostname text := lower(trim(trailing '.' from coalesce(payload->>'hostname', '')));
  clean_slug text := lower(coalesce(payload->>'siteSlug', ''));
begin
  if coalesce(payload->>'website', '') <> '' then raise exception 'Submission rejected'; end if;
  if fingerprint is null or length(fingerprint) not between 16 and 128 then raise exception 'Invalid submission'; end if;
  requested_site := (payload->>'siteId')::uuid;
  if payload->>'deliveryMode' = 'fallback' then
    if clean_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then raise exception 'Invalid fallback website'; end if;
    select s.id into target_site from public.sites s
    where s.id = requested_site and s.slug = clean_slug and s.status = 'published'
      and s.published_snapshot is not null limit 1;
  else
    select s.id into target_site from public.domains d join public.sites s on s.id = d.site_id
    where d.hostname = clean_hostname and d.verification_status = 'verified'
      and s.id = requested_site and s.status = 'published' and s.published_snapshot is not null limit 1;
  end if;
  if target_site is null then raise exception 'Website unavailable'; end if;
  if length(trim(payload->>'name')) not between 2 and 100 then raise exception 'Enter your name'; end if;
  if clean_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then raise exception 'Enter a valid email'; end if;
  if length(coalesce(payload->>'message', '')) > 3000 then raise exception 'Message is too long'; end if;

  insert into private.lead_rate_limits(site_id, fingerprint, window_start, submissions)
  values(target_site, fingerprint, date_trunc('hour', now()), 1)
  on conflict on constraint lead_rate_limits_pkey
  do update set submissions = private.lead_rate_limits.submissions + 1
  where private.lead_rate_limits.submissions < 5
  returning submissions into current_count;
  if current_count is null then raise exception 'Too many enquiries. Please try again later.'; end if;

  if nullif(payload->>'experienceId', '') is not null then
    select id into target_experience from public.experiences
    where id = (payload->>'experienceId')::uuid and site_id = target_site and status = 'published';
    if target_experience is null then raise exception 'Invalid experience'; end if;
  end if;
  insert into public.leads(site_id,experience_id,name,email,phone,desired_date,guests,message,source_page)
  values(target_site,target_experience,trim(payload->>'name'),clean_email,nullif(trim(payload->>'phone'),''),nullif(payload->>'desiredDate','')::date,nullif(payload->>'guests','')::integer,nullif(trim(payload->>'message'),''),left(coalesce(payload->>'sourcePage','/'),300))
  returning id into created_lead;
  return created_lead;
end $$;
revoke all on function public.submit_public_lead(jsonb, text) from public;
grant execute on function public.submit_public_lead(jsonb, text) to anon, authenticated;
