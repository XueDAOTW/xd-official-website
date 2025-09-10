import { useState } from 'react'
import { Search, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface JobHeaderProps {
  jobCount: number
  loading: boolean
  onSearch: (searchTerm: string, location: string) => void
}

export function JobHeader({ jobCount, loading, onSearch }: JobHeaderProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')

  const handleSearch = () => {
    onSearch(searchTerm, location)
  }

  return (
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
                {`${jobCount} job results`}
              </Badge>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}