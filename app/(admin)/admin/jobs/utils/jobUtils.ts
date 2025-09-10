

import type { JobStatus } from '../types'

export const formatJobDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatSalaryRange = (min?: number, max?: number) => {
  if (!min || !max) return null
  return `$${min.toLocaleString()} - $${max.toLocaleString()}`
}

export const getTabTitle = (status: JobStatus) => {
  switch (status) {
    case 'pending': return 'Pending Jobs'
    case 'approved': return 'Approved Jobs' 
    case 'rejected': return 'Rejected Jobs'
    default: return 'Jobs'
  }
}