-- Posts (Home feed) — verified sellers only
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  media_url text not null,
  media_type text not null check (media_type in ('image','video')),
  caption text,
  listing_id uuid references public.listings(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "Posts are viewable by everyone"
on public.posts for select
using (true);

create policy "Only verified sellers can create posts"
on public.posts for insert
with check (
  auth.uid() = seller_id
  and exists (select 1 from public.profiles where id = auth.uid() and verified = true)
);

create policy "Sellers can delete their own posts"
on public.posts for delete
using (auth.uid() = seller_id);

create policy "Admins can delete any post"
on public.posts for delete
using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- Likes
create table public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table public.post_likes enable row level security;

create policy "Likes are viewable by everyone"
on public.post_likes for select
using (true);

create policy "Users can like posts"
on public.post_likes for insert
with check (auth.uid() = user_id);

create policy "Users can unlike their own likes"
on public.post_likes for delete
using (auth.uid() = user_id);

-- Comments
create table public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.post_comments enable row level security;

create policy "Comments are viewable by everyone"
on public.post_comments for select
using (true);

create policy "Signed in users can comment"
on public.post_comments for insert
with check (auth.uid() = user_id);

create policy "Users can delete their own comments"
on public.post_comments for delete
using (auth.uid() = user_id);

create policy "Admins can delete any comment"
on public.post_comments for delete
using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- Storage policies for the "posts" bucket
create policy "Public read access for post media"
on storage.objects for select
using (bucket_id = 'posts');

create policy "Verified sellers can upload posts"
on storage.objects for insert
with check (
  bucket_id = 'posts'
  and auth.uid()::text = (storage.foldername(name))[1]
  and exists (select 1 from public.profiles where id = auth.uid() and verified = true)
);

create policy "Users can delete their own post media"
on storage.objects for delete
using (bucket_id = 'posts' and auth.uid()::text = (storage.foldername(name))[1]);
