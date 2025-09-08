"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { applicationSchema, type ApplicationFormData } from '@/lib/validations/application'
import { motion } from 'framer-motion'
import { fadeInVariants, staggerContainer } from '@/lib/utils/animations'
import { Loader2, CheckCircle, AlertCircle, Languages } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/language-context'
import { applyTranslations } from '@/lib/translations/apply-page'

const contributionAreas = [
  { id: 'networking', key: 'networking' },
  { id: 'study-groups', key: 'studyGroups' },
  { id: 'community-moderation', key: 'communityModeration' },
]

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function ApplicationFormI18n() {
  const { language, setLanguage } = useLanguage()
  const t = applyTranslations[language]
  
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
      className="max-w-4xl mx-auto"
    >
      {/* Language Switcher and Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/20">
            <div className="flex items-center gap-3">
              <Languages className="w-5 h-5 text-purple-100" />
              <Button
                variant={language === 'zh' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('zh')}
                className={language === 'zh' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:from-purple-600 hover:to-pink-600 transition-all duration-200' 
                  : 'text-black hover:bg-white transition-all duration-200'}
              >
                中文
              </Button>
              <Button
                variant={language === 'en' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('en')}
                className={language === 'en' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:from-purple-600 hover:to-pink-600 transition-all duration-200' 
                  : 'text-black hover:bg-white transition-all duration-200'}
              >
                English
              </Button>
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white/20">
          {t.pageTitle}
        </h1>
        <div className="text-lg text-gray-100 max-w-4xl mx-auto space-y-6">
          <p className="font-semibold text-xl leading-relaxed">
            {t.welcomeMessage}
          </p>
          <p className="text-lg leading-relaxed text-gray-200">
            {t.description}
          </p>
          
          <div className="bg-gradient-to-r from-white/20 to-white/15 backdrop-blur-lg rounded-3xl p-10 mt-10 shadow-xl border border-white/30">
            <h3 className="font-bold text-white/20 mb-6 text-xl flex items-center gap-2">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 w-2 h-2 rounded-full"></span>
              {t.notesTitle}
            </h3>
            <div className="text-left bg-white rounded-xl p-6 hover:bg-gray-50 transition-all duration-300">
              <div className="text-gray-800 space-y-4">
                <div className="flex items-start">
                  <span className="text-2xl">✏️</span> 
                  <span className="text-base leading-relaxed">{t.note1}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl">📌</span> 
                  <span className="text-base leading-relaxed">{t.note2}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl">🎯</span> 
                  <span className="text-base leading-relaxed">{t.note3}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-700/20 to-pink-700/20"></div>
          <div className="relative z-10">
            <CardTitle className="text-3xl font-bold text-white drop-shadow-lg mb-2">{t.cardTitle}</CardTitle>
            <CardDescription className="text-purple-50 text-lg font-medium">
              {t.cardSubtitle}
            </CardDescription>
          </div>
          <div className="absolute -bottom-1 left-0 w-full h-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-b-3xl"></div>
        </CardHeader>
        <CardContent className="mt-8 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <motion.div variants={fadeInVariants} className="space-y-3">
              <Label htmlFor="name" className="text-gray-700 font-semibold text-base">{t.nameRequired}</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder={t.namePlaceholder}
                className={errors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' : 'border-purple-300 focus:border-purple-500 focus:ring-purple-200 bg-white hover:border-purple-400 transition-all duration-200 h-12'}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-4">
              <Label className="text-gray-700 font-semibold text-base">{t.studentStatusRequired}</Label>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-purple-200 hover:border-purple-300 hover:shadow-sm transition-all duration-200 cursor-pointer group">
                  <input
                    type="radio"
                    id="student"
                    value="student"
                    {...register('student_status')}
                    onChange={(e) => setStudentStatus(e.target.value as 'student')}
                    className="w-5 h-5 text-purple-600 border-purple-300 focus:ring-purple-500 shrink-0"
                  />
                  <Label htmlFor="student" className="cursor-pointer text-base font-medium group-hover:text-purple-700 transition-colors duration-200 flex-1">{t.studentOption}</Label>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-purple-200 hover:border-purple-300 hover:shadow-sm transition-all duration-200 cursor-pointer group">
                  <input
                    type="radio"
                    id="non-student"
                    value="non-student"
                    {...register('student_status')}
                    onChange={(e) => setStudentStatus(e.target.value as 'non-student')}
                    className="w-5 h-5 text-purple-600 border-purple-300 focus:ring-purple-500 shrink-0"
                  />
                  <Label htmlFor="non-student" className="cursor-pointer text-base font-medium group-hover:text-purple-700 transition-colors duration-200 flex-1">{t.nonStudentOption}</Label>
                </div>
              </div>
              {errors.student_status && (
                <p className="text-sm text-red-500">{errors.student_status.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-3">
              <Label htmlFor="school_name" className="text-gray-700 font-semibold text-base">{t.schoolNameRequired}</Label>
              <Input
                id="school_name"
                {...register('school_name')}
                placeholder={t.schoolPlaceholder}
                className={errors.school_name ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' : 'border-purple-300 focus:border-purple-500 focus:ring-purple-200 bg-white hover:border-purple-400 transition-all duration-200 h-12'}
              />
              {errors.school_name && (
                <p className="text-sm text-red-500">{errors.school_name.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-3">
              <Label htmlFor="major" className="text-gray-700 font-semibold text-base">{t.majorRequired}</Label>
              <Input
                id="major"
                {...register('major')}
                placeholder={t.majorPlaceholder}
                className={errors.major ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' : 'border-purple-300 focus:border-purple-500 focus:ring-purple-200 bg-white hover:border-purple-400 transition-all duration-200 h-12'}
              />
              {errors.major && (
                <p className="text-sm text-red-500">{errors.major.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-3">
              <Label htmlFor="years_since_graduation" className="text-gray-700 font-semibold text-base">{t.yearsGraduationDescription}</Label>
              <Input
                id="years_since_graduation"
                {...register('years_since_graduation')}
                placeholder={t.yearsPlaceholder}
                className={errors.years_since_graduation ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' : 'border-purple-300 focus:border-purple-500 focus:ring-purple-200 bg-white hover:border-purple-400 transition-all duration-200 h-12'}
              />
              {errors.years_since_graduation && (
                <p className="text-sm text-red-500">{errors.years_since_graduation.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-3">
              <Label htmlFor="telegram_id" className="text-gray-700 font-semibold text-base">{t.telegramId}</Label>
              <Input
                id="telegram_id"
                {...register('telegram_id')}
                placeholder={t.telegramPlaceholder}
                className={errors.telegram_id ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' : 'border-purple-300 focus:border-purple-500 focus:ring-purple-200 bg-white hover:border-purple-400 transition-all duration-200 h-12'}
              />
              {errors.telegram_id && (
                <p className="text-sm text-red-500">{errors.telegram_id.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
              <Label htmlFor="why_join_xuedao" className="text-purple-700 font-bold text-xl flex items-center gap-2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 w-3 h-3 rounded-full"></span>
                {t.whyJoinRequired}*
              </Label>
              <p className="text-sm text-gray-700 italic whitespace-pre-line bg-white/70 p-4 rounded-xl border-l-4 border-purple-300">
                {t.whyJoinExample}
              </p>
              <Textarea
                id="why_join_xuedao"
                {...register('why_join_xuedao')}
                placeholder={t.placeholder}
                rows={5}
                className={errors.why_join_xuedao ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' : 'border-purple-300 focus:border-purple-500 focus:ring-purple-200 bg-white hover:border-purple-400 transition-all duration-200 min-h-[140px]'}
              />
              {errors.why_join_xuedao && (
                <p className="text-sm text-red-500">{errors.why_join_xuedao.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
              <Label htmlFor="web3_interests" className="text-indigo-700 font-bold text-xl flex items-center gap-2">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 w-3 h-3 rounded-full"></span>
                {t.web3InterestsRequired}*
              </Label>
              <p className="text-sm text-gray-700 italic bg-white/70 p-4 rounded-xl border-l-4 border-blue-300">
                {t.web3InterestsExample}
              </p>
              <Textarea
                id="web3_interests"
                {...register('web3_interests')}
                placeholder={t.placeholder}
                rows={5}
                className={errors.web3_interests ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' : 'border-blue-300 focus:border-blue-500 focus:ring-blue-200 bg-white hover:border-blue-400 transition-all duration-200 min-h-[140px]'}
              />
              {errors.web3_interests && (
                <p className="text-sm text-red-500">{errors.web3_interests.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
              <Label htmlFor="skills_bringing" className="text-emerald-700 font-bold text-xl flex items-center gap-2">
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 w-3 h-3 rounded-full"></span>
                {t.skillsBringingRequired}*
              </Label>
              <p className="text-sm text-gray-700 italic bg-white/70 p-4 rounded-xl border-l-4 border-emerald-300">
                {t.skillsBringingExample}
              </p>
              <Textarea
                id="skills_bringing"
                {...register('skills_bringing')}
                placeholder={t.placeholder}
                rows={5}
                className={errors.skills_bringing ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' : 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200 bg-white hover:border-emerald-400 transition-all duration-200 min-h-[140px]'}
              />
              {errors.skills_bringing && (
                <p className="text-sm text-red-500">{errors.skills_bringing.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
              <Label htmlFor="web3_journey" className="text-orange-700 font-bold text-xl flex items-center gap-2">
                <span className="bg-gradient-to-r from-orange-600 to-amber-600 w-3 h-3 rounded-full"></span>
                {t.web3JourneyRequired}*
              </Label>
              <p className="text-sm text-gray-700 italic bg-white/70 p-4 rounded-xl border-l-4 border-orange-300">
                {t.web3JourneyExample}
              </p>
              <Textarea
                id="web3_journey"
                {...register('web3_journey')}
                placeholder={t.placeholder}
                rows={5}
                className={errors.web3_journey ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' : 'border-orange-300 focus:border-orange-500 focus:ring-orange-200 bg-white hover:border-orange-400 transition-all duration-200 min-h-[140px]'}
              />
              {errors.web3_journey && (
                <p className="text-sm text-red-500">{errors.web3_journey.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
              <Label className="text-rose-700 font-bold text-xl flex items-center gap-2">
                <span className="bg-gradient-to-r from-rose-600 to-pink-600 w-3 h-3 rounded-full"></span>
                {t.contributionAreasRequired}*
              </Label>
              <p className="text-sm text-gray-700 italic bg-white/70 p-4 rounded-xl border-l-4 border-rose-300 mb-4">{t.contributionAreasNote}</p>
              <div className="grid grid-cols-1 gap-2">
                {contributionAreas.map((area) => (
                  <div key={area.id} className="flex items-center space-x-4 p-4 bg-white/80 border border-rose-200 rounded-xl hover:bg-white hover:shadow-lg hover:border-rose-300 transition-all duration-300 cursor-pointer group">
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
                      className="shrink-0 data-[state=checked]:bg-rose-600"
                    />
                    <Label htmlFor={area.id} className="cursor-pointer text-base leading-relaxed group-hover:text-rose-700 transition-colors duration-200 font-medium flex-1">
                      {t.contributionOptions[area.key as keyof typeof t.contributionOptions]}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.contribution_areas && (
                <p className="text-sm text-red-500">{errors.contribution_areas.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
              <Label className="text-cyan-700 font-bold text-xl flex items-center gap-2">
                <span className="bg-gradient-to-r from-cyan-600 to-sky-600 w-3 h-3 rounded-full"></span>
                {t.howKnowUsRequired}*
              </Label>
              <p className="text-sm text-gray-700 italic bg-white/70 p-4 rounded-xl border-l-4 border-cyan-300 mb-4">{t.howKnowUsNote}</p>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl border border-cyan-200 hover:border-cyan-300 hover:shadow-sm transition-all duration-200 cursor-pointer group">
                  <input
                    type="radio"
                    id="social-media"
                    value="social-media"
                    {...register('how_know_us')}
                    onChange={(e) => setHowKnowUs(e.target.value as 'social-media')}
                    className="w-5 h-5 text-cyan-600 border-cyan-300 focus:ring-cyan-500 shrink-0"
                  />
                  <Label htmlFor="social-media" className="cursor-pointer text-base font-medium group-hover:text-cyan-700 transition-colors duration-200 flex-1">{t.howKnowUsOptions.socialMedia}</Label>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl border border-cyan-200 hover:border-cyan-300 hover:shadow-sm transition-all duration-200 cursor-pointer group">
                  <input
                    type="radio"
                    id="friend-referral"
                    value="friend-referral"
                    {...register('how_know_us')}
                    onChange={(e) => setHowKnowUs(e.target.value as 'friend-referral')}
                    className="w-5 h-5 text-cyan-600 border-cyan-300 focus:ring-cyan-500 shrink-0"
                  />
                  <Label htmlFor="friend-referral" className="cursor-pointer text-base font-medium group-hover:text-cyan-700 transition-colors duration-200 flex-1">{t.howKnowUsOptions.friendReferral}</Label>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl border border-cyan-200 hover:border-cyan-300 hover:shadow-sm transition-all duration-200 cursor-pointer group">
                  <input
                    type="radio"
                    id="event-workshop"
                    value="event-workshop"
                    {...register('how_know_us')}
                    onChange={(e) => setHowKnowUs(e.target.value as 'event-workshop')}
                    className="w-5 h-5 text-cyan-600 border-cyan-300 focus:ring-cyan-500 shrink-0"
                  />
                  <Label htmlFor="event-workshop" className="cursor-pointer text-base font-medium group-hover:text-cyan-700 transition-colors duration-200 flex-1">{t.howKnowUsOptions.eventWorkshop}</Label>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl border border-cyan-200 hover:border-cyan-300 hover:shadow-sm transition-all duration-200 cursor-pointer group">
                  <input
                    type="radio"
                    id="other"
                    value="other"
                    {...register('how_know_us')}
                    onChange={(e) => setHowKnowUs(e.target.value as 'other')}
                    className="w-5 h-5 text-cyan-600 border-cyan-300 focus:ring-cyan-500 shrink-0"
                  />
                  <Label htmlFor="other" className="cursor-pointer text-base font-medium group-hover:text-cyan-700 transition-colors duration-200 flex-1">{t.howKnowUsOptions.other}</Label>
                </div>
              </div>
              {errors.how_know_us && (
                <p className="text-sm text-red-500">{errors.how_know_us.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-3">
              <Label htmlFor="referrer_name" className="text-gray-700 font-semibold text-base">{t.referrerNameDescription}</Label>
              <Textarea
                id="referrer_name"
                {...register('referrer_name')}
                placeholder={t.placeholder}
                rows={2}
                className={errors.referrer_name ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' : 'border-purple-300 focus:border-purple-500 focus:ring-purple-200 bg-white hover:border-purple-400 transition-all duration-200'}
              />
              {errors.referrer_name && (
                <p className="text-sm text-red-500">{errors.referrer_name.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeInVariants} className="space-y-3">
              <Label htmlFor="last_words" className="text-gray-700 font-semibold text-base">{t.lastWordsDescription}</Label>
              <Textarea
                id="last_words"
                {...register('last_words')}
                placeholder={t.placeholder}
                rows={3}
                className={errors.last_words ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' : 'border-purple-300 focus:border-purple-500 focus:ring-purple-200 bg-white hover:border-purple-400 transition-all duration-200'}
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

            <motion.div variants={fadeInVariants} className="pt-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white font-bold py-6 text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 rounded-2xl border-0"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    {t.submitting}
                  </>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>✨</span>
                    {t.submitButton}
                    <span>🚀</span>
                  </span>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}