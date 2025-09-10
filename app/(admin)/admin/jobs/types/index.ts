import type { AdminItem, Counts, StatusType } from '@/lib/types/shared'

export interface JobItem extends AdminItem {
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
  updated_at?: string
}

export interface JobCounts extends Omit<Counts, 'total'> {}

export type JobStatus = StatusType