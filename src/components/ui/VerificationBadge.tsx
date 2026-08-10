import { BadgeCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export function VerificationBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn('inline-flex items-center justify-center text-verified', className)}
      title="Verified seller"
    >
      <BadgeCheck className="w-4 h-4 fill-verified/20" strokeWidth={2.5} />
    </span>
  )
}
