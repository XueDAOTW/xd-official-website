"use client"

import { useState } from 'react'
import { Search, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'

interface JobItem {
  id: string
  title: string
  company: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Entry' | 'Mid-Level'
  level: string
  category: 'engineering' | 'aiml' | 'design' | 'bd' | 'marketing' | 'blockchain' | 'data' | 'devops'
  description: string[]
  logo: string
}

const MOCK_JOBS: JobItem[] = [
  {
    id: '1',
    title: 'Product Designer',
    company: 'Google',
    location: 'Seattle, WA,USA',
    type: 'Full-time',
    level: 'Mid-Level',
    category: 'design',
    description: [
      "Bachelor's degree in Design or equivalent practical experience",
      "A portfolio that demonstrates refined digital product design across multiple projects"
    ],
    logo: '/company-logos/google.png'
  },
  {
    id: '2',
    title: 'UX Designer',
    company: 'Meta,Facebook',
    location: 'New York, NY,USA',
    type: 'Part-time',
    level: 'Entry',
    category: 'design',
    description: [
      "Bachelor's degree in Design or equivalent practical experience",
      "1 years of experience in product design or UX."
    ],
    logo: '/company-logos/meta.png'
  },
  {
    id: '3',
    title: 'BD Engineer',
    company: 'Microsoft',
    location: 'Redmond, WA,USA',
    type: 'Full-time',
    level: 'Mid-Level',
    category: 'bd',
    description: [
      "Experience in business development and strategic partnerships",
      "Strong technical background with engineering experience"
    ],
    logo: '/company-logos/microsoft.png'
  },
  {
    id: '4',
    title: 'ML Engineer',
    company: 'OpenAI',
    location: 'San Francisco, CA,USA',
    type: 'Full-time',
    level: 'Senior',
    category: 'aiml',
    description: [
      "PhD or Master's in Computer Science, Machine Learning, or related field",
      "3+ years of experience building and deploying ML models at scale"
    ],
    logo: '/company-logos/openai.png'
  },
  {
    id: '5',
    title: 'AI Research Scientist',
    company: 'DeepMind',
    location: 'London, UK',
    type: 'Full-time',
    level: 'Senior',
    category: 'aiml',
    description: [
      "PhD in Machine Learning, Computer Science, or related technical field",
      "Published research in top-tier ML conferences (NeurIPS, ICML, ICLR)"
    ],
    logo: '/company-logos/deepmind.png'
  },
  {
    id: '6',
    title: 'Full Stack Engineer',
    company: 'Netflix',
    location: 'Los Gatos, CA,USA',
    type: 'Full-time',
    level: 'Mid-Level',
    category: 'engineering',
    description: [
      "Bachelor's degree in Computer Science or equivalent experience",
      "Experience with React, Node.js, and distributed systems"
    ],
    logo: '/company-logos/netflix.png'
  },
  {
    id: '7',
    title: 'Data Scientist',
    company: 'Airbnb',
    location: 'San Francisco, CA,USA',
    type: 'Full-time',
    level: 'Entry',
    category: 'data',
    description: [
      "Master's degree in Statistics, Mathematics, or related field",
      "Experience with Python, SQL, and statistical modeling"
    ],
    logo: '/company-logos/airbnb.png'
  },
  {
    id: '8',
    title: 'DevOps Engineer',
    company: 'Amazon',
    location: 'Austin, TX,USA',
    type: 'Full-time',
    level: 'Mid-Level',
    category: 'devops',
    description: [
      "Experience with AWS, Docker, Kubernetes, and CI/CD pipelines",
      "Strong background in infrastructure automation and monitoring"
    ],
    logo: '/company-logos/amazon.png'
  },
  {
    id: '9',
    title: 'Blockchain Developer',
    company: 'Coinbase',
    location: 'Remote',
    type: 'Full-time',
    level: 'Senior',
    category: 'blockchain',
    description: [
      "Experience with Solidity, Web3, and decentralized applications",
      "Strong understanding of cryptocurrency and DeFi protocols"
    ],
    logo: '/company-logos/coinbase.png'
  },
  {
    id: '10',
    title: 'Mobile Engineer',
    company: 'Uber',
    location: 'San Francisco, CA,USA',
    type: 'Full-time',
    level: 'Mid-Level',
    category: 'engineering',
    description: [
      "Experience with iOS/Android development and React Native",
      "Bachelor's degree in Computer Science or equivalent experience"
    ],
    logo: '/company-logos/uber.png'
  },
  {
    id: '11',
    title: 'Growth Marketing Manager',
    company: 'Stripe',
    location: 'San Francisco, CA,USA',
    type: 'Full-time',
    level: 'Mid-Level',
    category: 'marketing',
    description: [
      "3+ years of experience in growth marketing or digital marketing",
      "Experience with A/B testing, analytics, and performance marketing"
    ],
    logo: '/company-logos/stripe.png'
  }
]

export default function JobsPage() {
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

  const handleFilterChange = (category: string, filter: string, checked: boolean | string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [filter]: checked
      }
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find your Dream Job
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Looking for jobs? Browse our latest job openings to view & apply oto the best jobs today
            </p>
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
            <Button className="h-12 px-8 bg-red-500 hover:bg-red-600">
              Search
            </Button>
          </div>

          {/* Job Results Count */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm">
              <span className="font-semibold">Total jobs</span>
              <Badge className="bg-white text-gray-700 border">{MOCK_JOBS.length} job results</Badge>
            </span>
          </div>
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
              {MOCK_JOBS.map((job) => (
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
                              {job.type}
                            </Badge>
                            <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs px-2 py-1">
                              {job.level}
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
                      <Button className="bg-red-500 hover:bg-red-600 px-6">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 