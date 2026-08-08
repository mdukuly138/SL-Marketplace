import { useState } from 'react'
import { ImagePlus, Video } from 'lucide-react'
import { categories } from '@/data/categories'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const conditions = ['new', 'like-new', 'used'] as const

export function Sell() {
  const [negotiable, setNegotiable] = useState(false)
  const [condition, setCondition] = useState<(typeof conditions)[number]>('used')

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="font-extrabold text-2xl mb-1">Create a listing</h1>
      <p className="text-muted text-sm mb-6">
        This form isn't connected yet — publishing will be enabled once Supabase is wired up.
      </p>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
        <div>
          <label className="text-sm font-semibold mb-2 block">Photos</label>
          <button
            type="button"
            className="w-full h-28 rounded-2xl bg-surface border border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted"
          >
            <ImagePlus className="w-5 h-5" />
            <span className="text-xs">Add photos</span>
          </button>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Short video (optional)</label>
          <button
            type="button"
            className="w-full h-20 rounded-2xl bg-surface border border-dashed border-border flex items-center justify-center gap-2 text-muted"
          >
            <Video className="w-5 h-5" />
            <span className="text-xs">Add a short video</span>
          </button>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Title</label>
          <Input placeholder="e.g. Tecno Camon 20 Pro — 256GB" />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Description</label>
          <textarea
            placeholder="Describe condition, features, reason for selling..."
            rows={4}
            className="w-full rounded-2xl bg-surface border border-border px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ember/50 focus:border-ember/50 transition resize-none"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-sm font-semibold mb-2 block">Price (Le)</label>
            <Input type="number" placeholder="0.00" />
          </div>
          <div className="flex flex-col items-start justify-end pb-2.5">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={negotiable}
                onChange={(e) => setNegotiable(e.target.checked)}
                className="w-4 h-4 rounded accent-ember"
              />
              Negotiable
            </label>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Category</label>
          <select className="w-full h-12 rounded-2xl bg-surface border border-border px-4 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ember/50 focus:border-ember/50 transition">
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Subcategory (optional)</label>
          <Input placeholder="e.g. Smartphones" />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Location</label>
          <Input placeholder="e.g. Sani Abacha Street, Freetown" />
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

        <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
          Publish listing
        </Button>
      </form>
    </div>
  )
}
