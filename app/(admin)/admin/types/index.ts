import type { Database } from '@/lib/types/database'

export type Application = Database['public']['Tables']['applications']['Row']

export type AppCounts = { 
  total: number
  pending: number
  approved: number
  rejected: number 
}

export type ApplicationStatus = 'all' | 'pending' | 'approved' | 'rejected'