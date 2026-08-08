import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-card bg-surface border border-border/60 overflow-hidden animate-fadeIn',
        className,
      )}
      {...props}
    />
  )
}
