insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
  ('site-media','site-media',true,10485760,array['image/jpeg','image/png','image/webp','image/avif']),
  ('avatars','avatars',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set file_size_limit=excluded.file_size_limit, allowed_mime_types=excluded.allowed_mime_types;

-- Paths are always {auth.uid()}/{siteId}/{random-name}; ownership is checked for both segments.
create policy "site media owner insert" on storage.objects for insert to authenticated with check (
  bucket_id = 'site-media' and (storage.foldername(name))[1] = auth.uid()::text
  and ((storage.foldername(name))[2] = 'pending' or public.owns_site(((storage.foldername(name))[2])::uuid))
);
create policy "site media owner update" on storage.objects for update to authenticated using (
  bucket_id = 'site-media' and owner_id = auth.uid()::text
) with check (bucket_id = 'site-media' and owner_id = auth.uid()::text);
create policy "site media owner delete" on storage.objects for delete to authenticated using (bucket_id = 'site-media' and owner_id = auth.uid()::text);
create policy "site media public read" on storage.objects for select to anon, authenticated using (bucket_id = 'site-media');
create policy "avatar owner insert" on storage.objects for insert to authenticated with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatar owner manage" on storage.objects for all to authenticated using (bucket_id = 'avatars' and owner_id = auth.uid()::text) with check (bucket_id = 'avatars' and owner_id = auth.uid()::text);
create policy "avatar public read" on storage.objects for select to anon, authenticated using (bucket_id = 'avatars');
