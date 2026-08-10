import { supabase } from '@/lib/supabase'

export interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  reviewer: { id: string; name: string; avatarUrl?: string }
}

export interface RatingSummary {
  average: number
  count: number
}

function mapReview(row: any): Review {
  return {
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
    reviewer: {
      id: row.reviewer?.id ?? '',
      name: row.reviewer?.display_name ?? 'User',
      avatarUrl: row.reviewer?.avatar_url ?? undefined,
    },
  }
}

export async function getReviewsForSeller(sellerId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id, rating, comment, created_at,
      reviewer:profiles!reviews_reviewer_id_fkey ( id, display_name, avatar_url )
    `)
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(mapReview)
}

export function getRatingSummary(reviews: Review[]): RatingSummary {
  if (reviews.length === 0) return { average: 0, count: 0 }
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return { average: sum / reviews.length, count: reviews.length }
}

export async function submitReview(params: {
  sellerId: string
  reviewerId: string
  rating: number
  comment: string
  listingId?: string
}) {
  const { sellerId, reviewerId, rating, comment, listingId } = params
  const { data, error } = await supabase
    .from('reviews')
    .upsert(
      { seller_id: sellerId, reviewer_id: reviewerId, rating, comment, listing_id: listingId ?? null },
      { onConflict: 'seller_id,reviewer_id' },
    )
    .select()
    .single()

  if (error) throw error
  return data
    }
