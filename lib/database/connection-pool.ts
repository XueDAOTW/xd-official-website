import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'

// Connection pool interface
interface ConnectionPool {
  getConnection(): Promise<SupabaseClient<Database>>
  releaseConnection(connection: SupabaseClient<Database>): void
  closeAll(): void
  getStats(): PoolStats
}

interface PoolStats {
  total: number
  active: number
  idle: number
  waiting: number
  timeouts: number
}

interface PoolConfig {
  maxConnections?: number
  minConnections?: number
  connectionTimeout?: number  // Timeout for getting a connection from pool
  idleTimeout?: number       // Timeout for idle connections
  queryTimeout?: number      // Timeout for individual queries
}

interface BatchQuery {
  id: string
  query: () => Promise<unknown>
  resolve: (value: unknown) => void
  reject: (error: unknown) => void
  table: string
  priority: 'high' | 'medium' | 'low'
  createdAt: number
}

// Simple connection pool implementation
class SimpleConnectionPool implements ConnectionPool {
  private connections: SupabaseClient<Database>[] = []
  private activeConnections = new Set<SupabaseClient<Database>>()
  private connectionTimestamps = new Map<SupabaseClient<Database>, number>()
  private waitingQueue: Array<{
    resolve: (connection: SupabaseClient<Database>) => void
    reject: (error: Error) => void
    timestamp: number
  }> = []
  private timeoutCount = 0
  private idleCheckInterval?: NodeJS.Timeout

  constructor(
    private createConnection: () => SupabaseClient<Database>,
    private config: PoolConfig = {}
  ) {
    const {
      maxConnections = 10,
      minConnections = 2,
      connectionTimeout = 10000,
      idleTimeout = 30000,
    } = config

    this.maxConnections = maxConnections
    this.minConnections = minConnections
    this.connectionTimeout = connectionTimeout
    this.idleTimeout = idleTimeout
    
    // Initialize minimum connections
    for (let i = 0; i < this.minConnections; i++) {
      const connection = this.createConnection()
      this.connections.push(connection)
      this.connectionTimestamps.set(connection, Date.now())
    }

    // Start idle connection cleanup if idleTimeout is set
    if (this.idleTimeout > 0) {
      this.idleCheckInterval = setInterval(() => {
        this.cleanupIdleConnections()
      }, this.idleTimeout / 2) // Check every half of idle timeout
    }
  }

  private maxConnections: number
  private minConnections: number 
  private connectionTimeout: number
  private idleTimeout: number

  async getConnection(): Promise<SupabaseClient<Database>> {
    return new Promise((resolve, reject) => {
      // Check for available connection
      const availableConnection = this.connections.find(
        conn => !this.activeConnections.has(conn)
      )

      if (availableConnection) {
        this.activeConnections.add(availableConnection)
        this.connectionTimestamps.set(availableConnection, Date.now())
        resolve(availableConnection)
        return
      }

      // Create new connection if under limit
      if (this.connections.length < this.maxConnections) {
        const newConnection = this.createConnection()
        this.connections.push(newConnection)
        this.activeConnections.add(newConnection)
        this.connectionTimestamps.set(newConnection, Date.now())
        resolve(newConnection)
        return
      }

      // Add to waiting queue with timestamp
      const queueItem = { resolve, reject, timestamp: Date.now() }
      this.waitingQueue.push(queueItem)

      // Set timeout for waiting requests using configured timeout
      setTimeout(() => {
        const index = this.waitingQueue.findIndex(item => item.resolve === resolve)
        if (index !== -1) {
          this.waitingQueue.splice(index, 1)
          this.timeoutCount++
          reject(new Error(`Connection pool timeout after ${this.connectionTimeout}ms`))
        }
      }, this.connectionTimeout)
    })
  }

  releaseConnection(connection: SupabaseClient<Database>): void {
    this.activeConnections.delete(connection)
    this.connectionTimestamps.set(connection, Date.now())

    // Serve waiting requests
    if (this.waitingQueue.length > 0) {
      const { resolve } = this.waitingQueue.shift()!
      this.activeConnections.add(connection)
      this.connectionTimestamps.set(connection, Date.now())
      resolve(connection)
    }
  }

  closeAll(): void {
    // Clear the idle check interval
    if (this.idleCheckInterval) {
      clearInterval(this.idleCheckInterval)
      this.idleCheckInterval = undefined
    }

    // Clear all pending timeouts and reject waiting requests
    this.waitingQueue.forEach(({ reject }) => {
      reject(new Error('Connection pool is being closed'))
    })

    this.connections.forEach(_conn => {
      // Note: Supabase client doesn't have explicit close method
      // In a real implementation, you might want to implement cleanup
    })
    
    this.connections = []
    this.activeConnections.clear()
    this.connectionTimestamps.clear()
    this.waitingQueue = []
  }

  getStats(): PoolStats {
    return {
      total: this.connections.length,
      active: this.activeConnections.size,
      idle: this.connections.length - this.activeConnections.size,
      waiting: this.waitingQueue.length,
      timeouts: this.timeoutCount,
    }
  }

  private cleanupIdleConnections(): void {
    if (this.idleTimeout <= 0) return

    const now = Date.now()
    const connectionsToRemove: SupabaseClient<Database>[] = []

    // Find idle connections that have exceeded the idle timeout
    for (const [connection, timestamp] of this.connectionTimestamps) {
      if (!this.activeConnections.has(connection) && 
          now - timestamp > this.idleTimeout &&
          this.connections.length > this.minConnections) {
        connectionsToRemove.push(connection)
      }
    }

    // Remove idle connections
    for (const connection of connectionsToRemove) {
      const index = this.connections.indexOf(connection)
      if (index > -1) {
        this.connections.splice(index, 1)
        this.connectionTimestamps.delete(connection)
      }
    }
  }
}

