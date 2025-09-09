export interface JobItem {
  id: string
  title: string
  company: string
  location: string
  job_type: string
  job_level: string
  category: string
  description: string[]
  requirements: string[]
  company_email: string
  company_website?: string
  apply_url?: string
  salary_min?: number
  salary_max?: number
  is_remote: boolean
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  reviewed_by?: string
  reviewed_at?: string
}

export interface JobCounts {
  pending: number
  approved: number
  rejected: number
}

export type JobStatus = 'pending' | 'approved' | 'rejected'