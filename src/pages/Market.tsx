import { useMemo, useState } from 'react'
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react'
import { categories } from '@/data/categories'
import { useListings } from '@/hooks/useListings'
import { ListingCard } from '@/components/listings/ListingCard'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

export function Market() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const { listings, loading } = useListings()

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const matchesQuery = l.title.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = !activeCategory || l.category === activeCategory
      return matchesQuery && matchesCategory
    })
  }, [listings, query, activeCategory])

  return (
    <div className="pb-4">
      <header className="px-4 pt-6 pb-4">
        <h1 className="font-extrabold text-2xl mb-3">Market</h1>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Market" className="pl-10" />
          </div>
          <button className="w-12 h-12 shrink-0 rounded-2xl bg-surface border border-border flex items-center justify-center text-muted">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="px-4 pb-4 flex gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn('shrink-0 rounded-pill px-3.5 py-1.5 text-xs font-semibold border', !activeCategory ? 'bg-ember text-base border-ember' : 'bg-surface text-muted border-border')}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={cn('shrink-0 rounded-pill px-3.5 py-1.5 text-xs font-semibold border', activeCategory === c ? 'bg-ember text-base border-ember' : 'bg-surface text-muted border-border')}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="px-4 text-muted text-sm">Loading listings...</p>
      ) : (
        <>
          <div className="px-4 grid grid-cols-2 gap-3">
            {filtered.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
          </div>
          {filtered.length === 0 && <p className="text-center text-muted text-sm mt-10">No listings match your search.</p>}
        </>
      )}
    </div>
  )
}
