import { Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Users, Package, ShieldCheck, Clock, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getAdminStats, type AdminStats } from '@/services/admin'
import { Card } from '@/components/ui/Card'

export function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)

  useEffect(() => {
    if (isAdmin) getAdminStats().then(setStats)
  }, [isAdmin])

  if (loading) return <div className="px-4 pt-6"><p className="text-muted text-sm">Loading...</p></div>
  if (!user || !isAdmin) return <Navigate to="/profile" replace />

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="font-extrabold text-2xl mb-1">Admin Dashboard</h1>
      <p className="text-muted text-sm mb-6">Manage users, listings, and moderation.</p>

      <div className="grid grid-cols-4 gap-2 mb-6">
        <Card className="p-2.5 text-center">
          <p className="text-ember font-extrabold text-lg">{stats?.totalUsers ?? '–'}</p>
          <p className="text-muted text-[10px] mt-1">Users</p>
        </Card>
        <Card className="p-2.5 text-center">
          <p className="text-ember font-extrabold text-lg">{stats?.totalListings ?? '–'}</p>
          <p className="text-muted text-[10px] mt-1">Listings</p>
        </Card>
        <Card className="p-2.5 text-center">
          <p className="text-ember font-extrabold text-lg">{stats?.verifiedSellers ?? '–'}</p>
          <p className="text-muted text-[10px] mt-1">Verified</p>
        </Card>
        <Card className={`p-2.5 text-center ${stats && stats.pendingListings > 0 ? 'border-ember/50' : ''}`}>
          <p className="text-ember font-extrabold text-lg">{stats?.pendingListings ?? '–'}</p>
          <p className="text-muted text-[10px] mt-1">Pending</p>
        </Card>
      </div>

      <div className="space-y-2">
        <Link to="/admin/pending" className="w-full flex items-center gap-3 p-3 rounded-2xl bg-ember/10 border border-ember/30">
          <div className="w-10 h-10 rounded-full bg-ember/20 flex items-center justify-center">
            <Clock className="w-4 h-4 text-ember" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-ember">Pending listings</p>
            <p className="text-muted text-xs">Review and approve new posts</p>
          </div>
          <ChevronRight className="w-4 h-4 text-ember" />
        </Link>

        <Link to="/admin/listings" className="w-full flex items-center gap-3 p-3 rounded-2xl bg-surface border border-border">
          <div className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center">
            <Package className="w-4 h-4 text-ember" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold">All listings</p>
            <p className="text-muted text-xs">View and remove any listing</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted" />
        </Link>

        <Link to="/admin/users" className="w-full flex items-center gap-3 p-3 rounded-2xl bg-surface border border-border">
          <div className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center">
            <Users className="w-4 h-4 text-ember" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold">Users & sellers</p>
            <p className="text-muted text-xs">View users, toggle seller verification</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted" />
        </Link>

        <div className="w-full flex items-center gap-3 p-3 rounded-2xl bg-surface border border-border opacity-60">
          <div className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-ember" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold">Reports & analytics</p>
            <p className="text-muted text-xs">Coming in a later update</p>
          </div>
        </div>
      </div>
    </div>
  )
}
