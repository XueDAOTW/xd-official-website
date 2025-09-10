import { useCallback } from 'react'
import type { StatusType, Counts } from '@/lib/types/shared'

interface UseDataFetchingOptions<T, C extends Counts> {
  baseUrl: string
  enableCounts: boolean
  transform: (data: any) => T[]
  transformCounts: (data: any) => C
  calculateCountsFromItems: (items: T[]) => C | null
  setItems: React.Dispatch<React.SetStateAction<T[]>>
  setCounts: React.Dispatch<React.SetStateAction<C | null>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export function useDataFetching<T extends { id: string; status: StatusType }, C extends Counts>({
  baseUrl,
  enableCounts,
  transform,
  transformCounts,
  calculateCountsFromItems,
  setItems,
  setCounts,
  setLoading
}: UseDataFetchingOptions<T, C>) {

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      // Always fetch all items, filter on client side to avoid excessive API calls
      const response = await fetch(baseUrl)
      if (response.ok) {
        const result = await response.json()
        const allItems = transform(result)
        setItems(allItems)
        
        // Use counts from API response if available, otherwise calculate from items
        if (result.counts && enableCounts) {
          setCounts(transformCounts(result.counts))
        } else {
          const calculatedCounts = calculateCountsFromItems(allItems)
          if (calculatedCounts) {
            setCounts(calculatedCounts)
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch items:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [baseUrl, transform, calculateCountsFromItems, enableCounts, transformCounts, setItems, setCounts, setLoading])

  const refresh = useCallback(async () => {
    await fetchItems() // fetchItems now handles counts calculation internally
  }, [fetchItems])

  return {
    fetchItems,
    refresh
  }
}