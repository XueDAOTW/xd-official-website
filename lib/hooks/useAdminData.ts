import { useState, useEffect } from 'react'
import type { StatusType, StatusWithAll, Counts } from '@/types'
import { useCounts } from './useCounts'
import { useDataFetching } from './useDataFetching'
import { useOptimisticUpdates } from './useOptimisticUpdates'

interface AdminDataOptions<T, C extends Counts> {
  baseUrl: string
  initialStatus?: StatusWithAll
  enableCounts?: boolean
  transform?: (data: any) => T[]
  transformCounts?: (data: any) => C
}

interface AdminDataReturn<T, C extends Counts> {
  items: T[]
  loading: boolean
  selectedStatus: StatusWithAll
  setSelectedStatus: (status: StatusWithAll) => void
  counts: C | null
  updateItemStatus: (id: string, status: StatusType) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

export function useAdminData<T extends { id: string; status: StatusType }, C extends Counts>({
  baseUrl,
  initialStatus = 'all',
  enableCounts = true,
  transform = (data) => data,
  transformCounts = (data) => data
}: AdminDataOptions<T, C>): AdminDataReturn<T, C> {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<StatusWithAll>(initialStatus)
  const [counts, setCounts] = useState<C | null>(null)

  // Use separated concerns hooks
  const { calculateCountsFromItems } = useCounts({ enableCounts, transformCounts })
  
  const { fetchItems, refresh } = useDataFetching({
    baseUrl,
    enableCounts,
    transform,
    transformCounts,
    calculateCountsFromItems,
    setItems,
    setCounts,
    setLoading
  })

  const { updateItemStatus, deleteItem } = useOptimisticUpdates({
    setItems,
    setCounts,
    calculateCountsFromItems,
    baseUrl,
    fetchItems
  })

  // Initial data fetch - only run once on mount
  useEffect(() => {
    fetchItems() // fetchItems now handles counts calculation internally
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array to run only once on mount

  return {
    items,
    loading,
    selectedStatus,
    setSelectedStatus,
    counts,
    updateItemStatus,
    deleteItem,
    refresh
  }
}