import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReviewStarsProps {
  value: number
  onChange?: (value: number) => void
  size?: 'sm' | 'md'
}

export function ReviewStars({ value, onChange, size = 'sm' }: ReviewStarsProps) {
  const dimension = size === 'sm' ? 'w-3.5 h-3.5' : 'w-6 h-6'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(star)}
          className={cn(!onChange && 'pointer-events-none')}
        >
          <Star className={cn(dimension, star <= Math.round(value) ? 'fill-ember text-ember' : 'text-border')} />
        </button>
      ))}
    </div>
  )
}
