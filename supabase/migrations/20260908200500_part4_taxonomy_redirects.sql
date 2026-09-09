-- TripOne+ Part 4: atomically preserve taxonomy URLs when a term or one of its
-- ancestors changes. Every affected descendant receives a permanent redirect.

create or replace function public.taxonomy_term_public_path(target_term uuid)
returns text
language plpgsql
stable
security invoker
set search_path = ''
as $$
declare
  current_term record;
  taxonomy_kind public.taxonomy_type;
  base_path text;
  path_parts text[] := array[]::text[];
  visited uuid[] := array[]::uuid[];
begin
  select t.id, t.parent_id, t.slug, tx.taxonomy_type
  into current_term
  from public.taxonomy_terms t
  join public.taxonomies tx on tx.id = t.taxonomy_id and tx.site_id = t.site_id
  where t.id = target_term;
  if not found then return null; end if;

  taxonomy_kind := current_term.taxonomy_type;
  base_path := case taxonomy_kind
    when 'activity' then 'activities'
    when 'destination' then 'destinations'
    when 'travel_style' then 'travel-styles'
    when 'package_category' then 'package-categories'
    when 'product_category' then 'rental-categories'
  end;
  if base_path is null then return null; end if;

  loop
    if current_term.id = any(visited) then raise exception 'Taxonomy hierarchy contains a cycle'; end if;
    visited := array_append(visited, current_term.id);
    path_parts := array_prepend(current_term.slug, path_parts);
    exit when current_term.parent_id is null;
    select t.id, t.parent_id, t.slug, taxonomy_kind as taxonomy_type
    into current_term
    from public.taxonomy_terms t
    where t.id = current_term.parent_id;
    if not found then return null; end if;
  end loop;
  return '/' || base_path || '/' || array_to_string(path_parts, '/');
end $$;
revoke all on function public.taxonomy_term_public_path(uuid) from public;
grant execute on function public.taxonomy_term_public_path(uuid) to authenticated;

create or replace function public.save_taxonomy_term_with_redirects(payload jsonb)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  target_term uuid := (payload->>'termId')::uuid;
  target_site uuid := (payload->>'siteId')::uuid;
  target_taxonomy uuid := (payload->>'taxonomyId')::uuid;
  target_parent uuid := nullif(payload->>'parentId', '')::uuid;
  old_paths jsonb;
  item record;
  next_path text;
  site_is_published boolean;
begin
  if not (select public.owns_site(target_site)) then raise exception 'Website not found'; end if;
  if not exists (
    select 1 from public.taxonomy_terms t
    where t.id = target_term and t.site_id = target_site
      and t.taxonomy_id = target_taxonomy and t.source_location_id is null
  ) then raise exception 'Editable taxonomy term not found'; end if;
  if not exists (
    select 1 from public.taxonomies tx
    where tx.id = target_taxonomy and tx.site_id = target_site
  ) then raise exception 'Taxonomy not found'; end if;

  perform pg_advisory_xact_lock(hashtext('taxonomy-term:' || target_term::text));
  with recursive descendants as (
    select t.id from public.taxonomy_terms t where t.id = target_term and t.site_id = target_site
    union all
    select child.id from public.taxonomy_terms child
    join descendants parent on child.parent_id = parent.id
    where child.site_id = target_site
  )
  select coalesce(jsonb_object_agg(d.id::text, public.taxonomy_term_public_path(d.id)), '{}'::jsonb)
  into old_paths from descendants d;

  update public.taxonomy_terms
  set taxonomy_id = target_taxonomy,
      parent_id = target_parent,
      name = trim(payload->>'name'),
      slug = payload->>'slug',
      description = coalesce(payload->>'description', ''),
      hero_image_url = nullif(payload->>'heroImageUrl', ''),
      listing_mode = payload->>'listingMode',
      status = (payload->>'status')::public.content_status,
      seo_settings = coalesce(payload->'seoSettings', '{}'::jsonb)
  where id = target_term and site_id = target_site;

  select s.status = 'published' into site_is_published
  from public.sites s where s.id = target_site;
  if site_is_published then
    for item in select key, value from jsonb_each_text(old_paths)
    loop
      next_path := public.taxonomy_term_public_path(item.key::uuid);
      if next_path is not null and item.value is distinct from next_path then
        insert into public.redirects(site_id, source_path, destination_path, status_code)
        values(target_site, item.value, next_path, 301)
        on conflict(site_id, source_path)
        do update set destination_path = excluded.destination_path, status_code = 301;
      end if;
    end loop;
  end if;
end $$;
revoke all on function public.save_taxonomy_term_with_redirects(jsonb) from public;
grant execute on function public.save_taxonomy_term_with_redirects(jsonb) to authenticated;
