-- Platform entitlement, privilege and consent-retention assertions.
-- Fixtures are always rolled back.
begin;

insert into auth.users(id, email, raw_user_meta_data)
values (
  '71f8f144-a142-4ce7-a854-fbfe98f51001',
  'platform-test@example.invalid',
  '{"full_name":"Platform Test","marketing_consent":true}'::jsonb
);

do $test$
declare
  test_user constant uuid := '71f8f144-a142-4ce7-a854-fbfe98f51001';
begin
  if not exists (
    select 1 from public.profiles
    where id = test_user and marketing_consent
  ) then
    raise exception 'New-user trigger did not persist explicit consent';
  end if;

  if not exists (
    select 1 from public.account_entitlements
    where user_id = test_user
      and plan_code = 'founding'
      and free_until >= now() + interval '2 years 11 months'
  ) then
    raise exception 'Founding entitlement was not created';
  end if;

  if has_table_privilege('authenticated', 'public.platform_members', 'select')
    or has_table_privilege('authenticated', 'public.retained_contacts', 'select')
    or has_table_privilege('authenticated', 'public.platform_audit_log', 'select') then
    raise exception 'A privileged platform table is readable by authenticated';
  end if;

  if not has_table_privilege('authenticated', 'public.account_entitlements', 'select')
    or not has_table_privilege('anon', 'public.platform_settings', 'select') then
    raise exception 'Expected narrow public grants are missing';
  end if;

  insert into public.platform_members(user_id, role, created_by)
  values(test_user, 'super_admin', test_user);
end
$test$;

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"71f8f144-a142-4ce7-a854-fbfe98f51001","role":"authenticated"}',
  true
);

do $test$
begin
  if (select count(*) from public.account_entitlements) <> 1 then
    raise exception 'Entitlement RLS did not scope reads to the current user';
  end if;
  if (select count(*) from public.platform_settings) <> 1 then
    raise exception 'Platform pricing is not publicly readable';
  end if;
  if not public.has_platform_role(array['super_admin'])
    or public.has_platform_role(array['analyst']) then
    raise exception 'Boolean role accessor returned an invalid result';
  end if;
end
$test$;

rollback;
