import { supabase } from '@/lib/supabase'
import type { Listing } from '@/types'

export interface AdminStats {
  totalUsers: number
  totalListings: number
  verifiedSellers: number
  pendingListings: number
}

export async function getAdminStats(): Promise<AdminStats> {
  const [{ count: totalUsers }, { count: totalListings }, { count: verifiedSellers }, { count: pendingListings }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('listings').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('verified', true),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ])
  return {
    totalUsers: totalUsers ?? 0,
    totalListings: totalListings ?? 0,
    verifiedSellers: verifiedSellers ?? 0,
    pendingListings: pendingListings ?? 0,
  }
}

type ListingRow = {
  id: string
  title: string
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
    images: row.images ?? [row.image_url],
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

const ADMIN_SELECT = `
  id, title, price, negotiable, image_url, images, location, condition, category, status, created_at, seller_id,
  profiles ( id, display_name, verified, avatar_url )
`

export async function getAllListingsForAdmin(): Promise<Listing[]> {
  const { data, error } = await supabase.from('listings').select(ADMIN_SELECT).order('created_at', { ascending: false })
  if (error) throw error
  return (data as unknown as ListingRow[]).map(mapListing)
}

export async function getPendingListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from('listings')
    .select(ADMIN_SELECT)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data as unknown as ListingRow[]).map(mapListing)
}

export async function approveListing(id: string) {
  const { error } = await supabase.from('listings').update({ status: 'approved' }).eq('id', id)
  if (error) throw error
}

export async function rejectListing(id: string) {
  const { error } = await supabase.from('listings').update({ status: 'rejected' }).eq('id', id)
  if (error) throw error
}

export async function adminDeleteListing(id: string) {
  const { error } = await supabase.from('listings').delete().eq('id', id)
  if (error) throw error
}

export interface AdminUser {
  id: string
  displayName: string
  avatarUrl?: string
  location: string
  verified: boolean
  isAdmin: boolean
  createdAt: string
}

export async function getAllUsersForAdmin(): Promise<AdminUser[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, location, verified, is_admin, created_at')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((row: any) => ({
    id: row.id,
    displayName: row.display_name,
    avatarUrl: row.avatar_url ?? undefined,
    location: row.location ?? '',
    verified: row.verified,
    isAdmin: row.is_admin,
    createdAt: row.created_at,
  }))
}

export async function toggleUserVerified(userId: string, verified: boolean) {
  const { error } = await supabase.from('profiles').update({ verified }).eq('id', userId)
  if (error) throw error
}
