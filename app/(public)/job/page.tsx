"use client"

import { useState, useEffect } from 'react'
import { Search, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import Navbar from '@/components/navbar'

interface JobItem {
  id: string
  title: string
  company: string
  location: string
  job_type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract'
  job_level: 'Entry' | 'Mid-Level' | 'Senior' | 'Lead' | 'Executive'
  category: 'engineering' | 'aiml' | 'design' | 'bd' | 'marketing' | 'blockchain' | 'data' | 'devops'
  description: string[]
  requirements: string[]
  company_website?: string
  apply_url?: string
  salary_min?: number
  salary_max?: number
  is_remote: boolean
  created_at: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    jobType: {
      fullTime: true,
      partTime: true,
      intern: false,
      freelance: false
    },
    jobCategory: {
      engineering: true,
      aiml: true,
      design: true,
      bd: true,
      marketing: true,
      blockchain: true,
      data: true,
      devops: true
    },
    workLocation: {
      onSite: true,
      hybrid: false,
      remote: false
    }
  })

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (searchTerm) params.append('search', searchTerm)
      if (location) params.append('location', location)
      
      const response = await fetch(`/api/jobs?${params}`)
      if (!response.ok) throw new Error('Failed to fetch jobs')
      
      const data = await response.json()
      setJobs(data.jobs || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    fetchJobs()
  }

  const handleFilterChange = (category: string, filter: string, checked: boolean | string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [filter]: checked
      }
    }))
  }

  // Filter jobs based on selected filters
  const filteredJobs = jobs.filter(job => {
    // Job type filter - check if job type matches selected filters
    const jobTypeMatch = (
      (selectedFilters.jobType.fullTime && job.job_type === 'Full-time') ||
      (selectedFilters.jobType.partTime && job.job_type === 'Part-time') ||
      (selectedFilters.jobType.intern && job.job_type === 'Internship') ||
      (selectedFilters.jobType.freelance && job.job_type === 'Contract')
    )
    
    // If no job type is selected, show no jobs
    const hasJobTypeSelected = selectedFilters.jobType.fullTime || selectedFilters.jobType.partTime || 
                              selectedFilters.jobType.intern || selectedFilters.jobType.freelance
    if (!hasJobTypeSelected || !jobTypeMatch) return false

    // Category filter - check if job category matches selected filters
    const categoryKey = job.category as keyof typeof selectedFilters.jobCategory
    if (!selectedFilters.jobCategory[categoryKey]) return false

    // Location filter - check if job location matches selected filters
    const locationMatch = (
      (selectedFilters.workLocation.onSite && !job.is_remote) ||
      (selectedFilters.workLocation.remote && job.is_remote) ||
      (selectedFilters.workLocation.hybrid) // Assume hybrid includes all jobs
    )
    
    // If no location is selected, show no jobs
    const hasLocationSelected = selectedFilters.workLocation.onSite || selectedFilters.workLocation.remote || 
                               selectedFilters.workLocation.hybrid
    if (!hasLocationSelected || !locationMatch) return false

    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Find your Dream Job
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto mb-4">
                Looking for jobs? Browse our latest job openings to view & apply to the best jobs today
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/submit-job'}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Post a Job
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search Job title or Keyword"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button 
                className="h-12 px-8 bg-red-500 hover:bg-red-600"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>

            {/* Job Results Count */}
            {!loading && (
              <div className="text-center">
                <span className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm">
                  <span className="font-semibold">Total jobs</span>
                  <Badge className="bg-white text-gray-700 border">
                    {`${filteredJobs.length} job results`}
                  </Badge>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  <Button variant="ghost" size="sm" className="text-red-500">
                    ⌄
                  </Button>
                </div>

                {/* Date Posted Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Date posted</h4>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Last Week" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Job Type Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Job type</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="full-time" 
                        checked={selectedFilters.jobType.fullTime}
                        onCheckedChange={(checked) => handleFilterChange('jobType', 'fullTime', checked as boolean)}
                      />
                      <label htmlFor="full-time" className="text-sm">Full-time</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="part-time" 
                        checked={selectedFilters.jobType.partTime}
                        onCheckedChange={(checked) => handleFilterChange('jobType', 'partTime', checked as boolean)}
                      />
                      <label htmlFor="part-time" className="text-sm">Part-time</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="intern" 
                        checked={selectedFilters.jobType.intern}
                        onCheckedChange={(checked) => handleFilterChange('jobType', 'intern', checked as boolean)}
                      />
                      <label htmlFor="intern" className="text-sm">Intern</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="freelance" 
                        checked={selectedFilters.jobType.freelance}
                        onCheckedChange={(checked) => handleFilterChange('jobType', 'freelance', checked as boolean)}
                      />
                      <label htmlFor="freelance" className="text-sm">Freelance</label>
                    </div>
                  </div>
                </div>

                {/* Job Category Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Job Category</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="engineering" 
                        checked={selectedFilters.jobCategory.engineering}
                        onCheckedChange={(checked) => handleFilterChange('jobCategory', 'engineering', checked as boolean)}
                      />
                      <label htmlFor="engineering" className="text-sm">Engineering</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="aiml" 
                        checked={selectedFilters.jobCategory.aiml}
                        onCheckedChange={(checked) => handleFilterChange('jobCategory', 'aiml', checked as boolean)}
                      />
                      <label htmlFor="aiml" className="text-sm">AI/ML</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="design" 
                        checked={selectedFilters.jobCategory.design}
                        onCheckedChange={(checked) => handleFilterChange('jobCategory', 'design', checked as boolean)}
                      />
                      <label htmlFor="design" className="text-sm">Design</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="bd" 
                        checked={selectedFilters.jobCategory.bd}
                        onCheckedChange={(checked) => handleFilterChange('jobCategory', 'bd', checked as boolean)}
                      />
                      <label htmlFor="bd" className="text-sm">Business Development</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="marketing" 
                        checked={selectedFilters.jobCategory.marketing}
                        onCheckedChange={(checked) => handleFilterChange('jobCategory', 'marketing', checked as boolean)}
                      />
                      <label htmlFor="marketing" className="text-sm">Marketing</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="blockchain" 
                        checked={selectedFilters.jobCategory.blockchain}
                        onCheckedChange={(checked) => handleFilterChange('jobCategory', 'blockchain', checked as boolean)}
                      />
                      <label htmlFor="blockchain" className="text-sm">Blockchain/Web3</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="data" 
                        checked={selectedFilters.jobCategory.data}
                        onCheckedChange={(checked) => handleFilterChange('jobCategory', 'data', checked as boolean)}
                      />
                      <label htmlFor="data" className="text-sm">Data Science</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="devops" 
                        checked={selectedFilters.jobCategory.devops}
                        onCheckedChange={(checked) => handleFilterChange('jobCategory', 'devops', checked as boolean)}
                      />
                      <label htmlFor="devops" className="text-sm">DevOps</label>
                    </div>
                  </div>
                </div>


                {/* Work Location Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">On site/Remote</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="on-site" 
                        checked={selectedFilters.workLocation.onSite}
                        onCheckedChange={(checked) => handleFilterChange('workLocation', 'onSite', checked as boolean)}
                      />
                      <label htmlFor="on-site" className="text-sm">On-site</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="hybrid" 
                        checked={selectedFilters.workLocation.hybrid}
                        onCheckedChange={(checked) => handleFilterChange('workLocation', 'hybrid', checked as boolean)}
                      />
                      <label htmlFor="hybrid" className="text-sm">Hybrid</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remote" 
                        checked={selectedFilters.workLocation.remote}
                        onCheckedChange={(checked) => handleFilterChange('workLocation', 'remote', checked as boolean)}
                      />
                      <label htmlFor="remote" className="text-sm">Remote</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500">Loading jobs...</div>
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500">No jobs found matching your criteria.</div>
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                  <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {job.company === 'Google' && (
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                              G
                            </div>
                          )}
                          {job.company.includes('Meta') && (
                            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                              M
                            </div>
                          )}
                          {job.company === 'Microsoft' && (
                            <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold text-lg">
                              MS
                            </div>
                          )}
                          {job.company === 'OpenAI' && (
                            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold text-lg">
                              AI
                            </div>
                          )}
                          {job.company === 'DeepMind' && (
                            <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-lg">
                              DM
                            </div>
                          )}
                          {job.company === 'Netflix' && (
                            <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center text-white font-bold text-lg">
                              N
                            </div>
                          )}
                          {job.company === 'Airbnb' && (
                            <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-lg">
                              A
                            </div>
                          )}
                          {job.company === 'Amazon' && (
                            <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
                              A
                            </div>
                          )}
                          {job.company === 'Coinbase' && (
                            <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-lg">
                              C
                            </div>
                          )}
                          {job.company === 'Uber' && (
                            <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-white font-bold text-lg">
                              U
                            </div>
                          )}
                          {job.company === 'Stripe' && (
                            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-lg">
                              S
                            </div>
                          )}
                        </div>
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
                          onClick={() => {
                            if (job.apply_url) {
                              window.open(job.apply_url, '_blank')
                            } else if (job.company_website) {
                              window.open(job.company_website, '_blank')
                            }
                          }}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 