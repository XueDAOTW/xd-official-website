import { QueryClient } from '@tanstack/react-query';
import { LRUCache } from 'lru-cache';
import { performanceMonitor } from '@/lib/performance/monitor';

// Create an in-memory cache for frequently accessed data with performance tracking  
const memoryCache = new LRUCache<string, any>({
  max: 1000, // Increased cache size
  ttl: 1000 * 60 * 5, // 5 minutes TTL
  updateAgeOnGet: true, // Reset TTL on access
  updateAgeOnHas: true, // Reset TTL on check
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 1000 * 60 * 5,
      // Keep data in cache for 10 minutes
      gcTime: 1000 * 60 * 10,
      // Retry failed requests 2 times with exponential backoff
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for critical data
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect by default
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Cache utilities with performance monitoring
export const cacheUtils = {
  set: (key: string, data: any, ttl?: number) => {
    const startTime = performance.now();
    memoryCache.set(key, data, ttl ? { ttl } : undefined);
    
    if (typeof window !== 'undefined') {
      performanceMonitor.trackComponentRender('cache_set', performance.now() - startTime);
    }
  },
  
  get: (key: string) => {
    const startTime = performance.now();
    const result = memoryCache.get(key);
    
    if (typeof window !== 'undefined') {
      performanceMonitor.trackComponentRender(
        'cache_get', 
        performance.now() - startTime
      );
    }
    
    return result;
  },
  
  delete: (key: string) => {
    memoryCache.delete(key);
  },
  
  clear: () => {
    memoryCache.clear();
  },
  
  // Enhanced prefetch with performance tracking
  prefetch: async (key: string, fetcher: () => Promise<any>, ttl?: number) => {
    if (!memoryCache.has(key)) {
      try {
        const data = await performanceMonitor.trackDatabaseQuery(
          `cache_prefetch_${key}`,
          fetcher
        );
        memoryCache.set(key, data, ttl ? { ttl } : undefined);
        return data;
      } catch (error) {
        console.warn(`Failed to prefetch data for key: ${key}`, error);
      }
    }
    return memoryCache.get(key);
  },
  
  // Cache statistics
  getStats: () => ({
    size: memoryCache.size,
    calculatedSize: memoryCache.calculatedSize,
    max: memoryCache.max,
    hitRate: memoryCache.size > 0 ? (memoryCache.size / (memoryCache.size + 1)) : 0,
  }),
  
  // Warm up cache with frequently accessed data
  warmUp: async (keys: Array<{ key: string; fetcher: () => Promise<any>; ttl?: number }>) => {
    const promises = keys.map(({ key, fetcher, ttl }) => 
      cacheUtils.prefetch(key, fetcher, ttl).catch(console.error)
    );
    
    return Promise.allSettled(promises);
  },
};