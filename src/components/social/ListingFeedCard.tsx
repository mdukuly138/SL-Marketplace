import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import type { Listing } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { ShareButton } from '@/components/ui/ShareButton'

export function ListingFeedCard({ listing }: { listing: Listing }) {
  return (
    <Card>
      <div className="flex items-center gap-2 p-3">
        <Link to={`/seller/${listing.seller.id}`} className="w-9 h-9 rounded-full bg-elevated overflow-hidden shrink-0">
          {listing.seller.avatarUrl && (
            <img src={listing.seller.avatarUrl} alt={listing.seller.name} className="w-full h-full object-cover" />
          )}
        </Link>
        <Link to={`/seller/${listing.seller.id}`} className="flex items-center gap-1 min-w-0">
          <p className="text-sm font-semibold truncate">{listing.seller.name}</p>
          {listing.seller.verified && <VerificationBadge />}
        </Link>
      </div>

      <Link to={`/listing/${listing.id}`}>
        <div className="aspect-[4/5] bg-elevated">
          <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
      </Link>

      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <p className="text-sm text-ink/90 flex-1 min-w-0 truncate">{listing.title}</p>
          {listing.negotiable && <Badge tone="alert">Negotiable</Badge>}
        </div>
        <p className="text-ember font-bold text-sm tabular-nums">Le {listing.price.toLocaleString()}</p>

        <div className="flex items-center gap-4 text-muted text-sm pt-1">
          <Link to={`/listing/${listing.id}`} className="flex items-center gap-1.5 hover:text-ember transition">
            <MessageCircle className="w-4 h-4" /> View listing
          </Link>
          <ShareButton
            title={listing.title}
            text={`Check out "${listing.title}" on SL Marketplace — Le ${listing.price.toLocaleString()}`}
            url={`${window.location.origin}/listing/${listing.id}`}
            className="ml-auto bg-transparent w-auto h-auto"
          />
        </div>
      </div>
    </Card>
  )
}
