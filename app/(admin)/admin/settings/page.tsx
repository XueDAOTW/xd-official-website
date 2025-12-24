"use client"

import { SettingsHeader, CategorySection } from '@/features/admin'
import { useAdminSettings } from '@/features/admin/hooks'
import { settingsConfig } from '@/features/admin/constants'

export default function SettingsPage() {
  const settings = useAdminSettings()

  const settingsByCategory = settingsConfig.reduce((groups, config) => {
    const category = config.category || 'General'
    if (!groups[category]) groups[category] = []
    groups[category].push(config)
    return groups
  }, {} as Record<string, typeof settingsConfig>)

  return (
    <div className="space-y-6 md:space-y-8">
      <SettingsHeader settingsCount={settingsConfig.length} />
      
      <div className="space-y-8 md:space-y-10">
        {Object.entries(settingsByCategory).map(([category, configs]) => (
          <CategorySection
            key={category}
            category={category}
            configs={configs}
            settings={settings}
          />
        ))}
      </div>
    </div>
  )
}