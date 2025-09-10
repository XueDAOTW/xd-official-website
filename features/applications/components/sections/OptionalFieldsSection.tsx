import { motion } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { fadeInVariants } from '@/lib/utils/animations'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { ApplicationFormData } from '@/lib/validations/application'

interface OptionalFieldsSectionProps {
  register: UseFormRegister<ApplicationFormData>
  errors: FieldErrors<ApplicationFormData>
  t: any
}

export function OptionalFieldsSection({ register, errors, t }: OptionalFieldsSectionProps) {
  return (
    <>
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
    </>
  )
}