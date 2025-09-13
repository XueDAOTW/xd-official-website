"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { InstagramEmbed } from 'react-social-media-embed'
import { RefreshCw, AlertCircle, ExternalLink, Instagram } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { cn } from '@/lib/utils'
import { useInstagramPosts } from './hooks/useInstagramPosts'

// Instagram embed script manager
class InstagramScriptManager {
  private static instance: InstagramScriptManager
  private scriptLoaded = false
  private scriptLoading = false
  private callbacks: (() => void)[] = []
  
  static getInstance(): InstagramScriptManager {
    if (!InstagramScriptManager.instance) {
      InstagramScriptManager.instance = new InstagramScriptManager()
    }
    return InstagramScriptManager.instance
  }
  
  loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.scriptLoaded) {
        resolve()
        return
      }
      
      if (this.scriptLoading) {
        this.callbacks.push(() => resolve())
        return
      }
      
      this.scriptLoading = true
      const script = document.createElement('script')
      script.src = 'https://www.instagram.com/embed.js'
      script.async = true
      
      script.onload = () => {
        this.scriptLoaded = true
        this.scriptLoading = false
        this.callbacks.forEach(cb => cb())
        this.callbacks = []
        resolve()
      }
      
      script.onerror = () => {
        this.scriptLoading = false
        this.callbacks = []
        reject(new Error('Failed to load Instagram embed script'))
      }
      
      document.head.appendChild(script)
    })
  }
  
  processEmbeds() {
    if (window.instgrm?.Embeds) {
      window.instgrm.Embeds.process()
    }
  }
}

// Declare Instagram embed script global
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process(): void;
      };
    };
  }
}

type EmbedStatus = 'loading' | 'loaded' | 'error' | 'timeout'

