// Application-related component types
// UI and business logic types for application functionality

import type { Counts, StatusWithAll } from '../api'
import type { Application } from '../database'

// Application type (re-exported from database)
export type ApplicationItem = Application

// Application-specific counts  
export interface AppCounts extends Counts {
  total: number
}

// Application status type
export type ApplicationStatus = StatusWithAll