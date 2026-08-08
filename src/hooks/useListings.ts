import { useEffect, useState } from 'react'
import { getListings } from '@/services/listings'
import type { Listing } from '@/types'

export function useListings() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getListings()
      .then((data) => { if (active) setListings(data) })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return { listings, loading, error }
}
