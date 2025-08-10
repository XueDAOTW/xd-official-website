import { z } from 'zod'

export const applicationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  university: z.string().min(2, 'Please select or enter your university'),
  portfolio_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  motivation: z.string().min(50, 'Please provide at least 50 characters explaining your motivation'),
  instagram_url: z.string().url('Please enter a valid Instagram URL').optional().or(z.literal('')),
})

export type ApplicationFormData = z.infer<typeof applicationSchema>

export const reviewApplicationSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  reviewed_by: z.string(),
})

export type ReviewApplicationData = z.infer<typeof reviewApplicationSchema>