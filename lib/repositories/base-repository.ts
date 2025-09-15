import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, StatusType } from '@/types';
import { QueryResultCache } from '@/lib/utils/lru-cache';
import { generateQueryCacheKey, hashCacheKey } from '@/lib/utils/cache-key';

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface FilterParams {
  status?: StatusType | 'all';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: unknown; // Allow additional filter parameters
}

export interface QueryResult<T> {
  data: T[];
  count: number | null;
  error?: string;
}

export interface CountsResult {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export abstract class BaseRepository<T> {
  protected supabase: SupabaseClient<Database>;
  protected tableName: keyof Database['public']['Tables'];
  private queryCache: QueryResultCache<any>;

  constructor(supabase: SupabaseClient<Database>, tableName: keyof Database['public']['Tables']) {
    this.supabase = supabase;
    this.tableName = tableName;
    // Initialize LRU cache with reasonable defaults
    this.queryCache = new QueryResultCache(100, 30000); // 100 items, 30s TTL
  }

  // Repository-level caching with LRU eviction
  protected getCachedQuery<R>(key: string): QueryResult<R> | null {
    const cached = this.queryCache.getCachedQuery(key);
    if (cached) {
      return cached as QueryResult<R>;
    }
    return null;
  }

  // Get cached array results directly (for methods returning T[] instead of QueryResult<T>)
  protected getCachedArray<T>(key: string): T[] | null {
    const cached = this.queryCache.getCachedQuery(key);
    if (cached && cached.data && Array.isArray(cached.data)) {
      return cached.data as T[];
    }
    return null;
  }

  protected setCachedQuery<R>(key: string, data: R[], count: number | null, ttl = 30000): void {
    this.queryCache.setCachedQuery(key, data, count, ttl);
  }

  protected clearCache(pattern?: string): void {
    if (pattern) {
      this.queryCache.deletePattern(pattern);
    } else {
      this.queryCache.clear();
    }
  }

  // Get cache statistics for monitoring
  protected getCacheStats() {
    return this.queryCache.getStats();
  }

  // Clean up expired entries
  protected cleanupCache(): number {
    return this.queryCache.cleanup();
  }

  // Generate deterministic cache key
  protected generateCacheKey(
    operation: string,
    pagination?: PaginationParams,
    filters?: FilterParams,
    additionalParams?: Record<string, unknown>
  ): string {
    const prefix = `${this.tableName}-${operation}`;
    const key = generateQueryCacheKey(prefix, pagination, filters, additionalParams);
    return hashCacheKey(key);
  }

  abstract findById(id: string): Promise<T | null>;
  abstract create(data: Partial<T>): Promise<T>;
  abstract update(id: string, data: Partial<T>): Promise<T>;
  abstract delete(id: string): Promise<boolean>;

  // Validation helper
  protected validateId(id: string): void {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw new Error('Invalid ID provided');
    }
  }

  // Validation helper for pagination
  protected validatePagination(pagination?: PaginationParams): PaginationParams {
    if (!pagination) {
      return { page: 1, limit: 10 };
    }

    const page = Math.max(1, pagination.page || 1);
    const limit = Math.min(Math.max(1, pagination.limit || 10), 100); // Cap at 100

    return { page, limit };
  }

