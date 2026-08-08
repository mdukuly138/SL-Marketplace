import { Store, Receipt, Heart, Settings, ChevronRight, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

const menuItems = [
  { icon: Store, label: 'My listings', hint: "Manage what you're selling" },
  { icon: Receipt, label: 'My posts', hint: 'Your Home feed activity' },
  { icon: Heart, label: 'Favorites', hint: 'Saved listings' },
  { icon: Settings, label: 'Settings', hint: 'Account & preferences' },
]

export function Profile() {
  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="font-extrabold text-2xl mb-4">Profile</h1>

      <Card className="p-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-elevated flex items-center justify-center font-bold text-lg">
            GS
          </div>
          <div>
            <p className="font-semibold">Guest</p>
            <p className="text-muted text-xs">Not signed in</p>
          </div>
        </div>
        <Button variant="primary" size="sm" className="w-full mt-4">
          Sign in
        </Button>
      </Card>

      <Card className="p-4 mb-6 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-muted" />
        <div className="flex-1">
          <p className="text-sm font-semibold">Seller verification</p>
          <p className="text-muted text-xs">Not verified — sign in to apply</p>
        </div>
      </Card>

      <div className="space-y-2">
        {menuItems.map(({ icon: Icon, label, hint }) => (
          <button key={label} className="w-full flex items-center gap-3 p-3 rounded-2xl bg-surface border border-border">
            <div className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center">
              <Icon className="w-4 h-4 text-ember" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-muted text-xs">{hint}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted" />
          </button>
        ))}
      </div>
    </div>
  )
}
