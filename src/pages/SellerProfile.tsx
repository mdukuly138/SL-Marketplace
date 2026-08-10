import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, MessageCircle } from 'lucide-react'
import { getProfile } from '@/services/profiles'
import { getListingsBySeller } from '@/services/listings'
import { getOrCreateConversation } from '@/services/conversations'
import { getReviewsForSeller, getRatingSummary, submitReview, type Review } from '@/services/reviews'
import { useAuth } from '@/hooks/useAuth'
import type { Seller, Listing } from '@/types'
import { ListingCard } from '@/components/listings/ListingCard'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { Button } from '@/components/ui/Button'
import { ShareButton } from '@/components/ui/ShareButton'
import { ReviewStars } from '@/components/reviews/ReviewStars'

export function SellerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [seller, setSeller] = useState<Seller | null>(null)
  const [sellerListings, setSellerListings] = useState<Listing[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [messaging, setMessaging] = useState(false)
  const [myRating, setMyRating] = useState(0)
  const [myComment, setMyComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function loadAll(sellerId: string) {
    const [profileData, listingsData, reviewsData] = await Promise.all([
      getProfile(sellerId),
      getListingsBySeller(sellerId),
      getReviewsForSeller(sellerId),
    ])
    setSeller(profileData)
    setSellerListings(listingsData)
    setReviews(reviewsData)
    if (user) {
      const mine = reviewsData.find((r) => r.reviewer.id === user.id)
      if (mine) {
        setMyRating(mine.rating)
        setMyComment(mine.comment ?? '')
      }
    }
  }

  useEffect(() => {
    if (!id) return
    let active = true
    setLoading(true)
    loadAll(id).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id, user])

  async function handleMessageSeller() {
    if (!user) { navigate('/login'); return }
    if (!seller) return
    setMessaging(true)
    try {
      const conversationId = await getOrCreateConversation({ currentUserId: user.id, sellerId: seller.id })
      navigate(`/messages/${conversationId}`)
    } finally {
      setMessaging(false)
    }
  }

  async function handleSubmitReview() {
    if (!user || !id || myRating === 0) return
    setSubmitting(true)
    try {
      await submitReview({ sellerId: id, reviewerId: user.id, rating: myRating, comment: myComment })
      await loadAll(id)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="px-4 pt-6"><p className="text-muted text-sm">Loading...</p></div>
  if (!seller) return <div className="px-4 pt-6"><p className="text-muted">Seller not found.</p></div>

  const summary = getRatingSummary(reviews)
  const isOwnProfile = user?.id === id

  return (
    <div className="pb-8">
      <div className="relative px-4 pt-6 flex flex-col items-center text-center">
        <ShareButton
          title={seller.name}
          text={`Check out ${seller.name} on SL Marketplace`}
          url={`${window.location.origin}/seller/${seller.id}`}
          className="absolute top-4 right-4"
        />
        <div className="w-20 h-20 rounded-full bg-elevated overflow-hidden">
          {seller.avatarUrl && <img src={seller.avatarUrl} alt={seller.name} className="w-full h-full object-cover" />}
        </div>
        <div className="flex items-center gap-1 mt-3">
          <h1 className="font-extrabold text-lg">{seller.name}</h1>
          {seller.verified && <VerificationBadge />}
        </div>

        {summary.count > 0 ? (
          <div className="flex items-center gap-1.5 mt-1">
            <ReviewStars value={summary.average} />
            <span className="text-xs text-muted">
              {summary.average.toFixed(1)} ({summary.count} review{summary.count === 1 ? '' : 's'})
            </span>
          </div>
        ) : (
          <p className="text-xs text-muted mt-1">No reviews yet</p>
        )}

        <p className="flex items-center gap-1 text-muted text-xs mt-1"><MapPin className="w-3.5 h-3.5" /> {seller.location}</p>
        {seller.about && <p className="text-sm text-ink/80 mt-3 max-w-xs">{seller.about}</p>}
        {!isOwnProfile && (
          <Button variant="primary" size="md" className="mt-4 gap-2" onClick={handleMessageSeller} disabled={messaging}>
            <MessageCircle className="w-4 h-4" />
            {messaging ? 'Opening...' : 'Message seller'}
          </Button>
        )}
      </div>

      {sellerListings.length > 0 && (
        <div className="mt-8 px-4">
          <h2 className="font-bold text-lg mb-3">Listings</h2>
          <div className="grid grid-cols-2 gap-3">
            {sellerListings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </div>
      )}

      <div className="mt-8 px-4">
        <h2 className="font-bold text-lg mb-3">Reviews</h2>

        {!isOwnProfile && (
          user ? (
            <div className="bg-surface border border-border rounded-2xl p-4 mb-4">
              <p className="text-sm font-semibold mb-2">
                {reviews.some((r) => r.reviewer.id === user.id) ? 'Update your review' : 'Leave a review'}
              </p>
              <ReviewStars value={myRating} onChange={setMyRating} size="md" />
              <textarea
                value={myComment}
                onChange={(e) => setMyComment(e.target.value)}
                placeholder="Share your experience with this seller..."
                rows={3}
                className="w-full mt-3 rounded-2xl bg-base border border-border px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ember/50 focus:border-ember/50 transition resize-none"
              />
              <Button variant="primary" size="sm" className="mt-3" disabled={myRating === 0 || submitting} onClick={handleSubmitReview}>
                {submitting ? 'Submitting...' : 'Submit review'}
              </Button>
            </div>
          ) : (
            <p className="text-muted text-sm mb-4">
              <button onClick={() => navigate('/login')} className="text-ember font-semibold">Sign in</button> to leave a review.
            </p>
          )
        )}

        {reviews.length === 0 ? (
          <p className="text-muted text-sm">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="bg-surface border border-border rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full bg-elevated overflow-hidden shrink-0">
                    {r.reviewer.avatarUrl && <img src={r.reviewer.avatarUrl} alt={r.reviewer.name} className="w-full h-full object-cover" />}
                  </div>
                  <p className="text-sm font-semibold">{r.reviewer.name}</p>
                  <ReviewStars value={r.rating} />
                </div>
                {r.comment && <p className="text-sm text-ink/80 mt-1">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
