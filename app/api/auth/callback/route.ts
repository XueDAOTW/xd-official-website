import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/lib/types/database'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const callbackUrl = requestUrl.searchParams.get('callbackUrl') || '/admin'

  if (code) {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(`${requestUrl.origin}?error=auth_failed`)
    }

    // Successfully authenticated, redirect to intended destination
    return NextResponse.redirect(`${requestUrl.origin}${callbackUrl}`)
  }

  // No code provided, redirect to home with error
  return NextResponse.redirect(`${requestUrl.origin}?error=no_code`)
}