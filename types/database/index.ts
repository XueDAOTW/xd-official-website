// Database type definitions
// Centralized database schema types for the application

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          // Core fields
          name: string
          email: string
          university: string
          status: 'pending' | 'approved' | 'rejected'
          reviewed_by: string | null
          reviewed_at: string | null
          // Application details
          student_status: string
          major: string
          years_since_graduation: string | null
          telegram_id: string
          motivation: string
          web3_interests: string
          skills_bringing: string
          web3_journey: string
          contribution_areas: string[]
          how_know_us: string[]
          referrer_name: string | null
          last_words: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          // Core fields
          name: string
          email: string
          university: string
          status?: 'pending' | 'approved' | 'rejected'
          reviewed_by?: string | null
          reviewed_at?: string | null
          // Application details
          student_status: string
          major: string
          years_since_graduation?: string | null
          telegram_id: string
          motivation: string
          web3_interests: string
          skills_bringing: string
          web3_journey: string
          contribution_areas: string[]
          how_know_us: string[]
          referrer_name?: string | null
          last_words?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          // Core fields
          name?: string
          email?: string
          university?: string
          status?: 'pending' | 'approved' | 'rejected'
          reviewed_by?: string | null
          reviewed_at?: string | null
          // Application details
          student_status?: string
          major?: string
          years_since_graduation?: string | null
          telegram_id?: string
          motivation?: string
          web3_interests?: string
          skills_bringing?: string
          web3_journey?: string
          contribution_areas?: string[]
          how_know_us?: string[]
          referrer_name?: string | null
          last_words?: string | null
        }
      }
      jobs: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          company: string
          location: string
          type: 'full-time' | 'part-time' | 'contract' | 'internship'
          remote: boolean
          description: string
          requirements: string[]
          benefits: string[]
          salary_min: number | null
          salary_max: number | null
          application_url: string
          contact_email: string
          is_active: boolean
          featured: boolean
          status: 'pending' | 'approved' | 'rejected'
          expires_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          company: string
          location: string
          type: 'full-time' | 'part-time' | 'contract' | 'internship'
          remote?: boolean
          description: string
          requirements: string[]
          benefits?: string[]
          salary_min?: number | null
          salary_max?: number | null
          application_url: string
          contact_email: string
          is_active?: boolean
          featured?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          expires_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          company?: string
          location?: string
          type?: 'full-time' | 'part-time' | 'contract' | 'internship'
          remote?: boolean
          description?: string
          requirements?: string[]
          benefits?: string[]
          salary_min?: number | null
          salary_max?: number | null
          application_url?: string
          contact_email?: string
          is_active?: boolean
          featured?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          expires_at?: string | null
        }
      }
      admin_settings: {
        Row: {
          id: string
          key: string
          value: string
          updated_by: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          updated_by: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          updated_by?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      application_status: 'pending' | 'approved' | 'rejected'
    }
  }
}

// Extracted database table types
export type Application = Database['public']['Tables']['applications']['Row']
export type ApplicationInsert = Database['public']['Tables']['applications']['Insert']
export type ApplicationUpdate = Database['public']['Tables']['applications']['Update']

export type Job = Database['public']['Tables']['jobs']['Row']
export type JobInsert = Database['public']['Tables']['jobs']['Insert']
export type JobUpdate = Database['public']['Tables']['jobs']['Update']

export type AdminSettings = Database['public']['Tables']['admin_settings']['Row']
export type AdminSettingsInsert = Database['public']['Tables']['admin_settings']['Insert']
export type AdminSettingsUpdate = Database['public']['Tables']['admin_settings']['Update']