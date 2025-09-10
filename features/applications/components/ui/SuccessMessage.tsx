import { CheckCircle } from 'lucide-react'

interface SuccessMessageProps {
  successTitle: string
  successMessage: string
}

export function SuccessMessage({
  successTitle,
  successMessage
}: SuccessMessageProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center bg-white rounded-xl p-8 shadow-2xl border border-gray-100">
        {/* Success Icon */}
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        
        {/* Success Title */}
        <h3 className="text-2xl font-bold text-green-700 mb-2">
          {successTitle}
        </h3>
        
        {/* Success Message */}
        <p className="text-gray-600 mb-4">
          {successMessage}
        </p>
      </div>
    </div>
  )
}