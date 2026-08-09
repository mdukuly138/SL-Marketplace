-- Conversations between a buyer and a seller, optionally about a specific listing
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete set null,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  last_message text,
  last_message_at timestamptz,
  last_read_buyer_at timestamptz,
  last_read_seller_at timestamptz,
  created_at timestamptz not null default now(),
  check (buyer_id <> seller_id)
);

alter table public.conversations enable row level security;

create policy "Participants can view their conversations"
  on public.conversations for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Participants can create conversations"
  on public.conversations for insert
  with check (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Participants can update their conversations"
  on public.conversations for update
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

-- Messages inside a conversation
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "Participants can view messages in their conversations"
  on public.messages for select
  using (
    conversation_id in (
      select id from public.conversations
      where auth.uid() = buyer_id or auth.uid() = seller_id
    )
  );

create policy "Participants can send messages in their conversations"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and conversation_id in (
      select id from public.conversations
      where auth.uid() = buyer_id or auth.uid() = seller_id
    )
  );

alter publication supabase_realtime add table public.messages;
