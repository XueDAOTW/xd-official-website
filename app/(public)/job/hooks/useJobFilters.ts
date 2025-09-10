import { useState } from 'react'
import type { JobFilters, JobItem } from '../types'

const defaultFilters: JobFilters = {
  jobType: {
    fullTime: true,
    partTime: true,
    intern: false,
    freelance: false
  },
  jobCategory: {
    engineering: true,
    aiml: true,
    design: true,
    bd: true,
    marketing: true,
    blockchain: true,
    data: true,
    devops: true
  },
  workLocation: {
    onSite: true,
    hybrid: false,
    remote: false
  }
}

export function useJobFilters() {
  const [selectedFilters, setSelectedFilters] = useState<JobFilters>(defaultFilters)

  const handleFilterChange = (category: keyof JobFilters, filter: string, checked: boolean) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [filter]: checked
      }
    }))
  }

  const filterJobs = (jobs: JobItem[]): JobItem[] => {
    return jobs.filter(job => {
      // Job type filter
      const jobTypeMatch = (
        (selectedFilters.jobType.fullTime && job.job_type === 'Full-time') ||
        (selectedFilters.jobType.partTime && job.job_type === 'Part-time') ||
        (selectedFilters.jobType.intern && job.job_type === 'Internship') ||
        (selectedFilters.jobType.freelance && job.job_type === 'Contract')
      )
      
      const hasJobTypeSelected = Object.values(selectedFilters.jobType).some(Boolean)
      if (!hasJobTypeSelected || !jobTypeMatch) return false

      // Category filter
      const categoryKey = job.category as keyof typeof selectedFilters.jobCategory
      if (!selectedFilters.jobCategory[categoryKey]) return false

      // Location filter
      const locationMatch = (
        (selectedFilters.workLocation.onSite && !job.is_remote) ||
        (selectedFilters.workLocation.remote && job.is_remote) ||
        (selectedFilters.workLocation.hybrid)
      )
      
      const hasLocationSelected = Object.values(selectedFilters.workLocation).some(Boolean)
      if (!hasLocationSelected || !locationMatch) return false

      return true
    })
  }

  return {
    selectedFilters,
    handleFilterChange,
    filterJobs,
  }
}