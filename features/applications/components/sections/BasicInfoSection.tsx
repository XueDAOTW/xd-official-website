import { motion } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { fadeInVariants } from '@/lib/utils/animations'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { ApplicationFormData } from '@/lib/validations/application'

interface BasicInfoSectionProps {
  register: UseFormRegister<ApplicationFormData>
  errors: FieldErrors<ApplicationFormData>
  studentStatus: 'student' | 'non-student' | ''
  onStudentStatusChange: (status: 'student' | 'non-student') => void
  t: any
}

export function BasicInfoSection({ 
  register, 
  errors, 
  studentStatus, 
  onStudentStatusChange, 
  t 
}: BasicInfoSectionProps) {
  return (
    <>
      <motion.div variants={fadeInVariants} className="space-y-3">
        <Label htmlFor="name" className="text-gray-700 font-semibold text-base">{t.nameRequired}</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder={t.namePlaceholder}
          className={errors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' : 'border-purple-300 focus:border-purple-500 focus:ring-purple-200 bg-white hover:border-purple-400 transition-all duration-200 h-12 touch-manipulation'}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </motion.div>

      <motion.div variants={fadeInVariants} className="space-y-3">
        <Label htmlFor="email" className="text-gray-700 font-semibold text-base">Email Address *</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="例如：your.email@example.com"
          className={errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' : 'border-purple-300 focus:border-purple-500 focus:ring-purple-200 bg-white hover:border-purple-400 transition-all duration-200 h-12 touch-manipulation'}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </motion.div>

      <motion.div variants={fadeInVariants} className="space-y-4">
        <Label className="text-gray-700 font-semibold text-base">{t.studentStatusRequired}</Label>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-purple-200 hover:border-purple-300 hover:shadow-sm transition-all duration-200 cursor-pointer group min-h-[3rem] touch-manipulation">
            <input
              type="radio"
              id="student"
              value="student"
              {...register('student_status')}
              onChange={(e) => onStudentStatusChange(e.target.value as 'student')}
              className="w-5 h-5 text-purple-600 border-purple-300 focus:ring-purple-500 shrink-0"
            />
            <Label htmlFor="student" className="cursor-pointer text-base font-medium group-hover:text-purple-700 transition-colors duration-200 flex-1">{t.studentOption}</Label>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-purple-200 hover:border-purple-300 hover:shadow-sm transition-all duration-200 cursor-pointer group min-h-[3rem] touch-manipulation">
            <input
              type="radio"
              id="non-student"
              value="non-student"
              {...register('student_status')}
              onChange={(e) => onStudentStatusChange(e.target.value as 'non-student')}
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
        <Label htmlFor="university" className="text-gray-700 font-semibold text-base">{t.schoolNameRequired}</Label>
        <Input
          id="university"
          {...register('university')}
          placeholder={t.schoolPlaceholder}
          className={errors.university ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' : 'border-purple-300 focus:border-purple-500 focus:ring-purple-200 bg-white hover:border-purple-400 transition-all duration-200 h-12 touch-manipulation'}
        />
        {errors.university && (
          <p className="text-sm text-red-500">{errors.university.message}</p>
        )}
      </motion.div>

      <motion.div variants={fadeInVariants} className="space-y-3">
        <Label htmlFor="major" className="text-gray-700 font-semibold text-base">{t.majorRequired}</Label>
        <Input
          id="major"
          {...register('major')}
          placeholder={t.majorPlaceholder}
          className={errors.major ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' : 'border-purple-300 focus:border-purple-500 focus:ring-purple-200 bg-white hover:border-purple-400 transition-all duration-200 h-12 touch-manipulation'}
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
          className={errors.years_since_graduation ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' : 'border-purple-300 focus:border-purple-500 focus:ring-purple-200 bg-white hover:border-purple-400 transition-all duration-200 h-12 touch-manipulation'}
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
          className={errors.telegram_id ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' : 'border-purple-300 focus:border-purple-500 focus:ring-purple-200 bg-white hover:border-purple-400 transition-all duration-200 h-12 touch-manipulation'}
        />
        {errors.telegram_id && (
          <p className="text-sm text-red-500">{errors.telegram_id.message}</p>
        )}
      </motion.div>
    </>
  )
}