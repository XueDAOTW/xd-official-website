"use client"

import { ApplicationsHeader } from './components/ApplicationsHeader'
import { StatsCards } from './components/StatsCards'
import { ApplicationTabs } from './components/ApplicationTabs'
import { useApplications } from './hooks/useApplications'

export default function ApplicationsPage() {
  const {
    applications,
    loading,
    selectedStatus,
    setSelectedStatus,
    counts,
    updateApplicationStatus,
    deleteApplication,
  } = useApplications()

  return (
    <div className="space-y-6 md:space-y-8">
      <ApplicationsHeader counts={counts} />
      <StatsCards counts={counts} />
      <ApplicationTabs
        applications={applications}
        loading={loading}
        selectedStatus={selectedStatus}
        counts={counts}
        onStatusChange={setSelectedStatus}
        onUpdateStatus={updateApplicationStatus}
        onDelete={deleteApplication}
      />
    </div>
  )
}