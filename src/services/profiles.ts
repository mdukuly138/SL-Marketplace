import { supabase } from '@/lib/supabase'
import type { Seller } from '@/types'

type ProfileRow = {
  id: string
  display_name: string
  avatar_url: string | null
  location: string | null
  verified: boolean
  about: string | null
}

function mapProfile(row: ProfileRow): Seller {
  return {
    id: row.id,
    name: row.display_name,
    avatarUrl: row.avatar_url ?? undefined,
    location: row.location ?? '',
    verified: row.verified,
    about: row.about ?? undefined,
  }
}

export async function getProfile(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, location, verified, about')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data ? mapProfile(data) : null
}

export interface UpdateProfileInput {
  displayName?: string
  avatarUrl?: string
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const payload: Record<string, unknown> = {}
  if (input.displayName !== undefined) payload.display_name = input.displayName
  if (input.avatarUrl !== undefined) payload.avatar_url = input.avatarUrl

  const { data, error } = await supabase.from('profiles').update(payload).eq('id', userId).select().single()
  if (error) throw error
  return data
}
