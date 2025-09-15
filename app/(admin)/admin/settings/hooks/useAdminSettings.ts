import { useState, useEffect } from 'react'
import type { Database } from '@/types'
import { settingsConfig } from '../constants/settingsConfig'

type AdminSetting = Database['public']['Tables']['admin_settings']['Row']

interface SettingsState {
  settings: AdminSetting[]
  values: Record<string, string>
  loadingStates: Record<string, boolean>
  saving: string | null
  isInitialLoading: boolean
}

export function useAdminSettings() {
  const [state, setState] = useState<SettingsState>({
    settings: [],
    values: {},
    loadingStates: {},
    saving: null,
    isInitialLoading: true,
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const initialLoadingStates: Record<string, boolean> = {}
    settingsConfig.forEach(config => {
      initialLoadingStates[config.key] = true
    })
    
    setState(prev => ({ 
      ...prev, 
      loadingStates: initialLoadingStates,
      isInitialLoading: true 
    }))
    
    try {
      const response = await fetch('/api/admin/settings')
      const result = await response.json()
      
      if (response.ok) {
        const valuesMap: Record<string, string> = {}
        const loadedStates: Record<string, boolean> = {}
        
        result.data.forEach((setting: AdminSetting) => {
          valuesMap[setting.key] = setting.value
          loadedStates[setting.key] = false
        })
        
        settingsConfig.forEach(config => {
          if (!valuesMap.hasOwnProperty(config.key)) {
            valuesMap[config.key] = ''
          }
          loadedStates[config.key] = false
        })
        
        setState(prev => ({
          ...prev,
          settings: result.data,
          values: valuesMap,
          loadingStates: loadedStates,
          isInitialLoading: false,
        }))
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      const errorStates: Record<string, boolean> = {}
      settingsConfig.forEach(config => {
        errorStates[config.key] = false
      })
      setState(prev => ({
        ...prev,
        loadingStates: errorStates,
        isInitialLoading: false,
      }))
    }
  }

  const updateSetting = async (key: string, value: string) => {
    setState(prev => ({ ...prev, saving: key }))
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value }),
      })

      if (response.ok) {
        setState(prev => ({
          ...prev,
          values: { ...prev.values, [key]: value }
        }))
      }
    } catch (error) {
      console.error('Failed to update setting:', error)
    } finally {
      setState(prev => ({ ...prev, saving: null }))
    }
  }

  const updateValue = (key: string, value: string) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [key]: value }
    }))
  }

  return {
    ...state,
    updateSetting,
    updateValue,
  }
}