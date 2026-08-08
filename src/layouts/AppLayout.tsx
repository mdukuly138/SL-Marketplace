import { Outlet } from 'react-router-dom'
import { BottomNav } from '@/components/navigation/BottomNav'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-base text-ink font-sans">
      <div className="pb-20 max-w-md mx-auto sm:max-w-2xl">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}
