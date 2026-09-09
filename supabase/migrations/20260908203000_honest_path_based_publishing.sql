-- The production platform currently owns tools.neurerohan.com.np, not
-- triponeplus.com. Keep future platform hostnames reserved but never mark them
-- verified or primary until real DNS/provider verification exists.

update public.domains
set verification_status = 'pending',
    is_primary = false,
    verified_at = null,
    provider_data = '{}'::jsonb,
    last_error = 'Platform subdomains are not enabled on the current production domain.'
where domain_type = 'subdomain';

create or replace function public.ensure_site_subdomain()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' and old.slug <> new.slug then
    update public.domains
    set hostname = new.slug || '.triponeplus.com',
        verification_status = 'pending',
        is_primary = false,
        verified_at = null,
        provider_data = '{}'::jsonb,
        last_error = 'Platform subdomains are not enabled on the current production domain.'
    where site_id = new.id and domain_type = 'subdomain';
  else
    insert into public.domains(
      site_id, hostname, domain_type, verification_status, is_primary, last_error
    ) values (
      new.id, new.slug || '.triponeplus.com', 'subdomain', 'pending', false,
      'Platform subdomains are not enabled on the current production domain.'
    ) on conflict (hostname) do nothing;
  end if;
  return new;
end $$;
revoke all on function public.ensure_site_subdomain() from public;

create or replace function public.get_published_site_by_hostname(input_hostname text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'snapshot', s.published_snapshot,
    'requestedHostname', d.hostname,
    'primaryHostname', coalesce(
      (select primary_domain.hostname from public.domains primary_domain
       where primary_domain.site_id = s.id
         and primary_domain.is_primary
         and primary_domain.verification_status = 'verified'
       limit 1),
      d.hostname
    )
  )
  from public.domains d
  join public.sites s on s.id = d.site_id
  where d.hostname = lower(trim(trailing '.' from input_hostname))
    and d.verification_status = 'verified'
    and s.status = 'published'
    and s.published_snapshot is not null
  limit 1
$$;
revoke all on function public.get_published_site_by_hostname(text) from public;
grant execute on function public.get_published_site_by_hostname(text) to anon, authenticated;
