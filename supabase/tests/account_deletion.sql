-- A user who has generated a site and version must still be deletable.
begin;
do $test$
declare
  owner_id constant uuid := 'b9a4d251-b984-4d9a-8c35-13e62b18f147';
  business_id uuid;
  target_site uuid;
begin
  insert into auth.users(id, raw_user_meta_data)
  values(owner_id, '{}'::jsonb);
  insert into public.businesses(
    owner_id,name,slug,business_type,country,city,timezone,currency,email
  ) values (
    owner_id,'Deletion Test','account-deletion-test','tour_operator',
    'Nepal','Kathmandu','Asia/Kathmandu','NPR','delete@example.invalid'
  ) returning id into business_id;
  insert into public.sites(business_id,owner_id,name,slug,theme_id)
  values(business_id,owner_id,'Deletion Test','account-deletion-test','horizon')
  returning id into target_site;
  insert into public.site_versions(site_id,version_number,snapshot,created_by,label)
  values(target_site,1,'{}'::jsonb,owner_id,'Deletion fixture');

  delete from auth.users where id = owner_id;
  if exists(select 1 from public.sites where id = target_site)
  then raise exception 'Site did not cascade on account deletion'; end if;
  if exists(select 1 from public.site_versions where site_id = target_site)
  then raise exception 'Version did not cascade on account deletion'; end if;
end
$test$;
rollback;
