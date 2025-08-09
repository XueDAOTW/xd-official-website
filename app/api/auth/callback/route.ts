import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/lib/types/database'
import { getURL } from '@/lib/utils/env'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const baseUrl = getURL()
  const code = requestUrl.searchParams.get('code')
  const callbackUrl = requestUrl.searchParams.get('callbackUrl') || '/admin'

  if (code) {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(`${baseUrl}?error=auth_failed`)
    }

    // Successfully authenticated, redirect to intended destination
    return NextResponse.redirect(`${baseUrl}${callbackUrl.replace(/^\//, '')}`)
  }

  // No code provided, redirect to home with error
  return NextResponse.redirect(`${baseUrl}?error=no_code`)
}