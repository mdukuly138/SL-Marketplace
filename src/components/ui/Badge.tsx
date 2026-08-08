import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'default' | 'success' | 'alert' | 'ember'
}

export function Badge({ className, tone = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-semibold',
        tone === 'default' && 'bg-elevated text-muted',
        tone === 'success' && 'bg-success/15 text-success',
        tone === 'alert' && 'bg-alert/15 text-alert',
        tone === 'ember' && 'bg-ember/15 text-ember',
        className,
      )}
      {...props}
    />
  )
}
