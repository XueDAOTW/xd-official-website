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