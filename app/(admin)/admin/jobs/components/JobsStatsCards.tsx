import { Card, CardContent } from '@/components/ui/card'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
import type { JobCounts } from '../types'

interface JobsStatsCardsProps {
  counts: JobCounts | null
}

const statsConfig = [
  {
    title: 'Pending Jobs',
    key: 'pending' as const,
    description: 'Awaiting review',
    icon: Clock,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-600',
  },
  {
    title: 'Approved Jobs',
    key: 'approved' as const,
    description: 'Live on website',
    icon: CheckCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    textColor: 'text-green-600',
  },
  {
    title: 'Rejected Jobs',
    key: 'rejected' as const,
    description: 'Not approved',
    icon: XCircle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    textColor: 'text-red-600',
  },
]

export function JobsStatsCards({ counts }: JobsStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
      {statsConfig.map((stat) => (
        <Card key={stat.key} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm group hover:scale-[1.02]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">{stat.title}</p>
                <p className={`text-2xl md:text-3xl font-black ${stat.textColor}`}>
                  {counts ? counts[stat.key] : '...'}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.iconBg} shadow-sm group-hover:shadow-md transition-shadow`}>
                <stat.icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.iconColor}`} />
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-600 font-medium mt-2">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}