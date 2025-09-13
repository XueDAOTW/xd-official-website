import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import type { Application, AppCounts, ApplicationStatus } from '../types'

import { ApplicationsList } from './ApplicationsList'

interface ApplicationTabsProps {
  applications: Application[]
  loading: boolean
  selectedStatus: ApplicationStatus
  counts: AppCounts
  onStatusChange: (status: ApplicationStatus) => void
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => void
  onDelete: (id: string) => void
}

const tabConfig = [
  {
    value: 'all' as const,
    label: 'All',
    countKey: 'total' as const,
    className: 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md',
  },
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

export function ApplicationTabs({ 
  applications, 
  loading, 
  selectedStatus, 
  counts, 
  onStatusChange, 
  onUpdateStatus, 
  onDelete 
}: ApplicationTabsProps) {
  return (
    <Tabs value={selectedStatus} onValueChange={(value) => onStatusChange(value as ApplicationStatus)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
          {tabConfig.map((tab) => (
            <TabsTrigger 
              key={tab.value}
              value={tab.value} 
              className={`${tab.className} font-bold text-xs md:text-sm px-3 py-2`}
            >
              {tab.label} ({counts[tab.countKey]})
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="text-sm text-gray-600 font-medium">
          Showing {applications.length} applications
        </div>
      </div>

      <TabsContent value={selectedStatus} className="mt-0">
        <ApplicationsList
          applications={applications}
          loading={loading}
          selectedStatus={selectedStatus}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
        />
      </TabsContent>
    </Tabs>
  )
}