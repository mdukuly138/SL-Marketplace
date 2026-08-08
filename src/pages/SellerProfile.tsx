import { useParams } from 'react-router-dom'
import { MapPin, MessageCircle } from 'lucide-react'
import { sellers } from '@/data/sellers'
import { listings } from '@/data/listings'
import { posts } from '@/data/posts'
import { ListingCard } from '@/components/listings/ListingCard'
import { PostCard } from '@/components/social/PostCard'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { Button } from '@/components/ui/Button'

export function SellerProfile() {
  const { id } = useParams()
  const seller = sellers.find((s) => s.id === id)
  const sellerListings = listings.filter((l) => l.seller.id === id)
  const sellerPosts = posts.filter((p) => p.author.id === id)

  if (!seller) {
    return (
      <div className="px-4 pt-6">
        <p className="text-muted">Seller not found.</p>
      </div>
    )
  }

  return (
    <div className="pb-8">
      <div className="px-4 pt-6 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-elevated overflow-hidden">
          {seller.avatarUrl && (
            <img src={seller.avatarUrl} alt={seller.name} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex items-center gap-1 mt-3">
          <h1 className="font-extrabold text-lg">{seller.name}</h1>
          {seller.verified && <VerificationBadge />}
        </div>
        <p className="flex items-center gap-1 text-muted text-xs mt-1">
          <MapPin className="w-3.5 h-3.5" /> {seller.location}
        </p>
        {seller.about && <p className="text-sm text-ink/80 mt-3 max-w-xs">{seller.about}</p>}
        <Button variant="primary" size="md" className="mt-4 gap-2">
          <MessageCircle className="w-4 h-4" />
          Message seller
        </Button>
      </div>

      {sellerListings.length > 0 && (
        <div className="mt-8 px-4">
          <h2 className="font-bold text-lg mb-3">Listings</h2>
          <div className="grid grid-cols-2 gap-3">
            {sellerListings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      )}

      {sellerPosts.length > 0 && (
        <div className="mt-8 px-4 space-y-4">
          <h2 className="font-bold text-lg">Posts</h2>
          {sellerPosts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  )
      }
