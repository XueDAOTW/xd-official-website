import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { UseFormRegister, FieldErrors } from 'react-hook-form'

interface FormFieldProps {
  name: string
  label: string
  required?: boolean
  placeholder?: string
  type?: 'text' | 'email' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox' | 'radio'
  options?: Array<{ value: string; label: string }>
  rows?: number
  register?: UseFormRegister<any>
  setValue?: (name: string, value: any) => void
  errors?: FieldErrors<any>
  className?: string
  inputClassName?: string
  labelClassName?: string
  errorClassName?: string
  animated?: boolean
  variant?: 'default' | 'outlined' | 'minimal'
  description?: string
  min?: string | number
  max?: string | number
  step?: string | number
  children?: React.ReactNode
}

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
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
  className,
  inputClassName,
  labelClassName,
  errorClassName,
  animated = false,
  variant = 'default',
  description,
  min,
  max,
  step,
  children
}: FormFieldProps) {
  const error = errors?.[name]
  const isRequired = required ? ' *' : ''
  
  const baseInputClasses = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 bg-white',
    outlined: 'border-purple-300 focus:border-purple-500 focus:ring-purple-200 bg-white hover:border-purple-400 transition-all duration-200 h-12',
    minimal: 'border-gray-200 focus:border-gray-400 focus:ring-gray-100 bg-gray-50'
  }
  
  const errorInputClasses = {
    default: 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50',
    outlined: 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50',
    minimal: 'border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50'
  }
  
  const inputClasses = cn(
    error ? errorInputClasses[variant] : baseInputClasses[variant],
    inputClassName
  )
  
  const labelClasses = cn(
    variant === 'outlined' ? 'text-gray-700 font-semibold text-base' : 'text-gray-700 font-medium',
    labelClassName
  )
  
  const fieldContent = (
    <div className={cn('space-y-2', variant === 'outlined' && 'space-y-3', className)}>
      <Label htmlFor={name} className={labelClasses}>
        {label}{isRequired}
      </Label>
      
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}
      
      {type === 'textarea' ? (
        <Textarea
          id={name}
          {...(register ? register(name) : {})}
          placeholder={placeholder}
          rows={rows}
          className={inputClasses}
        />
      ) : type === 'select' && options ? (
        <Select onValueChange={(value) => setValue?.(name, value)}>
          <SelectTrigger className={inputClasses}>
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
      ) : type === 'checkbox' ? (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={name}
            {...(register ? register(name) : {})}
            className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
          />
          <Label htmlFor={name} className="text-sm font-normal cursor-pointer">
            {placeholder || label}
          </Label>
        </div>
      ) : type === 'radio' && options ? (
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer group">
              <input
                type="radio"
                id={`${name}-${option.value}`}
                value={option.value}
                {...(register ? register(name) : {})}
                onChange={(e) => setValue?.(name, e.target.value)}
                className="w-4 h-4 text-purple-600 border-purple-300 focus:ring-purple-500"
              />
              <Label htmlFor={`${name}-${option.value}`} className="cursor-pointer text-sm font-medium group-hover:text-purple-700 transition-colors duration-200 flex-1">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      ) : (
        <Input
          id={name}
          type={type}
          {...(register ? register(name, type === 'number' ? { valueAsNumber: true } : {}) : {})}
          placeholder={placeholder}
          className={inputClasses}
          min={min}
          max={max}
          step={step}
        />
      )}
      
      {children}
      
      {error && (
        <p className={cn('text-sm text-red-500', errorClassName)}>
          {typeof error === 'string' ? error : (error as any)?.message || 'Invalid input'}
        </p>
      )}
    </div>
  )
  
  if (animated) {
    return (
      <motion.div variants={variants}>
        {fieldContent}
      </motion.div>
    )
  }
  
  return fieldContent
}