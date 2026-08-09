import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Send } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useMessages } from '@/hooks/useMessages'
import { sendMessage, markConversationRead } from '@/services/messages'
import { supabase } from '@/lib/supabase'

export function Chat() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { messages, loading } = useMessages(id)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  useEffect(() => {
    if (!id || !user) return
    supabase.from('conversations').select('buyer_id, seller_id').eq('id', id).maybeSingle()
      .then(({ data }) => { if (data) markConversationRead(id, user.id, data.buyer_id === user.id) })
  }, [id, user])

  async function handleSend(e: FormEvent) {
    e.preventDefault()
    if (!text.trim() || !id || !user) return
    setSending(true)
    try {
      await sendMessage(id, user.id, text.trim())
      setText('')
    } finally {
      setSending(false)
    }
  }

  if (!user) return <div className="px-4 pt-6"><p className="text-muted text-sm">Sign in to view this conversation.</p></div>

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <header className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <button onClick={() => navigate('/messages')} className="p-1 -ml-1">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold">Conversation</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <p className="text-muted text-sm">Loading...</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${m.senderId === user.id ? 'bg-ember text-base' : 'bg-surface text-ink border border-border'}`}>
                {m.content}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-border">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 h-11 rounded-pill bg-surface border border-border px-4 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ember/50"
        />
        <button type="submit" disabled={sending || !text.trim()} className="w-11 h-11 rounded-full bg-ember text-base flex items-center justify-center disabled:opacity-40">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
