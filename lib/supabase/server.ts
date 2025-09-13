import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/lib/types/database'

// Enhanced configuration for server client with performance optimizations
const serverClientConfig = {
  db: {
    schema: 'public' as const,
  },
  auth: {
    autoRefreshToken: false, // Disable auto-refresh on server
    persistSession: false,   // No session persistence on server
    detectSessionInUrl: false, // Not needed on server
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-server',
      'Connection': 'keep-alive',
      'Keep-Alive': 'timeout=5, max=1000',
    },
  },
}

export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      ...serverClientConfig,
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export const createRouteSupabaseClient = async () => {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      ...serverClientConfig,
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}

// Service role client for admin operations (bypasses RLS)
export const createServiceRoleClient = () => {
  const { createClient } = require('@supabase/supabase-js')
  
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      db: {
        schema: 'public',
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          'X-Client-Info': 'supabase-js-service-role',
          'Connection': 'keep-alive',
          'Keep-Alive': 'timeout=10, max=1000',
        },
      },
    }
  )
}

export const getUser = async () => {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const isAdmin = async (email?: string) => {
  if (!email) return false
  
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
  return adminEmails.includes(email)
}