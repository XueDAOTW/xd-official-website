import { useAdminData } from '@/lib/hooks/useAdminData'
import type { Application, AppCounts, ApplicationStatus } from '../types'

export function useApplications() {
  const {
    items: applications,
    loading,
    selectedStatus,
    setSelectedStatus,
    counts,
    updateItemStatus,
    deleteItem,
    refresh
  } = useAdminData<Application, AppCounts>({
    baseUrl: '/api/applications',
    initialStatus: 'all',
    enableCounts: true,
    transform: (result) => {
      // Handle both old and new API response formats
      if (Array.isArray(result)) {
        return result
      }
      if (result?.data) {
        return Array.isArray(result.data) ? result.data : []
      }
      return result?.items || []
    },
    transformCounts: (countsData) => {
      // Handle counts from API response or calculated from items
      if (countsData && typeof countsData === 'object' && 'total' in countsData) {
        return {
          total: countsData.total || 0,
          pending: countsData.pending || 0,
          approved: countsData.approved || 0,
          rejected: countsData.rejected || 0,
        }
      }
      // Fallback: default empty counts
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      }
    }
  })

  // Filter applications based on selected status (client-side filtering)
  const filteredApplications = selectedStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === selectedStatus)

  const updateApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateItemStatus(id, status)
    } catch (error) {
      console.error('Failed to update application:', error)
    }
  }

  const deleteApplication = async (id: string) => {
    try {
      await deleteItem(id)
    } catch (error) {
      console.error('Failed to delete application:', error)
    }
  }

  // Provide default counts if null
  const defaultCounts: AppCounts = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  }

  return {
    applications: filteredApplications,
    loading,
    selectedStatus: selectedStatus as ApplicationStatus,
    setSelectedStatus: (status: ApplicationStatus) => setSelectedStatus(status),
    counts: counts || defaultCounts,
    updateApplicationStatus,
    deleteApplication,
  }
}