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
