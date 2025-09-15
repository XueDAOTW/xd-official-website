import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types';
import { BaseRepository, type PaginationParams, type FilterParams, type QueryResult } from './base-repository';

type JobRow = Database['public']['Tables']['jobs']['Row'];
type JobInsert = Database['public']['Tables']['jobs']['Insert'];
type JobUpdate = Database['public']['Tables']['jobs']['Update'];

export class JobRepository extends BaseRepository<JobRow> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'jobs');
  }

  async findById(id: string): Promise<JobRow | null> {
    try {
      const { data, error } = await this.supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        this.handleError(error, 'Find job by ID');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Find job by ID');
    }
  }

  async findAll(
    pagination?: PaginationParams,
    filters?: FilterParams
  ): Promise<QueryResult<JobRow>> {
    const cacheKey = this.generateCacheKey('findAll', pagination, filters);
    
    let query = this.supabase
      .from('jobs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    query = this.buildFilterQuery(query, filters);
    query = this.buildPaginationQuery(query, pagination);

    return this.executeQuery<JobRow>(
      query,
      'Fetch jobs',
      cacheKey,
      120000 // 2 minutes cache
    );
  }

  async findPublicJobs(
    pagination?: PaginationParams,
    filters?: Omit<FilterParams, 'status'>
  ): Promise<QueryResult<JobRow>> {
    const cacheKey = this.generateCacheKey('findPublicJobs', pagination, { ...filters, status: 'approved' });
    
    let query = this.supabase
      .from('jobs')
      .select('*', { count: 'exact' })
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    query = this.buildFilterQuery(query, { ...filters, status: 'approved' });
    query = this.buildPaginationQuery(query, pagination);

    return this.executeQuery<JobRow>(
      query,
      'Fetch public jobs',
      cacheKey,
      300000 // 5 minutes cache for public jobs
    );
  }

  async create(data: JobInsert): Promise<JobRow> {
    try {
      const { data: created, error } = await this.supabase
        .from('jobs')
        .insert({
          ...data,
          status: data.status || 'pending',
        })
        .select()
        .single();

      if (error) {
        this.handleError(error, 'Create job');
      }

      // Clear caches after creation
      this.clearCache('jobs');

      return created!;
    } catch (error) {
      this.handleError(error, 'Create job');
    }
  }

  async update(id: string, data: JobUpdate): Promise<JobRow> {
    try {
      const { data: updated, error } = await this.supabase
        .from('jobs')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.handleError(error, 'Update job');
      }

      // Clear related caches
      this.clearCache('jobs');

      return updated!;
    } catch (error) {
      this.handleError(error, 'Update job');
    }
  }

  async updateStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<JobRow> {
    return this.update(id, { status });
  }

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) {
        this.handleError(error, 'Delete job');
      }

      return true;
    } catch (error) {
      this.handleError(error, 'Delete job');
    }
  }

  async findByCompany(company: string): Promise<JobRow[]> {
    try {
      const { data, error } = await this.supabase
        .from('jobs')
        .select('*')
        .ilike('company', `%${company}%`)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        this.handleError(error, 'Find jobs by company');
      }

      return data || [];
    } catch (error) {
      this.handleError(error, 'Find jobs by company');
    }
  }

  async findByLocation(location: string): Promise<JobRow[]> {
    try {
      const { data, error } = await this.supabase
        .from('jobs')
        .select('*')
        .ilike('location', `%${location}%`)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        this.handleError(error, 'Find jobs by location');
      }

      return data || [];
    } catch (error) {
      this.handleError(error, 'Find jobs by location');
    }
  }

  // Override filter query for job-specific search
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
      // Search across multiple fields for jobs
      query = query.or(`title.ilike.%${search}%,company.ilike.%${search}%,location.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }

    if (dateTo) {
      query = query.lte('created_at', dateTo);
    }

    return query;
  }

  async getFeaturedJobs(limit = 5): Promise<JobRow[]> {
    const cacheKey = this.generateCacheKey('getFeaturedJobs', undefined, undefined, { limit });
    const cached = this.getCachedArray<JobRow>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const { data, error } = await this.supabase
        .from('jobs')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        this.handleError(error, 'Fetch featured jobs');
      }

      const results = data || [];
      // Cache featured jobs for 10 minutes
      this.setCachedQuery(cacheKey, results, results.length, 600000);
      return results;
    } catch (error) {
      this.handleError(error, 'Fetch featured jobs');
    }
  }

  async getJobsByDateRange(
    startDate: string,
    endDate: string,
    includeAll = false
  ): Promise<JobRow[]> {
    try {
      let query = this.supabase
        .from('jobs')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (!includeAll) {
        query = query.eq('status', 'approved');
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        this.handleError(error, 'Fetch jobs by date range');
      }

      return data || [];
    } catch (error) {
      this.handleError(error, 'Fetch jobs by date range');
    }
  }

  async searchJobs(searchTerm: string, limit = 20): Promise<JobRow[]> {
    const cacheKey = this.generateCacheKey('searchJobs', undefined, undefined, { searchTerm, limit });
    const cached = this.getCachedArray<JobRow>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const { data, error } = await this.supabase
        .from('jobs')
        .select('*')
        .eq('status', 'approved')
        .or(`title.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        this.handleError(error, 'Search jobs');
      }

      const results = data || [];
      // Cache search results for 2 minutes
      this.setCachedQuery(cacheKey, results, results.length, 120000);
      return results;
    } catch (error) {
      this.handleError(error, 'Search jobs');
    }
  }

  // Bulk operations for jobs
  async createManyJobs(jobs: JobInsert[]): Promise<JobRow[]> {
    const results = await this.bulkInsert(jobs);
    this.clearCache('jobs');
    return results;
  }

  async updateManyJobStatuses(updates: Array<{ id: string; status: 'pending' | 'approved' | 'rejected' }>): Promise<JobRow[]> {
    const results = await this.bulkUpdate(
      updates.map(({ id, status }) => ({
        id,
        data: { status, updated_at: new Date().toISOString() } as JobUpdate,
      }))
    );
    this.clearCache('jobs');
    return results;
  }
}