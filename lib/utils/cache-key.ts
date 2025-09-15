// Utility for generating deterministic cache keys
export function generateCacheKey(prefix: string, params: Record<string, unknown>): string {
  // Sort keys to ensure consistent order
  const sortedKeys = Object.keys(params).sort();
  
  // Create deterministic string representation
  const paramString = sortedKeys
    .map(key => {
      const value = params[key];
      
      // Handle different value types consistently
      if (value === null || value === undefined) {
        return `${key}=null`;
      }
      
      if (typeof value === 'object') {
        return `${key}=${JSON.stringify(value, Object.keys(value).sort())}`;
      }
      
      if (typeof value === 'string') {
        return `${key}=${value}`;
      }
      
      return `${key}=${String(value)}`;
    })
    .join('&');
  
  return `${prefix}-${paramString}`;
}

// Generate cache key for pagination parameters
export function generatePaginationCacheKey(
  prefix: string, 
  pagination?: { page?: number; limit?: number; offset?: number }
): string {
  if (!pagination) {
    return `${prefix}-pagination=default`;
  }
  
  return generateCacheKey(prefix, {
    page: pagination.page || 1,
    limit: pagination.limit || 10,
    offset: pagination.offset || 0
  });
}

// Generate cache key for filter parameters
export function generateFilterCacheKey(
  prefix: string,
  filters?: { 
    status?: string; 
    search?: string; 
    dateFrom?: string; 
    dateTo?: string;
    [key: string]: unknown;
  }
): string {
  if (!filters || Object.keys(filters).length === 0) {
    return `${prefix}-filters=none`;
  }
  
  // Remove undefined/null values and sort
  const cleanFilters = Object.entries(filters)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, unknown>);
  
  if (Object.keys(cleanFilters).length === 0) {
    return `${prefix}-filters=none`;
  }
  
  return generateCacheKey(prefix, cleanFilters);
}

// Generate combined cache key for queries with both pagination and filters
export function generateQueryCacheKey(
  prefix: string,
  pagination?: { page?: number; limit?: number; offset?: number },
  filters?: Record<string, unknown>,
  additionalParams?: Record<string, unknown>
): string {
  const allParams: Record<string, unknown> = {};
  
  // Add pagination parameters
  if (pagination) {
    allParams.page = pagination.page || 1;
    allParams.limit = pagination.limit || 10;
    if (pagination.offset !== undefined) {
      allParams.offset = pagination.offset;
    }
  }
  
  // Add filter parameters (excluding null/undefined values)
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        allParams[key] = value;
      }
    });
  }
  
  // Add any additional parameters
  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        allParams[key] = value;
      }
    });
  }
  
  return generateCacheKey(prefix, allParams);
}

// Hash long cache keys for better performance
export function hashCacheKey(key: string): string {
  if (key.length <= 100) {
    return key; // Short keys don't need hashing
  }
  
  // Simple hash function for longer keys
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Return prefix + hash to maintain some readability
  const prefix = key.substring(0, 20);
  return `${prefix}-hash:${Math.abs(hash).toString(36)}`;
}