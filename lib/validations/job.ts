import { z } from 'zod'

export const jobSubmissionSchema = z.object({
  title: z.string().min(1, 'Job title is required').max(100, 'Title too long'),
  company: z.string().min(1, 'Company name is required').max(100, 'Company name too long'),
  location: z.string().min(1, 'Location is required').max(100, 'Location too long'),
  job_type: z.enum(['Full-time', 'Part-time', 'Internship', 'Contract']),
  job_level: z.enum(['Entry', 'Mid-Level', 'Senior', 'Lead', 'Executive']),
  category: z.enum(['engineering', 'aiml', 'design', 'bd', 'marketing', 'blockchain', 'data', 'devops']),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000, 'Description too long'),
  requirements: z.string().min(50, 'Requirements must be at least 50 characters').max(2000, 'Requirements too long'),
  company_email: z.string().email('Invalid email address'),
  company_website: z.string().url('Invalid URL').optional().or(z.literal('')),
  apply_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  salary_min: z.number().min(0, 'Salary must be positive').optional(),
  salary_max: z.number().min(0, 'Salary must be positive').optional(),
  is_remote: z.boolean().default(false),
  expires_at: z.string().optional()
}).refine((data) => {
  if (data.salary_min && data.salary_max) {
    return data.salary_max >= data.salary_min
  }
  return true
}, {
  message: "Maximum salary must be greater than minimum salary",
  path: ["salary_max"]
})

export type JobSubmissionForm = z.infer<typeof jobSubmissionSchema>
