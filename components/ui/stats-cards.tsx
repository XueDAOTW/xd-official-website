import { LucideIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface StatConfig {
  title: string
  key: string
  description: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
  textColor: string
  getValue?: (counts: any) => number
}

interface StatsCardsProps {
  counts: any
  statsConfig: StatConfig[]
  columns?: 2 | 3 | 4
  showDescription?: boolean
  className?: string
}

export function StatsCards({ 
  counts, 
  statsConfig, 
  columns = 4,
  showDescription = true,
  className 
}: StatsCardsProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-3', 
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  }
  
  return (
    <div className={cn(
      'grid gap-4 md:gap-6',
      gridCols[columns],
      className
    )}>
      {statsConfig.map((stat) => {
        const value = counts 
          ? (stat.getValue ? stat.getValue(counts) : (counts[stat.key] ?? 0))
          : '...'
        
        return (
          <Card 
            key={stat.key} 
            className="hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm group hover:scale-[1.02]"
          >
            {showDescription ? (
              <>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">
                        {stat.title}
                      </CardTitle>
                      <div className={cn('text-2xl md:text-3xl font-black', stat.textColor)}>
                        {value}
                      </div>
                    </div>
                    <div className={cn(
                      'p-2.5 rounded-xl shadow-sm group-hover:shadow-md transition-shadow',
                      stat.iconBg
                    )}>
                      <stat.icon className={cn('h-5 w-5 md:h-6 md:w-6', stat.iconColor)} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs md:text-sm text-gray-600 font-medium">{stat.description}</p>
                </CardContent>
              </>
            ) : (
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className={cn('text-2xl md:text-3xl font-black', stat.textColor)}>
                      {value}
                    </p>
                  </div>
                  <div className={cn(
                    'p-2.5 rounded-xl shadow-sm group-hover:shadow-md transition-shadow',
                    stat.iconBg
                  )}>
                    <stat.icon className={cn('h-5 w-5 md:h-6 md:w-6', stat.iconColor)} />
                  </div>
                </div>
                <p className="text-xs md:text-sm text-gray-600 font-medium mt-2">{stat.description}</p>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}