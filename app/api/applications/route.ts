import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { applicationSchema } from '@/lib/validations/application'
import type { Database } from '@/lib/types/database'
import emailjs from 'emailjs-com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = applicationSchema.parse(body)

    // Use service role client for public submissions to bypass RLS
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

    // Check if email already exists
    const { data: existingApplication } = await supabase
      .from('applications')
      .select('id')
      .eq('email', validatedData.email)
      .single()

    if (existingApplication) {
      return NextResponse.json(
        { error: 'An application with this email already exists' },
        { status: 400 }
      )
    }

    // Insert new application
    const { data, error } = await supabase
      .from('applications')
      .insert({
        ...validatedData,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to submit application' },
        { status: 500 }
      )
    }

    // Send confirmation email
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_email: validatedData.email,
          to_name: validatedData.name,
          university: validatedData.university,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
    } catch (emailError) {
      console.error('Email error:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Application submission error:', error)
    return NextResponse.json(
      { error: 'Invalid application data' },
      { status: 400 }
    )
  }
}

export async function GET(request: NextRequest) {
  const authSupabase = createRouteHandlerClient<Database>({ cookies })
  
  // Check if user is admin
  const { data: { user } } = await authSupabase.auth.getUser()
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
  
  if (!user || !adminEmails.includes(user.email || '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Use service role client to bypass RLS for admin operations
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

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const offset = (page - 1) * limit

  let query = supabase
    .from('applications')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Admin applications fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }

  return NextResponse.json({
    data,
    meta: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  })
}