  protected async executeQuery<R>(
    queryBuilder: any,
    errorMessage: string,
    cacheKey?: string,
    cacheTtl = 30000
  ): Promise<QueryResult<R>> {
    // Check cache first if cache key provided
    if (cacheKey) {
      const cached = this.getCachedQuery<R>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      const result = await queryBuilder;
      
      if (result.error) {
        console.error(`${errorMessage}:`, result.error);
        // Handle specific Supabase errors
        if (result.error.code === 'PGRST116') {
          return {
            data: [],
            count: 0,
            error: 'No records found',
          };
        }
        return {
          data: [],
          count: 0,
          error: result.error.message || 'Database error',
        };
      }

      const queryResult = {
        data: result.data || [],
        count: result.count ?? result.data?.length ?? 0,
      };

      // Cache successful results
      if (cacheKey && queryResult.data.length > 0) {
        this.setCachedQuery(cacheKey, queryResult.data, queryResult.count, cacheTtl);
      }

      return queryResult;
    } catch (error) {
      console.error(`${errorMessage}:`, error);
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  protected buildPaginationQuery(
    query: any,
    pagination?: PaginationParams
  ) {
    const validatedPagination = this.validatePagination(pagination);
    const { page = 1, limit = 10 } = validatedPagination;
    const offset = (page - 1) * limit;

    // Add limit to improve performance
    return query.range(offset, offset + limit - 1).limit(limit);
  }

  // Batch operations for better performance
  protected async batchSelect<R>(
    queries: Array<{ query: any; key: string }>
  ): Promise<Array<QueryResult<R>>> {
    const results = await Promise.allSettled(
      queries.map(({ query }) => query)
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        const { data, error, count } = result.value;
        if (error) {
          return {
            data: [],
            count: 0,
            error: error.message,
          };
        }
        return {
          data: data || [],
          count: count ?? data?.length ?? 0,
        };
      } else {
        return {
          data: [],
          count: 0,
          error: result.reason?.message || 'Query failed',
        };
      }
    });
  }

  // Bulk operations
  protected async bulkInsert<InsertType>(
    items: InsertType[],
    batchSize = 100
  ): Promise<T[]> {
    const results: T[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      
      try {
        const { data, error } = await this.supabase
          .from(this.tableName)
          .insert(batch as any)
          .select();
        
        if (error) {
          console.error(`Bulk insert batch ${i / batchSize + 1} failed:`, error);
          continue;
        }
        
        if (data) {
          results.push(...(data as T[]));
        }
      } catch (error) {
        console.error(`Bulk insert batch ${i / batchSize + 1} failed:`, error);
      }
    }
    
    return results;
  }

  protected async bulkUpdate<UpdateType>(
    updates: Array<{ id: string; data: UpdateType }>,
    batchSize = 50
  ): Promise<T[]> {
    const results: T[] = [];
    
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      
      const promises = batch.map(({ id, data }) =>
        this.supabase
          .from(this.tableName)
          .update(data as any)
          .eq('id', id)
          .select()
          .single()
      );
      
      try {
        const batchResults = await Promise.allSettled(promises);
        
        batchResults.forEach((result) => {
          if (result.status === 'fulfilled' && result.value.data) {
            results.push(result.value.data as T);
          }
        });
      } catch (error) {
        console.error(`Bulk update batch ${i / batchSize + 1} failed:`, error);
      }
    }
    
    return results;
  }

  protected buildFilterQuery(
    query: any,
    filters?: FilterParams
  ) {
    if (!filters) return query;

    const { status, search, dateFrom, dateTo } = filters;

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      // This will need to be customized per table
      query = query.ilike('name', `%${search}%`);
    }

    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }

    if (dateTo) {
      query = query.lte('created_at', dateTo);
    }

    return query;
  }

  async getCounts(): Promise<CountsResult> {
    const cacheKey = `${this.tableName}-counts`;
    const cached = this.getCachedQuery<CountsResult>(cacheKey);
    if (cached && cached.data.length > 0) {
      return cached.data[0];
    }

    try {
      // Use more efficient count queries
      const [totalResult, pendingResult, approvedResult, rejectedResult] = await Promise.all([
        this.supabase.from(this.tableName).select('id', { count: 'exact', head: true }),
        this.supabase.from(this.tableName).select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        this.supabase.from(this.tableName).select('id', { count: 'exact', head: true }).eq('status', 'approved'),
        this.supabase.from(this.tableName).select('id', { count: 'exact', head: true }).eq('status', 'rejected'),
      ]);

      const counts: CountsResult = {
        total: totalResult.count || 0,
        pending: pendingResult.count || 0,
        approved: approvedResult.count || 0,
        rejected: rejectedResult.count || 0,
      };

      // Cache for 1 minute
      this.setCachedQuery(cacheKey, [counts], 1, 60000);
      return counts;
    } catch (error) {
      console.error('Error calculating counts:', error);
      return { total: 0, pending: 0, approved: 0, rejected: 0 };
    }
  }

  protected handleError(error: unknown, operation: string): never {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`${operation} failed:`, error);
    throw new Error(`${operation}: ${message}`);
  }
}