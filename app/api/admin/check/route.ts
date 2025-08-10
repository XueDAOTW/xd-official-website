import { NextResponse } from 'next/server'
import { getUser, isAdmin } from '@/lib/supabase/server'

export async function GET() {
  try {
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({ isAdmin: false })
    }

    const userIsAdmin = await isAdmin(user.email)
    
    return NextResponse.json({ isAdmin: userIsAdmin })
  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json({ isAdmin: false })
  }
}