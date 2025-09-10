import { StatsCards as BaseStatsCards, type StatConfig } from '@/components/ui/stats-cards'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
import type { JobCounts } from '../types'

interface JobsStatsCardsProps {
  counts: JobCounts | null
}

const statsConfig: StatConfig[] = [
  {
    title: 'Pending Jobs',
    key: 'pending',
    description: 'Awaiting review',
    icon: Clock,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-600',
  },
  {
    title: 'Approved Jobs',
    key: 'approved',
    description: 'Live on website',
    icon: CheckCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    textColor: 'text-green-600',
  },
  {
    title: 'Rejected Jobs',
    key: 'rejected',
    description: 'Not approved',
    icon: XCircle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    textColor: 'text-red-600',
  },
]

export function JobsStatsCards({ counts }: JobsStatsCardsProps) {
  return (
    <BaseStatsCards 
      counts={counts} 
      statsConfig={statsConfig} 
      columns={3}
      showDescription={false}
    />
  )
}