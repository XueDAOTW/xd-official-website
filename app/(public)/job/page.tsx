"use client"

import Navbar from '@/components/navbar'
import { JobHeader, JobFilters, JobList } from '@/features/jobs'
import { useJobs, useJobFilters } from '@/features/jobs/hooks'

export default function JobsPage() {
  const { jobs, loading, refetch } = useJobs()
  const { selectedFilters, handleFilterChange, filterJobs } = useJobFilters()
  
  const filteredJobs = filterJobs(jobs)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <JobHeader 
          jobCount={filteredJobs.length}
          loading={loading}
          onSearch={refetch}
        />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <JobFilters 
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
              />
            </div>
            
            <div className="lg:col-span-3">
              <JobList 
                jobs={filteredJobs}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 