import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import type { JobItem, JobCounts, JobStatus } from '../types'

import { JobsTable } from './JobsTable'

interface JobsTabsProps {
  jobs: JobItem[]
  loading: boolean
  activeTab: JobStatus
  counts: JobCounts | null
  onTabChange: (tab: JobStatus) => void
  onUpdateStatus: (jobId: string, status: 'approved' | 'rejected') => void
  onDelete: (jobId: string) => void
}

const tabConfig = [
  {
    value: 'pending' as const,
    label: 'Pending',
    countKey: 'pending' as const,
    className: 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md',
  },
  {
    value: 'approved' as const,
    label: 'Approved', 
    countKey: 'approved' as const,
    className: 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md',
  },
  {
    value: 'rejected' as const,
    label: 'Rejected',
    countKey: 'rejected' as const,
    className: 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-md',
  },
]

export function JobsTabs({ 
  jobs, 
  loading, 
  activeTab, 
  counts, 
  onTabChange, 
  onUpdateStatus, 
  onDelete 
}: JobsTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as JobStatus)} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <TabsList className="grid grid-cols-3 w-full sm:w-auto bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
          {tabConfig.map((tab) => (
            <TabsTrigger 
              key={tab.value}
              value={tab.value} 
              className={`${tab.className} font-bold text-xs md:text-sm px-4 py-2`}
            >
              {tab.label} ({counts ? counts[tab.countKey] : '...'})
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="text-sm text-gray-600 font-medium">
          Showing {jobs.length} job{jobs.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      {tabConfig.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <JobsTable 
            jobs={jobs}
            loading={loading}
            activeTab={activeTab}
            amount={counts ? counts[tab.countKey] : 0}
            onUpdateStatus={onUpdateStatus}
            onDelete={onDelete}
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}