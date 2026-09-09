-- Published fallback websites share the application origin. Expose only their
-- public slugs so the root robots.txt can advertise each tenant sitemap.

create or replace function public.list_published_site_slugs()
returns table(slug text)
language sql
stable
security definer
set search_path = ''
as $$
  select s.slug
  from public.sites s
  where s.status = 'published'
    and s.published_snapshot is not null
    and coalesce(
      s.published_snapshot #>> '{site,seoSettings,indexingEnabled}',
      'true'
    ) = 'true'
  order by s.slug
$$;
revoke all on function public.list_published_site_slugs() from public;
grant execute on function public.list_published_site_slugs() to anon, authenticated;
