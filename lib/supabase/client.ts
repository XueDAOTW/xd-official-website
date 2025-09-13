import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Connection pool configuration for better performance
const clientConfig = {
  db: {
    schema: 'public' as const,
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
      'Cache-Control': 'max-age=300', // 5 minutes cache for static requests
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // Throttle realtime events
    },
  },
}

export const createSupabaseClient = () => {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, clientConfig)
}

// Singleton pattern for browser client to avoid multiple connections
let browserClient: ReturnType<typeof createSupabaseClient> | null = null

export const getSupabaseClient = () => {
  if (!browserClient) {
    browserClient = createSupabaseClient()
  }
  return browserClient
}

export const supabase = getSupabaseClient()

// Image optimization utilities
export const getOptimizedImageUrl = (url: string, options?: {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'auto'
}) => {
  if (!url || !url.includes('supabase')) {
    return url
  }

  const { width, height, quality = 80, format = 'webp' } = options || {}
  const params = new URLSearchParams()
  
  if (width) params.set('width', width.toString())
  if (height) params.set('height', height.toString())
  if (quality) params.set('quality', quality.toString())
  if (format && format !== 'auto') params.set('format', format)
  
  const separator = url.includes('?') ? '&' : '?'
  return params.toString() ? `${url}${separator}${params.toString()}` : url
}

// Storage optimization utilities
export const storageUtils = {
  // Get optimized public URL with caching headers
  getPublicUrl: (bucket: string, path: string, options?: {
    download?: boolean
    transform?: {
      width?: number
      height?: number
      quality?: number
      format?: 'origin'
    }
  }) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path, {
      download: options?.download,
      transform: options?.transform,
    })
    
    // Add cache headers for better CDN performance
    const url = new URL(data.publicUrl)
    url.searchParams.set('cache', '3600') // 1 hour cache
    
    return url.toString()
  },

  // Batch upload with progress tracking
  batchUpload: async (bucket: string, files: Array<{
    path: string
    file: File
    options?: Record<string, unknown>
  }>) => {
    const results = await Promise.allSettled(
      files.map(({ path, file, options }) =>
        supabase.storage.from(bucket).upload(path, file, {
          cacheControl: '3600',
          upsert: false,
          ...options,
        })
      )
    )
    
    return results.map((result, index) => ({
      path: files[index].path,
      success: result.status === 'fulfilled',
      data: result.status === 'fulfilled' ? result.value.data : null,
      error: result.status === 'rejected' ? result.reason : null,
    }))
  },

  // Get signed URL with extended expiration for private files
  getSignedUrl: async (bucket: string, path: string, expiresIn = 3600) => {
    return supabase.storage.from(bucket).createSignedUrl(path, expiresIn)
  },
}

// Preload critical images
export const preloadImage = (src: string, options?: {
  as?: 'image'
  fetchPriority?: 'high' | 'low' | 'auto'
}) => {
  if (typeof window === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = options?.as || 'image'
  link.href = src
  if (options?.fetchPriority) {
    link.setAttribute('fetchpriority', options.fetchPriority)
  }
  document.head.appendChild(link)
}

// Image lazy loading with intersection observer
export const createImageObserver = (callback: (entry: IntersectionObserverEntry) => void) => {
  if (typeof window === 'undefined') return null
  
  return new IntersectionObserver(
    (entries) => {
      entries.forEach(callback)
    },
    {
      rootMargin: '50px', // Start loading 50px before image enters viewport
      threshold: 0.1,
    }
  )
}