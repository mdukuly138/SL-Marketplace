-- Add approval status to listings
alter table public.listings add column status text not null default 'pending' check (status in ('pending','approved','rejected'));

-- Existing listings are already live — keep them visible
update public.listings set status = 'approved';

-- Replace the old "everyone can see everything" policy
drop policy if exists "Listings are viewable by everyone" on public.listings;

create policy "Approved listings viewable by everyone, owner/admin see all"
on public.listings for select
using (
  status = 'approved'
  or seller_id = auth.uid()
  or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- Prevent sellers from setting their own approval status
create or replace function public.enforce_listing_status_permissions()
returns trigger as $$
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and is_admin = true) then
    new.status := old.status;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger enforce_listing_status_before_update
before update on public.listings
for each row execute procedure public.enforce_listing_status_permissions();
