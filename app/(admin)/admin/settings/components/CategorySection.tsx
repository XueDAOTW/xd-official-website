import { useAdminSettings } from '../hooks/useAdminSettings'

import { SettingCard } from './SettingCard'

interface CategorySectionProps {
  category: string
  configs: Array<{
    key: string
    label: string
    description: string
    type?: string
    icon?: React.ComponentType<{ className?: string }>
    category?: string
  }>
  settings: ReturnType<typeof useAdminSettings>
}

export function CategorySection({ category, configs, settings }: CategorySectionProps) {
  const { values, settings: adminSettings, loadingStates, saving, updateSetting, updateValue } = settings

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b-2 border-gradient-to-r from-blue-200 to-purple-200">
        <div className="w-3 h-10 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full shadow-sm"></div>
        <div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">{category}</h2>
          <p className="text-gray-600 font-medium text-sm md:text-base">
            {configs.length} setting{configs.length !== 1 ? 's' : ''} in this category
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 xl:grid-cols-2">
        {configs.map((config) => (
          <SettingCard
            key={config.key}
            config={config}
            value={values[config.key] || ''}
            settings={adminSettings}
            isLoading={loadingStates[config.key] || false}
            isSaving={saving === config.key}
            onValueChange={(value) => updateValue(config.key, value)}
            onSave={() => updateSetting(config.key, values[config.key] || '')}
          />
        ))}
      </div>
    </div>
  )
}