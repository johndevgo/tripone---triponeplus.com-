-- Idempotently grant the requested founding owner platform access.
-- Passwords remain exclusively in Supabase Auth and are never stored in SQL.
-- Run after the Auth identity exists; future role changes use /super-admin.
insert into public.platform_members(user_id, role, created_by)
select id, 'super_admin', id
from auth.users
where lower(email) = 'neurerohan@gmail.com'
on conflict (user_id) do update
set role = 'super_admin';
