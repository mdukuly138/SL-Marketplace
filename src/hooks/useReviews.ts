import { useEffect, useState } from 'react'
import { getReviewsForSeller, getRatingSummary, type Review } from '@/services/reviews'

export function useReviews(sellerId: string | undefined) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sellerId) { setLoading(false); return }
    let active = true
    setLoading(true)
    getReviewsForSeller(sellerId)
      .then((data) => { if (active) setReviews(data) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [sellerId])

  return { reviews, loading, summary: getRatingSummary(reviews) }
}
