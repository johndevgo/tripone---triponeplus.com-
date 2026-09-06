drop policy if exists "profiles own select" on public.profiles;
create policy "profiles own select" on public.profiles for select to authenticated
using (id = (select auth.uid()));
drop policy if exists "profiles own update" on public.profiles;
create policy "profiles own update" on public.profiles for update to authenticated
using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists "business owner all" on public.businesses;
create policy "business owner all" on public.businesses for all to authenticated
using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

drop policy if exists "site owner all" on public.sites;
create policy "site owner all" on public.sites for all to authenticated
using (owner_id = (select auth.uid()))
with check (
  owner_id = (select auth.uid()) and exists (
    select 1 from public.businesses b
    where b.id = business_id and b.owner_id = (select auth.uid())
  )
);

drop policy if exists "media owner all" on public.media;
create policy "media owner all" on public.media for all to authenticated
using (owner_id = (select auth.uid()) and (site_id is null or (select public.owns_site(site_id))))
with check (owner_id = (select auth.uid()) and (site_id is null or (select public.owns_site(site_id))));

drop policy if exists "site media owner insert" on storage.objects;
create policy "site media owner insert" on storage.objects for insert to authenticated with check (
  bucket_id = 'site-media' and (storage.foldername(name))[1] = (select auth.uid()::text)
  and ((storage.foldername(name))[2] = 'pending' or (select public.owns_site(((storage.foldername(name))[2])::uuid)))
);
drop policy if exists "site media owner update" on storage.objects;
create policy "site media owner update" on storage.objects for update to authenticated
using (bucket_id = 'site-media' and owner_id = (select auth.uid()::text))
with check (bucket_id = 'site-media' and owner_id = (select auth.uid()::text));
drop policy if exists "site media owner delete" on storage.objects;
create policy "site media owner delete" on storage.objects for delete to authenticated
using (bucket_id = 'site-media' and owner_id = (select auth.uid()::text));
drop policy if exists "avatar owner insert" on storage.objects;
create policy "avatar owner insert" on storage.objects for insert to authenticated
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid()::text));
drop policy if exists "avatar owner manage" on storage.objects;
create policy "avatar owner manage" on storage.objects for all to authenticated
using (bucket_id = 'avatars' and owner_id = (select auth.uid()::text))
with check (bucket_id = 'avatars' and owner_id = (select auth.uid()::text));
