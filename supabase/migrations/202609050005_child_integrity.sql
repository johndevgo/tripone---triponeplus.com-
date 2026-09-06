drop policy if exists "experiences owner all" on public.experiences;
create policy "experiences owner all"
on public.experiences
for all
to authenticated
using (public.owns_site(site_id))
with check (
  public.owns_site(site_id)
  and exists (
    select 1
    from public.sites
    where sites.id = experiences.site_id
      and sites.business_id = experiences.business_id
  )
);

drop policy if exists "locations owner all" on public.locations;
create policy "locations owner all"
on public.locations
for all
to authenticated
using (public.owns_site(site_id))
with check (
  public.owns_site(site_id)
  and exists (
    select 1
    from public.sites
    where sites.id = locations.site_id
      and sites.business_id = locations.business_id
  )
);

create unique index domains_one_primary_per_site
on public.domains(site_id)
where is_primary;
