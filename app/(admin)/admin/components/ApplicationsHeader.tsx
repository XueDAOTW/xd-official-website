import { AdminHeader } from '@/components/ui/admin-header'
import { Users } from 'lucide-react'
import type { AppCounts } from '../types'

interface ApplicationsHeaderProps {
  counts: AppCounts
}

export function ApplicationsHeader({ counts }: ApplicationsHeaderProps) {
  return (
    <AdminHeader
      title="Applications Management"
      description="Review and manage XueDAO community applications"
      icon={Users}
      totalCount={counts.total}
      totalLabel="Total Applications"
    />
  )
}