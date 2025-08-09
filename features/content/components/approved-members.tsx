"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Instagram, Globe, Users } from 'lucide-react'
import { fadeInVariants, staggerContainer } from '@/lib/utils/animations'
import { format } from 'date-fns'

type ApprovedApplication = {
  id: string
  name: string
  university: string
  portfolio_url: string | null
  instagram_url: string | null
  created_at: string
}

export default function ApprovedMembers() {
  const [members, setMembers] = useState<ApprovedApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApprovedMembers()
  }, [])

  const fetchApprovedMembers = async () => {
    try {
      const response = await fetch('/api/public/applications?limit=12')
      const result = await response.json()
      
      if (response.ok) {
        setMembers(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch approved members:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-8 w-8 animate-pulse text-gray-400" />
        <p className="mt-2 text-gray-600">Loading community members...</p>
      </div>
    )
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No members yet</h3>
        <p className="mt-1 text-gray-500">Be the first to join our community!</p>
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-8"
    >
      <motion.div variants={fadeInVariants} className="text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
          Our Community Members
        </h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Meet the talented individuals who have joined the XueDAO community
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {members.map((member) => (
          <motion.div key={member.id} variants={fadeInVariants}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                    {member.university}
                  </p>
                  <p className="text-xs text-gray-500">
                    Joined {format(new Date(member.created_at), 'MMM yyyy')}
                  </p>
                </div>

                {(member.portfolio_url || member.instagram_url) && (
                  <div className="flex justify-center space-x-2">
                    {member.portfolio_url && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <a
                          href={member.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name}'s portfolio`}
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {member.instagram_url && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <a
                          href={member.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name}'s Instagram`}
                        >
                          <Instagram className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={fadeInVariants} className="text-center">
        <Button asChild size="lg" className="bg-joinus_btn hover:bg-joinus_btn/90">
          <a href="/apply">
            Join Our Community
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </motion.div>
    </motion.div>
  )
}