import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image as ImageIcon, Video, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { createPost } from '@/services/posts'
import { uploadPostMedia } from '@/services/storage'
import { Button } from '@/components/ui/Button'

const MAX_VIDEO_SECONDS = 60

export function CreatePost() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!user) {
    return <div className="px-4 pt-10 text-center"><p className="text-muted text-sm">Sign in to create a post.</p></div>
  }

  function resetMedia() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setMediaType(null)
    setPreviewUrl(null)
  }

  function handleImageSelect(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    e.target.value = ''
    if (!selected) return
    setError(null)
    resetMedia()
    setFile(selected)
    setMediaType('image')
    setPreviewUrl(URL.createObjectURL(selected))
  }

  function handleVideoSelect(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    e.target.value = ''
    if (!selected) return
    setError(null)

    const url = URL.createObjectURL(selected)
    const tempVideo = document.createElement('video')
    tempVideo.preload = 'metadata'
    tempVideo.onloadedmetadata = () => {
      if (tempVideo.duration > MAX_VIDEO_SECONDS) {
        setError(`Video must be ${MAX_VIDEO_SECONDS} seconds or less — yours is ${Math.round(tempVideo.duration)}s.`)
        URL.revokeObjectURL(url)
        return
      }
      resetMedia()
      setFile(selected)
      setMediaType('video')
      setPreviewUrl(url)
    }
    tempVideo.src = url
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!user) return
    if (!file || !mediaType) {
      setError('Add a photo or short video to post.')
      return
    }

    setLoading(true)
    try {
      const mediaUrl = await uploadPostMedia(file, user.id, mediaType)
      await createPost({ sellerId: user.id, mediaUrl, mediaType, caption })
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="font-extrabold text-2xl mb-1">New post</h1>
      <p className="text-muted text-sm mb-6">Share a photo or a short video (up to {MAX_VIDEO_SECONDS}s) with everyone on Home.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {previewUrl ? (
          <div className="relative rounded-2xl overflow-hidden bg-elevated aspect-[4/5]">
            {mediaType === 'image' ? (
              <img src={previewUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <video src={previewUrl} controls className="w-full h-full object-cover" />
            )}
            <button type="button" onClick={resetMedia} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-base/80 flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <label className="aspect-square rounded-2xl bg-surface border border-dashed border-border flex flex-col items-center justify-center gap-1.5 text-muted cursor-pointer">
              <ImageIcon className="w-6 h-6" />
              <span className="text-xs font-medium">Photo</span>
              <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            </label>
            <label className="aspect-square rounded-2xl bg-surface border border-dashed border-border flex flex-col items-center justify-center gap-1.5 text-muted cursor-pointer">
              <Video className="w-6 h-6" />
              <span className="text-xs font-medium">Video (max {MAX_VIDEO_SECONDS}s)</span>
              <input type="file" accept="video/*" onChange={handleVideoSelect} className="hidden" />
            </label>
          </div>
        )}

        <div>
          <label className="text-sm font-semibold mb-2 block">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Say something about this post..."
            rows={3}
            className="w-full rounded-2xl bg-surface border border-border px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ember/50 focus:border-ember/50 transition resize-none"
          />
        </div>

        {error && <p className="text-alert text-sm">{error}</p>}

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </Button>
      </form>
    </div>
  )
}
