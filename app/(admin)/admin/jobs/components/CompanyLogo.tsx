import { generateCompanyLogo } from '../utils/jobUtils'

interface CompanyLogoProps {
  company: string
  size?: 'sm' | 'md' | 'lg'
}

export function CompanyLogo({ company, size = 'md' }: CompanyLogoProps) {
  const { initial, colorClass } = generateCompanyLogo(company)
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base'
  }
  
  return (
    <div className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center text-white font-semibold`}>
      {initial}
    </div>
  )
}