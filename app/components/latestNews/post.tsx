"use client"

import { useState, useEffect } from 'react'
import { InstagramEmbed } from 'react-social-media-embed'
import { RefreshCw } from 'lucide-react'

const fallbackPosts = [
  'https://www.instagram.com/p/DIKijg1Mcgw',
  'https://www.instagram.com/p/DG8HPZtM1pu',
  'https://www.instagram.com/p/DG7t_buhzC4',
]

function Post() {
  const [instagramPosts, setInstagramPosts] = useState<string[]>(fallbackPosts)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInstagramPosts()
  }, [])

  const fetchInstagramPosts = async () => {
    try {
      const response = await fetch('/api/public/settings')
      const result = await response.json()
      
      if (response.ok && result.data) {
        const posts = [
          result.data.instagram_post_1_url || fallbackPosts[0],
          result.data.instagram_post_2_url || fallbackPosts[1],
          result.data.instagram_post_3_url || fallbackPosts[2],
        ]
        setInstagramPosts(posts)
      }
    } catch (error) {
      console.error('Failed to fetch Instagram posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex w-full bg-gradient-to-b py-6 md:py-12">
        <div className="container flex flex-col mx-auto w-full px-4 md:px-6">
          <div className="text-center py-12">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-gray-400" />
            <p className="mt-2 text-gray-600">Loading Instagram posts...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full bg-gradient-to-b py-6 md:py-12">
      <div className="container flex flex-col mx-auto w-full px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 w-full">
          {instagramPosts.map((postUrl, index) => (
            <div key={index} className="flex w-full justify-center items-center md:p-4">
              <InstagramEmbed 
                url={postUrl}
                width="100%"
                className="w-full min-w-[280px] max-w-[390px] md:max-w-[450px] xl:max-w-[400px]"
                style={{ margin: "auto" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Post;
