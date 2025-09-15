import { NextRequest, NextResponse } from 'next/server'
import { validateAdminAccess } from '@/lib/supabase/server'
import { AuthValidator } from '@/lib/security/auth-validation'

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const envCheck = AuthValidator.validateEnvVars()
    if (!envCheck.valid) {
      console.error('Missing required environment variables:', envCheck.missing)
      return NextResponse.json({ 
        isAdmin: false, 
        error: 'Configuration error' 
      }, { status: 500 })
    }

    // Rate limiting
    const ip = AuthValidator.getClientIP(request)
    if (!AuthValidator.checkRateLimit(ip, true)) {
      return NextResponse.json({ 
        isAdmin: false, 
        error: 'Rate limit exceeded' 
      }, { status: 429 })
    }

    // Validate security headers
    if (!AuthValidator.validateSecurityHeaders(request)) {
      return NextResponse.json({ 
        isAdmin: false, 
        error: 'Invalid request headers' 
      }, { status: 400 })
    }

    // Enhanced admin validation
    const validation = await validateAdminAccess()
    
    if (!validation.isValid) {
      return NextResponse.json({ 
        isAdmin: false,
        error: validation.error || 'Access denied'
      }, { 
        status: validation.error === 'No authenticated user' ? 401 : 403 
      })
    }

    // Success - return admin status with minimal user info
    return NextResponse.json({ 
      isAdmin: true,
      user: {
        id: validation.user.id,
        email: validation.user.email,
        emailVerified: !!validation.user.email_confirmed_at
      }
    })
    
  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json({ 
      isAdmin: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}