import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { applicationSchema, type ApplicationFormData } from '@/lib/validations/application'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function useApplicationForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  })

  const onSubmit = useCallback(async (data: ApplicationFormData) => {
    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application')
      }

      setStatus('success')
      form.reset()
    } catch (error) {
      console.error('Application submission error:', error)
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit application')
    }
  }, [form])

  return {
    form,
    status,
    errorMessage,
    onSubmit,
    setStatus
  }
}