-- Add admin flag to profiles
alter table public.profiles add column is_admin boolean not null default false;

-- Make your account the admin
update public.profiles
set is_admin = true
where id = (select id from auth.users where email = 'dukuly1300@gmail.com');

-- Admins can moderate any listing
create policy "Admins can update any listing"
on public.listings for update
using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Admins can delete any listing"
on public.listings for delete
using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- Admins can verify/manage any user profile
create policy "Admins can update any profile"
on public.profiles for update
using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
