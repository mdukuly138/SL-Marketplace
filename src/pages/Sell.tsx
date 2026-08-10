import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ImagePlus } from 'lucide-react'
import { categories } from '@/data/categories'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { createListing } from '@/services/listings'
import { uploadListingImages } from '@/services/storage'
import { cn } from '@/lib/utils'

const conditions = ['new', 'like-new', 'used'] as const
const MAX_PHOTOS = 6

interface PhotoItem {
  file: File
  previewUrl: string
}

export function Sell() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [negotiable, setNegotiable] = useState(false)
  const [category, setCategory] = useState<string>(categories[0])
  const [location, setLocation] = useState('')
  const [condition, setCondition] = useState<(typeof conditions)[number]>('used')
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

  function handlePhotoSelect(e: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    if (selected.length === 0) return
    setPhotos((prev) => {
      const combined = [...prev, ...selected.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }))]
      return combined.slice(0, MAX_PHOTOS)
    })
    e.target.value = ''
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!user) return

    if (!title || !price || !location || photos.length === 0) {
      setError('Please add at least one photo, and fill in title, price, and location.')
      return
    }

    setLoading(true)
    try {
      const imageUrls = await uploadListingImages(photos.map((p) => p.file), user.id)
      await createListing({
        title, description, price: Number(price), negotiable, images: imageUrls,
        location, condition, category, sellerId: user.id,
      })
      navigate('/my-listings')
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
        Add up to {MAX_PHOTOS} photos. New listings are reviewed by an admin before they appear in Market.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-semibold mb-2 block">Photos</label>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-elevated">
                <img src={photo.previewUrl} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removePhoto(i)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-base/80 flex items-center justify-center">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {photos.length < MAX_PHOTOS && (
              <label className="aspect-square rounded-2xl bg-surface border border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted cursor-pointer">
                <ImagePlus className="w-5 h-5" />
                <span className="text-[11px]">Add photo</span>
                <input type="file" accept="image/*" multiple onChange={handlePhotoSelect} className="hidden" />
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Tecno Camon 20 Pro — 256GB" />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe condition, features, reason for selling..." rows={4} className="w-full rounded-2xl bg-surface border border-border px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ember/50 focus:border-ember/50 transition resize-none" />
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
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-12 rounded-2xl bg-surface border border-border px-4 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ember/50 focus:border-ember/50 transition">
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
              <button key={c} type="button" onClick={() => setCondition(c)} className={cn('flex-1 h-11 rounded-2xl text-sm font-semibold border capitalize', condition === c ? 'bg-ember text-base border-ember' : 'bg-surface text-muted border-border')}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-alert text-sm">{error}</p>}

        <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={loading}>
          {loading ? 'Publishing...' : 'Submit for review'}
        </Button>
      </form>
    </div>
  )
}
