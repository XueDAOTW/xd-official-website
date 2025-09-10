import { useState, useEffect, useCallback } from 'react'
import type { StatusType, StatusWithAll, Counts } from '@/lib/types/shared'

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

  const fetchCounts = useCallback(async () => {
    if (!enableCounts) return
    
    try {
      const response = await fetch(`${baseUrl}?aggregate=counts`)
      if (response.ok) {
        const data = await response.json()
        setCounts(transformCounts(data.counts || data))
      }
    } catch (error) {
      console.error('Failed to fetch counts:', error)
    }
  }, [baseUrl, enableCounts, transformCounts])

  const fetchItems = useCallback(async (status: StatusWithAll = selectedStatus) => {
    setLoading(true)
    try {
      const url = status === 'all' 
        ? baseUrl 
        : `${baseUrl}?status=${status}`
      const response = await fetch(url)
      if (response.ok) {
        const result = await response.json()
        setItems(transform(result.data || result.items || result))
      }
    } catch (error) {
      console.error('Failed to fetch items:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [baseUrl, transform, selectedStatus])

  const updateItemStatus = useCallback(async (id: string, status: StatusType) => {
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        await Promise.all([fetchItems(), fetchCounts()])
      } else {
        throw new Error('Failed to update status')
      }
    } catch (error) {
      console.error('Failed to update item status:', error)
      throw error
    }
  }, [baseUrl, fetchItems, fetchCounts])

  const deleteItem = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      const response = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await Promise.all([fetchItems(), fetchCounts()])
      } else {
        throw new Error('Failed to delete item')
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
      throw error
    }
  }, [baseUrl, fetchItems, fetchCounts])

  const refresh = useCallback(async () => {
    await Promise.all([fetchItems(), fetchCounts()])
  }, [fetchItems, fetchCounts])

  // Initial data fetch
  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  useEffect(() => {
    fetchCounts()
  }, [fetchCounts])

  // Fetch when status changes
  useEffect(() => {
    fetchItems(selectedStatus)
  }, [selectedStatus, fetchItems])

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