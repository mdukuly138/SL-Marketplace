import { supabase } from '@/lib/supabase'
import type { Listing } from '@/types'

type ListingRow = {
  id: string
  title: string
  description: string | null
  price: number
  negotiable: boolean
  image_url: string
  images: string[] | null
  location: string
  condition: 'new' | 'like-new' | 'used'
  category: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  seller_id: string
  profiles: { id: string; display_name: string; verified: boolean; avatar_url: string | null } | null
}

function mapListing(row: ListingRow): Listing {
  return {
    id: row.id,
    title: row.title,
    price: row.price,
    negotiable: row.negotiable,
    imageUrl: row.image_url,
    images: row.images && row.images.length > 0 ? row.images : [row.image_url],
    location: row.location,
    condition: row.condition,
    category: row.category,
    status: row.status,
    createdAt: row.created_at,
    seller: {
      id: row.profiles?.id ?? row.seller_id,
      name: row.profiles?.display_name ?? 'Seller',
      verified: row.profiles?.verified ?? false,
      avatarUrl: row.profiles?.avatar_url ?? undefined,
    },
  }
}

const SELECT = `
  id, title, description, price, negotiable, image_url, images, location, condition, category, status, created_at, seller_id,
  profiles ( id, display_name, verified, avatar_url )
`

export async function getListings() {
  const { data, error } = await supabase
    .from('listings')
    .select(SELECT)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as unknown as ListingRow[]).map(mapListing)
}

export async function getListingById(id: string) {
  const { data, error } = await supabase.from('listings').select(SELECT).eq('id', id).maybeSingle()
  if (error) throw error
  return data ? mapListing(data as unknown as ListingRow) : null
}

// Public-facing: only approved listings show on a seller's public profile
export async function getListingsBySeller(sellerId: string) {
  const { data, error } = await supabase
    .from('listings')
    .select(SELECT)
    .eq('seller_id', sellerId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as unknown as ListingRow[]).map(mapListing)
}

// Owner-facing: shows all of a seller's own listings regardless of status
export async function getMyListings(sellerId: string) {
  const { data, error } = await supabase
    .from('listings')
    .select(SELECT)
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as unknown as ListingRow[]).map(mapListing)
}

export interface NewListingInput {
  title: string
  description: string
  price: number
  negotiable: boolean
  images: string[]
  location: string
  condition: 'new' | 'like-new' | 'used'
  category: string
  sellerId: string
}

export async function createListing(input: NewListingInput) {
  const { data, error } = await supabase
    .from('listings')
    .insert({
      title: input.title,
      description: input.description,
      price: input.price,
      negotiable: input.negotiable,
      image_url: input.images[0],
      images: input.images,
      location: input.location,
      condition: input.condition,
      category: input.category,
      seller_id: input.sellerId,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export type UpdateListingInput = Partial<Omit<NewListingInput, 'sellerId'>>

export async function updateListing(id: string, input: UpdateListingInput) {
  const payload: Record<string, unknown> = {}
  if (input.title !== undefined) payload.title = input.title
  if (input.description !== undefined) payload.description = input.description
  if (input.price !== undefined) payload.price = input.price
  if (input.negotiable !== undefined) payload.negotiable = input.negotiable
  if (input.images !== undefined) {
    payload.image_url = input.images[0]
    payload.images = input.images
  }
  if (input.location !== undefined) payload.location = input.location
  if (input.condition !== undefined) payload.condition = input.condition
  if (input.category !== undefined) payload.category = input.category

  const { data, error } = await supabase.from('listings').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteListing(id: string) {
  const { error } = await supabase.from('listings').delete().eq('id', id)
  if (error) throw error
}
