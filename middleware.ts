import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Enhanced CORS handling for API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const origin = req.headers.get('origin');
    const allowedOrigins = process.env.NODE_ENV === 'development' 
      ? ['http://localhost:3000', 'http://127.0.0.1:3000']
      : ['https://xuedao.org', 'https://www.xuedao.org', 'https://xuedao.xyz'];

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': origin && allowedOrigins.includes(origin) ? origin : 'null',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Client-Info',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400',
          'Vary': 'Origin'
        },
      });
    }

    // Add CORS headers to API responses
    if (origin && allowedOrigins.includes(origin)) {
      res.headers.set('Access-Control-Allow-Origin', origin);
      res.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Client-Info');
    res.headers.set('Vary', 'Origin');
  }

  // Enhanced security headers for all responses
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-DNS-Prefetch-Control', 'off');
  res.headers.set('X-Download-Options', 'noopen');
  res.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  
  // Enhanced Permissions Policy
  res.headers.set(
    'Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()'
  );

  // Strict Transport Security (HSTS) for production
  if (process.env.NODE_ENV === 'production') {
    res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Enhanced Content Security Policy
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' blob: data: https: https://www.googletagmanager.com https://www.google-analytics.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');

  res.headers.set('Content-Security-Policy', cspHeader);

  // Rate limiting headers (basic implementation)
  const clientIP = getClientIP(req);
  res.headers.set('X-RateLimit-Limit', '1000');
  res.headers.set('X-RateLimit-Remaining', '999'); // Simplified for now
  res.headers.set('X-RateLimit-Reset', String(Date.now() + 60000));

  return res;
}

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  const headers = [
    'x-forwarded-for',
    'x-real-ip', 
    'cf-connecting-ip',
    'x-client-ip'
  ];
  
  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      return value.split(',')[0].trim();
    }
  }
  
  return '127.0.0.1';
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
};