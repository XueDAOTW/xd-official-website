import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    // Use service role client for public settings access
    const supabase = createServiceRoleClient()

    const { data, error } = await supabase
      .from('admin_settings')
      .select('key, value')
      .order('key')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      )
    }

    // Transform the data into a more usable format for the frontend
    const settings = data.reduce((acc, { key, value }) => {
      acc[key] = value
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Public settings fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}