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
import { HeaderSection } from './ui/HeaderSection'
import { SuccessMessage } from './ui/SuccessMessage'
import { FormCardHeader } from './ui/FormCardHeader'

export default function ApplicationForm() {
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

  // Template data is now passed directly as props

  if (status === 'success') {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        className="max-w-2xl mx-auto"
      >
        <SuccessMessage 
          successTitle="Application Submitted!"
          successMessage="Thank you for your application. We'll review it and get back to you soon."
        />
        <div className="text-center mt-4">
          <Button onClick={() => setStatus('idle')} variant="outline">
            Submit Another Application
          </Button>
        </div>
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
        {/* Language Switcher - Keep as React components */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 from-purple-600/30 to-pink-600/30 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/20">
            <div className="flex items-center gap-3">
              <Languages className="w-5 h-5 text-purple-100" />
              <Button
                variant={language === 'zh' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('zh')}
                className={language === 'zh'
                  ? 'bg-xuedao_pink text-white shadow-md hover:bg-xuedao_pink/90 transition-all duration-200'
                  : 'text-black hover:bg-white transition-all duration-200'}
              >
                中文
              </Button>
              <Button
                variant={language === 'en' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('en')}
                className={language === 'en'
                  ? 'bg-xuedao_pink text-white shadow-md hover:bg-xuedao_pink/90 transition-all duration-200'
                  : 'text-black hover:bg-white transition-all duration-200'}
              >
                English
              </Button>
            </div>
          </div>
        </div>

        {/* Header Content - Use component */}
        <div className="space-y-6">
          <HeaderSection 
            pageTitle={t.pageTitle}
            welcomeMessage={t.welcomeMessage}
            description={t.description}
            notesTitle={t.notesTitle}
            note1={t.note1}
            note2={t.note2}
            note3={t.note3}
          />
        </div>
      </div>

      <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
        <FormCardHeader 
          cardTitle={t.cardTitle}
          cardSubtitle={t.cardSubtitle}
        />
        <CardContent className="p-6 md:p-8 overflow-visible">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              className="pt-8 pb-4 bg-gray-50 -mx-6 md:-mx-8 px-6 md:px-8 mt-8 rounded-b-2xl border-t border-gray-200"
            >
              <Button
                type="submit"
                className="w-full bg-xuedao_pink hover:bg-xuedao_pink/90 text-white font-bold py-4 md:py-6 text-lg md:text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 rounded-2xl border-0 min-h-[3rem] md:min-h-[4rem]"
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