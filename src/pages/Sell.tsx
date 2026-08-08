import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { categories } from '@/data/categories'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { createListing } from '@/services/listings'
import { cn } from '@/lib/utils'

const conditions = ['new', 'like-new', 'used'] as const

export function Sell() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [negotiable, setNegotiable] = useState(false)
  const [category, setCategory] = useState(categories[0])
  const [location, setLocation] = useState('')
  const [condition, setCondition] = useState<(typeof conditions)[number]>('used')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!user) {
    return (
      <div className="px-4 pt-10 text-center">
        <p className="text-muted text-sm mb-4">You need to sign in to create a listing.</p>
        <Button variant="primary" onClick={() => navigate('/login')}>Sign in</Button>
      </div>
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!title || !price || !location || !imageUrl) {
      setError('Please fill in title, price, location, and an image URL.')
      return
    }

    setLoading(true)
    try {
      const listing = await createListing({
        title, description, price: Number(price), negotiable, imageUrl,
        location, condition, category, sellerId: user.id,
      })
      navigate(`/listing/${listing.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="font-extrabold text-2xl mb-1">Create a listing</h1>
      <p className="text-muted text-sm mb-6">
        Photo upload is coming in the next update — for now, paste a direct image link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-semibold mb-2 block">Image URL</label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Tecno Camon 20 Pro — 256GB" />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe condition, features, reason for selling..."
            rows={4}
            className="w-full rounded-2xl bg-surface border border-border px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ember/50 focus:border-ember/50 transition resize-none"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-sm font-semibold mb-2 block">Price (Le)</label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
          </div>
          <div className="flex flex-col items-start justify-end pb-2.5">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={negotiable} onChange={(e) => setNegotiable(e.target.checked)} className="w-4 h-4 rounded accent-ember" />
              Negotiable
            </label>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-12 rounded-2xl bg-surface border border-border px-4 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ember/50 focus:border-ember/50 transition"
          >
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Location</label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Sani Abacha Street, Freetown" />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Condition</label>
          <div className="flex gap-2">
            {conditions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCondition(c)}
                className={cn(
                  'flex-1 h-11 rounded-2xl text-sm font-semibold border capitalize',
                  condition === c ? 'bg-ember text-base border-ember' : 'bg-surface text-muted border-border',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-alert text-sm">{error}</p>}

        <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish listing'}
        </Button>
      </form>
    </div>
  )
}
