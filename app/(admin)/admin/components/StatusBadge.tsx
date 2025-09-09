import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'approved':
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 font-semibold px-3 py-1">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      )
    case 'rejected':
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 font-semibold px-3 py-1">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      )
    case 'pending':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 font-semibold px-3 py-1">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    default:
      return <Badge variant="outline" className="font-semibold px-3 py-1">{status}</Badge>
  }
}