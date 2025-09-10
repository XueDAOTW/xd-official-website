import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type StatusType = 'pending' | 'approved' | 'rejected' | 'active' | 'inactive' | 'draft' | string

interface StatusBadgeProps {
  status: StatusType
  variant?: 'default' | 'minimal'
  showIcon?: boolean
  className?: string
}

const STATUS_CONFIG: Record<string, {
  label: string
  className: string
  icon?: React.ComponentType<{ className?: string }>
}> = {
  pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock
  },
  approved: {
    label: 'Approved',
    className: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle
  },
  active: {
    label: 'Active',
    className: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: XCircle
  },
  draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: AlertCircle
  }
}

export function StatusBadge({ 
  status, 
  variant = 'default', 
  showIcon = true, 
  className 
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status.toLowerCase()] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    className: 'border-gray-200 text-gray-700'
  }
  
  const Icon = config.icon
  
  if (variant === 'minimal') {
    return (
      <Badge className={cn(config.className, 'font-semibold', className)}>
        {config.label}
      </Badge>
    )
  }
  
  return (
    <Badge className={cn(config.className, 'font-semibold px-3 py-1', className)}>
      {showIcon && Icon && <Icon className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  )
}