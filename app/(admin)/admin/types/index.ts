import type { Database } from '@/lib/types/database'
import type { Counts, StatusWithAll } from '@/lib/types/shared'

export type Application = Database['public']['Tables']['applications']['Row']

export interface AppCounts extends Counts {
  total: number
}

export type ApplicationStatus = StatusWithAll