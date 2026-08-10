import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { X, ImagePlus } from 'lucide-react'
import { categories } from '@/data/categories'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { getListingById, updateListing } from '@/services/listings'
import { uploadListingImages } from '@/services/storage'
import { cn } from '@/lib/utils'

const conditions = ['new', 'like-new', 'used'] as const
const MAX_PHOTOS = 6

type PhotoItem =
  | { kind: 'existing'; url: string }
  | { kind: 'new'; file: File; previewUrl: string }

export function EditListing() {
  const { id } = useParams()
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [notOwner, setNotOwner] = useState(false)

  useEffect(() => {
    if (!id || !user) return
    let active = true
    getListingById(id).then((listing) => {
      if (!active) return
      if (!listing) { setNotFound(true); setLoading(false); return }
      if (listing.seller.id !== user.id) { setNotOwner(true); setLoading(false); return }

      setTitle(listing.title)
      setPrice(String(listing.price))
      setNegotiable(listing.negotiable)
      setCategory(listing.category)
      setLocation(listing.location)
      setCondition(listing.condition)
      const gallery = listing.images && listing.images.length > 0 ? listing.images : [listing.imageUrl]
      setPhotos(gallery.map((url) => ({ kind: 'existing', url })))
      setLoading(false)
    })
    return () => { active = false }
  }, [id, user])

  if (!user) return <div className="px-4 pt-10 text-center"><p className="text-muted text-sm">Sign in to edit this listing.</p></div>
  if (loading) return <div className="px-4 pt-6"><p className="text-muted text-sm">Loading...</p></div>
  if (notFound) return <div className="px-4 pt-6"><p className="text-muted">Listing not found.</p></div>
  if (notOwner) return <div className="px-4 pt-6"><p className="text-muted">You can only edit your own listings.</p></div>

  function handlePhotoSelect(e: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    if (selected.length === 0) return
    setPhotos((prev) => {
      const combined: PhotoItem[] = [...prev, ...selected.map((file) => ({ kind: 'new' as const, file, previewUrl: URL.createObjectURL(file) }))]
      return combined.slice(0, MAX_PHOTOS)
    })
    e.target.value = ''
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      const item = prev[index]
      if (item.kind === 'new') URL.revokeObjectURL(item.previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!id || !user) return

    if (!title || !price || !location || photos.length === 0) {
      setError('Please keep at least one photo, and fill in title, price, and location.')
      return
    }

    setSaving(true)
    try {
      const newFiles = photos.filter((p): p is Extract<PhotoItem, { kind: 'new' }> => p.kind === 'new')
      const uploadedUrls = newFiles.length > 0 ? await uploadListingImages(newFiles.map((p) => p.file), user.id) : []

      let uploadIndex = 0
      const finalImages = photos.map((p) => (p.kind === 'existing' ? p.url : uploadedUrls[uploadIndex++]))

      await updateListing(id, {
        title, description, price: Number(price), negotiable, images: finalImages,
        location, condition, category,
      })
      navigate(`/listing/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="font-extrabold text-2xl mb-1">Edit listing</h1>
      <p className="text-muted text-sm mb-6">Update your listing details below.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-semibold mb-2 block">Photos</label>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-elevated">
                <img src={photo.kind === 'existing' ? photo.url : photo.previewUrl} alt="" className="w-full h-full object-cover" />
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

        <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </Button>
      </form>
    </div>
  )
         }
