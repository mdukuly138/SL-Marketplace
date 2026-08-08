import { Link } from 'react-router-dom'
import { conversations } from '@/data/conversations'
import { VerificationBadge } from '@/components/ui/VerificationBadge'

export function Messages() {
  return (
    <div className="pb-4">
      <header className="px-4 pt-6 pb-4">
        <h1 className="font-extrabold text-2xl">Messages</h1>
        <p className="text-muted text-sm mt-1">Chat with buyers & sellers</p>
      </header>

      {conversations.length === 0 ? (
        <p className="text-center text-muted text-sm mt-16">No conversations yet.</p>
      ) : (
        <ul className="divide-y divide-border">
          {conversations.map((c) => (
            <li key={c.id}>
              <Link to={`/seller/${c.sellerId}`} className="flex items-center gap-3 px-4 py-3">
                <div className="w-12 h-12 rounded-full bg-elevated overflow-hidden shrink-0">
                  {c.avatarUrl && <img src={c.avatarUrl} alt={c.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold truncate">{c.name}</p>
                    {c.verified && <VerificationBadge />}
                  </div>
                  <p className="text-xs text-muted truncate">{c.lastMessage}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[11px] text-muted">{c.time}</span>
                  {c.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-ember text-[10px] font-bold text-base flex items-center justify-center">
                      {c.unread}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
