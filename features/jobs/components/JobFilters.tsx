import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import type { JobFilters as JobFiltersType } from '@/types'

interface JobFiltersProps {
  selectedFilters: JobFiltersType
  onFilterChange: (category: keyof JobFiltersType, filter: string, checked: boolean) => void
}

const jobTypeFilters = [
  { id: 'fullTime', label: 'Full-time' },
  { id: 'partTime', label: 'Part-time' },
  { id: 'intern', label: 'Intern' },
  { id: 'freelance', label: 'Freelance' },
]

const jobCategoryFilters = [
  { id: 'engineering', label: 'Engineering' },
  { id: 'aiml', label: 'AI/ML' },
  { id: 'design', label: 'Design' },
  { id: 'bd', label: 'Business Development' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'blockchain', label: 'Blockchain/Web3' },
  { id: 'data', label: 'Data Science' },
  { id: 'devops', label: 'DevOps' },
]

const workLocationFilters = [
  { id: 'onSite', label: 'On-site' },
  { id: 'hybrid', label: 'Hybrid' },
  { id: 'remote', label: 'Remote' },
]

export function JobFilters({ selectedFilters, onFilterChange }: JobFiltersProps) {
  return (
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
          {jobTypeFilters.map((filter) => (
            <div key={filter.id} className="flex items-center space-x-2">
              <Checkbox 
                id={filter.id}
                checked={selectedFilters.jobType[filter.id as keyof typeof selectedFilters.jobType]}
                onCheckedChange={(checked) => onFilterChange('jobType', filter.id, checked as boolean)}
              />
              <label htmlFor={filter.id} className="text-sm">{filter.label}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Job Category Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Job Category</h4>
        <div className="space-y-2">
          {jobCategoryFilters.map((filter) => (
            <div key={filter.id} className="flex items-center space-x-2">
              <Checkbox 
                id={filter.id}
                checked={selectedFilters.jobCategory[filter.id as keyof typeof selectedFilters.jobCategory]}
                onCheckedChange={(checked) => onFilterChange('jobCategory', filter.id, checked as boolean)}
              />
              <label htmlFor={filter.id} className="text-sm">{filter.label}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Work Location Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">On site/Remote</h4>
        <div className="space-y-2">
          {workLocationFilters.map((filter) => (
            <div key={filter.id} className="flex items-center space-x-2">
              <Checkbox 
                id={filter.id}
                checked={selectedFilters.workLocation[filter.id as keyof typeof selectedFilters.workLocation]}
                onCheckedChange={(checked) => onFilterChange('workLocation', filter.id, checked as boolean)}
              />
              <label htmlFor={filter.id} className="text-sm">{filter.label}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}