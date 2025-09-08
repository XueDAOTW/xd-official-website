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
import { Checkbox } from '@/components/ui/checkbox'
import { applicationSchema, type ApplicationFormData } from '@/lib/validations/application'
import { motion } from 'framer-motion'
import { fadeInVariants, staggerContainer } from '@/lib/utils/animations'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

const contributionAreas = [
  { id: 'networking', label: '舉辦 Networking 活動 | Hold events to help talented students can be seen' },
  { id: 'study-groups', label: '投入讀書會/共學日 | Join study groups and do some solid learning' },
  { id: 'community-moderation', label: '主持社群&經營社群媒體 | Moderate the community and social media' },
]

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function ApplicationForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedContributions, setSelectedContributions] = useState<string[]>([])
  const [studentStatus, setStudentStatus] = useState<'student' | 'non-student' | ''>('')
  const [howKnowUs, setHowKnowUs] = useState<'social-media' | 'friend-referral' | 'event-workshop' | 'other' | ''>('')

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
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-white">讓我們更了解你的！| Let us know more about YOU!</CardTitle>
          <CardDescription className="text-purple-100">
            Please fill out this field.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div variants={fadeInVariants} className="space-y-2">
              <Label htmlFor="name">姓名 | What's your name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="d"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-3">
              <Label>是否是學生？| Are you currently a student? *</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="student"
                    value="student"
                    {...register('student_status')}
                    onChange={(e) => setStudentStatus(e.target.value as 'student')}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <Label htmlFor="student" className="cursor-pointer">我是學生 | I am a Student!</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="non-student"
                    value="non-student"
                    {...register('student_status')}
                    onChange={(e) => setStudentStatus(e.target.value as 'non-student')}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <Label htmlFor="non-student" className="cursor-pointer">已經不是學生咧 | I am not a Student</Label>
                </div>
              </div>
              {errors.student_status && (
                <p className="text-sm text-red-500">{errors.student_status.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-2">
              <Label htmlFor="school_name">學校名稱 | School Name (For both Students/Non-students) *</Label>
              <Input
                id="school_name"
                {...register('school_name')}
                placeholder="d"
                className={errors.school_name ? 'border-red-500' : ''}
              />
              {errors.school_name && (
                <p className="text-sm text-red-500">{errors.school_name.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-2">
              <Label htmlFor="major">科系 | Major (For both Students/Non-students) *</Label>
              <Input
                id="major"
                {...register('major')}
                placeholder="d"
                className={errors.major ? 'border-red-500' : ''}
              />
              {errors.major && (
                <p className="text-sm text-red-500">{errors.major.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-2">
              <Label htmlFor="years_since_graduation">若已經畢業，請填寫畫業年數 | If not student, please fill the # of years since your graduation</Label>
              <Input
                id="years_since_graduation"
                {...register('years_since_graduation')}
                placeholder="d"
                className={errors.years_since_graduation ? 'border-red-500' : ''}
              />
              {errors.years_since_graduation && (
                <p className="text-sm text-red-500">{errors.years_since_graduation.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-2">
              <Label htmlFor="telegram_id">Telegram ID (@___) *</Label>
              <Input
                id="telegram_id"
                {...register('telegram_id')}
                placeholder="d"
                className={errors.telegram_id ? 'border-red-500' : ''}
              />
              {errors.telegram_id && (
                <p className="text-sm text-red-500">{errors.telegram_id.message}</p>
              )}
            </motion.div>



            <motion.div variants={fadeInVariants} className="space-y-2">
              <Label htmlFor="why_join_xuedao" className="text-purple-600 font-semibold">
                想加入 XueDAO 的原因！*<br/>
                Why does joining XueDAO sparkle joy for you?
              </Label>
              <p className="text-sm text-gray-600 italic">
                ex: I want to learn! / I want to impact the Web3 industry in Taiwan!<br/>
                Share your dreams, aspirations, or just why you think we're a good match. We're all ears!
              </p>
              <Textarea
                id="why_join_xuedao"
                {...register('why_join_xuedao')}
                placeholder="您的回答"
                rows={4}
                className={errors.why_join_xuedao ? 'border-red-500' : ''}
              />
              {errors.why_join_xuedao && (
                <p className="text-sm text-red-500">{errors.why_join_xuedao.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-2">
              <Label htmlFor="web3_interests" className="text-purple-600 font-semibold">
                對 Web3 最感興趣的領域/事物！*<br/>
                What specific area in Web3 you feel interested the most and bring to XueDAO?
              </Label>
              <p className="text-sm text-gray-600 italic">
                Don't limit yourself, list down multiple areas is fine! Like "DeFi Wizard", "NFTs hunters", "ETH Maxi". Your uniqueness diversify us!
              </p>
              <Textarea
                id="web3_interests"
                {...register('web3_interests')}
                placeholder="您的回答"
                rows={4}
                className={errors.web3_interests ? 'border-red-500' : ''}
              />
              {errors.web3_interests && (
                <p className="text-sm text-red-500">{errors.web3_interests.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-2">
              <Label htmlFor="skills_bringing" className="text-purple-600 font-semibold">
                向我們分享你伽計帶來 XueDAO 的技能！*<br/>
                What magical skills are you brining to XueDAO?
              </Label>
              <p className="text-sm text-gray-600 italic">
                Let go your potential by just writing it down! Such as, like: "I can present!", "I do some coding", "I am from marketing background," any skill can strengthen us!
              </p>
              <Textarea
                id="skills_bringing"
                {...register('skills_bringing')}
                placeholder="您的回答"
                rows={4}
                className={errors.skills_bringing ? 'border-red-500' : ''}
              />
              {errors.skills_bringing && (
                <p className="text-sm text-red-500">{errors.skills_bringing.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-2">
              <Label htmlFor="web3_journey" className="text-purple-600 font-semibold">
                請來分享Web3的旅程！*<br/>
                How would you describe your journey with Web3 so far?
              </Label>
              <p className="text-sm text-gray-600 italic">
                Don't worry! As long as you want to learn, you can also join us without any related experience!
              </p>
              <Textarea
                id="web3_journey"
                {...register('web3_journey')}
                placeholder="您的回答"
                rows={4}
                className={errors.web3_journey ? 'border-red-500' : ''}
              />
              {errors.web3_journey && (
                <p className="text-sm text-red-500">{errors.web3_journey.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-3">
              <Label className="text-purple-600 font-semibold">
                會願意參與 XueDAO 哪些面向的事物呢！（多選）*<br/>
                In which area you think you can contribute to XueDAO?
              </Label>
              <p className="text-sm text-gray-600 italic">You can also choose ALL if you are an all-round talent!</p>
              <div className="grid grid-cols-1 gap-3">
                {contributionAreas.map((area) => (
                  <div key={area.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-purple-50">
                    <Checkbox
                      id={area.id}
                      checked={selectedContributions.includes(area.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          const newContributions = [...selectedContributions, area.id]
                          setSelectedContributions(newContributions)
                          setValue('contribution_areas', newContributions)
                        } else {
                          const newContributions = selectedContributions.filter(id => id !== area.id)
                          setSelectedContributions(newContributions)
                          setValue('contribution_areas', newContributions)
                        }
                      }}
                      className="mt-1"
                    />
                    <Label htmlFor={area.id} className="cursor-pointer text-sm leading-relaxed">
                      {area.label}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.contribution_areas && (
                <p className="text-sm text-red-500">{errors.contribution_areas.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-3">
              <Label className="text-purple-600 font-semibold">
                如何知道我們的？*<br/>
                How did you know us?
              </Label>
              <p className="text-sm text-gray-600 italic">Knowing this helps us connect with more awesome folks like you.</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="social-media"
                    value="social-media"
                    {...register('how_know_us')}
                    onChange={(e) => setHowKnowUs(e.target.value as 'social-media')}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <Label htmlFor="social-media" className="cursor-pointer">社群媒體 Social Media</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="friend-referral"
                    value="friend-referral"
                    {...register('how_know_us')}
                    onChange={(e) => setHowKnowUs(e.target.value as 'friend-referral')}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <Label htmlFor="friend-referral" className="cursor-pointer">朋友推虐 Friend Referral</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="event-workshop"
                    value="event-workshop"
                    {...register('how_know_us')}
                    onChange={(e) => setHowKnowUs(e.target.value as 'event-workshop')}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <Label htmlFor="event-workshop" className="cursor-pointer">活動等與 Event or Workshop</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="other"
                    value="other"
                    {...register('how_know_us')}
                    onChange={(e) => setHowKnowUs(e.target.value as 'other')}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <Label htmlFor="other" className="cursor-pointer">其他 Other</Label>
                </div>
              </div>
              {errors.how_know_us && (
                <p className="text-sm text-red-500">{errors.how_know_us.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-2">
              <Label htmlFor="referrer_name">推薦人姓名（若有）| Referrer Name (if any)</Label>
              <Textarea
                id="referrer_name"
                {...register('referrer_name')}
                placeholder="您的回答"
                rows={2}
                className={errors.referrer_name ? 'border-red-500' : ''}
              />
              {errors.referrer_name && (
                <p className="text-sm text-red-500">{errors.referrer_name.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-2">
              <Label htmlFor="last_words">任何想告訴/問我們的嘆！| Any last words?</Label>
              <Textarea
                id="last_words"
                {...register('last_words')}
                placeholder="您的回答"
                rows={3}
                className={errors.last_words ? 'border-red-500' : ''}
              />
              {errors.last_words && (
                <p className="text-sm text-red-500">{errors.last_words.message}</p>
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
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg"
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