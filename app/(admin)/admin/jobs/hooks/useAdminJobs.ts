import { useAdminData } from '@/lib/hooks/useAdminData'
import { useToast } from '@/lib/contexts/ToastContext'
import type { JobItem, JobCounts, JobStatus } from '../types'
import { handleJobsError } from '../types/errors'

export function useAdminJobs() {
  const { success, error } = useToast()
  const {
    items: allJobs,
    loading,
    selectedStatus: activeTab,
    setSelectedStatus: setActiveTab,
    counts,
    updateItemStatus,
    deleteItem,
    refresh
  } = useAdminData<JobItem, JobCounts>({
    baseUrl: '/api/admin/jobs',
    initialStatus: 'pending',
    enableCounts: true,
    transform: (data) => data?.jobs || data || [],
    transformCounts: (data) => data || { pending: 0, approved: 0, rejected: 0 }
  })

  // Filter jobs based on selected status (client-side filtering)
  const jobs = activeTab === 'all' 
    ? allJobs 
    : allJobs.filter(job => job.status === activeTab)

  const updateJobStatus = async (jobId: string, status: 'approved' | 'rejected') => {
    try {
      // Jobs API has a different structure, so we need custom handling
      const response = await fetch('/api/admin/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, status }),
      })
      if (!response.ok) {
        throw new Error(`Failed to update job ${jobId} to ${status} status`)
      }
      const data = await response.json()
      success(data.message)
      // Use proper refresh instead of page reload
      await refresh()
    } catch (err) {
      const errorMessage = handleJobsError(err)
      console.error('Error updating job:', errorMessage)
      error(errorMessage)
    }
  }

  const deleteJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/admin/jobs?jobId=${jobId}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error(`Failed to delete job ${jobId}`)
      }
      const data = await response.json()
      success(data.message)
      // Use proper refresh instead of page reload
      await refresh()
    } catch (err) {
      const errorMessage = handleJobsError(err)
      console.error('Error deleting job:', errorMessage)
      error(errorMessage)
    }
  }

  return {
    jobs,
    loading,
    activeTab: activeTab as JobStatus,
    setActiveTab: (status: JobStatus) => setActiveTab(status),
    counts,
    updateJobStatus,
    deleteJob,
  }
}