"use client"

import { useEffect } from 'react'
import { InstagramEmbed } from 'react-social-media-embed'
import { RefreshCw, AlertCircle, Instagram } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { useInstagramPosts } from './hooks/useInstagramPosts'


function Post() {
  const {
    shouldLoadInstagram,
    setShouldLoadInstagram,
    instagramError,
    instagramPosts,
    loading,
    fetchInstagramPosts
  } = useInstagramPosts()

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Single effect with proper guard conditions
  useEffect(() => {
    let isMounted = true
    
    if (inView && !shouldLoadInstagram && isMounted) {
      setShouldLoadInstagram(true)
      // Only call fetch once when component first comes into view
      // The fetchInstagramPosts function has its own caching logic
      setTimeout(() => {
        if (isMounted) {
          fetchInstagramPosts()
        }
      }, 100) // Small delay to prevent race conditions
    }
    
    return () => {
      isMounted = false
    }
  }, [inView, shouldLoadInstagram, setShouldLoadInstagram, fetchInstagramPosts]) // Depend on inView and related functions


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
        {loading && (
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
        
        {/* Instagram Posts - Only show when we have posts and not loading */}
        {!loading && instagramPosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 w-full place-items-center">
            {instagramPosts.map((postUrl, index) => (
              <div key={`${postUrl}-${index}`} className="w-full flex justify-center">
                <InstagramEmbed url={postUrl} />
              </div>
            ))}
          </div>
        )}

        {/* Manual Refresh Button */}
        {!loading && instagramError && (
          <div className="text-center mt-8">
            <button
              onClick={fetchInstagramPosts}
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
