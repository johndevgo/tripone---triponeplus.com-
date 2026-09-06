create function public.site_slug_is_available(candidate text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select candidate ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    and length(candidate) <= 63
    and not exists(select 1 from public.sites where slug = candidate)
$$;

revoke all on function public.site_slug_is_available(text) from public;
grant execute on function public.site_slug_is_available(text) to authenticated;
