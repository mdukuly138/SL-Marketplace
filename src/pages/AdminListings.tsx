import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ChevronLeft, Trash2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getAllListingsForAdmin, adminDeleteListing } from '@/services/admin'
import type { Listing } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

export function AdminListings() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [target, setTarget] = useState<Listing | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!isAdmin) return
    getAllListingsForAdmin().then(setListings).finally(() => setLoading(false))
  }, [isAdmin])

  if (authLoading) return <div className="px-4 pt-6"><p className="text-muted text-sm">Loading...</p></div>
  if (!user || !isAdmin) return <Navigate to="/profile" replace />

  async function confirmDelete() {
    if (!target) return
    setDeleting(true)
    try {
      await adminDeleteListing(target.id)
      setListings((prev) => prev.filter((l) => l.id !== target.id))
      setTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="px-4 pt-6 pb-8">
      <button onClick={() => navigate('/admin')} className="flex items-center gap-1 text-muted text-sm mb-4">
        <ChevronLeft className="w-4 h-4" /> Admin
      </button>
      <h1 className="font-extrabold text-2xl mb-1">All listings</h1>
      <p className="text-muted text-sm mb-6">{listings.length} total</p>

      {loading ? (
        <p className="text-muted text-sm">Loading...</p>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <Card key={listing.id} className="flex gap-3 p-3">
              <Link to={`/listing/${listing.id}`} className="w-16 h-16 rounded-xl overflow-hidden bg-elevated shrink-0">
                <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{listing.title}</p>
                <p className="text-ember text-sm font-bold tabular-nums">Le {listing.price.toLocaleString()}</p>
                <p className="text-muted text-xs mt-0.5">by {listing.seller.name}</p>
                <Button variant="secondary" size="sm" className="gap-1.5 text-alert mt-2" onClick={() => setTarget(listing)}>
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!target} onClose={() => setTarget(null)} title="Remove listing?">
        <p className="text-sm text-muted mb-5">
          "{target?.title}" will be permanently removed for all users. This can't be undone.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => setTarget(null)}>Cancel</Button>
          <Button variant="primary" className="flex-1 bg-alert hover:bg-alert" onClick={confirmDelete} disabled={deleting}>
            {deleting ? 'Removing...' : 'Remove'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
