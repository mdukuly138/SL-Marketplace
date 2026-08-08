import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-pill font-semibold transition active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none',
          variant === 'primary' && 'bg-ember text-base hover:bg-ember-light',
          variant === 'secondary' && 'bg-surface text-ink border border-border hover:border-ember/50',
          variant === 'ghost' && 'text-ink hover:bg-surface',
          size === 'sm' && 'h-9 px-4 text-sm',
          size === 'md' && 'h-11 px-5 text-sm',
          size === 'lg' && 'h-14 px-6 text-base',
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
