export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          // Legacy fields (v1)
          email: string | null
          university: string | null
          portfolio_url: string | null
          motivation: string | null
          instagram_url: string | null
          // Common fields
          name: string
          status: 'pending' | 'approved' | 'rejected'
          reviewed_by: string | null
          reviewed_at: string | null
          // New fields (v2)
          student_status: string | null
          school_name: string | null
          major: string | null
          years_since_graduation: string | null
          telegram_id: string | null
          why_join_xuedao: string | null
          web3_interests: string | null
          skills_bringing: string | null
          web3_journey: string | null
          contribution_areas: string[] | null
          how_know_us: string | null
          referrer_name: string | null
          last_words: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          // Legacy fields (v1)
          email?: string | null
          university?: string | null
          portfolio_url?: string | null
          motivation?: string | null
          instagram_url?: string | null
          // Common fields
          name: string
          status?: 'pending' | 'approved' | 'rejected'
          reviewed_by?: string | null
          reviewed_at?: string | null
          // New fields (v2)
          student_status?: string | null
          school_name?: string | null
          major?: string | null
          years_since_graduation?: string | null
          telegram_id?: string | null
          why_join_xuedao?: string | null
          web3_interests?: string | null
          skills_bringing?: string | null
          web3_journey?: string | null
          contribution_areas?: string[] | null
          how_know_us?: string | null
          referrer_name?: string | null
          last_words?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          // Legacy fields (v1)
          email?: string | null
          university?: string | null
          portfolio_url?: string | null
          motivation?: string | null
          instagram_url?: string | null
          // Common fields
          name?: string
          status?: 'pending' | 'approved' | 'rejected'
          reviewed_by?: string | null
          reviewed_at?: string | null
          // New fields (v2)
          student_status?: string | null
          school_name?: string | null
          major?: string | null
          years_since_graduation?: string | null
          telegram_id?: string | null
          why_join_xuedao?: string | null
          web3_interests?: string | null
          skills_bringing?: string | null
          web3_journey?: string | null
          contribution_areas?: string[] | null
          how_know_us?: string | null
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