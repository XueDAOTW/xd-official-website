import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/lib/types/database';
import { rateLimiters } from '@/lib/security/rate-limiter';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Apply rate limiting based on route patterns
  let rateLimitResult: { allowed: boolean; remaining: number; resetTime: number; message?: string } | null = null;
  
  if (req.nextUrl.pathname.startsWith('/api/')) {
    // Different rate limits for different API endpoints
    if (req.nextUrl.pathname.includes('/auth/') || req.nextUrl.pathname.includes('/signin')) {
      rateLimitResult = await rateLimiters.auth.check(req);
    } else if (req.nextUrl.pathname.includes('/applications') && req.method === 'POST') {
      rateLimitResult = await rateLimiters.forms.check(req);
    } else if (req.nextUrl.pathname.startsWith('/api/admin/')) {
      rateLimitResult = await rateLimiters.strict.check(req);
    } else {
      rateLimitResult = await rateLimiters.api.check(req);
    }

    // Return early if rate limited
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({
          error: rateLimitResult.message,
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': '100', // Default rate limit
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            // Security headers
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          },
        }
      );
    }
  }

  // CORS handling for API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' ? '*' : 'https://xuedao.org',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Add CORS headers to API responses
    res.headers.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'development' ? '*' : 'https://xuedao.org');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  }

  // Security headers for all responses
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Add Content Security Policy for enhanced security
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
    "img-src 'self' blob: data: https: http:",
    "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ');
  
  res.headers.set('Content-Security-Policy', cspHeader);

  // Supabase authentication and admin route protection
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      const redirectUrl = new URL('/api/auth/signin', req.url);
      redirectUrl.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Check if user is admin
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    if (!adminEmails.includes(session.user.email || '')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Add rate limit headers if we performed rate limiting
  if (rateLimitResult) {
    res.headers.set('X-RateLimit-Limit', '100'); // Default rate limit
    res.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    res.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
  }

  return res;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$|.*\\.svg$).*)'
  ]
};