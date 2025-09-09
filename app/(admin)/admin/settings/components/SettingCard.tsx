import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Save, RefreshCw, Globe } from 'lucide-react'
import { SettingInput } from './SettingInput'
import type { Database } from '@/lib/types/database'

type AdminSetting = Database['public']['Tables']['admin_settings']['Row']

interface SettingCardProps {
  config: {
    key: string
    label: string
    description: string
    type?: string
    icon?: React.ComponentType<{ className?: string }>
    category?: string
  }
  value: string
  settings: AdminSetting[]
  isLoading: boolean
  isSaving: boolean
  onValueChange: (value: string) => void
  onSave: () => void
}

export function SettingCard({
  config,
  value,
  settings,
  isLoading,
  isSaving,
  onValueChange,
  onSave,
}: SettingCardProps) {
  const setting = settings.find(s => s.key === config.key)
  const showUrlPreview = config.key.includes('_url') && value

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group hover:scale-[1.01] overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-gray-50/80 to-blue-50/30">
        <div className="flex items-start gap-4">
          {config.icon && (
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <config.icon className="h-7 w-7 text-white" />
            </div>
          )}
          <div className="flex-1">
            <CardTitle className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
              {config.label}
            </CardTitle>
            <CardDescription className="text-gray-600 font-semibold text-sm md:text-base leading-relaxed">
              {config.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor={config.key} className="text-sm md:text-base font-bold text-gray-700 uppercase tracking-wide">
            {config.label}
          </Label>
          <div className="relative">
            {isLoading ? (
              <div className="rounded-lg border-2 border-gray-200/50 p-4 bg-gray-50/50 flex items-center justify-center h-12">
                <RefreshCw className="h-4 w-4 animate-spin text-blue-500 mr-2" />
                <span className="text-sm text-gray-500 font-medium">Loading...</span>
              </div>
            ) : (
              <div className="rounded-lg border-2 border-gray-200/50 focus-within:border-blue-400 transition-colors">
                <SettingInput
                  config={config}
                  value={value}
                  onChange={onValueChange}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200">
          <div className="bg-gray-50/50 px-3 py-2 rounded-lg border border-gray-200/50">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Last Updated</p>
            <p className="text-sm font-semibold text-gray-700">
              {isLoading ? (
                <span className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Loading...
                </span>
              ) : (
                setting?.updated_at
                  ? new Date(setting.updated_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'Never'
              )}
            </p>
          </div>
          
          <Button
            onClick={onSave}
            disabled={isSaving || isLoading}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md font-bold px-6 py-2.5 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {showUrlPreview && (
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200/50 px-5 py-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Globe className="h-4 w-4 text-blue-600" />
              </div>
              <h5 className="font-bold text-blue-800 text-sm uppercase tracking-wide">URL Preview</h5>
            </div>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 break-all font-bold underline decoration-2 underline-offset-4 transition-colors hover:bg-blue-100 px-2 py-1 rounded-md"
            >
              <span>🔗</span>
              {value}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}