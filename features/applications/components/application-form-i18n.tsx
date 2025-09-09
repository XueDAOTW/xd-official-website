"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { fadeInVariants, staggerContainer } from '@/lib/utils/animations'
import { Loader2, CheckCircle, AlertCircle, Languages } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/language-context'
import { applyTranslations } from '@/lib/translations/apply-page'
import { useApplicationForm } from '../hooks/useApplicationForm'
import { useFormSelections } from '../hooks/useFormSelections'
import { BasicInfoSection } from './sections/BasicInfoSection'
import { TextAreaSection } from './sections/TextAreaSection'
import { ContributionAreasSection } from './sections/ContributionAreasSection'
import { HowKnowUsSection } from './sections/HowKnowUsSection'
import { OptionalFieldsSection } from './sections/OptionalFieldsSection'

export default function ApplicationFormI18n() {
  const { language, setLanguage } = useLanguage()
  const t = applyTranslations[language]
  
  const { form, status, errorMessage, onSubmit, setStatus } = useApplicationForm()
  const { register, handleSubmit, setValue, formState: { errors } } = form
  
  const {
    selectedContributions,
    selectedHowKnowUs,
    studentStatus,
    handleContributionChange,
    handleHowKnowUsChange,
    handleStudentStatusChange
  } = useFormSelections(setValue)

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
          <div className="bg-gray-100 from-purple-600/30 to-pink-600/30 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/20">
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
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white/20">
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
        <CardContent className="p-8 overflow-visible">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <BasicInfoSection 
              register={register}
              errors={errors}
              studentStatus={studentStatus}
              onStudentStatusChange={handleStudentStatusChange}
              t={t}
            />

            <TextAreaSection 
              register={register}
              errors={errors}
              t={t}
            />

            <ContributionAreasSection 
              selectedContributions={selectedContributions}
              onContributionChange={handleContributionChange}
              errors={errors}
              t={t}
            />

            <HowKnowUsSection 
              selectedHowKnowUs={selectedHowKnowUs}
              onHowKnowUsChange={handleHowKnowUsChange}
              errors={errors}
              t={t}
            />

            <OptionalFieldsSection 
              register={register}
              errors={errors}
              t={t}
            />

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

            <motion.div 
              variants={fadeInVariants} 
              className="pt-8 pb-4 bg-gradient-to-r from-white to-gray-50 -mx-8 px-8 mt-8 rounded-b-2xl border-t border-gray-200"
            >
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
              <p className="text-center text-sm text-gray-500 mt-4 font-medium">
                Please make sure all required fields are filled before submitting.
              </p>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}