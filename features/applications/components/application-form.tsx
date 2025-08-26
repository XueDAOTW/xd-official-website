"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { applicationSchema, type ApplicationFormData } from '@/lib/validations/application'
import { motion } from 'framer-motion'
import { fadeInVariants, staggerContainer } from '@/lib/utils/animations'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

const universities = [
  'National Taiwan University (NTU)',
  'National Chengchi University (NCCU)',
  'National Cheng Kung University (NCKU)',
  'National Central University (NCU)',
  'National Kaohsiung University of Science and Technology (NKUST)',
  'National Tsing Hua University (NTHU)',
  'National Taiwan Normal University (NTNU)',
  'National Taipei University (NTPU)',
  'National Taipei University of Technology (NTUT)',
  'Fu Jen Catholic University (FJU)',
  'Chung Shan Medical University (CSMU)',
  'University of Southern California (USC)',
  'Other'
]

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function ApplicationForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [showCustomUniversity, setShowCustomUniversity] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  })

  const onSubmit = async (data: ApplicationFormData) => {
    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application')
      }

      setStatus('success')
      reset()
    } catch (error) {
      console.error('Application submission error:', error)
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit application')
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        className="max-w-2xl mx-auto"
      >
        <Card className="text-center">
          <CardContent className="pt-6">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-bold text-green-700 mb-2">Application Submitted!</h3>
            <p className="text-gray-600 mb-4">
              Thank you for your application. We'll review it and get back to you soon.
            </p>
            <Button onClick={() => setStatus('idle')} variant="outline">
              Submit Another Application
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Join XueDAO Community</CardTitle>
          <CardDescription>
            Apply to become part of Taiwan's first student-led blockchain development community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div variants={fadeInVariants} className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter your full name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="Enter your email address"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-2">
              <Label htmlFor="university">University *</Label>
              {!showCustomUniversity ? (
                <Select onValueChange={(value) => {
                  if (value === 'Other') {
                    setShowCustomUniversity(true)
                    setValue('university', '')
                  } else {
                    setValue('university', value)
                  }
                }}>
                  <SelectTrigger className={errors.university ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select your university" />
                  </SelectTrigger>
                  <SelectContent>
                    {universities.map((uni) => (
                      <SelectItem key={uni} value={uni}>
                        {uni}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="space-y-2">
                  <Input
                    {...register('university')}
                    placeholder="Please enter your university name"
                    className={errors.university ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowCustomUniversity(false)
                      setValue('university', '')
                    }}
                  >
                    Back to list
                  </Button>
                </div>
              )}
              {errors.university && (
                <p className="text-sm text-red-500">{errors.university.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-2">
              <Label htmlFor="portfolio_url">Portfolio URL</Label>
              <Input
                id="portfolio_url"
                type="url"
                {...register('portfolio_url')}
                placeholder="https://your-portfolio.com (optional)"
                className={errors.portfolio_url ? 'border-red-500' : ''}
              />
              {errors.portfolio_url && (
                <p className="text-sm text-red-500">{errors.portfolio_url.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-2">
              <Label htmlFor="instagram_url">Instagram Profile URL</Label>
              <Input
                id="instagram_url"
                type="url"
                {...register('instagram_url')}
                placeholder="https://instagram.com/yourhandle (optional)"
                className={errors.instagram_url ? 'border-red-500' : ''}
              />
              {errors.instagram_url && (
                <p className="text-sm text-red-500">{errors.instagram_url.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-2">
              <Label htmlFor="motivation">Why do you want to join XueDAO? *</Label>
              <Textarea
                id="motivation"
                {...register('motivation')}
                placeholder="Tell us about your interest in blockchain development and what you hope to gain from joining our community (minimum 50 characters)"
                rows={4}
                className={errors.motivation ? 'border-red-500' : ''}
              />
              {errors.motivation && (
                <p className="text-sm text-red-500">{errors.motivation.message}</p>
              )}
            </motion.div>

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md"
              >
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-700">{errorMessage}</p>
              </motion.div>
            )}

            <motion.div variants={fadeInVariants}>
              <Button
                type="submit"
                className="w-full"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}