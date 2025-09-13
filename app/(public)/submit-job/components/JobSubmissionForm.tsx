import type { UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { FormField } from '@/components/ui/form-field'

import type { JobSubmissionForm as JobForm } from '../schemas/jobSchema'

interface JobSubmissionFormProps {
  form: UseFormReturn<JobForm>
  onSubmit: (data: JobForm) => void
  isSubmitting: boolean
}

const jobTypeOptions = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Contract', label: 'Contract' },
]

const jobLevelOptions = [
  { value: 'Entry', label: 'Entry' },
  { value: 'Mid-Level', label: 'Mid-Level' },
  { value: 'Senior', label: 'Senior' },
  { value: 'Lead', label: 'Lead' },
  { value: 'Executive', label: 'Executive' },
]

const categoryOptions = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'aiml', label: 'AI/ML' },
  { value: 'design', label: 'Design' },
  { value: 'bd', label: 'Business Development' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'blockchain', label: 'Blockchain/Web3' },
  { value: 'data', label: 'Data Science' },
  { value: 'devops', label: 'DevOps' },
]

export function JobSubmissionForm({ form, onSubmit, isSubmitting }: JobSubmissionFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = form
  const isRemote = watch('is_remote')

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
                <FormField
                  name="title"
                  label="Job Title"
                  required
                  placeholder="e.g. Senior Frontend Developer"
                  register={register}
                  errors={errors}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    name="company"
                    label="Company Name"
                    required
                    placeholder="e.g. TechCorp Inc."
                    register={register}
                    errors={errors}
                  />
                  <FormField
                    name="location"
                    label="Location"
                    required
                    placeholder="e.g. San Francisco, CA, USA"
                    register={register}
                    errors={errors}
                  />
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
                  <FormField
                    name="job_type"
                    label="Job Type"
                    required
                    type="select"
                    options={jobTypeOptions}
                    register={register}
                    setValue={setValue}
                    errors={errors}
                  />
                  <FormField
                    name="job_level"
                    label="Job Level"
                    required
                    type="select"
                    options={jobLevelOptions}
                    register={register}
                    setValue={setValue}
                    errors={errors}
                  />
                  <FormField
                    name="category"
                    label="Category"
                    required
                    type="select"
                    options={categoryOptions}
                    register={register}
                    setValue={setValue}
                    errors={errors}
                  />
                </div>

                <FormField
                  name="description"
                  label="Job Description (one point per line)"
                  required
                  type="textarea"
                  placeholder="• Bachelor's degree in Computer Science or related field&#10;• 3+ years of software development experience&#10;• Experience with React and Node.js"
                  rows={6}
                  register={register}
                  errors={errors}
                />

                <FormField
                  name="requirements"
                  label="Job Requirements (one point per line)"
                  required
                  type="textarea"
                  placeholder="• Strong proficiency in JavaScript/TypeScript&#10;• Experience with modern web frameworks&#10;• Excellent communication skills"
                  rows={6}
                  register={register}
                  errors={errors}
                />
              </div>

              <Separator />

              {/* Company Information */}
              <div className="space-y-4">
                <FormField
                  name="company_email"
                  label="Company Contact Email"
                  required
                  type="email"
                  placeholder="hr@company.com"
                  register={register}
                  errors={errors}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    name="company_website"
                    label="Company Website"
                    placeholder="https://company.com"
                    register={register}
                    errors={errors}
                  />
                  <FormField
                    name="apply_url"
                    label="Application URL"
                    placeholder="https://company.com/careers/job-id"
                    register={register}
                    errors={errors}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    name="salary_min"
                    label="Minimum Salary (USD)"
                    type="number"
                    placeholder="50000"
                    register={register}
                    errors={errors}
                  />
                  <FormField
                    name="salary_max"
                    label="Maximum Salary (USD)"
                    type="number"
                    placeholder="80000"
                    register={register}
                    errors={errors}
                  />
                </div>

                <FormField
                  name="expires_at"
                  label="Job Expiry Date (Optional)"
                  type="date"
                  register={register}
                  errors={errors}
                />
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