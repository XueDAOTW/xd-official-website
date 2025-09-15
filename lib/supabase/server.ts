import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

// Validate environment variables on module load
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables')
}

if (!supabaseServiceKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY is not set. Admin operations may fail.')
}

export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()
  
  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Enhanced security for auth cookies
              const secureOptions = {
                ...options,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax' as const,
                path: '/'
              }
              cookieStore.set(name, value, secureOptions)
            })
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      auth: {
        persistSession: false, // Don't persist on server
        autoRefreshToken: false, // Handle manually in middleware
        detectSessionInUrl: false // Not needed on server
      },
      global: {
        headers: {
          'X-Client-Info': 'xuedao-server-client'
        }
      }
    }
  )
}

export const createRouteSupabaseClient = async () => {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const secureOptions = {
              ...options,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax' as const,
              path: '/'
            }
            cookieStore.set(name, value, secureOptions)
          })
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  )
}

// Secure service role client for admin operations
export const createServiceRoleClient = () => {
  if (!supabaseServiceKey) {
    throw new Error('Service role key is required for admin operations')
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        'X-Client-Info': 'xuedao-service-client'
      }
    }
  })
}

export const getUser = async () => {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting user:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Error in getUser:', error)
    return null
  }
}

export const getSession = async () => {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error getting session:', error)
      return null
    }
    
    return session
  } catch (error) {
    console.error('Error in getSession:', error)
    return null
  }
}

export const isAdmin = async (email?: string): Promise<boolean> => {
  if (!email) return false
  
  try {
    // Sanitize email input
    const sanitizedEmail = email.trim().toLowerCase()
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitizedEmail)) return false
    
    const adminEmails = process.env.ADMIN_EMAILS?.split(',')
      .map(e => e.trim().toLowerCase()) || []
    
    return adminEmails.includes(sanitizedEmail)
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

// Enhanced admin validation with additional security checks
export const validateAdminAccess = async (): Promise<{
  isValid: boolean
  user: any | null
  error?: string
}> => {
  try {
    const user = await getUser()
    
    if (!user || !user.email) {
      return { isValid: false, user: null, error: 'No authenticated user' }
    }

    // Check if email is verified
    if (!user.email_confirmed_at) {
      return { isValid: false, user: null, error: 'Email not verified' }
    }

    const userIsAdmin = await isAdmin(user.email)
    
    if (!userIsAdmin) {
      // Log unauthorized access attempt
      console.warn(`Unauthorized admin access attempt: ${user.email}`)
      return { isValid: false, user: null, error: 'Insufficient permissions' }
    }

    return { isValid: true, user }
  } catch (error) {
    console.error('Error validating admin access:', error)
    return { isValid: false, user: null, error: 'Validation error' }
  }
}