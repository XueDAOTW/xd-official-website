import { LRUCache } from 'lru-cache';
import type { NextRequest } from 'next/server';

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
  skipIf?: (req: NextRequest) => boolean;
  keyGenerator?: (req: NextRequest) => string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private cache: LRUCache<string, RateLimitEntry>;
  private config: Required<RateLimitConfig>;

  constructor(config: RateLimitConfig) {
    this.config = {
      windowMs: config.windowMs,
      maxRequests: config.maxRequests,
      message: config.message || 'Too many requests, please try again later.',
      skipIf: config.skipIf || (() => false),
      keyGenerator: config.keyGenerator || this.getDefaultKey,
    };

    this.cache = new LRUCache<string, RateLimitEntry>({
      max: 10000, // Maximum 10k entries
      ttl: config.windowMs + 1000, // TTL slightly longer than window
    });
  }

  private getDefaultKey = (req: NextRequest): string => {
    // Prioritize real IP from headers, fallback to basic IP
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || '127.0.0.1';
    
    // Include user agent for better fingerprinting
    const userAgent = req.headers.get('user-agent') || '';
    const userAgentHash = this.simpleHash(userAgent);
    
    return `${ip}:${userAgentHash}`;
  }

  private simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  async check(req: NextRequest): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
    message?: string;
  }> {
    // Skip rate limiting if condition is met
    if (this.config.skipIf(req)) {
      return {
        allowed: true,
        remaining: this.config.maxRequests,
        resetTime: Date.now() + this.config.windowMs,
      };
    }

    const key = this.config.keyGenerator(req);
    const now = Date.now();
    const entry = this.cache.get(key);

    if (!entry || now > entry.resetTime) {
      // First request or window has expired
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + this.config.windowMs,
      };
      this.cache.set(key, newEntry);
      
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: newEntry.resetTime,
      };
    }

    // Increment counter
    entry.count += 1;
    this.cache.set(key, entry);

    const allowed = entry.count <= this.config.maxRequests;
    
    return {
      allowed,
      remaining: Math.max(0, this.config.maxRequests - entry.count),
      resetTime: entry.resetTime,
      message: allowed ? undefined : this.config.message,
    };
  }

  // Get current stats for a request (useful for debugging)
  getStats(req: NextRequest): RateLimitEntry | null {
    const key = this.config.keyGenerator(req);
    return this.cache.get(key) || null;
  }

  // Clear all entries (useful for testing)
  clear(): void {
    this.cache.clear();
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }
}

// Pre-configured rate limiters for different use cases
export const rateLimiters = {
  // General API rate limiting
  api: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many API requests, please try again later.',
  }),

  // Strict rate limiting for sensitive endpoints
  strict: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10,
    message: 'Rate limit exceeded for sensitive endpoint.',
  }),

  // Form submission rate limiting
  forms: new RateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    maxRequests: 5,
    message: 'Too many form submissions, please wait before trying again.',
  }),

  // Authentication rate limiting
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many authentication attempts, please try again later.',
  }),
};

// Middleware helper function
export function createRateLimitMiddleware(limiter: RateLimiter) {
  return async (req: NextRequest) => {
    const result = await limiter.check(req);
    
    if (!result.allowed) {
      return new Response(
        JSON.stringify({
          error: result.message,
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limiter['config'].maxRequests.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetTime.toString(),
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Add rate limit headers to successful responses
    return {
      headers: {
        'X-RateLimit-Limit': limiter['config'].maxRequests.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.resetTime.toString(),
      },
    };
  };
}

// Utility function to add rate limit headers to any response
export function addRateLimitHeaders(
  response: Response,
  result: Awaited<ReturnType<RateLimiter['check']>>
): Response {
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });

  newResponse.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  newResponse.headers.set('X-RateLimit-Reset', result.resetTime.toString());

  return newResponse;
}