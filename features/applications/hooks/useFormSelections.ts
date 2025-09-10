import { useState, useCallback } from 'react'
import type { UseFormSetValue } from 'react-hook-form'
import type { ApplicationFormData } from '@/lib/validations/application'

type HowKnowUsOption = 'social-media' | 'friend-referral' | 'event-workshop' | 'other'

export function useFormSelections(setValue: UseFormSetValue<ApplicationFormData>) {
  const [selectedContributions, setSelectedContributions] = useState<string[]>([])
  const [selectedHowKnowUs, setSelectedHowKnowUs] = useState<HowKnowUsOption[]>([])
  const [studentStatus, setStudentStatus] = useState<'student' | 'non-student' | ''>('')

  const handleContributionChange = useCallback((contributionId: string, checked: boolean) => {
    setSelectedContributions(prevContributions => {
      const newContributions = checked 
        ? [...prevContributions, contributionId]
        : prevContributions.filter(id => id !== contributionId)
      setValue('contribution_areas', newContributions)
      return newContributions
    })
  }, [setValue])

  const handleHowKnowUsChange = useCallback((option: HowKnowUsOption, checked: boolean) => {
    setSelectedHowKnowUs(prevSelections => {
      const newSelections = checked
        ? [...prevSelections, option]
        : prevSelections.filter(id => id !== option)
      setValue('how_know_us', newSelections)
      return newSelections
    })
  }, [setValue])

  const handleStudentStatusChange = useCallback((status: 'student' | 'non-student') => {
    setStudentStatus(status)
  }, [])

  return {
    selectedContributions,
    selectedHowKnowUs,
    studentStatus,
    handleContributionChange,
    handleHowKnowUsChange,
    handleStudentStatusChange
  }
}