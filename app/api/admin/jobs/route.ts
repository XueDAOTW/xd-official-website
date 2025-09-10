import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'

// Middleware to check if user is admin
async function checkAdminAuth() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
  if (!adminEmails.includes(user.email || '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return null
}

function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  )
}

export async function GET(request: Request) {
  const authError = await checkAdminAuth()
  if (authError) return authError

  try {
    const supabase = createServiceClient()
    const { searchParams } = new URL(request.url)
    const aggregate = searchParams.get('aggregate')

    if (aggregate === 'counts') {
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'rejected'),
      ])
      return NextResponse.json({
        counts: {
          pending: pendingRes.count || 0,
          approved: approvedRes.count || 0,
          rejected: rejectedRes.count || 0,
        },
      })
    }

    // Always fetch all jobs, filter on client side to avoid excessive API calls
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching jobs for admin:', error)
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
    }

    return NextResponse.json({ jobs: jobs || [] })
  } catch (error) {
    console.error('Error in admin jobs API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const authError = await checkAdminAuth()
  if (authError) return authError

  try {
    const supabase = createServiceClient()
    const serverSupabase = await createServerSupabaseClient()
    const { data: { user } } = await serverSupabase.auth.getUser()
    const body = await request.json()

    const { jobId, status, ...updateFields } = body

    if (!jobId || !status) {
      return NextResponse.json({ error: 'Missing jobId or status' }, { status: 400 })
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const { data: job, error } = await supabase
      .from('jobs')
      .update({
        status,
        reviewed_by: user?.email || null,
        reviewed_at: new Date().toISOString(),
        ...updateFields,
      })
      .eq('id', jobId)
      .select()
      .single()

    if (error) {
      console.error('Error updating job:', error)
      return NextResponse.json({ error: 'Failed to update job' }, { status: 500 })
    }

    return NextResponse.json({ job, message: `Job ${status} successfully` })
  } catch (error) {
    console.error('Error in admin jobs PATCH API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const authError = await checkAdminAuth()
  if (authError) return authError

  try {
    const supabase = createServiceClient()
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')

    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId' }, { status: 400 })
    }

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId)

    if (error) {
      console.error('Error deleting job:', error)
      return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Job deleted successfully' })
  } catch (error) {
    console.error('Error in admin jobs DELETE API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}