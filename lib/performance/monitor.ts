'use client'

import React from 'react'

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  type: 'database' | 'image' | 'api' | 'render' | 'navigation'
  metadata?: Record<string, unknown>
}

interface PerformanceStats {
  averageTime: number
  minTime: number
  maxTime: number
  totalCalls: number
  errorRate: number
  p95: number
  p99: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private maxMetrics = 1000
  private isEnabled = process.env.NODE_ENV === 'development'
  private metricIndex = 0

  // Database performance tracking
  trackDatabaseQuery<T>(
    queryName: string,
    queryFn: () => Promise<T>
  ): Promise<T> {
    if (!this.isEnabled) return queryFn()

    const startTime = performance.now()
    const startTimestamp = Date.now()

    return queryFn()
      .then(result => {
        this.addMetric({
          name: `db_${queryName}`,
          value: performance.now() - startTime,
          timestamp: startTimestamp,
          type: 'database',
          metadata: { status: 'success' }
        })
        return result
      })
      .catch(error => {
        this.addMetric({
          name: `db_${queryName}`,
          value: performance.now() - startTime,
          timestamp: startTimestamp,
          type: 'database',
          metadata: { 
            status: 'error',
            error: error.message 
          }
        })
        throw error
      })
  }

  // Image loading performance
  trackImageLoad(src: string, startTime: number, success: boolean) {
    if (!this.isEnabled) return

    this.addMetric({
      name: 'image_load',
      value: performance.now() - startTime,
      timestamp: Date.now(),
      type: 'image',
      metadata: {
        src,
        success,
        size: this.getImageSize(src)
      }
    })
  }

  // API call performance
  trackApiCall<T>(
    endpoint: string,
    method: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    if (!this.isEnabled) return apiCall()

    const startTime = performance.now()
    const startTimestamp = Date.now()

    return apiCall()
      .then(result => {
        this.addMetric({
          name: `api_${method.toLowerCase()}_${endpoint.replace(/\//g, '_')}`,
          value: performance.now() - startTime,
          timestamp: startTimestamp,
          type: 'api',
          metadata: { 
            method,
            endpoint,
            status: 'success'
          }
        })
        return result
      })
      .catch(error => {
        this.addMetric({
          name: `api_${method.toLowerCase()}_${endpoint.replace(/\//g, '_')}`,
          value: performance.now() - startTime,
          timestamp: startTimestamp,
          type: 'api',
          metadata: { 
            method,
            endpoint,
            status: 'error',
            error: error.message
          }
        })
        throw error
      })
  }

  // React component render performance
  trackComponentRender(componentName: string, renderTime: number) {
    if (!this.isEnabled) return

    this.addMetric({
      name: `render_${componentName}`,
      value: renderTime,
      timestamp: Date.now(),
      type: 'render',
      metadata: { component: componentName }
    })
  }

  // Navigation performance
  trackNavigation(from: string, to: string, duration: number) {
    if (!this.isEnabled) return

    this.addMetric({
      name: 'navigation',
      value: duration,
      timestamp: Date.now(),
      type: 'navigation',
      metadata: { from, to }
    })
  }

