create function public.publish_site(target_site uuid) returns void language plpgsql security invoker set search_path = '' as $$
declare next_version integer;
begin
  if not public.owns_site(target_site) then raise exception 'Not authorized'; end if;
  update public.pages set status = 'published' where site_id = target_site;
  update public.experiences set status = 'published' where site_id = target_site;
  update public.sites set status = 'published', published_at = now() where id = target_site;
  select coalesce(max(version_number),0)+1 into next_version from public.site_versions where site_id = target_site;
  insert into public.site_versions(site_id,version_number,snapshot,created_by,label)
  select s.id,next_version,jsonb_build_object('theme',s.theme_settings,'globalSettings',s.global_settings,'navigation',s.navigation,'footer',s.footer_settings,'pages',(select coalesce(jsonb_agg(jsonb_build_object('title',p.title,'slug',p.slug,'pageType',p.page_type,'sections',p.sections,'seoSettings',p.seo_settings,'sortOrder',p.sort_order,'showInNavigation',p.show_in_navigation) order by p.sort_order),'[]') from public.pages p where p.site_id=s.id)),auth.uid(),'Published version' from public.sites s where s.id=target_site;
end $$;
revoke all on function public.publish_site(uuid) from public;
grant execute on function public.publish_site(uuid) to authenticated;
