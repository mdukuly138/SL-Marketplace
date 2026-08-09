import { useEffect, useState } from 'react'
import { getConversationsForUser, type ConversationSummary } from '@/services/conversations'

export function useConversations(userId: string | undefined) {
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    let active = true
    setLoading(true)
    getConversationsForUser(userId)
      .then((data) => { if (active) setConversations(data) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [userId])

  return { conversations, loading }
}
