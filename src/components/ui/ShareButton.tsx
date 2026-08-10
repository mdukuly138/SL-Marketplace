import { Share2, Check } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ShareButtonProps {
  title: string
  text?: string
  url: string
  label?: string
  className?: string
}

export function ShareButton({ title, text, url, label, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch {
        // user cancelled the share sheet — ignore
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  if (label) {
    return (
      <button
        onClick={handleShare}
        className={cn('w-full flex items-center gap-3 p-3 rounded-2xl bg-surface border border-border', className)}
      >
        <div className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center">
          {copied ? <Check className="w-4 h-4 text-success" /> : <Share2 className="w-4 h-4 text-ember" />}
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-muted text-xs">{copied ? 'Link copied!' : 'Invite others to SL Marketplace'}</p>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={handleShare}
      aria-label="Share"
      className={cn('w-9 h-9 rounded-full bg-base/70 backdrop-blur flex items-center justify-center transition', className)}
    >
      {copied ? <Check className="w-4 h-4 text-success" /> : <Share2 className="w-4 h-4" />}
    </button>
  )
}
