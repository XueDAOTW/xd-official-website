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