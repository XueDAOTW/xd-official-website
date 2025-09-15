import { Briefcase, Filter, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

import type { AdminJobItem as Job, JobStatus } from '@/types'
import { getTabTitle } from '../utils/jobUtils'

import { JobItem } from './JobItem'

interface JobsTableProps {
  jobs: Job[]
  loading: boolean
  activeTab: JobStatus
  amount: number
  onUpdateStatus: (jobId: string, status: 'approved' | 'rejected') => void
  onDelete: (jobId: string) => void
}

export function JobsTable({ jobs, loading, activeTab, amount, onUpdateStatus, onDelete }: JobsTableProps) {

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50/80 to-blue-50/30 border-b border-gray-200/50 px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg md:text-xl">
                {getTabTitle(activeTab)}
              </h3>
              <p className="text-gray-600 font-medium text-sm">{amount} total job{amount !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="font-semibold">
            <Filter className="h-4 w-4 mr-2" />
            Filter Jobs
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <RefreshCw className="h-8 w-8 animate-spin text-white" />
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">Loading Jobs</p>
            <p className="text-gray-500 font-medium">Please wait while we fetch the job listings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">No Jobs Found</p>
            <p className="text-gray-500 font-medium">There are no jobs in the {activeTab} category.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100/80">
            {jobs.map((job) => (
              <JobItem
                key={job.id}
                job={job}
                onUpdateStatus={onUpdateStatus}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}