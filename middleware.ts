import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/lib/types/database'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      const redirectUrl = new URL('/api/auth/signin', req.url)
      redirectUrl.searchParams.set('callbackUrl', req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user is admin
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    if (!adminEmails.includes(session.user.email || '')) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*']
}