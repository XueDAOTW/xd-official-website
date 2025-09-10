import { NextRequest, NextResponse } from 'next/server'
import { getURL } from '@/lib/utils/env'
import { createRouteSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const callbackUrl = requestUrl.searchParams.get('callbackUrl') || '/admin'
  const baseUrl = getURL()
  
  const supabase = await createRouteSupabaseClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${baseUrl}api/auth/callback`,
      queryParams: {
        callbackUrl: callbackUrl
      }
    },
  })

  if (error) {
    console.error('Auth error:', error)
    return NextResponse.redirect(`${baseUrl}?error=auth_failed`)
  }

  return NextResponse.redirect(data.url)
}

export async function POST(request: NextRequest) {
  return GET(request)
}