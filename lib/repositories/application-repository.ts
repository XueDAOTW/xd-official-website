import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { BaseRepository, type PaginationParams, type FilterParams, type QueryResult } from './base-repository';

type ApplicationRow = Database['public']['Tables']['applications']['Row'];
type ApplicationInsert = Database['public']['Tables']['applications']['Insert'];
type ApplicationUpdate = Database['public']['Tables']['applications']['Update'];

export class ApplicationRepository extends BaseRepository<ApplicationRow> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'applications');
  }

  async findById(id: string): Promise<ApplicationRow | null> {
    this.validateId(id);
    
    try {
      const { data, error } = await this.supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        this.handleError(error, 'Find application by ID');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Find application by ID');
    }
  }

  async findAll(
    pagination?: PaginationParams,
    filters?: FilterParams
  ): Promise<QueryResult<ApplicationRow>> {
    const cacheKey = `applications-all-${JSON.stringify({ pagination, filters })}`;
    
    let query = this.supabase
      .from('applications')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    query = this.buildFilterQuery(query, filters);
    
    // Apply pagination
    query = this.buildPaginationQuery(query, pagination);

    return this.executeQuery<ApplicationRow>(
      query,
      'Fetch applications',
      cacheKey,
      60000 // 1 minute cache
    );
  }

  async create(data: ApplicationInsert): Promise<ApplicationRow> {
    try {
      // Validate required fields
      this.validateApplicationData(data);

      // Check for duplicates before creating
      const isDuplicate = await this.checkForDuplicate(data);
      if (isDuplicate) {
        throw new Error('Application with this email, telegram ID, or personal information already exists');
      }

      const { data: created, error } = await this.supabase
        .from('applications')
        .insert({
          ...data,
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        this.handleError(error, 'Create application');
      }

      // Clear caches after creation
      this.clearCache('applications');

      return created!;
    } catch (error) {
      this.handleError(error, 'Create application');
    }
  }

  private validateApplicationData(data: ApplicationInsert): void {
    const requiredFields = ['name', 'email', 'university', 'telegram_id'];
    
    for (const field of requiredFields) {
      if (!data[field as keyof ApplicationInsert] || 
          (typeof data[field as keyof ApplicationInsert] === 'string' && 
           data[field as keyof ApplicationInsert]?.toString().trim().length === 0)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }

    // Validate telegram ID format (should start with @ or be numeric)
    if (!data.telegram_id.match(/^@?[a-zA-Z0-9_]+$/)) {
      throw new Error('Invalid Telegram ID format');
    }
  }

  async update(id: string, data: ApplicationUpdate): Promise<ApplicationRow> {
    this.validateId(id);
    
    try {
      const { data: updated, error } = await this.supabase
        .from('applications')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.handleError(error, 'Update application');
      }

      // Clear related caches
      this.clearCache('applications');

      return updated!;
    } catch (error) {
      this.handleError(error, 'Update application');
    }
  }

  async updateStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<ApplicationRow> {
    this.validateId(id);
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      throw new Error('Invalid status value');
    }
    
    return this.update(id, { status });
  }

  async delete(id: string): Promise<boolean> {
    this.validateId(id);
    
    try {
      const { error } = await this.supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (error) {
        this.handleError(error, 'Delete application');
      }

      return true;
    } catch (error) {
      this.handleError(error, 'Delete application');
    }
  }

  async findByEmail(email: string): Promise<ApplicationRow | null> {
    try {
      const { data, error } = await this.supabase
        .from('applications')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        this.handleError(error, 'Find application by email');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Find application by email');
    }
  }

  async findByTelegramId(telegramId: string): Promise<ApplicationRow | null> {
    try {
      const { data, error } = await this.supabase
        .from('applications')
        .select('*')
        .eq('telegram_id', telegramId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        this.handleError(error, 'Find application by Telegram ID');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Find application by Telegram ID');
    }
  }

  private async checkForDuplicate(data: ApplicationInsert): Promise<boolean> {
    const cacheKey = `duplicate-check-${data.email}-${data.telegram_id}`;
    const cached = this.getCachedQuery<boolean>(cacheKey);
    if (cached !== null) {
      return cached;
    }

    try {
      // Use more efficient queries with parallel execution
      const [emailCheck, telegramCheck, nameUniversityCheck] = await Promise.all([
        this.supabase
          .from('applications')
          .select('id', { count: 'exact', head: true })
          .eq('email', data.email)
          .limit(1),
        this.supabase
          .from('applications')
          .select('id', { count: 'exact', head: true })
          .eq('telegram_id', data.telegram_id)
          .limit(1),
        this.supabase
          .from('applications')
          .select('id', { count: 'exact', head: true })
          .eq('name', data.name)
          .eq('university', data.university)
          .limit(1),
      ]);

      const isDuplicate = 
        (emailCheck.count && emailCheck.count > 0) ||
        (telegramCheck.count && telegramCheck.count > 0) ||
        (nameUniversityCheck.count && nameUniversityCheck.count > 0);

      // Cache result for 5 minutes
      this.setCachedQuery(cacheKey, Boolean(isDuplicate), 300000);
      return Boolean(isDuplicate);
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      return false;
    }
  }

  // Override the base filter query to handle application-specific search
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
      // Search across multiple fields for applications
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,university.ilike.%${search}%,telegram_id.ilike.%${search}%`);
    }

    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }

    if (dateTo) {
      query = query.lte('created_at', dateTo);
    }

    return query;
  }

  async getRecentApplications(limit = 5): Promise<ApplicationRow[]> {
    const cacheKey = `applications-recent-${limit}`;
    const cached = this.getCachedQuery<ApplicationRow[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const { data, error } = await this.supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        this.handleError(error, 'Fetch recent applications');
      }

      const results = data || [];
      // Cache for 2 minutes
      this.setCachedQuery(cacheKey, results, 120000);
      return results;
    } catch (error) {
      this.handleError(error, 'Fetch recent applications');
    }
  }

  // Bulk operations for applications
  async updateManyApplicationStatuses(updates: Array<{ id: string; status: 'pending' | 'approved' | 'rejected' }>): Promise<ApplicationRow[]> {
    const results = await this.bulkUpdate(
      updates.map(({ id, status }) => ({
        id,
        data: { status } as ApplicationUpdate,
      }))
    );
    this.clearCache('applications');
    return results;
  }

  // Efficient search with caching
  async searchApplications(searchTerm: string, limit = 20): Promise<ApplicationRow[]> {
    const cacheKey = `applications-search-${searchTerm}-${limit}`;
    const cached = this.getCachedQuery<ApplicationRow[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const { data, error } = await this.supabase
        .from('applications')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,university.ilike.%${searchTerm}%,telegram_id.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        this.handleError(error, 'Search applications');
      }

      const results = data || [];
      // Cache search results for 2 minutes
      this.setCachedQuery(cacheKey, results, 120000);
      return results;
    } catch (error) {
      this.handleError(error, 'Search applications');
    }
  }

  async getApplicationsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<ApplicationRow[]> {
    try {
      const { data, error } = await this.supabase
        .from('applications')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false });

      if (error) {
        this.handleError(error, 'Fetch applications by date range');
      }

      return data || [];
    } catch (error) {
      this.handleError(error, 'Fetch applications by date range');
    }
  }
}