import { motion } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { fadeInVariants } from '@/lib/utils/animations'
import type { FieldErrors } from 'react-hook-form'
import type { ApplicationFormData } from '@/lib/validations/application'

type HowKnowUsOption = 'social-media' | 'friend-referral' | 'event-workshop' | 'other'

const howKnowUsOptions: { id: HowKnowUsOption; key: string }[] = [
  { id: 'social-media', key: 'socialMedia' },
  { id: 'friend-referral', key: 'friendReferral' },
  { id: 'event-workshop', key: 'eventWorkshop' },
  { id: 'other', key: 'other' },
]

interface HowKnowUsSectionProps {
  selectedHowKnowUs: HowKnowUsOption[]
  onHowKnowUsChange: (option: HowKnowUsOption, checked: boolean) => void
  errors: FieldErrors<ApplicationFormData>
  t: any
}

export function HowKnowUsSection({ 
  selectedHowKnowUs, 
  onHowKnowUsChange, 
  errors, 
  t 
}: HowKnowUsSectionProps) {
  return (
    <motion.div variants={fadeInVariants} className="space-y-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
      <Label className="text-cyan-700 font-bold text-xl flex items-center gap-2">
        <span className="bg-gradient-to-r from-cyan-600 to-sky-600 w-3 h-3 rounded-full"></span>
        {t.howKnowUsRequired}*
      </Label>
      <p className="text-sm text-gray-700 italic bg-white/70 p-4 rounded-xl border-l-4 border-cyan-300 mb-4">{t.howKnowUsNote}</p>
      <div className="space-y-3">
        {howKnowUsOptions.map((option) => (
          <label key={option.id} htmlFor={option.id} className="flex items-center space-x-4 p-4 bg-white rounded-xl hover:bg-cyan-50 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md border border-gray-100 hover:border-cyan-200 group">
            <Checkbox
              id={option.id}
              checked={selectedHowKnowUs.includes(option.id)}
              onCheckedChange={(checked) => {
                onHowKnowUsChange(option.id, !!checked)
              }}
              className="shrink-0"
            />
            <span className="text-sm leading-relaxed select-none group-hover:text-cyan-700 transition-colors font-medium">
              {t.howKnowUsOptions[option.key as keyof typeof t.howKnowUsOptions]}
            </span>
          </label>
        ))}
      </div>
      {errors.how_know_us && (
        <p className="text-sm text-red-500">{errors.how_know_us.message}</p>
      )}
    </motion.div>
  )
}