import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createServerSupabaseClient = () => {
  return createServerComponentClient({ cookies })
}

export const getUser = async () => {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const isAdmin = async (email?: string) => {
  if (!email) return false
  
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
  return adminEmails.includes(email)
}