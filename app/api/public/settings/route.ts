export const dynamic = 'force-dynamic'

import { createRouteSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/lib/types/database'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createRouteSupabaseClient()
    
    const { data, error } = await supabase
      .from('admin_settings')
      .select('key, value')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      )
    }

    // Convert to key-value object for easier use
    const settings: Record<string, string> = {}
    data.forEach(setting => {
      settings[setting.key] = setting.value
    })

    return NextResponse.json({ data: settings })
  } catch (error) {
    console.error('Public settings fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}