import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    
    const category = searchParams.get('category')
    const jobType = searchParams.get('jobType')
    const location = searchParams.get('location')
    const search = searchParams.get('search')
    
    let query = supabase
      .from('public_jobs')
      .select('*')

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    
    if (jobType && jobType !== 'all') {
      query = query.eq('job_type', jobType)
    }
    
    if (location) {
      query = query.ilike('location', `%${location}%`)
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,company.ilike.%${search}%,description.cs.{${search}}`)
    }

    const { data: jobs, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching jobs:', error)
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
    }

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('Error in jobs API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Use service role client for creating jobs to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
    const body = await request.json()

    const {
      title,
      company,
      location,
      job_type,
      job_level,
      category,
      description,
      requirements,
      company_email,
      company_website,
      apply_url,
      salary_min,
      salary_max,
      is_remote,
      expires_at,
    } = body

    // Validate required fields
    if (
      !title ||
      !company ||
      !location ||
      !job_type ||
      !job_level ||
      !category ||
      !description ||
      !requirements ||
      !company_email
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: job, error } = await supabase
      .from('jobs')
      .insert([
        {
          title,
          company,
          location,
          job_type,
          job_level,
          category,
          description: Array.isArray(description) ? description : [description],
          requirements: Array.isArray(requirements) ? requirements : [requirements],
          company_email,
          company_website,
          apply_url,
          salary_min,
          salary_max,
          is_remote: is_remote || false,
          expires_at: expires_at ? new Date(expires_at).toISOString() : null,
          status: 'pending',
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating job:', error)
      return NextResponse.json({ error: 'Failed to create job posting' }, { status: 500 })
    }

    return NextResponse.json({ job, message: 'Job posting submitted for review' }, { status: 201 })
  } catch (error) {
    console.error('Error in jobs POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}