-- Profiles table: one row per user, auto-created on signup
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Seller',
  avatar_url text,
  location text,
  verified boolean not null default false,
  about text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill a profile for any account that signed up before this trigger existed
insert into public.profiles (id, display_name)
select id, split_part(email, '@', 1) from auth.users
where id not in (select id from public.profiles);

-- Listings table
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  price numeric not null,
  negotiable boolean not null default false,
  image_url text not null,
  location text not null,
  condition text not null check (condition in ('new', 'like-new', 'used')),
  category text not null,
  created_at timestamptz not null default now()
);

alter table public.listings enable row level security;

create policy "Listings are viewable by everyone"
  on public.listings for select
  using (true);

create policy "Users can create their own listings"
  on public.listings for insert
  with check (auth.uid() = seller_id);

create policy "Users can update their own listings"
  on public.listings for update
  using (auth.uid() = seller_id);

create policy "Users can delete their own listings"
  on public.listings for delete
  using (auth.uid() = seller_id);
