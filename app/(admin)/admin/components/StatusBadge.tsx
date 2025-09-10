import { StatusBadge as BaseStatusBadge } from '@/components/ui/status-badge'

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <BaseStatusBadge status={status} />
}