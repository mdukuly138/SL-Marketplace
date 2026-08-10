import { useEffect, useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getAllUsersForAdmin, toggleUserVerified, type AdminUser } from '@/services/admin'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { VerificationBadge } from '@/components/ui/VerificationBadge'

export function AdminUsers() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    if (!isAdmin) return
    getAllUsersForAdmin().then(setUsers).finally(() => setLoading(false))
  }, [isAdmin])

  if (authLoading) return <div className="px-4 pt-6"><p className="text-muted text-sm">Loading...</p></div>
  if (!user || !isAdmin) return <Navigate to="/profile" replace />

  async function handleToggleVerified(u: AdminUser) {
    setBusyId(u.id)
    try {
      await toggleUserVerified(u.id, !u.verified)
      setUsers((prev) => prev.map((p) => (p.id === u.id ? { ...p, verified: !p.verified } : p)))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="px-4 pt-6 pb-8">
      <button onClick={() => navigate('/admin')} className="flex items-center gap-1 text-muted text-sm mb-4">
        <ChevronLeft className="w-4 h-4" /> Admin
      </button>
      <h1 className="font-extrabold text-2xl mb-1">Users & sellers</h1>
      <p className="text-muted text-sm mb-6">{users.length} total</p>

      {loading ? (
        <p className="text-muted text-sm">Loading...</p>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <Card key={u.id} className="flex items-center gap-3 p-3">
              <Link to={`/seller/${u.id}`} className="w-11 h-11 rounded-full bg-elevated overflow-hidden shrink-0">
                {u.avatarUrl && <img src={u.avatarUrl} alt={u.displayName} className="w-full h-full object-cover" />}
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-semibold truncate">{u.displayName}</p>
                  {u.verified && <VerificationBadge />}
                  {u.isAdmin && <span className="text-[10px] text-ember font-bold">ADMIN</span>}
                </div>
                <p className="text-muted text-xs truncate">{u.location || 'No location set'}</p>
              </div>
              {!u.isAdmin && (
                <Button
                  variant={u.verified ? 'secondary' : 'primary'}
                  size="sm"
                  disabled={busyId === u.id}
                  onClick={() => handleToggleVerified(u)}
                >
                  {busyId === u.id ? '...' : u.verified ? 'Unverify' : 'Verify'}
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
