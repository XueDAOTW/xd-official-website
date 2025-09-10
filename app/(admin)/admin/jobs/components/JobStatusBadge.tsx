import { StatusBadge as BaseStatusBadge } from '@/components/ui/status-badge'
import type { JobStatus } from '../types'

interface JobStatusBadgeProps {
  status: JobStatus
}

export function JobStatusBadge({ status }: JobStatusBadgeProps) {
  return <BaseStatusBadge status={status} variant="minimal" showIcon={false} />
}