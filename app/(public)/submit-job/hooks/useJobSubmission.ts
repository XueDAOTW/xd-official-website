import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/lib/contexts/ToastContext'
import { jobSubmissionSchema, type JobSubmissionForm } from '../schemas/jobSchema'

export function useJobSubmission() {
  const { success, error } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const form = useForm<JobSubmissionForm>({
    resolver: zodResolver(jobSubmissionSchema) as Resolver<JobSubmissionForm>,
    defaultValues: {
      is_remote: false
    }
  })

  const onSubmit = async (data: JobSubmissionForm) => {
    try {
      setIsSubmitting(true)
      
      // Convert description and requirements to arrays
      const descriptionArray = data.description.split('\n').filter(line => line.trim())
      const requirementsArray = data.requirements.split('\n').filter(line => line.trim())

      const payload = {
        ...data,
        description: descriptionArray,
        requirements: requirementsArray,
        company_website: data.company_website || undefined,
        apply_url: data.apply_url || undefined,
        expires_at: data.expires_at || undefined
      }

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Failed to submit job posting')
      }

      setSubmitSuccess(true)
      success('Job posting submitted successfully! We will review it and notify you once approved.')
      form.reset()
    } catch (err) {
      console.error('Error submitting job:', err)
      error('Failed to submit job posting. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    isSubmitting,
    submitSuccess,
    setSubmitSuccess,
    onSubmit,
  }
}