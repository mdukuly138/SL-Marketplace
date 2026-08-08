import { Heart, MessageCircle, Share2, Play } from 'lucide-react'
import type { Post } from '@/types'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { Card } from '@/components/ui/Card'

export function PostCard({ post }: { post: Post }) {
  return (
    <Card>
      <div className="flex items-center gap-2 p-3">
        <div className="w-9 h-9 rounded-full bg-elevated overflow-hidden shrink-0">
          {post.author.avatarUrl && (
            <img src={post.author.avatarUrl} alt={post.author.name} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex items-center gap-1">
          <p className="text-sm font-semibold">{post.author.name}</p>
          {post.author.verified && <VerificationBadge />}
        </div>
      </div>

      {post.imageUrl && (
        <div className="aspect-[4/5] bg-elevated relative">
          <img src={post.imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
          {post.videoPlaceholder && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-3 space-y-2">
        <p className="text-sm text-ink/90">{post.caption}</p>
        <div className="flex items-center gap-4 text-muted text-sm pt-1">
          <button className="flex items-center gap-1.5 hover:text-ember transition">
            <Heart className="w-4 h-4" /> {post.likes}
          </button>
          <button className="flex items-center gap-1.5 hover:text-ember transition">
            <MessageCircle className="w-4 h-4" /> {post.comments}
          </button>
          <button className="flex items-center gap-1.5 hover:text-ember transition ml-auto">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  )
}
