import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return NextResponse.json({ 
        isAuthenticated: false, 
        isAdmin: false 
      });
    }

    // Check if user is admin using server-side env variable
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    const isAdmin = adminEmails.includes(session.user.email || '');

    return NextResponse.json({ 
      isAuthenticated: true, 
      isAdmin,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.name
      }
    });

  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json({ 
      isAuthenticated: false, 
      isAdmin: false 
    }, { status: 500 });
  }
}