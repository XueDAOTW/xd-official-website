import { StatsCards as BaseStatsCards, type StatConfig } from '@/components/ui/stats-cards'
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react'
import type { AppCounts } from '../types'

interface StatsCardsProps {
  counts: AppCounts
}

const statsConfig: StatConfig[] = [
  {
    title: 'Total Applications',
    key: 'total',
    description: 'All time submissions',
    icon: Users,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    textColor: 'text-gray-900',
  },
  {
    title: 'Pending Review',
    key: 'pending',
    description: 'Awaiting review',
    icon: Clock,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-600',
  },
  {
    title: 'Approved',
    key: 'approved',
    description: 'Successfully approved',
    icon: CheckCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    textColor: 'text-green-600',
  },
  {
    title: 'Rejected',
    key: 'rejected',
    description: 'Applications rejected',
    icon: XCircle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    textColor: 'text-red-600',
  },
]

export function StatsCards({ counts }: StatsCardsProps) {
  return (
    <BaseStatsCards 
      counts={counts} 
      statsConfig={statsConfig} 
      columns={4}
      showDescription={true}
    />
  )
}