import { useState, useCallback, useRef } from 'react'

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
  const [loading, setLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const fetchAttempted = useRef(false)
  const maxRetries = 2

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
    if (fetchAttempted.current) return
    fetchAttempted.current = true
    
    try {
      setInstagramError(null)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await fetch('/api/public/settings', {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'max-age=300', // Cache for 5 minutes
        },
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.data) {
        const posts = [
          result.data.instagram_post_1_url || fallbackPosts[0],
          result.data.instagram_post_2_url || fallbackPosts[1],
          result.data.instagram_post_3_url || fallbackPosts[2],
        ]
        setInstagramPosts(posts)
        setRetryCount(0) // Reset retry count on success
      } else {
        throw new Error('No data received from API')
      }
    } catch (error) {
      console.error('Failed to fetch Instagram posts:', error)
      
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1)
        fetchAttempted.current = false // Allow retry
        // Exponential backoff: wait 1s, then 2s, then 4s
        setTimeout(() => {
          fetchInstagramPosts()
        }, Math.pow(2, retryCount) * 1000)
        return
      }
      
      setInstagramError('Unable to load latest Instagram posts. Showing fallback content.')
      // Use fallback posts if all retries failed
      setInstagramPosts(fallbackPosts)
    } finally {
      setLoading(false)
    }
  }, [retryCount])

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