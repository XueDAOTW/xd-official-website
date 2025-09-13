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
}

interface BatchQuery {
  id: string
  query: () => Promise<any>
  resolve: (value: any) => void
  reject: (error: any) => void
  table: string
  priority: 'high' | 'medium' | 'low'
  createdAt: number
}

// Simple connection pool implementation
class SimpleConnectionPool implements ConnectionPool {
  private connections: SupabaseClient<Database>[] = []
  private activeConnections = new Set<SupabaseClient<Database>>()
  private waitingQueue: Array<{
    resolve: (connection: SupabaseClient<Database>) => void
    reject: (error: Error) => void
  }> = []

  constructor(
    private createConnection: () => SupabaseClient<Database>,
    private maxConnections = 10,
    private minConnections = 2
  ) {
    // Initialize minimum connections
    for (let i = 0; i < minConnections; i++) {
      this.connections.push(createConnection())
    }
  }

  async getConnection(): Promise<SupabaseClient<Database>> {
    return new Promise((resolve, reject) => {
      // Check for available connection
      const availableConnection = this.connections.find(
        conn => !this.activeConnections.has(conn)
      )

      if (availableConnection) {
        this.activeConnections.add(availableConnection)
        resolve(availableConnection)
        return
      }

      // Create new connection if under limit
      if (this.connections.length < this.maxConnections) {
        const newConnection = this.createConnection()
        this.connections.push(newConnection)
        this.activeConnections.add(newConnection)
        resolve(newConnection)
        return
      }

      // Add to waiting queue
      this.waitingQueue.push({ resolve, reject })

      // Set timeout for waiting requests
      setTimeout(() => {
        const index = this.waitingQueue.findIndex(item => item.resolve === resolve)
        if (index !== -1) {
          this.waitingQueue.splice(index, 1)
          reject(new Error('Connection pool timeout'))
        }
      }, 10000) // 10 second timeout
    })
  }

  releaseConnection(connection: SupabaseClient<Database>): void {
    this.activeConnections.delete(connection)

    // Serve waiting requests
    if (this.waitingQueue.length > 0) {
      const { resolve } = this.waitingQueue.shift()!
      this.activeConnections.add(connection)
      resolve(connection)
    }
  }

  closeAll(): void {
    this.connections.forEach(conn => {
      // Note: Supabase client doesn't have explicit close method
      // In a real implementation, you might want to implement cleanup
    })
    this.connections = []
    this.activeConnections.clear()
    this.waitingQueue = []
  }

  getStats(): PoolStats {
    return {
      total: this.connections.length,
      active: this.activeConnections.size,
      idle: this.connections.length - this.activeConnections.size,
      waiting: this.waitingQueue.length,
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
    return new Promise((resolve, reject) => {
      const batchQuery: BatchQuery = {
        id: Math.random().toString(36).substr(2, 9),
        query: query as () => Promise<any>,
        resolve,
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
  options: {
    maxConnections?: number
    minConnections?: number
    batchSize?: number
    batchTimeout?: number
  } = {}
) {
  const {
    maxConnections = 10,
    minConnections = 2,
    batchSize = 10,
    batchTimeout = 100,
  } = options

  const pool = new SimpleConnectionPool(
    createConnection,
    maxConnections,
    minConnections
  )

  return new PooledRepository(pool, batchSize, batchTimeout)
}

export type { ConnectionPool, PoolStats, BatchQuery }
export { SimpleConnectionPool, QueryBatcher }