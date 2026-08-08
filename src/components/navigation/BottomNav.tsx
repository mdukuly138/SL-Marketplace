import { NavLink } from 'react-router-dom'
import { Home, Store, PlusCircle, MessageCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/market', label: 'Market', icon: Store },
  { to: '/sell', label: 'Sell', icon: PlusCircle },
  { to: '/messages', label: 'Messages', icon: MessageCircle },
  { to: '/profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur border-t border-border">
      <ul className="flex items-center justify-between max-w-md mx-auto px-2 py-2">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-1.5 rounded-2xl text-[11px] font-medium transition',
                  isActive ? 'text-ember' : 'text-muted',
                )
              }
            >
              <Icon className="w-5 h-5" strokeWidth={2.2} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
