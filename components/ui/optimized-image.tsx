'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getOptimizedImageUrl, createImageObserver, preloadImage } from '@/lib/supabase/client'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  format?: 'webp' | 'avif' | 'auto'
  lazy?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  fill?: boolean
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  objectPosition?: string
  onLoad?: () => void
  onError?: () => void
  fallback?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 80,
  format = 'webp',
  lazy = true,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  objectFit = 'cover',
  objectPosition = 'center',
  onLoad,
  onError,
  fallback = '/images/placeholder.svg',
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(!lazy || priority)
  const imgRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Get optimized URL for Supabase images
  const optimizedSrc = getOptimizedImageUrl(src, {
    width,
    height,
    quality,
    format,
  })

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return

    const currentRef = imgRef.current
    if (!currentRef) return

    observerRef.current = createImageObserver((entry) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        observerRef.current?.unobserve(entry.target)
      }
    })

    if (observerRef.current) {
      observerRef.current.observe(currentRef)
    }

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef)
      }
    }
  }, [lazy, priority, isInView])

  // Preload critical images
  useEffect(() => {
    if (priority && !isLoaded) {
      preloadImage(optimizedSrc, {
        fetchPriority: 'high',
      })
    }
  }, [priority, optimizedSrc, isLoaded])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  const shouldRender = isInView || priority

  return (
    <div 
      ref={imgRef}
      className={cn(
        'relative overflow-hidden',
        !isLoaded && shouldRender && 'animate-pulse bg-gray-200',
        className
      )}
      style={fill ? { width: '100%', height: '100%' } : { width, height }}
    >
      {shouldRender && (
        <Image
          src={hasError ? fallback : optimizedSrc}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          quality={quality}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          sizes={sizes}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            fill && `object-${objectFit}`
          )}
          style={fill ? { objectPosition } : undefined}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
      
      {/* Loading placeholder */}
      {!isLoaded && shouldRender && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600" />
        </div>
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-400">
            <svg className="mx-auto h-12 w-12 mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <p className="text-sm">Failed to load</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Hook for batch image preloading
export function useBatchImagePreload(images: string[], enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const preloadPromises = images.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new window.Image()
        img.onload = resolve
        img.onerror = reject
        img.src = getOptimizedImageUrl(src, { quality: 60, format: 'webp' })
      })
    })

    Promise.allSettled(preloadPromises).then((results) => {
      const successful = results.filter(r => r.status === 'fulfilled').length
      // eslint-disable-next-line no-console
      console.log(`Preloaded ${successful}/${images.length} images`)
    })
  }, [images, enabled])
}

// Progressive image loading component
interface ProgressiveImageProps extends OptimizedImageProps {
  lowQualitySrc?: string
}

export function ProgressiveImage({
  src,
  lowQualitySrc,
  ...props
}: ProgressiveImageProps) {
  const [highQualityLoaded, setHighQualityLoaded] = useState(false)
  
  const lowQualityUrl = lowQualitySrc || getOptimizedImageUrl(src, {
    width: 50,
    quality: 20,
    format: 'webp',
  })

  return (
    <div className="relative">
      {/* Low quality image */}
      <OptimizedImage
        {...props}
        src={lowQualityUrl}
        className={cn(
          props.className,
          'transition-opacity duration-300',
          highQualityLoaded ? 'opacity-0' : 'opacity-100'
        )}
        priority={true}
        lazy={false}
      />
      
      {/* High quality image */}
      <OptimizedImage
        {...props}
        src={src}
        className={cn(
          props.className,
          'absolute inset-0 transition-opacity duration-300',
          highQualityLoaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => setHighQualityLoaded(true)}
        priority={props.priority}
      />
    </div>
  )
}