import type { JobItem } from '@/types'

import { JobCard } from './JobCard'

interface JobListProps {
  jobs: JobItem[]
  loading: boolean
}

export function JobList({ jobs, loading }: JobListProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Loading jobs...</div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">No jobs found matching your criteria.</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}