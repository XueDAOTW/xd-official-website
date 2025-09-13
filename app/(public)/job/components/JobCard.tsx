import { MapPin } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CompanyLogo } from '@/components/ui/company-logo'

import type { JobItem } from '../types'

interface JobCardProps {
  job: JobItem
}

export function JobCard({ job }: JobCardProps) {
  const handleApply = () => {
    if (job.apply_url) {
      window.open(job.apply_url, '_blank')
    } else if (job.company_website) {
      window.open(job.company_website, '_blank')
    }
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <CompanyLogo companyName={job.company} />
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs px-2 py-1">
                  {job.job_type}
                </Badge>
                <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs px-2 py-1">
                  {job.job_level}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <span className="font-medium">{job.company}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
            </div>
            
            <ul className="space-y-1 text-sm text-gray-600 mb-4">
              {job.description.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            className="bg-red-500 hover:bg-red-600 px-6"
            onClick={handleApply}
          >
            Apply Now
          </Button>
        </div>
      </div>
    </Card>
  )
}