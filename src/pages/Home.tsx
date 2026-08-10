import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Search as SearchIcon, PlusCircle } from 'lucide-react'
import { categories } from '@/data/categories'
import { useListings } from '@/hooks/useListings'
import { usePosts } from '@/hooks/usePosts'
import { useAuth } from '@/hooks/useAuth'
import { ListingCard } from '@/components/listings/ListingCard'
import { PostCard } from '@/components/social/PostCard'
import { Input } from '@/components/ui/Input'

export function Home() {
  const [query, setQuery] = useState('')
  const { listings, loading: listingsLoading } = useListings()
  const { posts, loading: postsLoading } = usePosts()
  const { user, isVerified } = useAuth()
  const featured = listings.slice(0, 5)

  return (
    <div className="pb-4">
      <header className="px-4 pt-6 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="w-4 h-4" />
          Freetown, Sierra Leone
        </div>
        {user && isVerified && (
          <Link to="/create-post" className="flex items-center gap-1 text-ember text-sm font-semibold">
            <PlusCircle className="w-4 h-4" /> Post
          </Link>
        )}
      </header>

      <div className="px-4 pb-4">
        <div className="relative">
          <SearchIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search listings, sellers..." className="pl-10" />
        </div>
      </div>

      <div className="px-4 pb-5 flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((c) => (
          <span key={c} className="shrink-0 rounded-pill bg-surface border border-border px-3.5 py-1.5 text-xs font-medium text-muted">
            {c}
          </span>
        ))}
      </div>

      {listingsLoading ? (
        <p className="px-4 text-muted text-sm">Loading listings...</p>
      ) : featured.length > 0 ? (
        <>
          <div className="px-4 mb-2">
            <h2 className="font-bold text-lg">Featured</h2>
          </div>
          <div className="pl-4 pb-6 flex gap-3 overflow-x-auto no-scrollbar">
            {featured.map((listing) => (
              <div key={listing.id} className="w-40 shrink-0">
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        </>
      ) : null}

      {user && !isVerified && (
        <div className="mx-4 mb-4 rounded-2xl bg-surface border border-border p-3">
          <p className="text-sm font-semibold">Get verified to post on Home</p>
          <p className="text-muted text-xs mt-0.5">Verified sellers can share photos and short videos here. Contact an admin to get verified.</p>
        </div>
      )}

      {postsLoading ? (
        <p className="px-4 text-muted text-sm">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="px-4 text-muted text-sm">No posts yet — verified sellers can be the first to share something.</p>
      ) : (
        <div className="px-4 space-y-4">
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  )
}
