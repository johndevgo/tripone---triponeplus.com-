-- TripOne+ Part 4 milestone 3: optimistic revisions for record-specific
-- dynamic page layouts. A null override means the record inherits its current
-- site/subtype template; a JSON array is an explicit independent layout.

alter table public.experiences
  add column layout_revision bigint not null default 1
    check (layout_revision > 0);
alter table public.rental_products
  add column layout_revision bigint not null default 1
    check (layout_revision > 0);
alter table public.taxonomy_terms
  add column layout_revision bigint not null default 1
    check (layout_revision > 0);
alter table public.locations
  add column layout_revision bigint not null default 1
    check (layout_revision > 0);

create or replace function public.save_record_layout_draft(
  target_site uuid,
  target_kind text,
  target_record uuid,
  expected_revision bigint,
  new_sections jsonb,
  source_template_version integer default null
)
returns table(revision bigint, saved_at timestamptz)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not (select public.owns_site(target_site)) then
    raise exception 'Not authorized';
  end if;
  if new_sections is not null and (
    jsonb_typeof(new_sections) <> 'array'
    or jsonb_array_length(new_sections) > 60
  ) then
    raise exception 'Invalid record layout sections';
  end if;
  if source_template_version is not null and source_template_version < 1 then
    raise exception 'Invalid source template version';
  end if;

  case target_kind
    when 'experience' then
      update public.experiences
      set sections_override = new_sections,
          template_version = source_template_version,
          layout_revision = experiences.layout_revision + 1
      where id = target_record and site_id = target_site
        and experiences.layout_revision = expected_revision
      returning experiences.layout_revision, experiences.updated_at
      into revision, saved_at;
    when 'rental' then
      update public.rental_products
      set sections_override = new_sections,
          template_version = source_template_version,
          layout_revision = rental_products.layout_revision + 1
      where id = target_record and site_id = target_site
        and rental_products.layout_revision = expected_revision
      returning rental_products.layout_revision, rental_products.updated_at
      into revision, saved_at;
    when 'taxonomy' then
      update public.taxonomy_terms
      set sections_override = new_sections,
          template_version = source_template_version,
          layout_revision = taxonomy_terms.layout_revision + 1
      where id = target_record and site_id = target_site
        and taxonomy_terms.layout_revision = expected_revision
      returning taxonomy_terms.layout_revision, taxonomy_terms.updated_at
      into revision, saved_at;
    when 'location' then
      update public.locations
      set sections_override = new_sections,
          template_version = source_template_version,
          layout_revision = locations.layout_revision + 1
      where id = target_record and site_id = target_site
        and locations.layout_revision = expected_revision
      returning locations.layout_revision, locations.updated_at
      into revision, saved_at;
    else
      raise exception 'Unsupported record layout kind';
  end case;

  if not found then
    if target_kind = 'experience' and not exists (
      select 1 from public.experiences where id = target_record and site_id = target_site
    ) or target_kind = 'rental' and not exists (
      select 1 from public.rental_products where id = target_record and site_id = target_site
    ) or target_kind = 'taxonomy' and not exists (
      select 1 from public.taxonomy_terms where id = target_record and site_id = target_site
    ) or target_kind = 'location' and not exists (
      select 1 from public.locations where id = target_record and site_id = target_site
    ) then
      raise exception 'Record not found';
    end if;
    raise exception 'This record layout changed in another tab. Refresh before saving again.';
  end if;
  return next;
end
$$;

revoke all on function public.save_record_layout_draft(
  uuid, text, uuid, bigint, jsonb, integer
) from public;
grant execute on function public.save_record_layout_draft(
  uuid, text, uuid, bigint, jsonb, integer
) to authenticated;
