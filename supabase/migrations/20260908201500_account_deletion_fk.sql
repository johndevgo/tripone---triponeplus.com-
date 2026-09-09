-- Account deletion must not be blocked by the audit author reference. The site
-- still owns each version and cascades it away with the site; SET NULL also
-- makes the relationship safe if an operator preserves a version separately.

alter table public.site_versions
  alter column created_by drop not null,
  drop constraint site_versions_created_by_fkey,
  add constraint site_versions_created_by_fkey
    foreign key (created_by) references auth.users(id) on delete set null;
