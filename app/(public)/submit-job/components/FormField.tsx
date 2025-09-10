import { FormField as BaseFormField } from '@/components/ui/form-field'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { JobSubmissionForm } from '../schemas/jobSchema'

interface FormFieldProps {
  name: keyof JobSubmissionForm
  label: string
  required?: boolean
  placeholder?: string
  type?: 'text' | 'email' | 'number' | 'date' | 'textarea' | 'select'
  options?: Array<{ value: string; label: string }>
  rows?: number
  register: UseFormRegister<JobSubmissionForm>
  setValue?: (name: keyof JobSubmissionForm, value: any) => void
  errors: FieldErrors<JobSubmissionForm>
}

export function FormField({
  name,
  label,
  required = false,
  placeholder,
  type = 'text',
  options,
  rows = 3,
  register,
  setValue,
  errors,
}: FormFieldProps) {
  return (
    <BaseFormField
      name={name}
      label={label}
      required={required}
      placeholder={placeholder}
      type={type}
      options={options}
      rows={rows}
      register={register}
      setValue={setValue ? (name: string, value: any) => setValue(name as keyof JobSubmissionForm, value) : undefined}
      errors={errors}
      variant="default"
      min={type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
    />
  )
}