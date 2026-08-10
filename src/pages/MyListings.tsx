import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getMyListings, deleteListing } from '@/services/listings'
import type { Listing, ListingStatus } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'

const statusConfig: Record<ListingStatus, { label: string; tone: 'default' | 'success' | 'alert' }> = {
  pending: { label: 'Pending review', tone: 'default' },
  approved: { label: 'Live', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'alert' },
}

export function MyListings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [target, setTarget] = useState<Listing | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    let active = true
    getMyListings(user.id)
      .then((data) => { if (active) setListings(data) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [user])

  if (!user) {
    return (
      <div className="px-4 pt-10 text-center">
        <p className="text-muted text-sm mb-4">Sign in to manage your listings.</p>
        <Button variant="primary" onClick={() => navigate('/login')}>Sign in</Button>
      </div>
    )
  }

  async function confirmDelete() {
    if (!target) return
    setDeleting(true)
    try {
      await deleteListing(target.id)
      setListings((prev) => prev.filter((l) => l.id !== target.id))
      setTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="font-extrabold text-2xl mb-1">My listings</h1>
      <p className="text-muted text-sm mb-6">Manage what you're selling.</p>

      {loading ? (
        <p className="text-muted text-sm">Loading...</p>
      ) : listings.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-muted text-sm mb-4">You haven't posted anything yet.</p>
          <Link to="/sell"><Button variant="primary">Create a listing</Button></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <Card key={listing.id} className="flex gap-3 p-3">
              <Link to={`/listing/${listing.id}`} className="w-16 h-16 rounded-xl overflow-hidden bg-elevated shrink-0">
                <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Link to={`/listing/${listing.id}`} className="min-w-0">
                    <p className="text-sm font-semibold truncate">{listing.title}</p>
                  </Link>
                  <Badge tone={statusConfig[listing.status].tone}>{statusConfig[listing.status].label}</Badge>
                </div>
                <p className="text-ember text-sm font-bold tabular-nums">Le {listing.price.toLocaleString()}</p>
                <p className="flex items-center gap-1 text-muted text-xs mt-0.5">
                  <MapPin className="w-3 h-3" /> {listing.location}
                </p>
                <div className="flex gap-2 mt-2">
                  <Link to={`/listing/${listing.id}/edit`}>
                    <Button variant="secondary" size="sm" className="gap-1.5">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </Button>
                  </Link>
                  <Button variant="secondary" size="sm" className="gap-1.5 text-alert" onClick={() => setTarget(listing)}>
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!target} onClose={() => setTarget(null)} title="Delete listing?">
        <p className="text-sm text-muted mb-5">
          "{target?.title}" will be permanently removed. This can't be undone.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => setTarget(null)}>Cancel</Button>
          <Button variant="primary" className="flex-1 bg-alert hover:bg-alert" onClick={confirmDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
