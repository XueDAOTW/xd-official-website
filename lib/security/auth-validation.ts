import { NextRequest } from 'next/server'
import type { User } from '@supabase/supabase-js'
import { createServerSupabaseClient, isAdmin } from '@/lib/supabase/server'

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

interface AuthResult {
  success: boolean
  user?: User
  isAdmin?: boolean
  error?: string
  statusCode?: number
}

export class AuthValidator {
  // Rate limiting configuration
  private static readonly RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
  private static readonly MAX_ATTEMPTS = 100 // per window
  private static readonly ADMIN_MAX_ATTEMPTS = 1000 // higher limit for admin operations

  // Validate environment variables
  static validateEnvVars(): { valid: boolean; missing: string[] } {
    const required = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'ADMIN_EMAILS'
    ]
    
    const missing = required.filter(env => !process.env[env])
    return { valid: missing.length === 0, missing }
  }

  // Rate limiting
  static checkRateLimit(ip: string, isAdminOperation = false): boolean {
    const key = `rate_limit:${ip}`
    const now = Date.now()
    const limit = isAdminOperation ? this.ADMIN_MAX_ATTEMPTS : this.MAX_ATTEMPTS
    
    const record = rateLimitStore.get(key)
    
    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + this.RATE_LIMIT_WINDOW })
      return true
    }
    
    if (record.count >= limit) {
      return false
    }
    
    record.count++
    return true
  }

  // Secure session validation
  static async validateSession(request?: NextRequest): Promise<AuthResult> {
    try {
      // Check rate limiting if request is provided
      if (request) {
        const ip = this.getClientIP(request)
        if (!this.checkRateLimit(ip)) {
          return {
            success: false,
            error: 'Rate limit exceeded',
            statusCode: 429
          }
        }
      }

      const supabase = await createServerSupabaseClient()
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Session validation error:', error)
        return {
          success: false,
          error: 'Authentication failed',
          statusCode: 401
        }
      }
      
      if (!session || !session.user) {
        return {
          success: false,
          error: 'No active session',
          statusCode: 401
        }
      }

      // Validate session expiry
      if (session.expires_at && session.expires_at * 1000 < Date.now()) {
        return {
          success: false,
          error: 'Session expired',
          statusCode: 401
        }
      }

      return {
        success: true,
        user: session.user
      }
    } catch (error) {
      console.error('Session validation error:', error)
      return {
        success: false,
        error: 'Internal authentication error',
        statusCode: 500
      }
    }
  }

  // Enhanced admin validation
  static async validateAdmin(request?: NextRequest): Promise<AuthResult> {
    const sessionResult = await this.validateSession(request)
    
    if (!sessionResult.success || !sessionResult.user) {
      return sessionResult
    }

    try {
      // Additional rate limiting for admin operations
      if (request) {
        const ip = this.getClientIP(request)
        if (!this.checkRateLimit(ip, true)) {
          return {
            success: false,
            error: 'Admin rate limit exceeded',
            statusCode: 429
          }
        }
      }

      const userIsAdmin = await isAdmin(sessionResult.user.email)
      
      if (!userIsAdmin) {
        // Log unauthorized admin access attempts
        console.warn(`Unauthorized admin access attempt from user: ${sessionResult.user.email}`)
        
        return {
          success: false,
          error: 'Insufficient permissions',
          statusCode: 403
        }
      }

      return {
        success: true,
        user: sessionResult.user,
        isAdmin: true
      }
    } catch (error) {
      console.error('Admin validation error:', error)
      return {
        success: false,
        error: 'Admin validation failed',
        statusCode: 500
      }
    }
  }

  // Secure admin email validation
  static validateAdminEmail(email: string | undefined): boolean {
    if (!email) return false
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return false
    
    // Check against admin email list
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || []
    return adminEmails.includes(email.toLowerCase())
  }

  // Extract client IP securely
  static getClientIP(request: NextRequest): string {
    // Check various headers for IP (in order of preference)
    const headers = [
      'x-forwarded-for',
      'x-real-ip',
      'cf-connecting-ip', // Cloudflare
      'x-client-ip',
      'x-forwarded',
      'forwarded-for',
      'forwarded'
    ]
    
    for (const header of headers) {
      const value = request.headers.get(header)
      if (value) {
        // Take the first IP if comma-separated
        const ip = value.split(',')[0].trim()
        if (this.isValidIP(ip)) {
          return ip
        }
      }
    }
    
    // Fallback to a default IP
    return '127.0.0.1'
  }

  // IP validation
  private static isValidIP(ip: string): boolean {
    // Basic IP validation (IPv4 and IPv6)
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip)
  }

  // Security headers validation
  static validateSecurityHeaders(request: NextRequest): boolean {
    const requiredHeaders = [
      'user-agent',
      'accept'
    ]
    
    return requiredHeaders.every(header => request.headers.has(header))
  }

  // Clean up rate limit store (call periodically)
  static cleanupRateLimit(): void {
    const now = Date.now()
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }
}

// Middleware helper for admin routes
export async function requireAdmin(request: NextRequest) {
  const validation = await AuthValidator.validateAdmin(request)
  
  if (!validation.success) {
    return new Response(JSON.stringify({ 
      error: validation.error || 'Authentication required' 
    }), {
      status: validation.statusCode || 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  return null // Success, continue with request
}

// Middleware helper for authenticated routes
export async function requireAuth(request: NextRequest) {
  const validation = await AuthValidator.validateSession(request)
  
  if (!validation.success) {
    return new Response(JSON.stringify({ 
      error: validation.error || 'Authentication required' 
    }), {
      status: validation.statusCode || 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  return null // Success, continue with request
}

export default AuthValidator