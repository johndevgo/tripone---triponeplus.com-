-- Template, saved-section and optimistic-revision assertions. Fixtures roll back.
begin;
insert into auth.users(id, raw_user_meta_data) values
  ('375704f5-6484-4e39-8e91-144fd4381501', '{}'::jsonb),
  ('82046867-681a-49f8-b7f7-44bdd6713502', '{}'::jsonb);
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"375704f5-6484-4e39-8e91-144fd4381501","role":"authenticated"}', true);

do $test$
declare
  owner_a constant uuid := '375704f5-6484-4e39-8e91-144fd4381501';
  owner_b constant uuid := '82046867-681a-49f8-b7f7-44bdd6713502';
  business_a uuid; site_a uuid; page_a uuid; saved_a uuid; next_revision bigint;
  rejected boolean := false;
begin
  insert into public.businesses(owner_id,name,slug,business_type,country,city,timezone,currency,email)
  values(owner_a,'Template Test','template-test','tour_operator','Nepal','Pokhara','Asia/Kathmandu','NPR','template@example.invalid') returning id into business_a;
  insert into public.sites(business_id,owner_id,name,slug,theme_id)
  values(business_a,owner_a,'Template Test','template-test','nomad') returning id into site_a;
  if (select count(*) from public.site_templates where site_id = site_a) <> 4 then
    raise exception 'New site did not receive all default templates';
  end if;
  insert into public.pages(site_id,title,slug,page_type,sections)
  values(site_a,'Home','','home','[]'::jsonb) returning id into page_a;
  select revision into next_revision from public.save_page_draft(
    site_a,page_a,1,'[{"id":"hero-1","type":"hero","variant":"minimal","visible":true,"settings":{"title":"Fresh page"}}]'::jsonb
  );
  if next_revision <> 2 then raise exception 'Page revision did not advance atomically'; end if;
  begin
    perform public.save_page_draft(site_a,page_a,1,'[]'::jsonb);
  exception when others then rejected := sqlerrm like 'This page changed in another tab%';
  end;
  if not rejected then raise exception 'Stale page revision was not rejected'; end if;

  insert into public.saved_sections(site_id,name,section_type,variant,settings,save_mode)
  values(site_a,'Reusable call to action','finalCta','banner','{"title":"Plan your trip"}'::jsonb,'copy') returning id into saved_a;
  perform set_config('request.jwt.claims', jsonb_build_object('sub',owner_b,'role','authenticated')::text, true);
  if exists(select 1 from public.saved_sections where id = saved_a)
    or exists(select 1 from public.site_templates where site_id = site_a) then
    raise exception 'Another tenant can read template or saved-section drafts';
  end if;
  update public.pages set sections = '[]'::jsonb where id = page_a;
  if found then raise exception 'Another tenant changed a page revision'; end if;
end
$test$;
reset role;
rollback;
