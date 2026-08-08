import { type ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 animate-fadeIn" onClick={onClose} />
      <div
        className={cn(
          'relative w-full sm:max-w-md bg-elevated rounded-t-card sm:rounded-card border border-border p-5 animate-fadeIn max-h-[85vh] overflow-y-auto',
          className,
        )}
      >
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="font-semibold text-lg">{title}</h2>}
          <button onClick={onClose} className="ml-auto p-1 rounded-full hover:bg-surface text-muted">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
