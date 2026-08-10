export type Condition = 'new' | 'like-new' | 'used'

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
  seller: Pick<Seller, 'id' | 'name' | 'verified' | 'avatarUrl'>
  createdAt: string
}

export interface Post {
  id: string
  author: Pick<Seller, 'id' | 'name' | 'avatarUrl' | 'verified'>
  imageUrl?: string
  videoPlaceholder?: boolean
  caption: string
  likes: number
  comments: number
  listingId?: string
  createdAt: string
}
