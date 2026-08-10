import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getComments, addComment, type PostComment } from '@/services/comments'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface PostCommentsModalProps {
  postId: string
  open: boolean
  onClose: () => void
}

export function PostCommentsModal({ postId, open, onClose }: PostCommentsModalProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<PostComment[]>([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!open) return
    let active = true
    setLoading(true)
    getComments(postId).then((data) => { if (active) setComments(data) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [open, postId])

  async function handleSend(e: FormEvent) {
    e.preventDefault()
    if (!text.trim() || !user) return
    setSending(true)
    try {
      const comment = await addComment(postId, user.id, text.trim())
      setComments((prev) => [...prev, comment])
      setText('')
    } finally {
      setSending(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Comments">
      <div className="max-h-64 overflow-y-auto space-y-3 mb-3">
        {loading ? (
          <p className="text-muted text-sm">Loading...</p>
        ) : comments.length === 0 ? (
          <p className="text-muted text-sm">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-elevated overflow-hidden shrink-0">
                {c.author.avatarUrl && <img src={c.author.avatarUrl} alt={c.author.name} className="w-full h-full object-cover" />}
              </div>
              <div>
                <p className="text-xs font-semibold">{c.author.name}</p>
                <p className="text-sm text-ink/90">{c.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {user ? (
        <form onSubmit={handleSend} className="flex gap-2">
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment..." className="flex-1" />
          <Button type="submit" variant="primary" size="sm" disabled={sending || !text.trim()}>
            {sending ? '...' : 'Send'}
          </Button>
        </form>
      ) : (
        <p className="text-muted text-sm">Sign in to comment.</p>
      )}
    </Modal>
  )
}
