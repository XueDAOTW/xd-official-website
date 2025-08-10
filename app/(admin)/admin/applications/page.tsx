"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, XCircle, Clock, ExternalLink, Trash2, Users, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import type { Database } from '@/lib/types/database'

type Application = Database['public']['Tables']['applications']['Row']

type AppCounts = { total: number; pending: number; approved: number; rejected: number }

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [counts, setCounts] = useState<AppCounts>({ total: 0, pending: 0, approved: 0, rejected: 0 })

  const fetchCounts = useCallback(async () => {
    try {
      const [allRes, pendingRes, approvedRes, rejectedRes] = await Promise.all([
        fetch('/api/applications'),
        fetch('/api/applications?status=pending'),
        fetch('/api/applications?status=approved'),
        fetch('/api/applications?status=rejected'),
      ])
      const [allJson, pendingJson, approvedJson, rejectedJson] = await Promise.all([
        allRes.json(),
        pendingRes.json(),
        approvedRes.json(),
        rejectedRes.json(),
      ])
      setCounts({
        total: allJson?.meta?.total ?? allJson?.data?.length ?? 0,
        pending: pendingJson?.meta?.total ?? pendingJson?.data?.length ?? 0,
        approved: approvedJson?.meta?.total ?? approvedJson?.data?.length ?? 0,
        rejected: rejectedJson?.meta?.total ?? rejectedJson?.data?.length ?? 0,
      })
    } catch (e) {
      // keep zeros on failure
    }
  }, [])

  const fetchApplications = useCallback(async () => {
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
  }, [selectedStatus])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  useEffect(() => {
    fetchCounts()
  }, [fetchCounts])

  const updateApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        fetchApplications()
        fetchCounts()
      }
    } catch (error) {
      console.error('Failed to update application:', error)
    }
  }

  const deleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return
    try {
      const response = await fetch(`/api/applications/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchApplications()
        fetchCounts()
      }
    } catch (error) {
      console.error('Failed to delete application:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 font-semibold px-3 py-1">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 font-semibold px-3 py-1">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 font-semibold px-3 py-1">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline" className="font-semibold px-3 py-1">{status}</Badge>
    }
  }

  const filteredApplications = applications.filter(app => {
    if (selectedStatus === 'all') return true
    return app.status === selectedStatus
  })

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Users className="h-7 w-7 md:h-8 md:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 tracking-tight">Applications Management</h1>
                <p className="text-blue-100 text-sm md:text-lg font-medium opacity-90">Review and manage XueDAO community applications</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
                <p className="text-xs font-semibold text-white/90 whitespace-nowrap">
                  {counts.total} Total Applications
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm group hover:scale-[1.02]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">Total Applications</CardTitle>
                <div className="text-2xl md:text-3xl font-black text-gray-900">{counts.total}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-100 shadow-sm group-hover:shadow-md transition-shadow">
                <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs md:text-sm text-gray-600 font-medium">All time submissions</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm group hover:scale-[1.02]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">Pending Review</CardTitle>
                <div className="text-2xl md:text-3xl font-black text-yellow-600">{counts.pending}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-yellow-100 shadow-sm group-hover:shadow-md transition-shadow">
                <Clock className="h-5 w-5 md:h-6 md:w-6 text-yellow-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs md:text-sm text-gray-600 font-medium">Awaiting review</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm group hover:scale-[1.02]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">Approved</CardTitle>
                <div className="text-2xl md:text-3xl font-black text-green-600">{counts.approved}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-green-100 shadow-sm group-hover:shadow-md transition-shadow">
                <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs md:text-sm text-gray-600 font-medium">Successfully approved</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm group hover:scale-[1.02]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">Rejected</CardTitle>
                <div className="text-2xl md:text-3xl font-black text-red-600">{counts.rejected}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-red-100 shadow-sm group-hover:shadow-md transition-shadow">
                <XCircle className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs md:text-sm text-gray-600 font-medium">Applications rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filter Tabs */}
      <Tabs value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as any)}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
            <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-bold text-xs md:text-sm px-3 py-2">
              All ({counts.total})
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md font-bold text-xs md:text-sm px-3 py-2">
              Pending ({counts.pending})
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md font-bold text-xs md:text-sm px-3 py-2">
              Approved ({counts.approved})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-md font-bold text-xs md:text-sm px-3 py-2">
              Rejected ({counts.rejected})
            </TabsTrigger>
          </TabsList>
          <div className="text-sm text-gray-600 font-medium">
            Showing {filteredApplications.length} applications
          </div>
        </div>

        <TabsContent value={selectedStatus} className="mt-0">
          {loading ? (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardContent className="min-h-[50vh] flex items-center justify-center py-16">
                <div className="text-center max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <RefreshCw className="h-10 w-10 animate-spin text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Loading Applications</h3>
                  <p className="text-gray-600 font-medium leading-relaxed">Please wait while we fetch the latest applications from the database...</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredApplications.length === 0 ? (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardContent className="text-center py-20 px-6">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">No Applications Found</h3>
                  <p className="text-gray-600 font-medium leading-relaxed mb-4">There are no applications matching your current filter criteria.</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200/50">
                    <span className="text-sm font-semibold text-blue-700">Filter: {selectedStatus === 'all' ? 'All Applications' : selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredApplications.map((application) => (
                <Card key={application.id} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group hover:scale-[1.01] overflow-hidden">
                  <CardHeader className="pb-4 bg-gradient-to-r from-gray-50/80 to-blue-50/30">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:shadow-lg transition-shadow">
                          {application.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors">{application.name}</CardTitle>
                          <CardDescription className="text-gray-600 font-semibold truncate text-base">{application.email}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {getStatusBadge(application.status)}
                        <Button 
                          onClick={() => deleteApplication(application.id)} 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 hover:border-red-400 font-semibold transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200/50">
                        <h4 className="font-bold text-sm text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          University
                        </h4>
                        <p className="text-gray-900 font-semibold text-base">{application.university}</p>
                      </div>
                      <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200/50">
                        <h4 className="font-bold text-sm text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Applied
                        </h4>
                        <p className="text-gray-900 font-semibold text-base">{format(new Date(application.created_at), 'PPP')}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50/30 p-5 rounded-xl border border-blue-200/50">
                      <h4 className="font-bold text-sm text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Motivation Statement
                      </h4>
                      <p className="text-gray-900 text-sm md:text-base leading-relaxed font-medium">{application.motivation}</p>
                    </div>

                    {(application.portfolio_url || application.instagram_url) && (
                      <div className="flex items-center space-x-4">
                        {application.portfolio_url && (
                          <a href={application.portfolio_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Portfolio
                          </a>
                        )}
                        {application.instagram_url && (
                          <a href={application.instagram_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Instagram
                          </a>
                        )}
                      </div>
                    )}

                    {application.status === 'pending' && (
                      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                        <Button 
                          onClick={() => updateApplicationStatus(application.id, 'approved')} 
                          size="sm" 
                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md font-bold px-6 py-2.5 transition-all hover:scale-105"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Application
                        </Button>
                        <Button 
                          onClick={() => updateApplicationStatus(application.id, 'rejected')} 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 font-bold px-6 py-2.5 transition-all hover:scale-105 shadow-sm"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject Application
                        </Button>
                      </div>
                    )}

                    {(application.reviewed_by && application.reviewed_at) && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 px-5 py-4 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-bold text-green-800 text-sm">Application Reviewed</p>
                            <p className="text-green-700 text-xs font-medium mt-0.5">
                              Reviewed by <span className="font-bold">{application.reviewed_by}</span> on {format(new Date(application.reviewed_at), 'PPP')}
                            </p>
                          </div>
                        </div>
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