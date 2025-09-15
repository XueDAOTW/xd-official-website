import { useCallback } from 'react'
import type { StatusType, Counts } from '@/types'

interface UseOptimisticUpdatesOptions<T extends { id: string; status: StatusType }, C extends Counts> {
  setItems: React.Dispatch<React.SetStateAction<T[]>>
  setCounts: React.Dispatch<React.SetStateAction<C | null>>
  calculateCountsFromItems: (items: T[]) => C | null
  baseUrl: string
  fetchItems: () => Promise<void>
}

export function useOptimisticUpdates<T extends { id: string; status: StatusType }, C extends Counts>({
  setItems,
  setCounts,
  calculateCountsFromItems,
  baseUrl,
  fetchItems
}: UseOptimisticUpdatesOptions<T, C>) {
  
  const updateItemStatus = useCallback(async (id: string, status: StatusType) => {
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      
      if (response.ok) {
        // Optimistically update the local state instead of refetching
        setItems(prevItems => {
          const updatedItems = prevItems.map(item => 
            item.id === id ? { ...item, status } : item
          )
          
          // Recalculate counts from updated items
          const calculatedCounts = calculateCountsFromItems(updatedItems)
          if (calculatedCounts) {
            setCounts(calculatedCounts)
          }
          
          return updatedItems
        })
      } else {
        throw new Error('Failed to update status')
      }
    } catch (error) {
      console.error('Failed to update item status:', error)
      // Fallback to full refresh on error
      await fetchItems()
      throw error
    }
  }, [baseUrl, calculateCountsFromItems, fetchItems, setCounts, setItems])

  const deleteItem = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' })
      if (response.ok) {
        // Optimistically remove item from local state instead of refetching
        setItems(prevItems => {
          const filteredItems = prevItems.filter(item => item.id !== id)
          
          // Recalculate counts from remaining items
          const calculatedCounts = calculateCountsFromItems(filteredItems)
          if (calculatedCounts) {
            setCounts(calculatedCounts)
          }
          
          return filteredItems
        })
      } else {
        throw new Error('Failed to delete item')
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
      // Fallback to full refresh on error
      await fetchItems()
      throw error
    }
  }, [baseUrl, calculateCountsFromItems, fetchItems, setCounts, setItems])

  return {
    updateItemStatus,
    deleteItem
  }
}