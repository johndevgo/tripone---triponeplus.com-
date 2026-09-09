-- Parent taxonomy moves must preserve both the parent URL and descendant URLs.
begin;
insert into auth.users(id, raw_user_meta_data)
values ('b5566481-b49f-4cdc-b9ae-b4d7380add0d', '{}'::jsonb);
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"b5566481-b49f-4cdc-b9ae-b4d7380add0d","role":"authenticated"}',
  true
);

do $test$
declare
  owner_id constant uuid := 'b5566481-b49f-4cdc-b9ae-b4d7380add0d';
  business_id uuid;
  target_site uuid;
  target_taxonomy uuid;
  parent_term uuid;
  child_term uuid;
begin
  insert into public.businesses(
    owner_id,name,slug,business_type,country,city,timezone,currency,email
  ) values (
    owner_id,'Redirect Test','taxonomy-redirect-test','tour_operator',
    'Nepal','Pokhara','Asia/Kathmandu','NPR','redirect@example.invalid'
  ) returning id into business_id;
  insert into public.sites(business_id,owner_id,name,slug,theme_id,status,published_snapshot)
  values(
    business_id,owner_id,'Redirect Test','taxonomy-redirect-test','horizon',
    'published','{"schemaVersion":3}'::jsonb
  ) returning id into target_site;
  select id into target_taxonomy from public.taxonomies
  where site_id = target_site and taxonomy_type = 'destination';
  insert into public.taxonomy_terms(taxonomy_id,site_id,name,slug,status)
  values(target_taxonomy,target_site,'Nepal','nepal','published') returning id into parent_term;
  insert into public.taxonomy_terms(taxonomy_id,site_id,parent_id,name,slug,status)
  values(target_taxonomy,target_site,parent_term,'Pokhara','pokhara','published') returning id into child_term;

  perform public.save_taxonomy_term_with_redirects(jsonb_build_object(
    'termId',parent_term,'siteId',target_site,'taxonomyId',target_taxonomy,
    'parentId','','name','Greater Nepal','slug','greater-nepal',
    'description','','heroImageUrl','','listingMode','automatic',
    'status','published','seoSettings','{}'::jsonb
  ));

  if not exists (
    select 1 from public.redirects where site_id = target_site
      and source_path = '/destinations/nepal'
      and destination_path = '/destinations/greater-nepal'
  ) then raise exception 'Parent redirect was not created'; end if;
  if not exists (
    select 1 from public.redirects where site_id = target_site
      and source_path = '/destinations/nepal/pokhara'
      and destination_path = '/destinations/greater-nepal/pokhara'
  ) then raise exception 'Descendant redirect was not created'; end if;
  if public.taxonomy_term_public_path(child_term) <> '/destinations/greater-nepal/pokhara'
  then raise exception 'Unexpected descendant path'; end if;
end
$test$;
rollback;
