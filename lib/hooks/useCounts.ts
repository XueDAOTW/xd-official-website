import { useCallback } from 'react'
import type { StatusType, Counts } from '@/types'

interface UseCountsOptions<T, C extends Counts> {
  enableCounts: boolean
  transformCounts: (data: any) => C
}

export function useCounts<T extends { id: string; status: StatusType }, C extends Counts>({
  enableCounts,
  transformCounts
}: UseCountsOptions<T, C>) {

  // Calculate counts from existing items to avoid separate API call
  const calculateCountsFromItems = useCallback((items: T[]) => {
    if (!enableCounts) return null
    
    const counts = items.reduce((acc: any, item) => {
      acc.total = (acc.total || 0) + 1
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    }, { total: 0, pending: 0, approved: 0, rejected: 0 })
    
    return transformCounts(counts)
  }, [enableCounts, transformCounts])

  return {
    calculateCountsFromItems
  }
}