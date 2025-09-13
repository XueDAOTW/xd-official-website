import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { StatusWithAll, StatusType } from '@/lib/types/shared';
import type { Application } from '@/lib/stores/admin-store';
import { cacheUtils } from './query-client';

// Query Keys
export const queryKeys = {
  all: ['xuedao'] as const,
  applications: () => [...queryKeys.all, 'applications'] as const,
  applicationsByStatus: (status: StatusWithAll) => [...queryKeys.applications(), status] as const,
  applicationCounts: () => [...queryKeys.applications(), 'counts'] as const,
  jobs: () => [...queryKeys.all, 'jobs'] as const,
  jobsByStatus: (status: StatusWithAll) => [...queryKeys.jobs(), status] as const,
  jobCounts: () => [...queryKeys.jobs(), 'counts'] as const,
  settings: () => [...queryKeys.all, 'settings'] as const,
} as const;

// Types for API responses
interface ApplicationsResponse {
  data: Application[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApplicationCountsResponse {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface JobsResponse {
  data: Array<{
    id: string;
    title: string;
    company: string;
    status: StatusType;
    created_at: string;
    updated_at: string;
  }>;
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface CachedData<T> {
  data: T;
  timestamp: number;
}

// API functions with caching
const api = {
  fetchApplications: async (status?: string, page = 1, limit = 10): Promise<ApplicationsResponse> => {
    const cacheKey = `applications-${status || 'all'}-${page}-${limit}`;
    
    // Try cache first for non-critical data
    const cached = cacheUtils.get(cacheKey) as CachedData<ApplicationsResponse> | undefined;
    if (cached && Date.now() - cached.timestamp < 60000) { // 1 minute cache
      return cached.data;
    }

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && status !== 'all' && { status }),
    });

    try {
      const response = await fetch(`/api/applications?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch applications: ${response.statusText}`);
      }
      
      const data: ApplicationsResponse = await response.json();
      
      // Cache the result
      cacheUtils.set(cacheKey, { data, timestamp: Date.now() }, 60000); // 1 minute TTL
      
      return data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  fetchApplicationCounts: async (): Promise<ApplicationCountsResponse> => {
    const cacheKey = 'application-counts';
    
    // Check cache first
    const cached = cacheUtils.get(cacheKey) as CachedData<ApplicationCountsResponse> | undefined;
    if (cached && Date.now() - cached.timestamp < 30000) { // 30 seconds cache
      return cached.data;
    }

    try {
      const response = await fetch('/api/applications?aggregate=counts');
      if (!response.ok) {
        throw new Error(`Failed to fetch application counts: ${response.statusText}`);
      }
      
      const data: ApplicationCountsResponse = await response.json();
      
      // Cache the result
      cacheUtils.set(cacheKey, { data, timestamp: Date.now() }, 30000); // 30 seconds TTL
      
      return data;
    } catch (error) {
      console.error('Error fetching application counts:', error);
      throw error;
    }
  },

  fetchJobs: async (status?: string, page = 1, limit = 10): Promise<JobsResponse> => {
    const cacheKey = `jobs-${status || 'all'}-${page}-${limit}`;
    
    const cached = cacheUtils.get(cacheKey) as CachedData<JobsResponse> | undefined;
    if (cached && Date.now() - cached.timestamp < 120000) { // 2 minutes cache for jobs
      return cached.data;
    }

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && status !== 'all' && { status }),
    });

    try {
      const response = await fetch(`/api/admin/jobs?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.statusText}`);
      }
      
      const data: JobsResponse = await response.json();
      
      cacheUtils.set(cacheKey, { data, timestamp: Date.now() }, 120000); // 2 minutes TTL
      
      return data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  updateApplicationStatus: async (id: string, status: StatusType): Promise<Application> => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update application: ${response.statusText} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  deleteApplication: async (id: string): Promise<{ success: boolean }> => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete application: ${response.statusText} - ${errorText}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  },

  updateJobStatus: async (id: string, status: StatusType): Promise<{ success: boolean }> => {
    try {
      const response = await fetch(`/api/admin/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update job: ${response.statusText} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating job status:', error);
      throw error;
    }
  },
};

// Query Hooks
export const useApplicationsQuery = (status: StatusWithAll = 'all', page = 1, limit = 10) => {
  return useQuery({
    queryKey: queryKeys.applicationsByStatus(status),
    queryFn: () => api.fetchApplications(status === 'all' ? undefined : status, page, limit),
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useApplicationCountsQuery = () => {
  return useQuery({
    queryKey: queryKeys.applicationCounts(),
    queryFn: api.fetchApplicationCounts,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60, // Refetch every minute
  });
};

export const useJobsQuery = (status: StatusWithAll = 'all', page = 1, limit = 10) => {
  return useQuery({
    queryKey: queryKeys.jobsByStatus(status),
    queryFn: () => api.fetchJobs(status === 'all' ? undefined : status, page, limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Mutation Hooks
export const useUpdateApplicationStatusMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: StatusType }) => 
      api.updateApplicationStatus(id, status),
    onMutate: async ({ id, status }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.applications() });
      
      const previousApplications = queryClient.getQueryData(queryKeys.applications());
      
      // Update cached data optimistically
      queryClient.setQueriesData(
        { queryKey: queryKeys.applications() },
        (old: unknown) => {
          const oldData = old as { data?: Application[] } | undefined;
          if (oldData?.data) {
            return {
              ...oldData,
              data: oldData.data.map((app: Application) =>
                app.id === id ? { ...app, status } : app
              ),
            };
          }
          return oldData;
        }
      );
      
      // Clear cache to force refetch
      cacheUtils.delete(`application-counts`);
      
      return { previousApplications };
    },
    onError: (err, variables, context) => {
      // Revert optimistic update on error
      if (context?.previousApplications) {
        queryClient.setQueryData(queryKeys.applications(), context.previousApplications);
      }
    },
    onSettled: () => {
      // Refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.applications() });
      queryClient.invalidateQueries({ queryKey: queryKeys.applicationCounts() });
    },
  });
};

export const useDeleteApplicationMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications() });
      queryClient.invalidateQueries({ queryKey: queryKeys.applicationCounts() });
      // Clear relevant caches
      cacheUtils.clear();
    },
  });
};

export const useUpdateJobStatusMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: StatusType }) => 
      api.updateJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs() });
    },
  });
};

// Prefetch utilities
export const prefetchApplications = (queryClient: ReturnType<typeof useQueryClient>) => {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.applicationsByStatus('all'),
    queryFn: () => api.fetchApplications(),
    staleTime: 1000 * 60,
  });
};

export const prefetchApplicationCounts = (queryClient: ReturnType<typeof useQueryClient>) => {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.applicationCounts(),
    queryFn: api.fetchApplicationCounts,
    staleTime: 1000 * 30,
  });
};