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
    deleteItem
  } = useAdminData<Application, AppCounts>({
    baseUrl: '/api/applications',
    initialStatus: 'all',
    enableCounts: true,
    transform: (data) => data?.data || data || [],
    transformCounts: (countsData) => {
      // Custom transform for applications that includes total count
      return {
        total: countsData?.total || 0,
        pending: countsData?.pending || 0,
        approved: countsData?.approved || 0,
        rejected: countsData?.rejected || 0,
      }
    }
  })

  // Filter applications based on selected status
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