-- Transactional integration assertions for create_generated_site(jsonb).
-- All users and content are fixtures and are rolled back at the end.

begin;

insert into auth.users (id, raw_user_meta_data)
values
  ('d7948642-12bc-4cf5-9fe0-7af980680701', '{}'::jsonb),
  ('a715328e-f72d-462b-b7bb-aef87cf43402', '{}'::jsonb);

set local role authenticated;
select set_config('request.jwt.claims', '{}', true);

do $test$
declare
  rejected boolean := false;
begin
  begin
    perform public.create_generated_site('{}'::jsonb);
  exception when others then
    rejected := sqlerrm = 'Authentication required';
  end;
  if not rejected then
    raise exception 'Expected unauthenticated generation to be rejected';
  end if;
end
$test$;

select set_config(
  'request.jwt.claims',
  '{"sub":"d7948642-12bc-4cf5-9fe0-7af980680701","role":"authenticated"}',
  true
);

do $test$
declare
  owner_a constant uuid := 'd7948642-12bc-4cf5-9fe0-7af980680701';
  owner_b constant uuid := 'a715328e-f72d-462b-b7bb-aef87cf43402';
  test_slug constant text := 'repair-rpc-integration-20260907';
  payload jsonb := jsonb_build_object(
    'name', 'Repair RPC Test Tours',
    'slug', test_slug,
    'businessType', 'tour_operator',
    'shortDescription', 'Disposable content for the generation repair integration test.',
    'country', 'Nepal',
    'city', 'Kathmandu',
    'region', '',
    'address', '',
    'timezone', 'Asia/Kathmandu',
    'currency', 'NPR',
    'phone', '',
    'whatsapp', '',
    'email', 'repair-test@example.invalid',
    'googleMapsUrl', '',
    'logoUrl', '',
    'themeId', 'atlas',
    'experiences', jsonb_build_array(jsonb_build_object(
      'name', 'Kathmandu Test Walk',
      'slug', 'kathmandu-test-walk',
      'experienceType', 'walking_tour',
      'shortDescription', 'Disposable experience used only inside a rolled-back database test.',
      'priceFrom', '1000',
      'currency', 'NPR',
      'durationValue', '2',
      'durationUnit', 'hours',
      'locationName', 'Kathmandu',
      'bookingUrl', '',
      'featuredImageUrl', '',
      'extraDetails', '{}'::jsonb
    )),
    'generated', jsonb_build_object(
      'theme', jsonb_build_object('id', 'atlas'),
      'globalSettings', jsonb_build_object('brandName', 'Repair RPC Test Tours'),
      'navigation', jsonb_build_array(
        jsonb_build_object('label', 'Home', 'href', '/'),
        jsonb_build_object('label', 'Experiences', 'href', '/experiences')
      ),
      'footer', jsonb_build_object('description', 'Disposable test footer.'),
      'pages', jsonb_build_array(
        jsonb_build_object(
          'title', 'Home', 'slug', '', 'pageType', 'home',
          'sections', '[]'::jsonb, 'seoSettings', '{}'::jsonb,
          'sortOrder', 0, 'showInNavigation', true
        ),
        jsonb_build_object(
          'title', 'Experiences', 'slug', 'experiences',
          'pageType', 'experiences', 'sections', '[]'::jsonb,
          'seoSettings', '{}'::jsonb, 'sortOrder', 1,
          'showInNavigation', true
        )
      )
    )
  );
  first_site uuid;
  retry_site uuid;
  rejected boolean;
begin
  if exists (select 1 from public.sites where slug = test_slug) then
    raise exception 'Integration fixture slug is already in use';
  end if;

  first_site := public.create_generated_site(payload);
  retry_site := public.create_generated_site(payload);

  if first_site is null or retry_site <> first_site then
    raise exception 'Idempotent retry did not return the original site';
  end if;
  if (select count(*) from public.businesses where owner_id = owner_a and slug = test_slug) <> 1
    or (select count(*) from public.sites where owner_id = owner_a and slug = test_slug) <> 1 then
    raise exception 'Retry created duplicate business or site records';
  end if;
  if (select count(*) from public.pages where site_id = first_site) <> 2
    or (select count(*) from public.experiences where site_id = first_site) <> 1
    or (select count(*) from public.site_versions where site_id = first_site and version_number = 1) <> 1 then
    raise exception 'Generated site graph is incomplete';
  end if;
  if not exists (
    select 1 from public.sites
    where id = first_site
      and navigation = payload->'generated'->'navigation'
      and status = 'draft'
  ) then
    raise exception 'Generated settings or draft state are incoherent';
  end if;

  rejected := false;
  begin
    perform public.create_generated_site(payload || jsonb_build_object('slug', ''));
  exception when check_violation or not_null_violation then
    rejected := true;
  end;
  if not rejected then raise exception 'Empty slug was not rejected'; end if;
  if exists (select 1 from public.businesses where owner_id = owner_a and slug = '') then
    raise exception 'Failed generation left a partial business';
  end if;

  rejected := false;
  begin
    perform public.create_generated_site(
      payload || jsonb_build_object('slug', 'Malformed Slug!')
    );
  exception when check_violation then
    rejected := true;
  end;
  if not rejected then raise exception 'Malformed slug was not rejected'; end if;
  if exists (
    select 1 from public.businesses
    where owner_id = owner_a and slug = 'Malformed Slug!'
  ) then
    raise exception 'Malformed generation left a partial business';
  end if;

  perform set_config(
    'request.jwt.claims',
    jsonb_build_object('sub', owner_b, 'role', 'authenticated')::text,
    true
  );
  if exists (select 1 from public.sites where id = first_site)
    or exists (select 1 from public.pages where site_id = first_site) then
    raise exception 'Another account can read the private draft';
  end if;
  update public.sites set name = 'Unauthorized change' where id = first_site;
  if found then raise exception 'Another account can modify the private draft'; end if;

  rejected := false;
  begin
    perform public.create_generated_site(payload);
  exception when unique_violation then
    rejected := true;
  end;
  if not rejected then raise exception 'Cross-owner slug conflict was not rejected'; end if;
  if exists (select 1 from public.businesses where owner_id = owner_b and slug = test_slug) then
    raise exception 'Cross-owner conflict left a partial business';
  end if;

  perform set_config(
    'request.jwt.claims',
    jsonb_build_object('sub', owner_a, 'role', 'authenticated')::text,
    true
  );
  if not exists (select 1 from public.sites where id = first_site) then
    raise exception 'Owner can no longer read the generated draft';
  end if;
end
$test$;

reset role;
rollback;
