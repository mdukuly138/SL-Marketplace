import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getMessages, type Message } from '@/services/messages'

export function useMessages(conversationId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!conversationId) return
    let active = true
    setLoading(true)

    getMessages(conversationId)
      .then((data) => { if (active) setMessages(data) })
      .finally(() => { if (active) setLoading(false) })

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          const row = payload.new as any
          setMessages((prev) => [
            ...prev,
            { id: row.id, conversationId: row.conversation_id, senderId: row.sender_id, content: row.content, createdAt: row.created_at },
          ])
        },
      )
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  return { messages, loading }
}
