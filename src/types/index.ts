export type Condition = 'new' | 'like-new' | 'used'
export type ListingStatus = 'pending' | 'approved' | 'rejected'
export type MediaType = 'image' | 'video'

export interface Seller {
  id: string
  name: string
  avatarUrl?: string
  location: string
  verified: boolean
  about?: string
}

export interface Listing {
  id: string
  title: string
  price: number
  negotiable: boolean
  imageUrl: string
  images?: string[]
  location: string
  condition: Condition
  category: string
  status: ListingStatus
  seller: Pick<Seller, 'id' | 'name' | 'verified' | 'avatarUrl'>
  createdAt: string
}

export interface Post {
  id: string
  seller: Pick<Seller, 'id' | 'name' | 'avatarUrl' | 'verified'>
  mediaUrl: string
  mediaType: MediaType
  caption: string | null
  listingId?: string
  likeCount: number
  commentCount: number
  likedByMe: boolean
  createdAt: string
}
