export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          name: string
          university: string
          portfolio_url: string | null
          motivation: string
          instagram_url: string | null
          status: 'pending' | 'approved' | 'rejected'
          reviewed_by: string | null
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          name: string
          university: string
          portfolio_url?: string | null
          motivation: string
          instagram_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          reviewed_by?: string | null
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          name?: string
          university?: string
          portfolio_url?: string | null
          motivation?: string
          instagram_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          reviewed_by?: string | null
          reviewed_at?: string | null
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