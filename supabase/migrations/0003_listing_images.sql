-- Add an images array column to listings (keeps image_url for backward compatibility)
alter table public.listings add column images text[] not null default '{}';

-- Storage policies for the "listings" bucket
create policy "Public read access for listing images"
on storage.objects for select
using (bucket_id = 'listings');

create policy "Users can upload to their own folder"
on storage.objects for insert
with check (bucket_id = 'listings' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own listing images"
on storage.objects for delete
using (bucket_id = 'listings' and auth.uid()::text = (storage.foldername(name))[1]);
