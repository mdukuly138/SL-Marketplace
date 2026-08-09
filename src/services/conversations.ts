import { supabase } from '@/lib/supabase'

export interface ConversationSummary {
  id: string
  otherUser: { id: string; name: string; avatarUrl?: string; verified: boolean }
  listingTitle?: string
  lastMessage: string | null
  lastMessageAt: string | null
  unread: boolean
}

export async function getOrCreateConversation(params: {
  currentUserId: string
  sellerId: string
  listingId?: string
}) {
  const { currentUserId, sellerId, listingId } = params
  if (currentUserId === sellerId) throw new Error("You can't message yourself.")

  let query = supabase.from('conversations').select('id').eq('buyer_id', currentUserId).eq('seller_id', sellerId)
  query = listingId ? query.eq('listing_id', listingId) : query.is('listing_id', null)

  const { data: existing, error: findError } = await query.maybeSingle()
  if (findError) throw findError
  if (existing) return existing.id

  const { data: created, error: insertError } = await supabase
    .from('conversations')
    .insert({ buyer_id: currentUserId, seller_id: sellerId, listing_id: listingId ?? null })
    .select('id')
    .single()

  if (insertError) throw insertError
  return created.id
}

export async function getConversationsForUser(userId: string): Promise<ConversationSummary[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      id, listing_id, buyer_id, seller_id, last_message, last_message_at,
      last_read_buyer_at, last_read_seller_at,
      buyer:profiles!conversations_buyer_id_fkey ( id, display_name, avatar_url, verified ),
      seller:profiles!conversations_seller_id_fkey ( id, display_name, avatar_url, verified ),
      listings ( title )
    `)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('last_message_at', { ascending: false, nullsFirst: false })

  if (error) throw error

  return (data ?? []).map((row: any) => {
    const isBuyer = row.buyer_id === userId
    const other = isBuyer ? row.seller : row.buyer
    const lastReadAt = isBuyer ? row.last_read_buyer_at : row.last_read_seller_at
    const unread = row.last_message_at ? !lastReadAt || new Date(row.last_message_at) > new Date(lastReadAt) : false
    return {
      id: row.id,
      otherUser: {
        id: other?.id ?? '',
        name: other?.display_name ?? 'User',
        avatarUrl: other?.avatar_url ?? undefined,
        verified: other?.verified ?? false,
      },
      listingTitle: row.listings?.title,
      lastMessage: row.last_message,
      lastMessageAt: row.last_message_at,
      unread,
    }
  })
  }
