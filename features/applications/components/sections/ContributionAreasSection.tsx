import { motion } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { fadeInVariants } from '@/lib/utils/animations'
import type { FieldErrors } from 'react-hook-form'
import type { ApplicationFormData } from '@/lib/validations/application'

const contributionAreas = [
  { id: 'networking', key: 'networking' },
  { id: 'study-groups', key: 'studyGroups' },
  { id: 'community-moderation', key: 'communityModeration' },
]

interface ContributionAreasSectionProps {
  selectedContributions: string[]
  onContributionChange: (contributionId: string, checked: boolean) => void
  errors: FieldErrors<ApplicationFormData>
  t: any
}

export function ContributionAreasSection({ 
  selectedContributions, 
  onContributionChange, 
  errors, 
  t 
}: ContributionAreasSectionProps) {
  return (
    <motion.div variants={fadeInVariants} className="space-y-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
      <Label className="text-rose-700 font-bold text-xl flex items-center gap-2">
        <span className="bg-gradient-to-r from-rose-600 to-pink-600 w-3 h-3 rounded-full"></span>
        {t.contributionAreasRequired}*
      </Label>
      <p className="text-sm text-gray-700 italic bg-white/70 p-4 rounded-xl border-l-4 border-rose-300 mb-4">{t.contributionAreasNote}</p>
      <div className="space-y-3">
        {contributionAreas.map((area) => (
          <label key={area.id} htmlFor={area.id} className="flex items-center space-x-4 p-4 bg-white rounded-xl hover:bg-rose-50 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md border border-gray-100 hover:border-rose-200 group">
            <Checkbox
              id={area.id}
              checked={selectedContributions.includes(area.id)}
              onCheckedChange={(checked) => {
                console.log('ContributionAreas - Selected option:', area.id, 'Checked:', !!checked)
                console.log('ContributionAreas - Current selections:', selectedContributions)
                onContributionChange(area.id, !!checked)
              }}
              className="shrink-0"
            />
            <span className="text-sm leading-relaxed select-none group-hover:text-rose-700 transition-colors font-medium">
              {t.contributionOptions[area.key as keyof typeof t.contributionOptions]}
            </span>
          </label>
        ))}
      </div>
      {errors.contribution_areas && (
        <p className="text-sm text-red-500">{errors.contribution_areas.message}</p>
      )}
    </motion.div>
  )
}