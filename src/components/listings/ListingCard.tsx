import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import type { Listing } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { Card } from '@/components/ui/Card'

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link to={`/listing/${listing.id}`}>
      <Card className="hover:border-ember/40 transition">
        <div className="aspect-square bg-elevated">
          <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="p-3 space-y-1">
          <div className="flex items-center gap-1">
            <p className="text-sm font-semibold truncate">{listing.title}</p>
            {listing.seller.verified && <VerificationBadge />}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-ember font-bold text-sm tabular-nums">
              Le {listing.price.toLocaleString()}
            </span>
            {listing.negotiable && <Badge tone="alert">Negotiable</Badge>}
          </div>
          <div className="flex items-center gap-1 text-muted text-xs">
            <MapPin className="w-3.5 h-3.5" />
            {listing.location}
          </div>
        </div>
      </Card>
    </Link>
  )
}
