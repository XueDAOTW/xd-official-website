import { useState, useEffect, useCallback } from 'react'
import type { JobItem, JobCounts, JobStatus } from '../types'
import { JobsFetchError, JobStatusUpdateError, JobDeleteError, handleJobsError } from '../types/errors'

export function useAdminJobs() {
  const [jobs, setJobs] = useState<JobItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<JobStatus>('pending')
  const [counts, setCounts] = useState<JobCounts | null>(null)

  const fetchCounts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/jobs?aggregate=counts')
      if (!res.ok) {
        throw new JobsFetchError()
      }
      const data = await res.json()
      setCounts(data.counts)
    } catch (error) {
      console.error('Error fetching job counts:', handleJobsError(error))
      setCounts({ pending: 0, approved: 0, rejected: 0 })
    }
  }, [])

  const fetchJobs = useCallback(async (status: JobStatus = 'pending') => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/jobs?status=${status}`)
      if (!response.ok) {
        throw new JobsFetchError(status)
      }
      const data = await response.json()
      setJobs(data.jobs || [])
    } catch (error) {
      const errorMessage = handleJobsError(error)
      console.error('Error fetching jobs:', errorMessage)
      setJobs([])
      // Could add toast notification here
    } finally {
      setLoading(false)
    }
  }, [])

  const updateJobStatus = useCallback(async (jobId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/admin/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, status }),
      })
      if (!response.ok) {
        throw new JobStatusUpdateError(jobId, status)
      }
      const data = await response.json()
      alert(data.message)
      await Promise.all([fetchJobs(activeTab), fetchCounts()])
    } catch (error) {
      const errorMessage = handleJobsError(error)
      console.error('Error updating job:', errorMessage)
      alert(errorMessage)
    }
  }, [activeTab, fetchJobs, fetchCounts])

  const deleteJob = useCallback(async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return
    try {
      const response = await fetch(`/api/admin/jobs?jobId=${jobId}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new JobDeleteError(jobId)
      }
      const data = await response.json()
      alert(data.message)
      await Promise.all([fetchJobs(activeTab), fetchCounts()])
    } catch (error) {
      const errorMessage = handleJobsError(error)
      console.error('Error deleting job:', errorMessage)
      alert(errorMessage)
    }
  }, [activeTab, fetchJobs, fetchCounts])

  useEffect(() => { fetchCounts() }, [fetchCounts])
  useEffect(() => { fetchJobs(activeTab) }, [activeTab, fetchJobs])

  return {
    jobs,
    loading,
    activeTab,
    setActiveTab,
    counts,
    updateJobStatus,
    deleteJob,
  }
}