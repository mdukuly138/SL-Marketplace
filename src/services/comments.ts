import { supabase } from '@/lib/supabase'

export interface PostComment {
  id: string
  postId: string
  content: string
  createdAt: string
  author: { id: string; name: string; avatarUrl?: string }
}

function mapComment(row: any): PostComment {
  return {
    id: row.id,
    postId: row.post_id,
    content: row.content,
    createdAt: row.created_at,
    author: {
      id: row.profiles?.id ?? row.user_id,
      name: row.profiles?.display_name ?? 'User',
      avatarUrl: row.profiles?.avatar_url ?? undefined,
    },
  }
}

export async function getComments(postId: string): Promise<PostComment[]> {
  const { data, error } = await supabase
    .from('post_comments')
    .select('id, post_id, content, created_at, user_id, profiles ( id, display_name, avatar_url )')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapComment)
}

export async function addComment(postId: string, userId: string, content: string) {
  const { data, error } = await supabase
    .from('post_comments')
    .insert({ post_id: postId, user_id: userId, content })
    .select('id, post_id, content, created_at, user_id, profiles ( id, display_name, avatar_url )')
    .single()
  if (error) throw error
  return mapComment(data)
}
