import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { Store, Receipt, Heart, Settings, ChevronRight, ShieldCheck, LogOut, Camera } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ShareButton } from '@/components/ui/ShareButton'
import { useAuth } from '@/hooks/useAuth'
import { getProfile, updateProfile } from '@/services/profiles'
import { uploadAvatar } from '@/services/storage'

const menuItems = [
  { icon: Store, label: 'My listings', hint: "Manage what you're selling", to: '/my-listings' },
  { icon: Receipt, label: 'My posts', hint: 'Your Home feed activity', to: null },
  { icon: Heart, label: 'Favorites', hint: 'Saved listings', to: null },
  { icon: Settings, label: 'Settings', hint: 'Account & preferences', to: null },
]

export function Profile() {
  const { user, loading, signOut } = useAuth()
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>()
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user) return
    let active = true
    getProfile(user.id).then((profile) => {
      if (active && profile) setAvatarUrl(profile.avatarUrl)
    })
    return () => { active = false }
  }, [user])

  async function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !user) return
    setUploading(true)
    try {
      const url = await uploadAvatar(file, user.id)
      await updateProfile(user.id, { avatarUrl: url })
      setAvatarUrl(url)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="font-extrabold text-2xl mb-4">Profile</h1>

      <Card className="p-5 mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => user && fileInputRef.current?.click()}
            disabled={!user || uploading}
            className="relative w-14 h-14 rounded-full bg-elevated flex items-center justify-center font-bold text-lg overflow-hidden shrink-0"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Your profile" className="w-full h-full object-cover" />
            ) : user ? (
              user.email!.slice(0, 2).toUpperCase()
            ) : (
              'GS'
            )}
            {user && (
              <span className="absolute bottom-0 inset-x-0 bg-black/50 py-0.5 flex items-center justify-center">
                <Camera className="w-3 h-3 text-white" />
              </span>
            )}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          <div>
            <p className="font-semibold">{user ? user.email : 'Guest'}</p>
            <p className="text-muted text-xs">
              {uploading ? 'Uploading photo...' : loading ? 'Loading...' : user ? 'Signed in' : 'Not signed in'}
            </p>
          </div>
        </div>

        {user ? (
          <Button variant="secondary" size="sm" className="w-full mt-4 gap-2" onClick={signOut}>
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        ) : (
          <Link to="/login">
            <Button variant="primary" size="sm" className="w-full mt-4">
              Sign in
            </Button>
          </Link>
        )}
      </Card>

      <Card className="p-4 mb-6 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-muted" />
        <div className="flex-1">
          <p className="text-sm font-semibold">Seller verification</p>
          <p className="text-muted text-xs">
            {user ? 'Not verified yet' : 'Not verified — sign in to apply'}
          </p>
        </div>
      </Card>

      <div className="mb-2">
        <ShareButton
          label="Share SL Marketplace"
          title="SL Marketplace"
          text="Buy and sell across Sierra Leone — check out SL Marketplace"
          url={window.location.origin}
        />
      </div>

      <div className="space-y-2">
        {menuItems.map(({ icon: Icon, label, hint, to }) => {
          const content = (
            <>
              <div className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center">
                <Icon className="w-4 h-4 text-ember" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-muted text-xs">{hint}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted" />
            </>
          )

          return to ? (
            <Link key={label} to={to} className="w-full flex items-center gap-3 p-3 rounded-2xl bg-surface border border-border">
              {content}
            </Link>
          ) : (
            <button key={label} className="w-full flex items-center gap-3 p-3 rounded-2xl bg-surface border border-border opacity-60">
              {content}
            </button>
          )
        })}
      </div>
    </div>
  )
}
