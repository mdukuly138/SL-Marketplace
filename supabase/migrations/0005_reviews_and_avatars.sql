-- Reviews: one review per buyer per seller
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (seller_id, reviewer_id),
  check (seller_id <> reviewer_id)
);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on public.reviews for select
  using (true);

create policy "Signed in users can create reviews"
  on public.reviews for insert
  with check (auth.uid() = reviewer_id);

create policy "Users can update their own reviews"
  on public.reviews for update
  using (auth.uid() = reviewer_id);

create policy "Users can delete their own reviews"
  on public.reviews for delete
  using (auth.uid() = reviewer_id);

-- Storage policies for the avatars bucket
create policy "Public read access for avatars"
on storage.objects for select
using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
on storage.objects for insert
with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can update their own avatar"
on storage.objects for update
using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own avatar"
on storage.objects for delete
using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
