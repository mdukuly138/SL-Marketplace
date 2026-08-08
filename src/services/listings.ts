import { supabase } from '@/lib/supabase'
import type { Listing } from '@/types'

type ListingRow = {
  id: string
  title: string
  description: string | null
  price: number
  negotiable: boolean
  image_url: string
  location: string
  condition: 'new' | 'like-new' | 'used'
  category: string
  created_at: string
  seller_id: string
  profiles: { id: string; display_name: string; verified: boolean } | null
}

function mapListing(row: ListingRow): Listing {
  return {
    id: row.id,
    title: row.title,
    price: row.price,
    negotiable: row.negotiable,
    imageUrl: row.image_url,
    location: row.location,
    condition: row.condition,
    category: row.category,
    createdAt: row.created_at,
    seller: {
      id: row.profiles?.id ?? row.seller_id,
      name: row.profiles?.display_name ?? 'Seller',
      verified: row.profiles?.verified ?? false,
    },
  }
}

const SELECT = `
  id, title, description, price, negotiable, image_url, location, condition, category, created_at, seller_id,
  profiles ( id, display_name, verified )
`

export async function getListings() {
  const { data, error } = await supabase.from('listings').select(SELECT).order('created_at', { ascending: false })
  if (error) throw error
  return (data as unknown as ListingRow[]).map(mapListing)
}

export async function getListingById(id: string) {
  const { data, error } = await supabase.from('listings').select(SELECT).eq('id', id).maybeSingle()
  if (error) throw error
  return data ? mapListing(data as unknown as ListingRow) : null
}

export async function getListingsBySeller(sellerId: string) {
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
  imageUrl: string
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
      image_url: input.imageUrl,
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
