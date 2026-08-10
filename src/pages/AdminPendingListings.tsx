import { useEffect, useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, MapPin, Check, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getPendingListings, approveListing, rejectListing } from '@/services/admin'
import type { Listing } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { VerificationBadge } from '@/components/ui/VerificationBadge'

export function AdminPendingListings() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    if (!isAdmin) return
    getPendingListings().then(setListings).finally(() => setLoading(false))
  }, [isAdmin])

  if (authLoading) return <div className="px-4 pt-6"><p className="text-muted text-sm">Loading...</p></div>
  if (!user || !isAdmin) return <Navigate to="/profile" replace />

  async function handleApprove(id: string) {
    setBusyId(id)
    try {
      await approveListing(id)
      setListings((prev) => prev.filter((l) => l.id !== id))
    } finally {
      setBusyId(null)
    }
  }

  async function handleReject(id: string) {
    setBusyId(id)
    try {
      await rejectListing(id)
      setListings((prev) => prev.filter((l) => l.id !== id))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="px-4 pt-6 pb-8">
      <button onClick={() => navigate('/admin')} className="flex items-center gap-1 text-muted text-sm mb-4">
        <ChevronLeft className="w-4 h-4" /> Admin
      </button>
      <h1 className="font-extrabold text-2xl mb-1">Pending listings</h1>
      <p className="text-muted text-sm mb-6">{listings.length} awaiting review</p>

      {loading ? (
        <p className="text-muted text-sm">Loading...</p>
      ) : listings.length === 0 ? (
        <p className="text-muted text-sm">Nothing waiting for review right now.</p>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <Card key={listing.id} className="p-3">
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-elevated shrink-0">
                  <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{listing.title}</p>
                  <p className="text-ember text-sm font-bold tabular-nums">Le {listing.price.toLocaleString()}</p>
                  <p className="flex items-center gap-1 text-muted text-xs mt-0.5">
                    <MapPin className="w-3 h-3" /> {listing.location}
                  </p>
                </div>
              </div>

              <Link to={`/seller/${listing.seller.id}`} className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                <div className="w-7 h-7 rounded-full bg-elevated overflow-hidden shrink-0">
                  {listing.seller.avatarUrl && (
                    <img src={listing.seller.avatarUrl} alt={listing.seller.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <p className="text-xs font-medium">{listing.seller.name}</p>
                  {listing.seller.verified && <VerificationBadge />}
                </div>
              </Link>

              <div className="flex gap-2 mt-3">
                <Button variant="secondary" size="sm" className="flex-1 gap-1.5 text-alert" disabled={busyId === listing.id} onClick={() => handleReject(listing.id)}>
                  <X className="w-3.5 h-3.5" /> Reject
                </Button>
                <Button variant="primary" size="sm" className="flex-1 gap-1.5" disabled={busyId === listing.id} onClick={() => handleApprove(listing.id)}>
                  <Check className="w-3.5 h-3.5" /> Approve
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
                        }
