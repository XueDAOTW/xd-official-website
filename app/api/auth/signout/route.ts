import { NextRequest, NextResponse } from 'next/server'
import { createRouteSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const supabase = await createRouteSupabaseClient()

  await supabase.auth.signOut()

  return NextResponse.redirect(`${requestUrl.origin}/`)
}

export async function GET(request: NextRequest) {
  return POST(request)
}