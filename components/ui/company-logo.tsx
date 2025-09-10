import { cn } from '@/lib/utils'

interface CompanyLogoProps {
  companyName: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'minimal'
  className?: string
}

const COMPANY_STYLES: Record<string, { bg: string; text: string; initials: string; rounded?: boolean }> = {
  'Google': { bg: 'bg-blue-500', text: 'text-white', initials: 'G', rounded: true },
  'Meta': { bg: 'bg-blue-600', text: 'text-white', initials: 'M' },
  'Microsoft': { bg: 'bg-green-600', text: 'text-white', initials: 'MS' },
  'OpenAI': { bg: 'bg-black', text: 'text-white', initials: 'AI' },
  'DeepMind': { bg: 'bg-red-600', text: 'text-white', initials: 'DM' },
  'Netflix': { bg: 'bg-red-500', text: 'text-white', initials: 'N' },
  'Airbnb': { bg: 'bg-pink-500', text: 'text-white', initials: 'A', rounded: true },
  'Amazon': { bg: 'bg-orange-500', text: 'text-white', initials: 'A' },
  'Coinbase': { bg: 'bg-blue-700', text: 'text-white', initials: 'C', rounded: true },
  'Uber': { bg: 'bg-black', text: 'text-white', initials: 'U' },
  'Stripe': { bg: 'bg-purple-600', text: 'text-white', initials: 'S' },
}

const FALLBACK_COLORS = [
  'bg-blue-500',
  'bg-green-500', 
  'bg-purple-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-indigo-500',
  'bg-pink-500',
  'bg-gray-500'
]

const SIZE_CONFIGS = {
  sm: {
    container: 'w-8 h-8',
    logo: 'w-6 h-6 text-xs',
    wrapper: 'w-10 h-10'
  },
  md: {
    container: 'w-10 h-10',
    logo: 'w-8 h-8 text-sm',
    wrapper: 'w-12 h-12'
  },
  lg: {
    container: 'w-12 h-12',
    logo: 'w-10 h-10 text-base',
    wrapper: 'w-14 h-14'
  },
  xl: {
    container: 'w-16 h-16',
    logo: 'w-14 h-14 text-lg',
    wrapper: 'w-18 h-18'
  }
}

export function CompanyLogo({ 
  companyName, 
  size = 'md', 
  variant = 'default',
  className 
}: CompanyLogoProps) {
  const sizeConfig = SIZE_CONFIGS[size]
  
  // Check for predefined company style
  const predefinedStyle = COMPANY_STYLES[companyName]
  
  // Generate fallback style
  const fallbackStyle = {
    bg: FALLBACK_COLORS[companyName.charCodeAt(0) % FALLBACK_COLORS.length],
    text: 'text-white',
    initials: companyName.charAt(0).toUpperCase(),
    rounded: false
  }
  
  const style = predefinedStyle || fallbackStyle
  const logoShape = style.rounded ? 'rounded-full' : 'rounded-lg'
  
  if (variant === 'minimal') {
    return (
      <div className={cn(
        sizeConfig.container,
        style.bg,
        logoShape,
        'flex items-center justify-center font-semibold',
        style.text,
        className
      )}>
        {style.initials}
      </div>
    )
  }
  
  return (
    <div className={cn(
      sizeConfig.wrapper,
      'rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0',
      className
    )}>
      <div className={cn(
        sizeConfig.logo,
        logoShape,
        style.bg,
        'flex items-center justify-center font-bold',
        style.text
      )}>
        {style.initials}
      </div>
    </div>
  )
}