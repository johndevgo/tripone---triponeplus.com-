-- TripOne+ platform administration, founding access and transparent retention.
-- Privileged tables are intentionally service-role only. Application users
-- never authorize themselves through user-editable JWT metadata.

alter table public.profiles
  add column if not exists marketing_consent boolean not null default false;

create table public.platform_settings (
  id smallint primary key default 1 check (id = 1),
  founding_free_years smallint not null default 3
    check (founding_free_years between 1 and 10),
  inactivity_days smallint not null default 60
    check (inactivity_days between 30 and 3650),
  annual_price numeric(12,2) not null default 4999.00
    check (annual_price >= 0),
  currency text not null default 'NPR'
    check (currency ~ '^[A-Z]{3}$'),
  retention_enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

insert into public.platform_settings(id)
values (1)
on conflict (id) do nothing;

create table public.platform_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'super_admin'
    check (role in ('super_admin', 'support', 'analyst')),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index platform_members_role_idx
  on public.platform_members(role, created_at desc);

create table public.account_entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan_code text not null default 'founding'
    check (plan_code ~ '^[a-z0-9]+(?:_[a-z0-9]+)*$'),
  status text not null default 'active'
    check (status in ('active', 'grace', 'expired', 'suspended')),
  starts_at timestamptz not null default now(),
  free_until timestamptz not null,
  annual_price numeric(12,2) not null check (annual_price >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create index account_entitlements_status_expiry_idx
  on public.account_entitlements(status, free_until);

create table public.retained_contacts (
  email text primary key check (email = lower(email)),
  former_user_id uuid,
  marketing_consent boolean not null default false,
  consent_source text not null default 'account_signup',
  deletion_reason text not null
    check (deletion_reason in ('user_request', 'inactive_60_days', 'admin_action')),
  last_account_deleted_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index retained_contacts_contactable_idx
  on public.retained_contacts(last_account_deleted_at desc)
  where marketing_consent and unsubscribed_at is null;

create table public.platform_audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  target_user_id uuid,
  action text not null check (char_length(action) between 3 and 100),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index platform_audit_log_created_idx
  on public.platform_audit_log(created_at desc, id desc);
create index platform_audit_log_actor_idx
  on public.platform_audit_log(actor_id, created_at desc)
  where actor_id is not null;
create index platform_audit_log_target_idx
  on public.platform_audit_log(target_user_id, created_at desc)
  where target_user_id is not null;

create trigger platform_settings_updated
before update on public.platform_settings
for each row execute function public.set_updated_at();
create trigger account_entitlements_updated
before update on public.account_entitlements
for each row execute function public.set_updated_at();
create trigger retained_contacts_updated
before update on public.retained_contacts
for each row execute function public.set_updated_at();

insert into public.account_entitlements(
  user_id, plan_code, status, starts_at, free_until, annual_price, currency
)
select
  users.id,
  'founding',
  'active',
  users.created_at,
  users.created_at + make_interval(years => settings.founding_free_years),
  settings.annual_price,
  settings.currency
from auth.users users
cross join public.platform_settings settings
where settings.id = 1
on conflict (user_id) do nothing;

-- Bootstrap the requested owner only when that confirmed Auth identity already
-- exists. Future platform roles are changed through the protected admin UI.
insert into public.platform_members(user_id, role, created_by)
select id, 'super_admin', id
from auth.users
where lower(email) = 'neurerohan@gmail.com'
on conflict (user_id) do nothing;

create or replace function public.has_platform_role(required_roles text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.platform_members
    where user_id = (select auth.uid())
      and role = any(required_roles)
  )
$$;

revoke all on function public.has_platform_role(text[]) from public, anon;
grant execute on function public.has_platform_role(text[]) to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  settings public.platform_settings%rowtype;
begin
  select * into settings from public.platform_settings where id = 1;

  insert into public.profiles(id, full_name, marketing_consent)
  values(
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->'marketing_consent' = 'true'::jsonb, false)
  )
  on conflict (id) do nothing;

  insert into public.account_entitlements(
    user_id, plan_code, status, starts_at, free_until, annual_price, currency
  ) values (
    new.id,
    'founding',
    'active',
    new.created_at,
    new.created_at + make_interval(years => settings.founding_free_years),
    settings.annual_price,
    settings.currency
  )
  on conflict (user_id) do nothing;

  return new;
end
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

alter table public.platform_settings enable row level security;
alter table public.platform_members enable row level security;
alter table public.account_entitlements enable row level security;
alter table public.retained_contacts enable row level security;
alter table public.platform_audit_log enable row level security;

create policy "platform settings public read"
on public.platform_settings for select
to anon, authenticated
using (id = 1);

create policy "entitlements own read"
on public.account_entitlements for select
to authenticated
using ((select auth.uid()) = user_id);

revoke all on table public.platform_settings, public.platform_members,
  public.account_entitlements, public.retained_contacts,
  public.platform_audit_log from public, anon, authenticated;
grant select on table public.platform_settings to anon, authenticated;
grant select on table public.account_entitlements to authenticated;
grant select, insert, update, delete on table public.platform_settings,
  public.platform_members, public.account_entitlements,
  public.retained_contacts, public.platform_audit_log to service_role;
grant usage, select on sequence public.platform_audit_log_id_seq to service_role;

comment on table public.platform_members is
  'Server-only platform roles. Never derive these roles from user_metadata.';
comment on table public.retained_contacts is
  'Minimal post-deletion contact data retained only for people who explicitly opted in; unsubscribe is authoritative.';
comment on table public.account_entitlements is
  'Per-account founding access and future renewal state; no payment claim is inferred from this table.';
comment on function public.has_platform_role(text[]) is
  'Returns only a boolean for the signed-in user; platform membership rows remain service-only.';
