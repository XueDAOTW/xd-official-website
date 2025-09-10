import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface FormCardHeaderProps {
  cardTitle: string
  cardSubtitle: string
}

export function FormCardHeader({
  cardTitle,
  cardSubtitle
}: FormCardHeaderProps) {
  return (
    <CardHeader className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white shadow-xl relative overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-700/20 to-pink-700/20"></div>
      
      {/* Header Content */}
      <div className="relative z-10">
        <CardTitle className="text-3xl font-bold text-white drop-shadow-lg mb-2">
          {cardTitle}
        </CardTitle>
        <CardDescription className="text-purple-50 text-lg font-medium">
          {cardSubtitle}
        </CardDescription>
      </div>
      
      {/* Decorative Bottom Border */}
      <div className="absolute -bottom-1 left-0 w-full h-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-b-3xl"></div>
    </CardHeader>
  )
}