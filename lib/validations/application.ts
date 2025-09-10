import { z } from 'zod'

// New application schema (v2)
export const applicationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  student_status: z.enum(['student', 'non-student']).refine((val) => val, { message: 'Please select your student status' }),
  school_name: z.string().min(2, 'Please enter your school name'),
  major: z.string().min(2, 'Please enter your major'),
  years_since_graduation: z.string().optional(),
  telegram_id: z.string().min(2, 'Please enter your Telegram ID'),
  why_join_xuedao: z.string().min(50, 'Please provide at least 50 characters explaining why you want to join XueDAO'),
  web3_interests: z.string().min(50, 'Please provide at least 50 characters about your Web3 interests'),
  skills_bringing: z.string().min(50, 'Please provide at least 50 characters about the skills you are bringing'),
  web3_journey: z.string().min(50, 'Please provide at least 50 characters about your Web3 journey'),
  contribution_areas: z.array(z.string()).min(1, 'Please select at least one contribution area'),
  how_know_us: z.array(z.enum(['social-media', 'friend-referral', 'event-workshop', 'other'])).min(1, 'Please select at least one option for how you know us'),
  referrer_name: z.string().optional(),
  last_words: z.string().optional(),
})


export type ApplicationFormData = z.infer<typeof applicationSchema>

export const reviewApplicationSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  reviewed_by: z.string(),
})

export type ReviewApplicationData = z.infer<typeof reviewApplicationSchema>