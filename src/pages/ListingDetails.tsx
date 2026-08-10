import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, MapPin, Clock, MessageCircle } from 'lucide-react'
import { getListingById } from '@/services/listings'
import { getProfile } from '@/services/profiles'
import { getOrCreateConversation } from '@/services/conversations'
import { useAuth } from '@/hooks/useAuth'
import type { Listing, Seller } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { ShareButton } from '@/components/ui/ShareButton'

export function ListingDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [listing, setListing] = useState<Listing | null>(null)
  const [seller, setSeller] = useState<Seller | null>(null)
  const [loading, setLoading] = useState(true)
  const [messaging, setMessaging] = useState(false)

  useEffect(() => {
    if (!id) return
    let active = true
    setLoading(true)
    getListingById(id)
      .then(async (data) => {
        if (!active) return
        setListing(data)
        if (data) {
          const sellerData = await getProfile(data.seller.id)
          if (active) setSeller(sellerData)
        }
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  async function handleMessageSeller() {
    if (!user) { navigate('/login'); return }
    if (!seller || !listing) return
    setMessaging(true)
    try {
      const conversationId = await getOrCreateConversation({ currentUserId: user.id, sellerId: seller.id, listingId: listing.id })
      navigate(`/messages/${conversationId}`)
    } finally {
      setMessaging(false)
    }
  }

  if (loading) return <div className="px-4 pt-6"><p className="text-muted text-sm">Loading...</p></div>
  if (!listing) return <div className="px-4 pt-6"><p className="text-muted">Listing not found.</p></div>

  const gallery = listing.images && listing.images.length > 0 ? listing.images : [listing.imageUrl]
  const isOwner = user?.id === listing.seller.id

  return (
    <div className="pb-6">
      <div className="relative">
        <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory">
          {gallery.map((url, i) => (
            <div key={i} className="w-full shrink-0 snap-center aspect-square bg-elevated">
              <img src={url} alt={listing.title} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-9 h-9 rounded-full bg-base/70 backdrop-blur flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <ShareButton
          title={listing.title}
          text={`Check out "${listing.title}" on SL Marketplace — Le ${listing.price.toLocaleString()}`}
          url={`${window.location.origin}/listing/${listing.id}`}
          className="absolute top-4 right-4"
        />
        {gallery.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-base/70 backdrop-blur rounded-pill px-2.5 py-1 text-xs font-semibold">1 / {gallery.length}</span>
        )}
      </div>

      <div className="px-4 pt-4">
        {isOwner && listing.status !== 'approved' && (
          <div className={`mb-3 rounded-2xl p-3 text-sm ${listing.status === 'pending' ? 'bg-surface border border-border text-muted' : 'bg-alert/10 border border-alert/30 text-alert'}`}>
            {listing.status === 'pending'
              ? "This listing is awaiting admin review — only you can see it right now."
              : 'This listing was rejected by an admin and is not visible to buyers.'}
          </div>
        )}

        <div className="flex gap-2 mb-3">
          <Badge tone="ember">{listing.condition}</Badge>
          {listing.negotiable && <Badge tone="alert">Negotiable</Badge>}
        </div>

        <h1 className="text-xl font-extrabold">{listing.title}</h1>
        <p className="text-ember text-2xl font-extrabold mt-2 tabular-nums">Le {listing.price.toLocaleString()}</p>

        <div className="flex items-center gap-4 text-muted text-xs mt-3">
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {listing.location}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Posted recently</span>
        </div>

        <div className="mt-5">
          <h2 className="text-sm font-semibold text-muted mb-1">Description</h2>
          <p className="text-sm text-ink/90 leading-relaxed">
            {listing.title} in {listing.condition} condition. Contact the seller for more details, availability, and delivery options.
          </p>
        </div>

        {seller && (
          <Link to={`/seller/${seller.id}`} className="flex items-center gap-3 mt-6 p-3 rounded-2xl bg-surface border border-border">
            <div className="w-11 h-11 rounded-full bg-elevated overflow-hidden shrink-0">
              {seller.avatarUrl && <img src={seller.avatarUrl} alt={seller.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-sm font-semibold truncate">{seller.name}</p>
                {seller.verified && <VerificationBadge />}
              </div>
              <p className="text-xs text-muted truncate">{seller.location}</p>
            </div>
          </Link>
        )}

        {!isOwner && (
          <Button variant="primary" size="lg" className="w-full mt-5 gap-2" onClick={handleMessageSeller} disabled={messaging}>
            <MessageCircle className="w-4 h-4" />
            {messaging ? 'Opening...' : 'Message seller'}
          </Button>
        )}
      </div>
    </div>
  )
}
