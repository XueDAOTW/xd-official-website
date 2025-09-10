'use client'

import { SuccessView } from './components/SuccessView'
import { JobSubmissionForm } from './components/JobSubmissionForm'
import { useJobSubmission } from './hooks/useJobSubmission'

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