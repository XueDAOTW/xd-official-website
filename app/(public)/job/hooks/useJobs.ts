import { useState, useEffect } from 'react'
import type { JobItem } from '../types'

export function useJobs() {
  const [jobs, setJobs] = useState<JobItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchJobs = async (searchTerm?: string, location?: string) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (searchTerm) params.append('search', searchTerm)
      if (location) params.append('location', location)
      
      const response = await fetch(`/api/jobs?${params}`)
      if (!response.ok) throw new Error('Failed to fetch jobs')
      
      const data = await response.json()
      setJobs(data.jobs || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  return {
    jobs,
    loading,
    refetch: fetchJobs,
  }
}