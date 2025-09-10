import { createClient } from '@supabase/supabase-js'
import { createRouteSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { applicationSchema } from '@/lib/validations/application'
import type { Database } from '@/lib/types/database'
import { EmailService } from '@/lib/email/service'

// Remove legacy application detection since we're using the new schema

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

    // Check for duplicates by email, telegram_id, or name+school combination
    const { data: existingApplication } = await supabase
      .from('applications')
      .select('id')
      .or(`email.eq.${validatedData.email},telegram_id.eq.${validatedData.telegram_id},and(name.eq.${validatedData.name},university.eq.${validatedData.university})`)
      .single()

    if (existingApplication) {
      return NextResponse.json(
        { error: 'An application with this email, telegram ID, or personal information already exists' },
        { status: 400 }
      )
    }

    // Prepare data for database insertion
    const insertData = {
      name: validatedData.name,
      email: validatedData.email,
      student_status: validatedData.student_status,
      university: validatedData.university,
      major: validatedData.major,
      years_since_graduation: validatedData.years_since_graduation || null,
      telegram_id: validatedData.telegram_id,
      motivation: validatedData.motivation,
      web3_interests: validatedData.web3_interests,
      skills_bringing: validatedData.skills_bringing,
      web3_journey: validatedData.web3_journey,
      contribution_areas: validatedData.contribution_areas,
      how_know_us: validatedData.how_know_us,
      referrer_name: validatedData.referrer_name || null,
      last_words: validatedData.last_words || null,
      status: 'pending',
    }

    // Insert new application
    const { data, error } = await supabase
      .from('applications')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to submit application' },
        { status: 500 }
      )
    }

    // Send confirmation email with admin notification
    try {
      await EmailService.sendApplicationConfirmationWithNotification({
        name: validatedData.name,
        email: validatedData.email,
        university: validatedData.university,
        major: validatedData.major,
        telegram_id: validatedData.telegram_id,
        student_status: validatedData.student_status,
        years_since_graduation: validatedData.years_since_graduation ? Number(validatedData.years_since_graduation) : null,
        contribution_areas: validatedData.contribution_areas,
        how_know_us: validatedData.how_know_us,
        motivation: validatedData.motivation,
        web3_interests: validatedData.web3_interests,
        skills_bringing: validatedData.skills_bringing,
        web3_journey: validatedData.web3_journey,
        referrer_name: validatedData.referrer_name,
        last_words: validatedData.last_words,
      })
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
  const authSupabase = await createRouteSupabaseClient()
  
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
  const aggregate = searchParams.get('aggregate')
  
  // Handle counts aggregation request
  if (aggregate === 'counts') {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('status')
      
      if (error) {
        console.error('Failed to fetch application counts:', error)
        return NextResponse.json({ error: 'Failed to fetch counts' }, { status: 500 })
      }

      // Calculate counts from the data
      const counts = data.reduce((acc: any, app: any) => {
        acc.total = (acc.total || 0) + 1
        acc[app.status] = (acc[app.status] || 0) + 1
        return acc
      }, { total: 0, pending: 0, approved: 0, rejected: 0 })

      return NextResponse.json({ counts })
    } catch (error) {
      console.error('Counts aggregation error:', error)
      return NextResponse.json({ error: 'Failed to calculate counts' }, { status: 500 })
    }
  }

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

  // Calculate counts for all applications when fetching without status filter
  let counts = null
  if (!status) {
    try {
      const { data: allData } = await supabase
        .from('applications')
        .select('status')
      
      if (allData) {
        counts = allData.reduce((acc: any, app: any) => {
          acc.total = (acc.total || 0) + 1
          acc[app.status] = (acc[app.status] || 0) + 1
          return acc
        }, { total: 0, pending: 0, approved: 0, rejected: 0 })
      }
    } catch (error) {
      console.error('Failed to calculate counts:', error)
    }
  }

  return NextResponse.json({
    data,
    counts, // Include counts when available
    meta: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  })
}