-- Custom-domain state must be provider-controlled and cannot be forged by a
-- tenant. Run after 20260914140138_secure_domain_mutations.sql.
begin;

insert into auth.users(id, raw_user_meta_data)
values ('4d0c7241-0fbb-4ae1-9ac0-841ed8407831', '{}'::jsonb);

insert into public.businesses(
  id, owner_id, name, slug, business_type, country, city, timezone, currency, email
) values (
  'fd57c29f-34f5-4eb5-9015-abce2b784aa1',
  '4d0c7241-0fbb-4ae1-9ac0-841ed8407831',
  'Domain Security Test', 'domain-security-test', 'tour_operator',
  'Nepal', 'Kathmandu', 'Asia/Kathmandu', 'NPR', 'domain@example.invalid'
);

insert into public.sites(id, business_id, owner_id, name, slug, theme_id)
values (
  'd7e79eeb-f1a0-4055-949a-30b834818431',
  'fd57c29f-34f5-4eb5-9015-abce2b784aa1',
  '4d0c7241-0fbb-4ae1-9ac0-841ed8407831',
  'Domain Security Test', 'domain-security-test', 'horizon'
);

insert into public.domains(
  id, site_id, hostname, domain_type, verification_status, provider_data
) values (
  'ad3d3b41-a7ad-47b9-85c0-5df6874cef2f',
  'd7e79eeb-f1a0-4055-949a-30b834818431',
  'pending.example.invalid', 'custom', 'pending',
  '{"projectVerified":false,"dnsConfigured":false}'::jsonb
);

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"4d0c7241-0fbb-4ae1-9ac0-841ed8407831","role":"authenticated"}',
  true
);

do $test$
declare
  rejected boolean := false;
begin
  if has_table_privilege('authenticated', 'public.domains', 'insert')
    or has_table_privilege('authenticated', 'public.domains', 'update')
    or has_table_privilege('authenticated', 'public.domains', 'delete') then
    raise exception 'Authenticated tenants can mutate provider-controlled domain rows';
  end if;

  begin
    perform public.set_primary_domain('ad3d3b41-a7ad-47b9-85c0-5df6874cef2f');
  exception when others then
    rejected := sqlerrm = 'Verified domain not found';
  end;
  if not rejected then
    raise exception 'An unverified hostname could be made primary';
  end if;
end
$test$;

reset role;
update public.domains
set verification_status = 'verified',
    provider_data = '{"projectVerified":true,"dnsConfigured":false}'::jsonb
where id = 'ad3d3b41-a7ad-47b9-85c0-5df6874cef2f';

set local role authenticated;
do $test$
declare
  rejected boolean := false;
begin
  begin
    perform public.set_primary_domain('ad3d3b41-a7ad-47b9-85c0-5df6874cef2f');
  exception when others then
    rejected := sqlerrm = 'Verified domain not found';
  end;
  if not rejected then
    raise exception 'A hostname with failing DNS configuration could be made primary';
  end if;
end
$test$;

reset role;
update public.domains
set provider_data = '{"projectVerified":true,"dnsConfigured":true}'::jsonb
where id = 'ad3d3b41-a7ad-47b9-85c0-5df6874cef2f';

set local role authenticated;
select public.set_primary_domain('ad3d3b41-a7ad-47b9-85c0-5df6874cef2f');

do $test$
begin
  if not exists (
    select 1 from public.domains
    where id = 'ad3d3b41-a7ad-47b9-85c0-5df6874cef2f'
      and is_primary
  ) then
    raise exception 'A verified, DNS-configured hostname was not made primary';
  end if;
end
$test$;

rollback;
