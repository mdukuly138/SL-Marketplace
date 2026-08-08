import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full h-12 rounded-2xl bg-surface border border-border px-4 text-sm text-ink placeholder:text-muted',
          'focus:outline-none focus:ring-2 focus:ring-ember/50 focus:border-ember/50 transition',
          className,
        )}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'
