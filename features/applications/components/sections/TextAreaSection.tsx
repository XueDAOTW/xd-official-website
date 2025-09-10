import { motion } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { fadeInVariants } from '@/lib/utils/animations'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { ApplicationFormData } from '@/lib/validations/application'

interface TextAreaSectionProps {
  register: UseFormRegister<ApplicationFormData>
  errors: FieldErrors<ApplicationFormData>
  t: any
}

export function TextAreaSection({ register, errors, t }: TextAreaSectionProps) {
  return (
    <>
      <motion.div variants={fadeInVariants} className="space-y-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
        <Label htmlFor="motivation" className="text-purple-700 font-bold text-xl flex items-center gap-2">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 w-3 h-3 rounded-full"></span>
          {t.whyJoinRequired}*
        </Label>
        <p className="text-sm text-gray-700 italic whitespace-pre-line bg-white/70 p-4 rounded-xl border-l-4 border-purple-300">
          {t.whyJoinExample}
        </p>
        <Textarea
          id="motivation"
          {...register('motivation')}
          placeholder={t.placeholder}
          rows={5}
          className={errors.motivation ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' : 'border-purple-300 focus:border-purple-500 focus:ring-purple-200 bg-white hover:border-purple-400 transition-all duration-200 min-h-[140px]'}
        />
        {errors.motivation && (
          <p className="text-sm text-red-500">{errors.motivation.message}</p>
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

    </>
  )
}