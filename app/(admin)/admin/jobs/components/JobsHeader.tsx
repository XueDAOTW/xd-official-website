import { Briefcase } from 'lucide-react'

import { AdminHeader } from '@/components/ui/admin-header'

import type { JobCounts } from '@/types'

interface JobsHeaderProps {
  counts: JobCounts | null
}

export function JobsHeader({ counts }: JobsHeaderProps) {
  const totalJobs = counts ? counts.pending + counts.approved + counts.rejected : 0

  return (
    <AdminHeader
      title="Jobs Management"
      description="Review and manage job postings from companies"
      icon={Briefcase}
      totalCount={totalJobs}
      totalLabel="Total Jobs"
    />
  )
}