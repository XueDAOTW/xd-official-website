import { NextRequest, NextResponse } from 'next/server'
import { createRouteSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const authSupabase = await createRouteSupabaseClient()
    
    // Check if user is admin
    const { data: { user } } = await authSupabase.auth.getUser()
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    
    if (!user || !adminEmails.includes(user.email || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use service role client for admin operations
    const supabase = createServiceRoleClient()

    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .order('key')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authSupabase = await createRouteSupabaseClient()
    
    // Check if user is admin
    const { data: { user } } = await authSupabase.auth.getUser()
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    
    if (!user || !adminEmails.includes(user.email || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { key, value } = body

    if (!key || value === undefined || value === null) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      )
    }

    // Use service role client for admin operations
    const supabase = createServiceRoleClient()

    // Upsert the setting
    const { data, error } = await supabase
      .from('admin_settings')
      .upsert(
        {
          key,
          value: String(value), // Ensure value is string
          updated_by: user.email!,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      )
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update setting' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json(
      { error: 'Failed to update setting' },
      { status: 500 }
    )
  }
}