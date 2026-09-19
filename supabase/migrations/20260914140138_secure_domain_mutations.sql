-- Domain verification is provider-controlled state. Tenants may read their
-- rows through RLS, but must not be able to forge verification, provider data,
-- or primary routing by writing the exposed table directly.
revoke insert, update, delete on table public.domains from authenticated;
grant select on table public.domains to authenticated;

-- Keep primary-domain selection atomic while retaining an explicit ownership
-- check. SECURITY DEFINER is required because direct tenant UPDATE privileges
-- on public.domains are intentionally revoked above.
create or replace function public.set_primary_domain(target_domain uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_site uuid;
begin
  select d.site_id
  into target_site
  from public.domains d
  where d.id = target_domain
    and d.verification_status = 'verified'
    and d.provider_data ->> 'dnsConfigured' = 'true';

  if target_site is null
    or not (select public.owns_site(target_site)) then
    raise exception 'Verified domain not found';
  end if;

  perform pg_advisory_xact_lock(
    hashtext('primary-domain:' || target_site::text)
  );
  update public.domains
  set is_primary = false
  where site_id = target_site and is_primary;

  update public.domains
  set is_primary = true
  where id = target_domain and site_id = target_site;
end;
$$;

revoke all on function public.set_primary_domain(uuid) from public;
grant execute on function public.set_primary_domain(uuid) to authenticated;
