import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { StatusType, StatusWithAll, Counts } from '@/lib/types/shared';

export interface Application {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  student_status: string;
  status: StatusType;
  created_at: string;
  telegram_id?: string;
  motivation?: string;
  web3_interests?: string;
  skills_bringing?: string;
  web3_journey?: string;
  contribution_areas?: string;
  how_know_us?: string;
  referrer_name?: string;
  last_words?: string;
  years_since_graduation?: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_range?: string;
  description: string;
  requirements: string;
  status: StatusType;
  created_at: string;
  updated_at: string;
}

export interface AdminState {
  // Applications
  applications: Application[];
  applicationCounts: Counts | null;
  selectedApplicationStatus: StatusWithAll;
  applicationsLoading: boolean;
  
  // Jobs
  jobs: Job[];
  jobCounts: Counts | null;
  selectedJobStatus: StatusWithAll;
  jobsLoading: boolean;
  
  // UI state
  refreshing: boolean;
  lastRefresh: number | null;
}

export interface AdminActions {
  // Applications
  setApplications: (applications: Application[]) => void;
  setApplicationCounts: (counts: Counts) => void;
  setSelectedApplicationStatus: (status: StatusWithAll) => void;
  setApplicationsLoading: (loading: boolean) => void;
  updateApplicationStatus: (id: string, status: StatusType) => void;
  removeApplication: (id: string) => void;
  
  // Jobs
  setJobs: (jobs: Job[]) => void;
  setJobCounts: (counts: Counts) => void;
  setSelectedJobStatus: (status: StatusWithAll) => void;
  setJobsLoading: (loading: boolean) => void;
  updateJobStatus: (id: string, status: StatusType) => void;
  removeJob: (id: string) => void;
  
  // Utility
  setRefreshing: (refreshing: boolean) => void;
  updateLastRefresh: () => void;
  reset: () => void;
}

export type AdminStore = AdminState & AdminActions;

const initialState: AdminState = {
  applications: [],
  applicationCounts: null,
  selectedApplicationStatus: 'all',
  applicationsLoading: false,
  
  jobs: [],
  jobCounts: null,
  selectedJobStatus: 'all',
  jobsLoading: false,
  
  refreshing: false,
  lastRefresh: null,
};

export const useAdminStore = create<AdminStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Applications
      setApplications: (applications) => set({ applications }, false, 'setApplications'),
      setApplicationCounts: (applicationCounts) => set({ applicationCounts }, false, 'setApplicationCounts'),
      setSelectedApplicationStatus: (selectedApplicationStatus) => 
        set({ selectedApplicationStatus }, false, 'setSelectedApplicationStatus'),
      setApplicationsLoading: (applicationsLoading) => set({ applicationsLoading }, false, 'setApplicationsLoading'),
      
      updateApplicationStatus: (id, status) =>
        set(
          (state) => ({
            applications: state.applications.map((app) =>
              app.id === id ? { ...app, status } : app
            ),
            applicationCounts: state.applicationCounts
              ? {
                  ...state.applicationCounts,
                  [status]: (state.applicationCounts[status] || 0) + 1,
                  // Decrease count from previous status
                  ...(state.applications.find(app => app.id === id)?.status && {
                    [state.applications.find(app => app.id === id)!.status]: 
                      Math.max(0, (state.applicationCounts[state.applications.find(app => app.id === id)!.status] || 1) - 1)
                  })
                }
              : null,
          }),
          false,
          'updateApplicationStatus'
        ),
      
      removeApplication: (id) =>
        set(
          (state) => {
            const app = state.applications.find(a => a.id === id);
            return {
              applications: state.applications.filter((app) => app.id !== id),
              applicationCounts: state.applicationCounts && app
                ? {
                    ...state.applicationCounts,
                    total: Math.max(0, (state.applicationCounts.total || 0) - 1),
                    [app.status]: Math.max(0, (state.applicationCounts[app.status] || 1) - 1),
                  }
                : state.applicationCounts,
            };
          },
          false,
          'removeApplication'
        ),
      
      // Jobs
      setJobs: (jobs) => set({ jobs }, false, 'setJobs'),
      setJobCounts: (jobCounts) => set({ jobCounts }, false, 'setJobCounts'),
      setSelectedJobStatus: (selectedJobStatus) => set({ selectedJobStatus }, false, 'setSelectedJobStatus'),
      setJobsLoading: (jobsLoading) => set({ jobsLoading }, false, 'setJobsLoading'),
      
      updateJobStatus: (id, status) =>
        set(
          (state) => ({
            jobs: state.jobs.map((job) =>
              job.id === id ? { ...job, status } : job
            ),
            jobCounts: state.jobCounts
              ? {
                  ...state.jobCounts,
                  [status]: (state.jobCounts[status] || 0) + 1,
                  // Decrease count from previous status
                  ...(state.jobs.find(job => job.id === id)?.status && {
                    [state.jobs.find(job => job.id === id)!.status]: 
                      Math.max(0, (state.jobCounts[state.jobs.find(job => job.id === id)!.status] || 1) - 1)
                  })
                }
              : null,
          }),
          false,
          'updateJobStatus'
        ),
      
      removeJob: (id) =>
        set(
          (state) => {
            const job = state.jobs.find(j => j.id === id);
            return {
              jobs: state.jobs.filter((job) => job.id !== id),
              jobCounts: state.jobCounts && job
                ? {
                    ...state.jobCounts,
                    total: Math.max(0, (state.jobCounts.total || 0) - 1),
                    [job.status]: Math.max(0, (state.jobCounts[job.status] || 1) - 1),
                  }
                : state.jobCounts,
            };
          },
          false,
          'removeJob'
        ),
      
      // Utility
      setRefreshing: (refreshing) => set({ refreshing }, false, 'setRefreshing'),
      updateLastRefresh: () => set({ lastRefresh: Date.now() }, false, 'updateLastRefresh'),
      reset: () => set(initialState, false, 'reset'),
    }),
    {
      name: 'XueDAO Admin Store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// Optimized selectors
export const useApplications = () => useAdminStore((state) => state.applications);
export const useApplicationCounts = () => useAdminStore((state) => state.applicationCounts);
export const useApplicationsLoading = () => useAdminStore((state) => state.applicationsLoading);
export const useSelectedApplicationStatus = () => useAdminStore((state) => state.selectedApplicationStatus);

export const useJobs = () => useAdminStore((state) => state.jobs);
export const useJobCounts = () => useAdminStore((state) => state.jobCounts);
export const useJobsLoading = () => useAdminStore((state) => state.jobsLoading);
export const useSelectedJobStatus = () => useAdminStore((state) => state.selectedJobStatus);