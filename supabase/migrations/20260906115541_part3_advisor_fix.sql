-- Supabase advisor: the initial child-integrity migration already creates this index.
drop index if exists public.domains_one_primary_per_site_idx;
