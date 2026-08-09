import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MapPin, MessageCircle } from 'lucide-react'
import { getProfile } from '@/services/profiles'
import { getListingsBySeller } from '@/services/listings'
import type { Seller, Listing } from '@/types'
import { ListingCard } from '@/components/listings/ListingCard'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { Button } from '@/components/ui/Button'

export function SellerProfile() {
  const { id } = useParams()
  const [seller, setSeller] = useState<Seller | null>(null)
  const [sellerListings, setSellerListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let active = true
    setLoading(true)
    Promise.all([getProfile(id), getListingsBySeller(id)])
      .then(([profileData, listingsData]) => {
        if (!active) return
        setSeller(profileData)
        setSellerListings(listingsData)
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  if (loading) return <div className="px-4 pt-6"><p className="text-muted text-sm">Loading...</p></div>
  if (!seller) return <div className="px-4 pt-6"><p className="text-muted">Seller not found.</p></div>

  return (
    <div className="pb-8">
      <div className="px-4 pt-6 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-elevated overflow-hidden">
          {seller.avatarUrl && <img src={seller.avatarUrl} alt={seller.name} className="w-full h-full object-cover" />}
        </div>
        <div className="flex items-center gap-1 mt-3">
          <h1 className="font-extrabold text-lg">{seller.name}</h1>
          {seller.verified && <VerificationBadge />}
        </div>
        <p className="flex items-center gap-1 text-muted text-xs mt-1"><MapPin className="w-3.5 h-3.5" /> {seller.location}</p>
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
            {sellerListings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </div>
      )}
    </div>
  )
}
