import { useEffect, useState } from 'react'
import { getFeedPosts } from '@/services/posts'
import type { Post } from '@/types'
import { useAuth } from './useAuth'

export function usePosts() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    getFeedPosts(user?.id)
      .then((data) => { if (active) setPosts(data) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [user?.id])

  return { posts, loading }
}
