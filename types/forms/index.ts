// Form-related type definitions
// Validation and form state types

// Form validation error type
export interface FormErrors {
  [key: string]: {
    message: string
    type?: string
  }
}

// Common form field props
export interface FormFieldProps {
  name: string
  label: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
}

// Select option type
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

// Checkbox group option
export interface CheckboxOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}