import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface SuccessViewProps {
  onSubmitAnother: () => void
}

export function SuccessView({ onSubmitAnother }: SuccessViewProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Submitted Successfully!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for submitting your job posting. Our admin team will review it and publish it soon.
              You will be notified at the email address you provided once it's approved.
            </p>
            <div className="space-y-4">
              <Button 
                onClick={onSubmitAnother}
                className="mr-4"
              >
                Submit Another Job
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/job'}
              >
                View Job Board
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}