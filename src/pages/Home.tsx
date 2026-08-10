import { useState } from 'react'
import { MapPin, Search as SearchIcon } from 'lucide-react'
import { categories } from '@/data/categories'
import { useListings } from '@/hooks/useListings'
import { ListingCard } from '@/components/listings/ListingCard'
import { ListingFeedCard } from '@/components/social/ListingFeedCard'
import { Input } from '@/components/ui/Input'

export function Home() {
  const [query, setQuery] = useState('')
  const { listings, loading } = useListings()
  const featured = listings.slice(0, 5)

  return (
    <div className="pb-4">
      <header className="px-4 pt-6 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="w-4 h-4" />
          Freetown, Sierra Leone
        </div>
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

      {loading ? (
        <p className="px-4 text-muted text-sm">Loading listings...</p>
      ) : listings.length === 0 ? (
        <div className="px-4 text-center mt-10">
          <p className="text-muted text-sm">No listings yet — be the first to sell something on SL Marketplace!</p>
        </div>
      ) : (
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

          <div className="px-4 space-y-4">
            {listings.map((listing) => (
              <ListingFeedCard key={listing.id} listing={listing} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
