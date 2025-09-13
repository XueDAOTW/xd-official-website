import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

import { EmailService } from '@/lib/email/service'
import { createRouteSupabaseClient } from '@/lib/supabase/server'
import { reviewApplicationSchema } from '@/lib/validations/application'

import type { Database } from '@/lib/types/database'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authSupabase = await createRouteSupabaseClient()
    
    // Check if user is admin
    const { data: { user } } = await authSupabase.auth.getUser()
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    
    if (!user || !adminEmails.includes(user.email || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = reviewApplicationSchema.parse({
      ...body,
      reviewed_by: user.email,
    })

    // Use service role client for admin operations
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { data, error } = await supabase
      .from('applications')
      .update({
        status: validatedData.status,
        reviewed_by: validatedData.reviewed_by,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update application' },
        { status: 500 }
      )
    }

    // Send email notification based on status
    try {
      if (validatedData.status === 'approved') {
        await EmailService.sendApplicationApproval(
          data.name,
          data.email,
          data.telegram_id
        )
      } else if (validatedData.status === 'rejected') {
        await EmailService.sendApplicationRejection(
          data.name,
          data.email
        )
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail the entire request if email fails
      // The status update was successful
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Application update error:', error)
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authSupabase = await createRouteSupabaseClient()
    
    // Check if user is admin
    const { data: { user } } = await authSupabase.auth.getUser()
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    
    if (!user || !adminEmails.includes(user.email || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use service role client for admin operations
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to delete application' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Application deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    )
  }
}