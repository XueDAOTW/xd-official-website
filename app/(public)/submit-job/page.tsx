'use client'

import { SuccessView, JobSubmissionForm } from '@/features/jobs'
import { useJobSubmission } from '@/features/jobs/hooks'

export default function SubmitJobPage() {
  const { form, isSubmitting, submitSuccess, setSubmitSuccess, onSubmit } = useJobSubmission()

  if (submitSuccess) {
    return <SuccessView onSubmitAnother={() => setSubmitSuccess(false)} />
  }

  return (
    <JobSubmissionForm 
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  )
}