export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { createRouteSupabaseClient } from '@/lib/supabase/server'

import type { Database } from '@/lib/types/database'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createRouteSupabaseClient()
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '12')

    const { data, error } = await supabase
      .from('applications')
      .select('id, name, university, portfolio_url, instagram_url, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch approved applications' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Public applications fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch approved applications' },
      { status: 500 }
    )
  }
}