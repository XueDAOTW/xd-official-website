import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
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
  const error = errors[name]
  const isRequired = required ? ' *' : ''

  return (
    <div>
      <Label htmlFor={name}>{label}{isRequired}</Label>
      {type === 'textarea' ? (
        <Textarea
          id={name}
          {...register(name)}
          placeholder={placeholder}
          rows={rows}
        />
      ) : type === 'select' && options ? (
        <Select onValueChange={(value) => setValue?.(name, value)}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder || 'Select option'} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={name}
          type={type}
          {...register(name, type === 'number' ? { valueAsNumber: true } : {})}
          placeholder={placeholder}
          min={type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
        />
      )}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error.message}</p>
      )}
    </div>
  )
}