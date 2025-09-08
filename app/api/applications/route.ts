import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { combinedApplicationSchema, legacyApplicationSchema, applicationSchema, type LegacyApplicationFormData, type ApplicationFormData } from '@/lib/validations/application'
import type { Database } from '@/lib/types/database'
import { sendMail } from '@/lib/utils/mailer'
import { applicationReceivedHtml, applicationReceivedText } from '@/lib/emails/application-received'
import { adminApplicationNotificationHtml, adminApplicationNotificationText } from '@/lib/emails/admin-application-notification'

function isLegacyApplication(data: any): data is LegacyApplicationFormData {
  return 'email' in data && 'university' in data
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = combinedApplicationSchema.parse(body)

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

    const isLegacy = isLegacyApplication(validatedData)
    
    // Check for duplicates based on the application type
    if (isLegacy) {
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
    } else {
      // For new applications, check by telegram_id or name+school combination
      const { data: existingApplication } = await supabase
        .from('applications')
        .select('id')
        .or(`telegram_id.eq.${validatedData.telegram_id},and(name.eq.${validatedData.name},school_name.eq.${validatedData.school_name})`)
        .single()

      if (existingApplication) {
        return NextResponse.json(
          { error: 'An application with this information already exists' },
          { status: 400 }
        )
      }
    }

    // Prepare data for database insertion
    let insertData: any = {
      name: validatedData.name,
      status: 'pending',
    }

    if (isLegacy) {
      // Legacy application data
      insertData = {
        ...insertData,
        email: validatedData.email,
        university: validatedData.university,
        portfolio_url: validatedData.portfolio_url || null,
        motivation: validatedData.motivation,
        instagram_url: validatedData.instagram_url || null,
      }
    } else {
      // New application data
      insertData = {
        ...insertData,
        student_status: validatedData.student_status,
        school_name: validatedData.school_name,
        major: validatedData.major,
        years_since_graduation: validatedData.years_since_graduation || null,
        telegram_id: validatedData.telegram_id,
        why_join_xuedao: validatedData.why_join_xuedao,
        web3_interests: validatedData.web3_interests,
        skills_bringing: validatedData.skills_bringing,
        web3_journey: validatedData.web3_journey,
        contribution_areas: validatedData.contribution_areas,
        how_know_us: validatedData.how_know_us,
        referrer_name: validatedData.referrer_name || null,
        last_words: validatedData.last_words || null,
      }
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

    // Send confirmation email (only for legacy applications that have email)
    if (isLegacy) {
      try {
        await sendMail({
          to: validatedData.email,
          subject: 'We received your application - XueDAO',
          text: applicationReceivedText({ name: validatedData.name, university: validatedData.university }),
          html: applicationReceivedHtml({ name: validatedData.name, university: validatedData.university }),
        })
      } catch (emailError) {
        console.error('Email error (applicant):', emailError)
        // Don't fail the request if email fails
      }

      // Send notification email to admins for legacy applications
      try {
        const adminEmails = (process.env.ADMIN_EMAILS || '')
          .split(',')
          .map((e) => e.trim())
          .filter(Boolean)

        if (adminEmails.length > 0) {
          for (const adminEmail of adminEmails) {
            await sendMail({
              to: adminEmail,
              subject: 'New application submitted - XueDAO',
              text: adminApplicationNotificationText({
                name: validatedData.name,
                email: validatedData.email,
                university: validatedData.university,
              }),
              html: adminApplicationNotificationHtml({
                name: validatedData.name,
                email: validatedData.email,
                university: validatedData.university,
              }),
            })
          }
        }
      } catch (adminEmailError) {
        console.error('Email error (admin notification):', adminEmailError)
        // Do not fail the request if admin notification fails
      }
    } else {
      // For new applications, send admin notification via Telegram or other means
      // This could be implemented later based on requirements
      console.log('New format application received:', { name: validatedData.name, telegram_id: validatedData.telegram_id })
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