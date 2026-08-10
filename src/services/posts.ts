import { supabase } from '@/lib/supabase'
import type { Post } from '@/types'

type PostRow = {
  id: string
  seller_id: string
  media_url: string
  media_type: 'image' | 'video'
  caption: string | null
  listing_id: string | null
  created_at: string
  profiles: { id: string; display_name: string; avatar_url: string | null; verified: boolean } | null
  post_likes: { count: number }[]
  post_comments: { count: number }[]
}

function mapPost(row: PostRow, likedPostIds: Set<string>): Post {
  return {
    id: row.id,
    seller: {
      id: row.profiles?.id ?? row.seller_id,
      name: row.profiles?.display_name ?? 'Seller',
      avatarUrl: row.profiles?.avatar_url ?? undefined,
      verified: row.profiles?.verified ?? false,
    },
    mediaUrl: row.media_url,
    mediaType: row.media_type,
    caption: row.caption,
    listingId: row.listing_id ?? undefined,
    likeCount: row.post_likes?.[0]?.count ?? 0,
    commentCount: row.post_comments?.[0]?.count ?? 0,
    likedByMe: likedPostIds.has(row.id),
    createdAt: row.created_at,
  }
}

const SELECT = `
  id, seller_id, media_url, media_type, caption, listing_id, created_at,
  profiles ( id, display_name, avatar_url, verified ),
  post_likes ( count ),
  post_comments ( count )
`

async function getLikedPostIds(postIds: string[], currentUserId?: string): Promise<Set<string>> {
  if (!currentUserId || postIds.length === 0) return new Set()
  const { data } = await supabase.from('post_likes').select('post_id').eq('user_id', currentUserId).in('post_id', postIds)
  return new Set((data ?? []).map((l: any) => l.post_id))
}

export async function getFeedPosts(currentUserId?: string): Promise<Post[]> {
  const { data, error } = await supabase.from('posts').select(SELECT).order('created_at', { ascending: false })
  if (error) throw error
  const rows = (data ?? []) as unknown as PostRow[]
  const liked = await getLikedPostIds(rows.map((r) => r.id), currentUserId)
  return rows.map((row) => mapPost(row, liked))
}

export async function getPostsBySeller(sellerId: string, currentUserId?: string): Promise<Post[]> {
  const { data, error } = await supabase.from('posts').select(SELECT).eq('seller_id', sellerId).order('created_at', { ascending: false })
  if (error) throw error
  const rows = (data ?? []) as unknown as PostRow[]
  const liked = await getLikedPostIds(rows.map((r) => r.id), currentUserId)
  return rows.map((row) => mapPost(row, liked))
}

export interface NewPostInput {
  sellerId: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  caption: string
  listingId?: string
}

export async function createPost(input: NewPostInput) {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      seller_id: input.sellerId,
      media_url: input.mediaUrl,
      media_type: input.mediaType,
      caption: input.caption,
      listing_id: input.listingId ?? null,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePost(id: string) {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
}

export async function toggleLike(postId: string, userId: string, currentlyLiked: boolean) {
  if (currentlyLiked) {
    const { error } = await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', userId)
    if (error) throw error
  } else {
    const { error } = await supabase.from('post_likes').insert({ post_id: postId, user_id: userId })
    if (error) throw error
  }
    }
