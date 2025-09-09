import { Badge } from '@/components/ui/badge'
import { getStatusVariant } from '../utils/jobUtils'
import type { JobStatus } from '../types'

interface JobStatusBadgeProps {
  status: JobStatus
}

export function JobStatusBadge({ status }: JobStatusBadgeProps) {
  const variant = getStatusVariant(status)
  
  return (
    <Badge className={variant.className}>
      {variant.label}
    </Badge>
  )
}