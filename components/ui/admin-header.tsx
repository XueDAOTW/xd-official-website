import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminHeaderProps {
  title: string
  description: string
  icon: LucideIcon
  totalCount?: number | string
  totalLabel?: string
  className?: string
  children?: React.ReactNode
}

export function AdminHeader({
  title,
  description,
  icon: Icon,
  totalCount,
  totalLabel,
  className,
  children
}: AdminHeaderProps) {
  return (
    <div className={cn(
      'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden',
      className
    )}>
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Icon className="h-7 w-7 md:h-8 md:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 tracking-tight">
                {title}
              </h1>
              <p className="text-blue-100 text-sm md:text-lg font-medium opacity-90">
                {description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {totalCount !== undefined && totalLabel && (
              <div className="px-3 py-1.5 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
                <p className="text-xs font-semibold text-white/90 whitespace-nowrap">
                  {totalCount} {totalLabel}
                </p>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}