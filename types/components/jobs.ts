// Job-related component types
// UI and business logic types for job functionality

import type { AdminItem, Counts, StatusType } from '../api'
import type { Job } from '../database'

// Public job item interface (for job board)
export interface JobItem {
  id: string
  title: string
  company: string
  location: string
  job_type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract'
  job_level: 'Entry' | 'Mid-Level' | 'Senior' | 'Lead' | 'Executive'
  category: 'engineering' | 'aiml' | 'design' | 'bd' | 'marketing' | 'blockchain' | 'data' | 'devops'
  description: string[]
  requirements: string[]
  company_website?: string
  apply_url?: string
  salary_min?: number
  salary_max?: number
  is_remote: boolean
  created_at: string
}

// Admin job interface (extends AdminItem)
export interface AdminJobItem extends AdminItem {
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

// Job filters for search/filtering
export interface JobFilters {
  jobType: {
    fullTime: boolean
    partTime: boolean
    intern: boolean
    freelance: boolean
  }
  jobCategory: {
    engineering: boolean
    aiml: boolean
    design: boolean
    bd: boolean
    marketing: boolean
    blockchain: boolean
    data: boolean
    devops: boolean
  }
  workLocation: {
    onSite: boolean
    hybrid: boolean
    remote: boolean
  }
}

// Job-specific counts
export interface JobCounts extends Omit<Counts, 'total'> {}

// Job status type
export type JobStatus = StatusType