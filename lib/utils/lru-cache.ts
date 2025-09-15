interface CacheEntry<T> {
  value: T
  timestamp: number
  ttl: number
  lastAccessed: number
}

export class LRUCache<T> {
  private cache = new Map<string, CacheEntry<T>>()
  private accessOrder: string[] = []
  
  constructor(
    private maxSize: number = 100,
    private defaultTtl: number = 30000 // 30 seconds
  ) {}

  set(key: string, value: T, ttl = this.defaultTtl): void {
    const now = Date.now()
    
    // Remove existing entry if it exists
    if (this.cache.has(key)) {
      this.removeFromAccessOrder(key)
    } else if (this.cache.size >= this.maxSize) {
      // Evict least recently used item
      this.evictLRU()
    }

    // Add new entry
    this.cache.set(key, {
      value,
      timestamp: now,
      ttl,
      lastAccessed: now
    })
    
    // Add to end of access order (most recently used)
    this.accessOrder.push(key)
  }

  get(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }
    
    const now = Date.now()
    
    // Check if expired
    if (now - entry.timestamp > entry.ttl) {
      this.delete(key)
      return null
    }
    
    // Update last accessed time and move to end (most recently used)
    entry.lastAccessed = now
    this.moveToEnd(key)
    
    return entry.value
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return false
    }
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key)
      return false
    }
    
    return true
  }

  delete(key: string): boolean {
    if (!this.cache.has(key)) {
      return false
    }
    
    this.cache.delete(key)
    this.removeFromAccessOrder(key)
    return true
  }

  clear(): void {
    this.cache.clear()
    this.accessOrder = []
  }

  // Delete entries matching pattern
  deletePattern(pattern: string): number {
    let deletedCount = 0
    const keysToDelete: string[] = []
    
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key)
      }
    }
    
    for (const key of keysToDelete) {
      this.delete(key)
      deletedCount++
    }
    
    return deletedCount
  }

  // Clean up expired entries
  cleanup(): number {
    const now = Date.now()
    const keysToDelete: string[] = []
    
    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key)
      }
    }
    
    for (const key of keysToDelete) {
      this.delete(key)
    }
    
    return keysToDelete.length
  }

  // Get cache statistics
  getStats() {
    const now = Date.now()
    let expiredCount = 0
    let totalAge = 0
    
    for (const entry of this.cache.values()) {
      const age = now - entry.timestamp
      totalAge += age
      
      if (age > entry.ttl) {
        expiredCount++
      }
    }
    
    const averageAge = this.cache.size > 0 ? totalAge / this.cache.size : 0
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      utilization: (this.cache.size / this.maxSize) * 100,
      expiredCount,
      averageAge,
      oldestEntry: this.accessOrder[0],
      newestEntry: this.accessOrder[this.accessOrder.length - 1]
    }
  }

  private evictLRU(): void {
    if (this.accessOrder.length === 0) return
    
    // Remove least recently used (first in access order)
    const lruKey = this.accessOrder[0]
    this.delete(lruKey)
  }

  private moveToEnd(key: string): void {
    this.removeFromAccessOrder(key)
    this.accessOrder.push(key)
  }

  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key)
    if (index > -1) {
      this.accessOrder.splice(index, 1)
    }
  }
}

// Specialized cache for query results
export interface QueryCacheEntry<T> {
  data: T
  count: number | null
  timestamp: number
  ttl: number
  lastAccessed: number
}

export class QueryResultCache<T> extends LRUCache<QueryCacheEntry<T>> {
  setCachedQuery(key: string, data: T, count: number | null, ttl?: number): void {
    const now = Date.now()
    const finalTtl = ttl || 30000 // Default 30 seconds
    const entry: QueryCacheEntry<T> = {
      data,
      count,
      timestamp: now,
      ttl: finalTtl,
      lastAccessed: now
    }
    
    this.set(key, entry, finalTtl)
  }

  getCachedQuery(key: string): { data: T; count: number | null } | null {
    const entry = this.get(key)
    
    if (!entry) {
      return null
    }
    
    return {
      data: entry.data,
      count: entry.count
    }
  }
}