import { MapPin, Calendar, Building, Trash2, Check, X, Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CompanyLogo } from '@/components/ui/company-logo'
import { StatusBadge } from '@/components/ui/status-badge'

import type { AdminJobItem as Job } from '@/types'
import { formatJobDate, formatSalaryRange } from '../utils/jobUtils'

interface JobItemProps {
  job: Job
  onUpdateStatus: (jobId: string, status: 'approved' | 'rejected') => void
  onDelete: (jobId: string) => void
}

interface JobItemActionsProps {
  job: Job
  onUpdateStatus: (jobId: string, status: 'approved' | 'rejected') => void
  onDelete: (jobId: string) => void
}

function JobItemActions({ job, onUpdateStatus, onDelete }: JobItemActionsProps) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      {job.status === 'pending' && (
        <>
          <Button 
            size="sm" 
            className="bg-green-600 hover:bg-green-700 font-semibold shadow-sm transition-all hover:scale-105" 
            onClick={() => onUpdateStatus(job.id, 'approved')}
          >
            <Check className="h-4 w-4 mr-1" />Approve
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-red-200 text-red-600 hover:bg-red-50 font-semibold shadow-sm transition-all hover:scale-105" 
            onClick={() => onUpdateStatus(job.id, 'rejected')}
          >
            <X className="h-4 w-4 mr-1" />Reject
          </Button>
        </>
      )}
      <Button size="sm" variant="outline" className="font-semibold">
        <Eye className="h-4 w-4" />
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        className="border-red-200 text-red-600 hover:bg-red-50 font-semibold" 
        onClick={() => onDelete(job.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

interface JobDetailsProps {
  job: Job
}

function JobDetails({ job }: JobDetailsProps) {
  const salaryRange = formatSalaryRange(job.salary_min, job.salary_max)
  
  const details = [
    {
      label: 'Email',
      value: job.company_email,
      className: 'truncate'
    },
    {
      label: 'Category', 
      value: job.category
    },
    ...(salaryRange ? [{
      label: 'Salary Range',
      value: salaryRange
    }] : []),
    ...(job.reviewed_by ? [{
      label: 'Reviewed By',
      value: job.reviewed_by
    }] : [])
  ]
  
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(details.length, 4)} gap-3`}>
        {details.map((detail, index) => (
          <div key={index} className="bg-gray-50/50 p-3 rounded-lg">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{detail.label}</p>
            <p className={`text-sm font-semibold text-gray-900 ${detail.className || ''}`}>{detail.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function JobItem({ job, onUpdateStatus, onDelete }: JobItemProps) {

  return (
    <div className="px-6 py-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 transition-all duration-200 group">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <CompanyLogo companyName={job.company} />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <h4 className="font-bold text-gray-900 text-lg truncate group-hover:text-blue-700 transition-colors">{job.title}</h4>
              <StatusBadge status={job.status} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
              <span className="flex items-center gap-2 font-medium"><Building className="h-4 w-4 text-blue-500" />{job.company}</span>
              <span className="flex items-center gap-2 font-medium"><MapPin className="h-4 w-4 text-green-500" />{job.location}</span>
              <span className="flex items-center gap-2 font-medium"><Calendar className="h-4 w-4 text-purple-500" />{formatJobDate(job.created_at)}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">{job.job_type}</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">{job.job_level}</span>
            </div>
          </div>
        </div>
        <JobItemActions job={job} onUpdateStatus={onUpdateStatus} onDelete={onDelete} />
      </div>
      <JobDetails job={job} />
    </div>
  )
}