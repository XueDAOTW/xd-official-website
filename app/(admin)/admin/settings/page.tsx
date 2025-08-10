"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save, RefreshCw, Instagram, Settings as SettingsIcon, Globe, Zap } from 'lucide-react'
import type { Database } from '@/lib/types/database'

type AdminSetting = Database['public']['Tables']['admin_settings']['Row']

const settingsConfig = [
  // Instagram Posts Configuration
  {
    key: 'instagram_post_1_url',
    label: 'Instagram Post 1 URL',
    description: 'First featured Instagram post URL',
    type: 'url',
    icon: Instagram,
    category: 'Instagram Posts',
  },
  {
    key: 'instagram_post_2_url',
    label: 'Instagram Post 2 URL',
    description: 'Second featured Instagram post URL',
    type: 'url',
    icon: Instagram,
    category: 'Instagram Posts',
  },
  {
    key: 'instagram_post_3_url',
    label: 'Instagram Post 3 URL',
    description: 'Third featured Instagram post URL',
    type: 'url',
    icon: Instagram,
    category: 'Instagram Posts',
  },
  // General Settings
  {
    key: 'applications_open',
    label: 'Applications Open',
    description: 'Whether new applications are being accepted',
    type: 'boolean',
    icon: Zap,
    category: 'General',
  },
  {
    key: 'featured_post_title',
    label: 'Featured Section Title',
    description: 'Title for the featured community section',
    type: 'text',
    icon: Globe,
    category: 'General',
  },
  {
    key: 'featured_post_description',
    label: 'Featured Section Description',
    description: 'Description for the featured community section',
    type: 'textarea',
    icon: Globe,
    category: 'General',
  },
]

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSetting[]>([])
  const [saving, setSaving] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    
    // Set individual loading states for each setting
    const initialLoadingStates: Record<string, boolean> = {}
    settingsConfig.forEach(config => {
      initialLoadingStates[config.key] = true
    })
    setLoadingStates(initialLoadingStates)
    
    try {
      const response = await fetch('/api/admin/settings')
      const result = await response.json()
      
      if (response.ok) {
        setSettings(result.data)
        const valuesMap: Record<string, string> = {}
        const loadedStates: Record<string, boolean> = {}
        
        result.data.forEach((setting: AdminSetting) => {
          valuesMap[setting.key] = setting.value
          loadedStates[setting.key] = false
        })
        
        // Mark any missing settings as loaded with empty values
        settingsConfig.forEach(config => {
          if (!valuesMap.hasOwnProperty(config.key)) {
            valuesMap[config.key] = ''
          }
          loadedStates[config.key] = false
        })
        
        setValues(valuesMap)
        setLoadingStates(loadedStates)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      // Clear loading states on error
      const errorStates: Record<string, boolean> = {}
      settingsConfig.forEach(config => {
        errorStates[config.key] = false
      })
      setLoadingStates(errorStates)
    }
  }

  const updateSetting = async (key: string, value: string) => {
    setSaving(key)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value }),
      })

      if (response.ok) {
        // Update local state
        setValues(prev => ({ ...prev, [key]: value }))
      }
    } catch (error) {
      console.error('Failed to update setting:', error)
    } finally {
      setSaving(null)
    }
  }

  const handleInputChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const renderSettingInput = (config: typeof settingsConfig[0]) => {
    const value = values[config.key] || ''

    switch (config.type) {
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleInputChange(config.key, e.target.value)}
            placeholder={`Enter ${config.label.toLowerCase()}`}
            rows={3}
          />
        )
      case 'boolean':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(config.key, e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="true">Open</option>
            <option value="false">Closed</option>
          </select>
        )
      default:
        return (
          <Input
            type={config.type || 'text'}
            value={value}
            onChange={(e) => handleInputChange(config.key, e.target.value)}
            placeholder={`Enter ${config.label.toLowerCase()}`}
          />
        )
    }
  }

  // Remove the global loading screen - we'll show individual loading states instead

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <SettingsIcon className="h-7 w-7 md:h-8 md:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 tracking-tight">Settings Management</h1>
                <p className="text-blue-100 text-sm md:text-lg font-medium opacity-90">
                  Manage XueDAO website settings and configuration
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
                <p className="text-xs font-semibold text-white/90 whitespace-nowrap">
                  {settingsConfig.length} Settings Available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Categories */}
      <div className="space-y-8 md:space-y-10">
        {Object.entries(
          settingsConfig.reduce((groups, config) => {
            const category = config.category || 'General'
            if (!groups[category]) groups[category] = []
            groups[category].push(config)
            return groups
          }, {} as Record<string, typeof settingsConfig>)
        ).map(([category, configs]) => (
          <div key={category} className="space-y-6">
            {/* Enhanced Category Header */}
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
                <Card key={config.key} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group hover:scale-[1.01] overflow-hidden">
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
                        {loadingStates[config.key] ? (
                          <div className="rounded-lg border-2 border-gray-200/50 p-4 bg-gray-50/50 flex items-center justify-center h-12">
                            <RefreshCw className="h-4 w-4 animate-spin text-blue-500 mr-2" />
                            <span className="text-sm text-gray-500 font-medium">Loading...</span>
                          </div>
                        ) : (
                          <div className="rounded-lg border-2 border-gray-200/50 focus-within:border-blue-400 transition-colors">
                            {renderSettingInput(config)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200">
                      <div className="bg-gray-50/50 px-3 py-2 rounded-lg border border-gray-200/50">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Last Updated</p>
                        <p className="text-sm font-semibold text-gray-700">
                          {loadingStates[config.key] ? (
                            <span className="flex items-center gap-1">
                              <RefreshCw className="h-3 w-3 animate-spin" />
                              Loading...
                            </span>
                          ) : (
                            settings.find(s => s.key === config.key)?.updated_at
                              ? new Date(settings.find(s => s.key === config.key)!.updated_at).toLocaleString('en-US', {
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
                        onClick={() => updateSetting(config.key, values[config.key] || '')}
                        disabled={saving === config.key || loadingStates[config.key]}
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md font-bold px-6 py-2.5 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving === config.key ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Saving Changes...
                          </>
                        ) : loadingStates[config.key] ? (
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

                    {config.key.includes('_url') && values[config.key] && (
                      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200/50 px-5 py-4 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Globe className="h-4 w-4 text-blue-600" />
                          </div>
                          <h5 className="font-bold text-blue-800 text-sm uppercase tracking-wide">URL Preview</h5>
                        </div>
                        <a
                          href={values[config.key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 break-all font-bold underline decoration-2 underline-offset-4 transition-colors hover:bg-blue-100 px-2 py-1 rounded-md"
                        >
                          <span>🔗</span>
                          {values[config.key]}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}