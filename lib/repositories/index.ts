import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { ApplicationRepository } from './application-repository';
import { JobRepository } from './job-repository';

// Repository factory for dependency injection and centralized management
export class RepositoryFactory {
  private static instance: RepositoryFactory;
  private supabaseClient: ReturnType<typeof createClient<Database>>;
  private applicationRepo?: ApplicationRepository;
  private jobRepo?: JobRepository;

  private constructor() {
    // Use service role for server-side operations
    this.supabaseClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }

  static getInstance(): RepositoryFactory {
    if (!RepositoryFactory.instance) {
      RepositoryFactory.instance = new RepositoryFactory();
    }
    return RepositoryFactory.instance;
  }

  // Lazy initialization with singleton pattern
  getApplicationRepository(): ApplicationRepository {
    if (!this.applicationRepo) {
      this.applicationRepo = new ApplicationRepository(this.supabaseClient);
    }
    return this.applicationRepo;
  }

  getJobRepository(): JobRepository {
    if (!this.jobRepo) {
      this.jobRepo = new JobRepository(this.supabaseClient);
    }
    return this.jobRepo;
  }

  // For client-side usage with user auth
  static createClientRepositories(userSupabaseClient: ReturnType<typeof createClient<Database>>) {
    return {
      applications: new ApplicationRepository(userSupabaseClient),
      jobs: new JobRepository(userSupabaseClient),
    };
  }

  // Health check for repositories
  async healthCheck(): Promise<boolean> {
    try {
      const { data, error } = await this.supabaseClient
        .from('applications')
        .select('count')
        .limit(1);
      
      return !error;
    } catch (error) {
      console.error('Repository health check failed:', error);
      return false;
    }
  }

  // Clean up connections (useful for testing)
  destroy(): void {
    this.applicationRepo = undefined;
    this.jobRepo = undefined;
  }
}

// Convenience exports for server-side usage
export const getApplicationRepository = () => 
  RepositoryFactory.getInstance().getApplicationRepository();

export const getJobRepository = () => 
  RepositoryFactory.getInstance().getJobRepository();

// Re-export types and classes
export { ApplicationRepository } from './application-repository';
export { JobRepository } from './job-repository';
export { BaseRepository } from './base-repository';
export type { PaginationParams, FilterParams, QueryResult, CountsResult } from './base-repository';