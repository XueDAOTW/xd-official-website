import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch {
  throw new Error('Invalid Supabase URL format')
}

export const createSupabaseClient = () => {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Enhanced security settings
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce', // Use PKCE flow for better security
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'sb-auth-token',
      debug: process.env.NODE_ENV === 'development'
    },
    global: {
      headers: {
        'X-Client-Info': 'xuedao-web-client'
      }
    },
    db: {
      schema: 'public'
    },
    realtime: {
      // Disable realtime for security unless specifically needed
      params: {
        eventsPerSecond: 2
      }
    }
  })
}

// Singleton instance with proper error handling
let clientInstance: ReturnType<typeof createSupabaseClient> | null = null

export const getSupabaseClient = () => {
  if (!clientInstance) {
    clientInstance = createSupabaseClient()
  }
  return clientInstance
}

// Legacy export for backward compatibility
export const supabase = getSupabaseClient()