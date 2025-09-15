import { Users, RefreshCw } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

import type { ApplicationItem as Application, ApplicationStatus } from '@/types'

import { ApplicationCard } from './ApplicationCard'

interface ApplicationsListProps {
  applications: Application[]
  loading: boolean
  selectedStatus: ApplicationStatus
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => void
  onDelete: (id: string) => void
}

export function ApplicationsList({ 
  applications, 
  loading, 
  selectedStatus, 
  onUpdateStatus, 
  onDelete 
}: ApplicationsListProps) {
  if (loading) {
    return (
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardContent className="min-h-[50vh] flex items-center justify-center py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <RefreshCw className="h-10 w-10 animate-spin text-white" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Loading Applications</h3>
            <p className="text-gray-600 font-medium leading-relaxed">Please wait while we fetch the latest applications from the database...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (applications.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardContent className="text-center py-20 px-6">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">No Applications Found</h3>
            <p className="text-gray-600 font-medium leading-relaxed mb-4">There are no applications matching your current filter criteria.</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200/50">
              <span className="text-sm font-semibold text-blue-700">
                Filter: {selectedStatus === 'all' ? 'All Applications' : selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}