function Post() {
  const {
    postStates,
    shouldLoadInstagram,
    setShouldLoadInstagram,
    instagramError,
    instagramPosts,
    loading,
    updatePostState,
    initializePostState,
    fetchInstagramPosts
  } = useInstagramPosts()
  const scriptManager = useRef(InstagramScriptManager.getInstance())

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '100px 0px', // Start loading 100px before coming into view
  })

  useEffect(() => {
    if (inView && !shouldLoadInstagram) {
      setShouldLoadInstagram(true)
      fetchInstagramPosts()
    }
  }, [inView, shouldLoadInstagram, setShouldLoadInstagram, fetchInstagramPosts])


  // Enhanced fallback card for failed embeds
  const FallbackInstagramCard = ({ postUrl, reason }: { postUrl: string; reason?: string }) => {
    const postId = postUrl.match(/\/p\/([^\/\?]+)/)?.[1]
    
    return (
      <div className="w-full max-w-[400px] mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="aspect-square bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center relative">
            <Instagram className="w-16 h-16 text-white/80" />
            <div className="absolute inset-0 bg-black/5" />
          </div>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">XD</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900 block">XueDAO</span>
                <span className="text-xs text-gray-500">@xue_dao_</span>
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-4">
              {reason === 'timeout' 
                ? 'This Instagram post is taking longer than expected to load.' 
                : 'Instagram post content couldn\'t load properly.'}
            </p>
            <div className="flex gap-2">
              <a
                href={postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200"
              >
                View on Instagram
                <ExternalLink className="w-4 h-4" />
              </a>
              {postId && (
                <button
                  onClick={() => {
                    updatePostState(postUrl, { status: 'loading' })
                    // Retry loading
                    setTimeout(() => {
                      if (window.instgrm?.Embeds) {
                        window.instgrm.Embeds.process()
                      }
                    }, 100)
                  }}
                  className="px-3 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 rounded-lg transition-colors duration-200"
                  title="Retry loading"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Improved Instagram embed component
  const InstagramPostEmbed = ({ postUrl, index }: { postUrl: string; index: number }) => {
    const embedRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [embedMethod, setEmbedMethod] = useState<'native' | 'library'>('native')
    
    const postId = postUrl.match(/\/p\/([^\/\?]+)/)?.[1]
    const currentState = postStates[postUrl] || { status: 'loading' }

    // Initialize post state
    useEffect(() => {
      initializePostState(postUrl)
    }, [postUrl])

    // Handle native Instagram embed
    useEffect(() => {
      if (embedMethod === 'native' && postId && currentState.status === 'loading') {
        const loadNativeEmbed = async () => {
          try {
            await scriptManager.current.loadScript()
            
            // Set timeout for embed loading
            timeoutRef.current = setTimeout(() => {
              if (currentState.status === 'loading') {
                updatePostState(postUrl, { status: 'timeout' })
              }
            }, 12000)
            
            // Process embeds after a short delay
            setTimeout(() => {
              scriptManager.current.processEmbeds()
              
              // Check if embed loaded after processing
              setTimeout(() => {
                if (embedRef.current) {
                  const iframe = embedRef.current.querySelector('iframe')
                  if (iframe && iframe.offsetHeight > 100) {
                    updatePostState(postUrl, { status: 'loaded' })
                    if (timeoutRef.current) clearTimeout(timeoutRef.current)
                  } else if (currentState.status === 'loading') {
                    // Native failed, try library
                    setEmbedMethod('library')
                  }
                }
              }, 3000)
            }, 100)
            
          } catch (error) {
            console.error('Failed to load Instagram script:', error)
            setEmbedMethod('library')
          }
        }

        loadNativeEmbed()
      }
        
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [embedMethod, postId, postUrl, currentState.status])

    const handleLibraryLoad = useCallback(() => {
      updatePostState(postUrl, { status: 'loaded' })
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }, [postUrl])

    const handleLibraryError = useCallback(() => {
      updatePostState(postUrl, { status: 'error', error: 'Failed to load Instagram post' })
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }, [postUrl])

    // Show fallback for error or timeout states
    if (currentState.status === 'error') {
      return <FallbackInstagramCard postUrl={postUrl} reason="error" />
    }
    
    if (currentState.status === 'timeout') {
      return <FallbackInstagramCard postUrl={postUrl} reason="timeout" />
    }

    return (
      <div className="relative w-full max-w-[400px] mx-auto">
        {/* Loading State */}
        {currentState.status === 'loading' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200 min-h-[500px]">
            <div className="text-center p-6">
              <div className="relative mb-4">
                <Instagram className="w-12 h-12 text-gray-300 mx-auto" />
                <div className="absolute inset-0 animate-pulse">
                  <Instagram className="w-12 h-12 text-blue-500 mx-auto opacity-50" />
                </div>
              </div>
              <RefreshCw className="h-6 w-6 animate-spin text-blue-500 mx-auto mb-3" />
              <p className="text-gray-600 text-sm font-medium mb-2">Loading Instagram post...</p>
              <p className="text-gray-400 text-xs">This might take a few seconds</p>
              <div className="mt-4">
                <button
                  onClick={() => setEmbedMethod('library')}
                  className="text-xs text-blue-600 hover:text-blue-800 underline transition-colors"
                >
                  Try alternative method
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Native Instagram Embed */}
        {embedMethod === 'native' && postId && (
          <div 
            ref={embedRef} 
            className={cn(
              "instagram-embed-container w-full",
              currentState.status === 'loading' && "opacity-50"
            )}
          >
            <blockquote 
              className="instagram-media" 
              data-instgrm-permalink={postUrl}
              data-instgrm-version="14"
              style={{
                background: '#FFF',
                border: '0',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                margin: '0',
                maxWidth: '400px',
                minWidth: '280px',
                padding: '0',
                width: '100%'
              }}
            >
              <div style={{ padding: '16px' }}>
                <a 
                  href={postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#FFFFFF',
                    lineHeight: '0',
                    padding: '0',
                    textAlign: 'center',
                    textDecoration: 'none',
                    width: '100%',
                    display: 'block'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ 
                      background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                      borderRadius: '50%', 
                      flexGrow: 0, 
                      height: '44px', 
                      marginRight: '14px', 
                      width: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Instagram style={{ color: 'white', width: '20px', height: '20px' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center' }}>
                      <div style={{ 
                        backgroundColor: '#F4F4F4', 
                        borderRadius: '6px', 
                        flexGrow: 0, 
                        height: '16px', 
                        marginBottom: '8px', 
                        width: '120px' 
                      }}></div>
                      <div style={{ 
                        backgroundColor: '#F4F4F4', 
                        borderRadius: '4px', 
                        flexGrow: 0, 
                        height: '12px', 
                        width: '80px' 
                      }}></div>
                    </div>
                  </div>
                  <div style={{ padding: '19% 0' }}></div>
                  <div style={{ 
                    height: '50px', 
                    margin: '0 auto 16px', 
                    width: '50px',
                    background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Instagram style={{ color: 'white', width: '24px', height: '24px' }} />
                  </div>
                </a>
                <p style={{
                  color: '#8e8e8e',
                  fontFamily: 'Arial,sans-serif',
                  fontSize: '14px',
                  lineHeight: '17px',
                  marginBottom: '0',
                  marginTop: '8px',
                  overflow: 'hidden',
                  padding: '8px 0 7px',
                  textAlign: 'center',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  <a 
                    href={postUrl}
                    style={{
                      color: '#8e8e8e',
                      fontFamily: 'Arial,sans-serif',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 'normal',
                      lineHeight: '17px',
                      textDecoration: 'none'
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    A post shared by XueDAO (@xue_dao_)
                  </a>
                </p>
              </div>
            </blockquote>
          </div>
        )}
        
        {/* Library Fallback */}
        {embedMethod === 'library' && (
          <div className="w-full">
            <InstagramEmbed 
              url={postUrl}
              width="100%"
              height={500}
              style={{ 
                margin: "0",
                maxWidth: "400px",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              }}
              onLoad={handleLibraryLoad}
              onError={handleLibraryError}
            />
          </div>
        )}
      </div>
    )
  }


  return (
    <div ref={ref} className="flex w-full bg-gradient-to-b py-6 md:py-12">
      <div className="container flex flex-col mx-auto w-full px-4 md:px-6">
        {/* Error Message */}
        {instagramError && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-yellow-800">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{instagramError}</span>
          </div>
        )}
        
        {/* Loading State */}
        {loading && !shouldLoadInstagram && (
          <div className="text-center py-16">
            <div className="w-full max-w-md mx-auto h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <Instagram className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Instagram posts will load when visible</p>
                <p className="text-gray-500 text-sm mt-1">Scroll down to see our latest updates</p>
              </div>
            </div>
          </div>
        )}
        
        {loading && shouldLoadInstagram && (
          <div className="text-center py-16">
            <div className="relative mx-auto w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-purple-500 animate-spin"></div>
              <Instagram className="absolute inset-0 m-auto w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Loading Instagram posts...
            </h3>
            <p className="text-gray-600">
              Fetching the latest updates from our social media
            </p>
          </div>
        )}
        
        {/* Instagram Posts */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 w-full place-items-center">
            {instagramPosts.map((postUrl, index) => (
              <div key={`${postUrl}-${index}`} className="w-full flex justify-center">
                <InstagramPostEmbed postUrl={postUrl} index={index} />
              </div>
            ))}
          </div>
        )}

        {/* Manual Refresh Button */}
        {!loading && instagramError && (
          <div className="text-center mt-8">
            <button
              onClick={() => {
                fetchInstagramPosts()
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <RefreshCw className="w-5 h-5" />
              Retry Loading Posts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
