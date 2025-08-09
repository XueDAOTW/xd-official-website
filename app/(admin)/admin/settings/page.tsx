"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save, RefreshCw, Instagram } from 'lucide-react'
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
    category: 'General',
  },
  {
    key: 'featured_post_title',
    label: 'Featured Section Title',
    description: 'Title for the featured community section',
    type: 'text',
    category: 'General',
  },
  {
    key: 'featured_post_description',
    label: 'Featured Section Description',
    description: 'Description for the featured community section',
    type: 'textarea',
    category: 'General',
  },
]

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/settings')
      const result = await response.json()
      
      if (response.ok) {
        setSettings(result.data)
        const valuesMap: Record<string, string> = {}
        result.data.forEach((setting: AdminSetting) => {
          valuesMap[setting.key] = setting.value
        })
        setValues(valuesMap)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="mx-auto h-8 w-8 animate-spin text-gray-400" />
        <p className="mt-2 text-gray-600">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Manage XueDAO website settings and configuration</p>
      </div>

      <div className="space-y-8">
        {Object.entries(
          settingsConfig.reduce((groups, config) => {
            const category = config.category || 'General'
            if (!groups[category]) groups[category] = []
            groups[category].push(config)
            return groups
          }, {} as Record<string, typeof settingsConfig>)
        ).map(([category, configs]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
            <div className="grid gap-4">
              {configs.map((config) => (
                <Card key={config.key}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      {config.icon && <config.icon className="h-5 w-5 text-gray-500" />}
                      <div>
                        <CardTitle className="text-base">{config.label}</CardTitle>
                        <CardDescription className="text-sm">{config.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={config.key}>{config.label}</Label>
                      {renderSettingInput(config)}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Last updated: {
                          settings.find(s => s.key === config.key)?.updated_at
                            ? new Date(settings.find(s => s.key === config.key)!.updated_at).toLocaleString()
                            : 'Never'
                        }
                      </div>
                      <Button
                        onClick={() => updateSetting(config.key, values[config.key] || '')}
                        disabled={saving === config.key}
                        size="sm"
                      >
                        {saving === config.key ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>

                    {config.key.includes('_url') && values[config.key] && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                        <a
                          href={values[config.key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 break-all"
                        >
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