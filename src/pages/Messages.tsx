import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useConversations } from '@/hooks/useConversations'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { Button } from '@/components/ui/Button'

function timeAgo(dateStr: string | null) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

export function Messages() {
  const { user } = useAuth()
  const { conversations, loading } = useConversations(user?.id)

  if (!user) {
    return (
      <div className="px-4 pt-10 text-center">
        <p className="text-muted text-sm mb-4">Sign in to see your messages.</p>
        <Link to="/login"><Button variant="primary">Sign in</Button></Link>
      </div>
    )
  }

  return (
    <div className="pb-4">
      <header className="px-4 pt-6 pb-4">
        <h1 className="font-extrabold text-2xl">Messages</h1>
        <p className="text-muted text-sm mt-1">Chat with buyers & sellers</p>
      </header>

      {loading ? (
        <p className="px-4 text-muted text-sm">Loading...</p>
      ) : conversations.length === 0 ? (
        <p className="text-center text-muted text-sm mt-16">No conversations yet.</p>
      ) : (
        <ul className="divide-y divide-border">
          {conversations.map((c) => (
            <li key={c.id}>
              <Link to={`/messages/${c.id}`} className="flex items-center gap-3 px-4 py-3">
                <div className="w-12 h-12 rounded-full bg-elevated overflow-hidden shrink-0">
                  {c.otherUser.avatarUrl && <img src={c.otherUser.avatarUrl} alt={c.otherUser.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold truncate">{c.otherUser.name}</p>
                    {c.otherUser.verified && <VerificationBadge />}
                  </div>
                  <p className="text-xs text-muted truncate">{c.lastMessage ?? (c.listingTitle ? `About: ${c.listingTitle}` : 'Say hello')}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[11px] text-muted">{timeAgo(c.lastMessageAt)}</span>
                  {c.unread && <span className="w-2.5 h-2.5 rounded-full bg-ember" />}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
