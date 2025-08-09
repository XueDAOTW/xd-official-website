"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, XCircle, Clock, ExternalLink, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import type { Database } from '@/lib/types/database'

type Application = Database['public']['Tables']['applications']['Row']

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    fetchApplications()
  }, [selectedStatus])

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const url = selectedStatus === 'all' 
        ? '/api/applications' 
        : `/api/applications?status=${selectedStatus}`
      
      const response = await fetch(url)
      const result = await response.json()
      
      if (response.ok) {
        setApplications(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        // Refresh the applications list
        fetchApplications()
      }
    } catch (error) {
      console.error('Failed to update application:', error)
    }
  }

  const deleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return
    }

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Refresh the applications list
        fetchApplications()
      }
    } catch (error) {
      console.error('Failed to delete application:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredApplications = applications.filter(app => {
    if (selectedStatus === 'all') return true
    return app.status === selectedStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Applications Management</h2>
        <p className="text-gray-600">Review and manage XueDAO community applications</p>
      </div>

      <Tabs value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as any)}>
        <TabsList>
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedStatus} className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <Clock className="mx-auto h-8 w-8 animate-spin text-gray-400" />
              <p className="mt-2 text-gray-600">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">No applications found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredApplications.map((application) => (
                <Card key={application.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{application.name}</CardTitle>
                        <CardDescription>{application.email}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(application.status)}
                        <Button
                          onClick={() => deleteApplication(application.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-1">University</h4>
                        <p className="text-gray-900">{application.university}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-1">Applied</h4>
                        <p className="text-gray-900">
                          {format(new Date(application.created_at), 'PPP')}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Motivation</h4>
                      <p className="text-gray-900 text-sm leading-relaxed">
                        {application.motivation}
                      </p>
                    </div>

                    {(application.portfolio_url || application.instagram_url) && (
                      <div className="flex items-center space-x-4">
                        {application.portfolio_url && (
                          <a
                            href={application.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Portfolio
                          </a>
                        )}
                        {application.instagram_url && (
                          <a
                            href={application.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Instagram
                          </a>
                        )}
                      </div>
                    )}

                    {application.status === 'pending' && (
                      <div className="flex space-x-2 pt-4 border-t">
                        <Button
                          onClick={() => updateApplicationStatus(application.id, 'approved')}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => updateApplicationStatus(application.id, 'rejected')}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}

                    {(application.reviewed_by && application.reviewed_at) && (
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        Reviewed by {application.reviewed_by} on{' '}
                        {format(new Date(application.reviewed_at), 'PPP')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}