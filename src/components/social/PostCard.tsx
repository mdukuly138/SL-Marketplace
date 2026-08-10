import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle } from 'lucide-react'
import type { Post } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { toggleLike } from '@/services/posts'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { ShareButton } from '@/components/ui/ShareButton'
import { Card } from '@/components/ui/Card'
import { PostCommentsModal } from './PostCommentsModal'

export function PostCard({ post }: { post: Post }) {
  const { user } = useAuth()
  const [liked, setLiked] = useState(post.likedByMe)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [commentsOpen, setCommentsOpen] = useState(false)

  async function handleLike() {
    if (!user) return
    const next = !liked
    setLiked(next)
    setLikeCount((c) => c + (next ? 1 : -1))
    try {
      await toggleLike(post.id, user.id, liked)
    } catch {
      setLiked(!next)
      setLikeCount((c) => c + (next ? -1 : 1))
    }
  }

  return (
    <Card>
      <div className="flex items-center gap-2 p-3">
        <Link to={`/seller/${post.seller.id}`} className="w-9 h-9 rounded-full bg-elevated overflow-hidden shrink-0">
          {post.seller.avatarUrl && <img src={post.seller.avatarUrl} alt={post.seller.name} className="w-full h-full object-cover" />}
        </Link>
        <Link to={`/seller/${post.seller.id}`} className="flex items-center gap-1 min-w-0">
          <p className="text-sm font-semibold truncate">{post.seller.name}</p>
          {post.seller.verified && <VerificationBadge />}
        </Link>
      </div>

      <div className="aspect-[4/5] bg-elevated relative">
        {post.mediaType === 'image' ? (
          <img src={post.mediaUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <video src={post.mediaUrl} controls playsInline className="w-full h-full object-cover" />
        )}
      </div>

      <div className="p-3 space-y-2">
        {post.caption && <p className="text-sm text-ink/90">{post.caption}</p>}
        <div className="flex items-center gap-4 text-muted text-sm pt-1">
          <button onClick={handleLike} disabled={!user} className="flex items-center gap-1.5 hover:text-ember transition">
            <Heart className={liked ? 'w-4 h-4 fill-ember text-ember' : 'w-4 h-4'} /> {likeCount}
          </button>
          <button onClick={() => setCommentsOpen(true)} className="flex items-center gap-1.5 hover:text-ember transition">
            <MessageCircle className="w-4 h-4" /> {post.commentCount}
          </button>
          <ShareButton
            title={`${post.seller.name} on SL Marketplace`}
            text={post.caption ?? 'Check this out on SL Marketplace'}
            url={`${window.location.origin}/seller/${post.seller.id}`}
            className="ml-auto bg-transparent w-auto h-auto"
          />
        </div>
      </div>

      <PostCommentsModal postId={post.id} open={commentsOpen} onClose={() => setCommentsOpen(false)} />
    </Card>
  )
}
