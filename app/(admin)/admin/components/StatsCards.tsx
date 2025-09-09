import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react'
import type { AppCounts } from '../types'

interface StatsCardsProps {
  counts: AppCounts
}

const statsConfig = [
  {
    title: 'Total Applications',
    value: 'total',
    description: 'All time submissions',
    icon: Users,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    textColor: 'text-gray-900',
  },
  {
    title: 'Pending Review',
    value: 'pending',
    description: 'Awaiting review',
    icon: Clock,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-600',
  },
  {
    title: 'Approved',
    value: 'approved',
    description: 'Successfully approved',
    icon: CheckCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    textColor: 'text-green-600',
  },
  {
    title: 'Rejected',
    value: 'rejected',
    description: 'Applications rejected',
    icon: XCircle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    textColor: 'text-red-600',
  },
]

export function StatsCards({ counts }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statsConfig.map((stat) => (
        <Card key={stat.value} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm group hover:scale-[1.02]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">
                  {stat.title}
                </CardTitle>
                <div className={`text-2xl md:text-3xl font-black ${stat.textColor}`}>
                  {counts[stat.value as keyof AppCounts]}
                </div>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.iconBg} shadow-sm group-hover:shadow-md transition-shadow`}>
                <stat.icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs md:text-sm text-gray-600 font-medium">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}