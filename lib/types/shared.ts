// Shared type definitions for admin interfaces

// Common status types
export type StatusType = 'pending' | 'approved' | 'rejected' | 'active' | 'inactive' | 'draft'

// Generic counts interface
export interface Counts {
  total?: number
  pending: number
  approved: number
  rejected: number
}

// Status with 'all' option for filtering
export type StatusWithAll = StatusType | 'all'

// Common error response format
export interface ApiError {
  message: string
  code?: string
  details?: any
}

// Common API response format
export interface ApiResponse<T = any> {
  data?: T
  meta?: {
    total: number
    page?: number
    limit?: number
  }
  error?: ApiError
}

// Form validation error type
export interface FormErrors {
  [key: string]: {
    message: string
    type?: string
  }
}

// Generic admin item interface
export interface AdminItem {
  id: string
  status: StatusType
  created_at: string
  updated_at?: string
  reviewed_by?: string
  reviewed_at?: string
}

// Pagination options
export interface PaginationOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}