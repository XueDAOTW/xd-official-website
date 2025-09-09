import type { JobStatus } from '../types'

export const getStatusVariant = (status: JobStatus) => {
  switch (status) {
    case 'pending':
      return {
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Pending'
      }
    case 'approved':
      return {
        className: 'bg-green-100 text-green-800 border-green-200',
        label: 'Approved'
      }
    case 'rejected':
      return {
        className: 'bg-red-100 text-red-800 border-red-200',
        label: 'Rejected'
      }
    default:
      return {
        className: 'border-gray-200 text-gray-700',
        label: status
      }
  }
}

export const generateCompanyLogo = (company: string) => {
  const initial = company.charAt(0).toUpperCase()
  const colors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-purple-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-gray-500'
  ]
  const colorIndex = company.charCodeAt(0) % colors.length
  return {
    initial,
    colorClass: colors[colorIndex]
  }
}

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