import { useAdminData } from '@/lib/hooks/useAdminData'
import type { JobItem, JobCounts, JobStatus } from '../types'
import { handleJobsError } from '../types/errors'

export function useAdminJobs() {
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
      alert(data.message)
      // Use proper refresh instead of page reload
      await refresh()
    } catch (error) {
      const errorMessage = handleJobsError(error)
      console.error('Error updating job:', errorMessage)
      alert(errorMessage)
    }
  }

  const deleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return
    try {
      const response = await fetch(`/api/admin/jobs?jobId=${jobId}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error(`Failed to delete job ${jobId}`)
      }
      const data = await response.json()
      alert(data.message)
      // Use proper refresh instead of page reload
      await refresh()
    } catch (error) {
      const errorMessage = handleJobsError(error)
      console.error('Error deleting job:', errorMessage)
      alert(errorMessage)
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