// Query batching system
class QueryBatcher {
  private batches = new Map<string, BatchQuery[]>()
  private processingTables = new Set<string>()
  private batchTimeouts = new Map<string, NodeJS.Timeout>()

  constructor(
    private connectionPool: ConnectionPool,
    private batchSize = 10,
    private batchTimeout = 100 // milliseconds
  ) {}

  async addQuery<T>(
    table: string,
    query: () => Promise<T>,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const batchQuery: BatchQuery = {
        id: Math.random().toString(36).substr(2, 9),
        query: query as () => Promise<unknown>,
        resolve: resolve as (value: unknown) => void,
        reject,
        table,
        priority,
        createdAt: Date.now(),
      }

      if (!this.batches.has(table)) {
        this.batches.set(table, [])
      }

      const batch = this.batches.get(table)!
      
      // Insert query based on priority
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      const insertIndex = batch.findIndex(
        q => priorityOrder[q.priority] > priorityOrder[priority]
      )
      
      if (insertIndex === -1) {
        batch.push(batchQuery)
      } else {
        batch.splice(insertIndex, 0, batchQuery)
      }

      // Process immediately if high priority or batch is full
      if (priority === 'high' || batch.length >= this.batchSize) {
        this.processBatch(table)
        return
      }

      // Set timeout for batch processing
      if (!this.batchTimeouts.has(table)) {
        const timeout = setTimeout(() => {
          this.processBatch(table)
        }, this.batchTimeout)
        this.batchTimeouts.set(table, timeout)
      }
    })
  }

  private async processBatch(table: string): Promise<void> {
    if (this.processingTables.has(table)) return

    const batch = this.batches.get(table)
    if (!batch || batch.length === 0) return

    this.processingTables.add(table)
    
    // Clear timeout
    const timeout = this.batchTimeouts.get(table)
    if (timeout) {
      clearTimeout(timeout)
      this.batchTimeouts.delete(table)
    }

    // Take queries to process
    const queriesToProcess = batch.splice(0, this.batchSize)

    try {
      const connection = await this.connectionPool.getConnection()

      // Execute queries in parallel within the batch
      const results = await Promise.allSettled(
        queriesToProcess.map(batchQuery => batchQuery.query())
      )

      // Resolve/reject individual queries
      results.forEach((result, index) => {
        const batchQuery = queriesToProcess[index]
        if (result.status === 'fulfilled') {
          batchQuery.resolve(result.value)
        } else {
          batchQuery.reject(result.reason)
        }
      })

      this.connectionPool.releaseConnection(connection)
    } catch (error) {
      // Reject all queries in the batch
      queriesToProcess.forEach(batchQuery => {
        batchQuery.reject(error)
      })
    } finally {
      this.processingTables.delete(table)
      
      // Process remaining queries if any
      const remainingBatch = this.batches.get(table)
      if (remainingBatch && remainingBatch.length > 0) {
        setTimeout(() => this.processBatch(table), 10)
      }
    }
  }

  getStats() {
    const stats: Record<string, number> = {}
    this.batches.forEach((batch, table) => {
      stats[table] = batch.length
    })
    return {
      pendingBatches: stats,
      processingTables: Array.from(this.processingTables),
      totalPending: Array.from(this.batches.values()).reduce(
        (sum, batch) => sum + batch.length, 0
      ),
    }
  }

  clear() {
    this.batchTimeouts.forEach(timeout => clearTimeout(timeout))
    this.batchTimeouts.clear()
    this.batches.clear()
    this.processingTables.clear()
  }
}

// Enhanced repository base with connection pooling and batching
export class PooledRepository {
  protected queryBatcher: QueryBatcher

  constructor(
    protected connectionPool: ConnectionPool,
    batchSize = 10,
    batchTimeout = 100
  ) {
    this.queryBatcher = new QueryBatcher(connectionPool, batchSize, batchTimeout)
  }

  // Batch-aware query execution
  protected async executeBatchedQuery<T>(
    table: string,
    query: () => Promise<T>,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): Promise<T> {
    return this.queryBatcher.addQuery(table, query, priority)
  }

  // Get performance stats
  getPerformanceStats() {
    return {
      connectionPool: this.connectionPool.getStats(),
      queryBatcher: this.queryBatcher.getStats(),
    }
  }

  // Cleanup resources
  cleanup() {
    this.queryBatcher.clear()
    this.connectionPool.closeAll()
  }
}

// Factory function to create optimized connection pool
export function createOptimizedConnectionPool(
  createConnection: () => SupabaseClient<Database>,
  options: PoolConfig & {
    batchSize?: number
    batchTimeout?: number
  } = {}
) {
  const {
    maxConnections = 10,
    minConnections = 2,
    connectionTimeout = 10000,
    idleTimeout = 30000,
    queryTimeout = 30000,
    batchSize = 10,
    batchTimeout = 100,
  } = options

  const poolConfig: PoolConfig = {
    maxConnections,
    minConnections,
    connectionTimeout,
    idleTimeout,
    queryTimeout,
  }

  const pool = new SimpleConnectionPool(createConnection, poolConfig)
  return new PooledRepository(pool, batchSize, batchTimeout)
}

export type { ConnectionPool, PoolStats, PoolConfig, BatchQuery }
export { SimpleConnectionPool, QueryBatcher }