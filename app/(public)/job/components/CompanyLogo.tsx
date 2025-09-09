interface CompanyLogoProps {
  companyName: string
}

const companyStyles: Record<string, { bg: string; text: string; initials: string }> = {
  'Google': { bg: 'bg-blue-500', text: 'text-white', initials: 'G' },
  'Meta': { bg: 'bg-blue-600', text: 'text-white', initials: 'M' },
  'Microsoft': { bg: 'bg-green-600', text: 'text-white', initials: 'MS' },
  'OpenAI': { bg: 'bg-black', text: 'text-white', initials: 'AI' },
  'DeepMind': { bg: 'bg-red-600', text: 'text-white', initials: 'DM' },
  'Netflix': { bg: 'bg-red-500', text: 'text-white', initials: 'N' },
  'Airbnb': { bg: 'bg-pink-500', text: 'text-white', initials: 'A' },
  'Amazon': { bg: 'bg-orange-500', text: 'text-white', initials: 'A' },
  'Coinbase': { bg: 'bg-blue-700', text: 'text-white', initials: 'C' },
  'Uber': { bg: 'bg-black', text: 'text-white', initials: 'U' },
  'Stripe': { bg: 'bg-purple-600', text: 'text-white', initials: 'S' },
}

export function CompanyLogo({ companyName }: CompanyLogoProps) {
  const style = companyStyles[companyName] || {
    bg: 'bg-gray-500',
    text: 'text-white',
    initials: companyName.charAt(0).toUpperCase()
  }

  const isRounded = ['Google', 'Airbnb', 'Coinbase'].includes(companyName)

  return (
    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
      <div className={`w-10 h-10 ${isRounded ? 'rounded-full' : 'rounded-lg'} ${style.bg} flex items-center justify-center ${style.text} font-bold text-lg`}>
        {style.initials}
      </div>
    </div>
  )
}