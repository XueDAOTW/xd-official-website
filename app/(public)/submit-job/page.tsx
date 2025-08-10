'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

const jobSubmissionSchema = z.object({
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

type JobSubmissionForm = z.infer<typeof jobSubmissionSchema>

export default function SubmitJobPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<JobSubmissionForm>({
    resolver: zodResolver(jobSubmissionSchema),
    defaultValues: {
      is_remote: false
    }
  })

  const isRemote = watch('is_remote')
  const jobType = watch('job_type')
  const category = watch('category')

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

      const result = await response.json()
      setSubmitSuccess(true)
      reset()
    } catch (error) {
      console.error('Error submitting job:', error)
      alert('Failed to submit job posting. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-green-600 text-6xl mb-4">✓</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Submitted Successfully!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for submitting your job posting. Our admin team will review it and publish it soon.
                You will be notified at the email address you provided once it&apos;s approved.
              </p>
              <div className="space-y-4">
                <Button 
                  onClick={() => setSubmitSuccess(false)}
                  className="mr-4"
                >
                  Submit Another Job
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/job'}
                >
                  View Job Board
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit a Job Posting</h1>
          <p className="text-gray-600 mt-2">
            Post your job opportunity to reach talented students and professionals in the XueDAO community.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="e.g. Senior Frontend Developer"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      {...register('company')}
                      placeholder="e.g. TechCorp Inc."
                    />
                    {errors.company && (
                      <p className="text-sm text-red-600 mt-1">{errors.company.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      {...register('location')}
                      placeholder="e.g. San Francisco, CA, USA"
                    />
                    {errors.location && (
                      <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_remote"
                    checked={isRemote}
                    onCheckedChange={(checked) => setValue('is_remote', checked as boolean)}
                  />
                  <Label htmlFor="is_remote">This is a remote position</Label>
                </div>
              </div>

              <Separator />

              {/* Job Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="job_type">Job Type *</Label>
                    <Select onValueChange={(value) => setValue('job_type', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.job_type && (
                      <p className="text-sm text-red-600 mt-1">{errors.job_type.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="job_level">Job Level *</Label>
                    <Select onValueChange={(value) => setValue('job_level', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entry">Entry</SelectItem>
                        <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                        <SelectItem value="Lead">Lead</SelectItem>
                        <SelectItem value="Executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.job_level && (
                      <p className="text-sm text-red-600 mt-1">{errors.job_level.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => setValue('category', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="aiml">AI/ML</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="bd">Business Development</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="blockchain">Blockchain/Web3</SelectItem>
                        <SelectItem value="data">Data Science</SelectItem>
                        <SelectItem value="devops">DevOps</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Job Description * (one point per line)</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="• Bachelor's degree in Computer Science or related field&#10;• 3+ years of software development experience&#10;• Experience with React and Node.js"
                    rows={6}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="requirements">Job Requirements * (one point per line)</Label>
                  <Textarea
                    id="requirements"
                    {...register('requirements')}
                    placeholder="• Strong proficiency in JavaScript/TypeScript&#10;• Experience with modern web frameworks&#10;• Excellent communication skills"
                    rows={6}
                  />
                  {errors.requirements && (
                    <p className="text-sm text-red-600 mt-1">{errors.requirements.message}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Company Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company_email">Company Contact Email *</Label>
                  <Input
                    id="company_email"
                    type="email"
                    {...register('company_email')}
                    placeholder="hr@company.com"
                  />
                  {errors.company_email && (
                    <p className="text-sm text-red-600 mt-1">{errors.company_email.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_website">Company Website</Label>
                    <Input
                      id="company_website"
                      {...register('company_website')}
                      placeholder="https://company.com"
                    />
                    {errors.company_website && (
                      <p className="text-sm text-red-600 mt-1">{errors.company_website.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="apply_url">Application URL</Label>
                    <Input
                      id="apply_url"
                      {...register('apply_url')}
                      placeholder="https://company.com/careers/job-id"
                    />
                    {errors.apply_url && (
                      <p className="text-sm text-red-600 mt-1">{errors.apply_url.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="salary_min">Minimum Salary (USD)</Label>
                    <Input
                      id="salary_min"
                      type="number"
                      {...register('salary_min', { valueAsNumber: true })}
                      placeholder="50000"
                    />
                    {errors.salary_min && (
                      <p className="text-sm text-red-600 mt-1">{errors.salary_min.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="salary_max">Maximum Salary (USD)</Label>
                    <Input
                      id="salary_max"
                      type="number"
                      {...register('salary_max', { valueAsNumber: true })}
                      placeholder="80000"
                    />
                    {errors.salary_max && (
                      <p className="text-sm text-red-600 mt-1">{errors.salary_max.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="expires_at">Job Expiry Date (Optional)</Label>
                  <Input
                    id="expires_at"
                    type="date"
                    {...register('expires_at')}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <Separator />

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Review Process</h4>
                <p className="text-sm text-yellow-700">
                  All job postings are reviewed by our admin team before being published. 
                  This typically takes 24-48 hours. You&apos;ll receive an email notification once your posting is approved.
                </p>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Job Posting'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}