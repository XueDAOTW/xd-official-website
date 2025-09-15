import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'

const fallbackPosts = [
  'https://www.instagram.com/p/DIKijg1Mcgw',
  'https://www.instagram.com/p/DG8HPZtM1pu',
  'https://www.instagram.com/p/DG7t_buhzC4',
]

export interface InstagramPostState {
  status: 'loading' | 'loaded' | 'error' | 'timeout'
  error?: string
}

export function useInstagramPosts() {
  const [postStates, setPostStates] = useState<Record<string, InstagramPostState>>({})
  const [shouldLoadInstagram, setShouldLoadInstagram] = useState(false)
  const [instagramError, setInstagramError] = useState<string | null>(null)
  const [instagramPosts, setInstagramPosts] = useState<string[]>(fallbackPosts)
  const [loading, setLoading] = useState(false)

  const updatePostState = useCallback((postUrl: string, updates: Partial<InstagramPostState>) => {
    setPostStates(prev => ({
      ...prev,
      [postUrl]: { ...prev[postUrl], ...updates }
    }))
  }, [])

  const initializePostState = useCallback((postUrl: string) => {
    setPostStates(prev => {
      if (!prev[postUrl]) {
        return {
          ...prev,
          [postUrl]: { status: 'loading' }
        }
      }
      return prev
    })
  }, [])

  const fetchInstagramPosts = useCallback(async () => {
    setLoading(true)
    try {
      setInstagramError(null)
      // Direct Supabase query - no API endpoint needed
      const { data, error } = await supabase
        .from('admin_settings')
        .select('key, value')
      
      if (error) {
        throw error
      }
      
      if (data) {
        // Convert to key-value object
        const settings: Record<string, string> = {}
        data.forEach(setting => {
          settings[setting.key] = setting.value
        })
        
        const posts = [
          settings.instagram_post_1_url || fallbackPosts[0],
          settings.instagram_post_2_url || fallbackPosts[1],
          settings.instagram_post_3_url || fallbackPosts[2],
        ]

        setInstagramPosts(posts)
        setInstagramError(null)
      } else {
        throw new Error('No data received from Supabase')
      }
    } catch (error) {
      setInstagramError('Using fallback Instagram posts.')
      setInstagramPosts(fallbackPosts)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    postStates,
    shouldLoadInstagram,
    setShouldLoadInstagram,
    instagramError,
    instagramPosts,
    loading,
    updatePostState,
    initializePostState,
    fetchInstagramPosts
  }
}