  // Core Web Vitals tracking
  trackWebVitals() {
    if (!this.isEnabled || typeof window === 'undefined') return

    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { element?: Element }
      
      this.addMetric({
        name: 'lcp',
        value: lastEntry.startTime,
        timestamp: Date.now(),
        type: 'render',
        metadata: { 
          url: window.location.pathname,
          element: lastEntry.element?.tagName
        }
      })
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // FID (First Input Delay)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidEntry = entry as PerformanceEntry & { processingStart: number }
        this.addMetric({
          name: 'fid',
          value: fidEntry.processingStart - fidEntry.startTime,
          timestamp: Date.now(),
          type: 'render',
          metadata: { 
            url: window.location.pathname,
            eventType: entry.name
          }
        })
      }
    }).observe({ entryTypes: ['first-input'] })

    // CLS (Cumulative Layout Shift)
    let clsValue = 0
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const clsEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value: number }
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value
        }
      }
      
      this.addMetric({
        name: 'cls',
        value: clsValue,
        timestamp: Date.now(),
        type: 'render',
        metadata: { url: window.location.pathname }
      })
    }).observe({ entryTypes: ['layout-shift'] })
  }

  private addMetric(metric: PerformanceMetric) {
    // Use circular buffer to prevent memory growth
    if (this.metrics.length < this.maxMetrics) {
      this.metrics.push(metric)
    } else {
      // Replace oldest metric with new one
      this.metrics[this.metricIndex] = metric
      this.metricIndex = (this.metricIndex + 1) % this.maxMetrics
    }
  }

  private getImageSize(src: string): string {
    if (src.includes('width=')) {
      const width = src.match(/width=(\d+)/)?.[1]
      const height = src.match(/height=(\d+)/)?.[1]
      return width && height ? `${width}x${height}` : 'unknown'
    }
    return 'original'
  }

  // Analytics and reporting
  getStats(metricName?: string, timeRange?: number): PerformanceStats | Record<string, PerformanceStats> {
    const now = Date.now()
    const cutoff = timeRange ? now - timeRange : 0
    
    let filteredMetrics = this.metrics.filter(m => m.timestamp >= cutoff)
    
    if (metricName) {
      filteredMetrics = filteredMetrics.filter(m => m.name === metricName)
      return this.calculateStats(filteredMetrics)
    }

    // Group by metric name
    const grouped = filteredMetrics.reduce((acc, metric) => {
      if (!acc[metric.name]) acc[metric.name] = []
      acc[metric.name].push(metric)
      return acc
    }, {} as Record<string, PerformanceMetric[]>)

    return Object.entries(grouped).reduce((acc, [name, metrics]) => {
      acc[name] = this.calculateStats(metrics)
      return acc
    }, {} as Record<string, PerformanceStats>)
  }

  private calculateStats(metrics: PerformanceMetric[]): PerformanceStats {
    if (metrics.length === 0) {
      return {
        averageTime: 0,
        minTime: 0,
        maxTime: 0,
        totalCalls: 0,
        errorRate: 0,
        p95: 0,
        p99: 0
      }
    }

    const values = metrics.map(m => m.value).sort((a, b) => a - b)
    const errors = metrics.filter(m => m.metadata?.status === 'error').length

    return {
      averageTime: values.reduce((sum, val) => sum + val, 0) / values.length,
      minTime: values[0],
      maxTime: values[values.length - 1],
      totalCalls: metrics.length,
      errorRate: errors / metrics.length,
      p95: values[Math.floor(values.length * 0.95)] || 0,
      p99: values[Math.floor(values.length * 0.99)] || 0
    }
  }

  // Performance recommendations
  getRecommendations(): string[] {
    const recommendations: string[] = []
    const stats = this.getStats() as Record<string, PerformanceStats>

    // Database recommendations
    const dbStats = Object.entries(stats).filter(([name]) => name.startsWith('db_'))
    dbStats.forEach(([name, stat]) => {
      if (stat.averageTime > 1000) {
        recommendations.push(`Database query "${name}" is slow (${stat.averageTime.toFixed(0)}ms avg). Consider adding indexes or optimizing the query.`)
      }
      if (stat.errorRate > 0.05) {
        recommendations.push(`Database query "${name}" has high error rate (${(stat.errorRate * 100).toFixed(1)}%). Check error handling.`)
      }
    })

    // Image recommendations
    const imageStats = stats['image_load']
    if (imageStats && imageStats.averageTime > 2000) {
      recommendations.push(`Images are loading slowly (${imageStats.averageTime.toFixed(0)}ms avg). Consider optimizing image sizes and formats.`)
    }

    // API recommendations
    const apiStats = Object.entries(stats).filter(([name]) => name.startsWith('api_'))
    apiStats.forEach(([name, stat]) => {
      if (stat.averageTime > 3000) {
        recommendations.push(`API call "${name}" is slow (${stat.averageTime.toFixed(0)}ms avg). Consider caching or optimizing the endpoint.`)
      }
    })

    // Core Web Vitals recommendations
    const lcpStats = stats['lcp']
    if (lcpStats && lcpStats.averageTime > 2500) {
      recommendations.push(`LCP is poor (${lcpStats.averageTime.toFixed(0)}ms). Optimize largest contentful paint.`)
    }

    const fidStats = stats['fid']
    if (fidStats && fidStats.averageTime > 100) {
      recommendations.push(`FID needs improvement (${fidStats.averageTime.toFixed(0)}ms). Reduce JavaScript execution time.`)
    }

    const clsStats = stats['cls']
    if (clsStats && clsStats.averageTime > 0.1) {
      recommendations.push(`CLS needs improvement (${clsStats.averageTime.toFixed(3)}). Reduce layout shifts.`)
    }

    return recommendations
  }

  // Export data for analysis
  exportMetrics(format: 'json' | 'csv' = 'json') {
    if (format === 'json') {
      return JSON.stringify(this.metrics, null, 2)
    }

    const headers = ['name', 'value', 'timestamp', 'type', 'metadata']
    const rows = this.metrics.map(m => [
      m.name,
      m.value.toString(),
      m.timestamp.toString(),
      m.type,
      JSON.stringify(m.metadata || {})
    ])

    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  clear() {
    this.metrics = []
    this.metricIndex = 0
  }

  // Clean up old metrics beyond time threshold
  private cleanupOldMetrics(maxAge = 5 * 60 * 1000) { // 5 minutes default
    const cutoffTime = Date.now() - maxAge
    this.metrics = this.metrics.filter(metric => metric.timestamp >= cutoffTime)
    this.metricIndex = Math.min(this.metricIndex, this.metrics.length)
  }

  enable() {
    this.isEnabled = true
  }

  disable() {
    this.isEnabled = false
  }
}

// Global instance
export const performanceMonitor = new PerformanceMonitor()

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const trackRender = (componentName: string) => {
    const startTime = performance.now()
    
    return () => {
      const renderTime = performance.now() - startTime
      performanceMonitor.trackComponentRender(componentName, renderTime)
    }
  }

  return {
    trackRender,
    getStats: performanceMonitor.getStats.bind(performanceMonitor),
    getRecommendations: performanceMonitor.getRecommendations.bind(performanceMonitor)
  }
}

// HOC for component performance tracking
export function withPerformanceTracking<T extends object>(
  Component: React.ComponentType<T>,
  componentName?: string
) {
  const WrappedComponent = (props: T) => {
    const { trackRender } = usePerformanceMonitor()
    
    React.useEffect(() => {
      const endTracking = trackRender(componentName || Component.displayName || Component.name || 'Unknown')
      return endTracking
    })

    return React.createElement(Component, props)
  }

  WrappedComponent.displayName = `WithPerformanceTracking(${componentName || Component.displayName || Component.name})`
  
  return WrappedComponent
}

export type { PerformanceMetric, PerformanceStats }