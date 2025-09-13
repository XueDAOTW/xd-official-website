'use client'

import { useState, useEffect } from 'react'
import { MapPin, Calendar, Building, Trash2, Check, X, Eye, Filter, Briefcase, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { useToast } from '@/lib/contexts/ToastContext'

interface JobItem {
  id: string
  title: string
  company: string
  location: string
  job_type: string
  job_level: string
  category: string
  description: string[]
  requirements: string[]
  company_email: string
  company_website?: string
  apply_url?: string
  salary_min?: number
  salary_max?: number
  is_remote: boolean
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  reviewed_by?: string
  reviewed_at?: string
}

export default function AdminJobsPage() {
  const { success, error } = useToast()
  const [jobs, setJobs] = useState<JobItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [counts, setCounts] = useState<{ pending: number; approved: number; rejected: number } | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{isOpen: boolean, jobId: string, jobTitle: string}>({isOpen: false, jobId: '', jobTitle: ''})

  const fetchCounts = async () => {
    try {
      const res = await fetch('/api/admin/jobs?aggregate=counts')
      if (!res.ok) throw new Error('Failed to fetch counts')
      const data = await res.json()
      setCounts(data.counts)
    } catch (e) {
      setCounts({ pending: 0, approved: 0, rejected: 0 })
    }
  }

  const fetchJobs = async (status: 'pending' | 'approved' | 'rejected' = 'pending') => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/jobs?status=${status}`)
      if (!response.ok) throw new Error('Failed to fetch jobs')
      const data = await response.json()
      setJobs(data.jobs || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  const updateJobStatus = async (jobId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/admin/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, status }),
      })
      if (!response.ok) throw new Error('Failed to update job')
      const data = await response.json()
      success(data.message)
      await Promise.all([fetchJobs(activeTab), fetchCounts()])
    } catch (err) {
      console.error('Error updating job:', err)
      error('Failed to update job status')
    }
  }

  const handleDeleteClick = (jobId: string, jobTitle: string) => {
    setDeleteDialog({isOpen: true, jobId, jobTitle})
  }

  const deleteJob = async () => {
    try {
      const response = await fetch(`/api/admin/jobs?jobId=${deleteDialog.jobId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete job')
      const data = await response.json()
      success(data.message)
      await Promise.all([fetchJobs(activeTab), fetchCounts()])
    } catch (err) {
      console.error('Error deleting job:', err)
      error('Failed to delete job')
    }
  }

  useEffect(() => { fetchCounts() }, [])
  useEffect(() => { fetchJobs(activeTab) }, [activeTab])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getCompanyLogo = (company: string) => {
    const initial = company.charAt(0).toUpperCase()
    const colors = ['bg-blue-500','bg-green-500','bg-purple-500','bg-red-500','bg-yellow-500','bg-indigo-500','bg-pink-500','bg-gray-500']
    const colorIndex = company.charCodeAt(0) % colors.length
    return (
      <div className={`w-8 h-8 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white font-semibold text-sm`}>
        {initial}
      </div>
    )
  }

  const JobTable = ({ amount }: { amount: number }) => (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50/80 to-blue-50/30 border-b border-gray-200/50 px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg md:text-xl">
                {activeTab === 'pending' && 'Pending Jobs'}
                {activeTab === 'approved' && 'Approved Jobs'}
                {activeTab === 'rejected' && 'Rejected Jobs'}
              </h3>
              <p className="text-gray-600 font-medium text-sm">{amount} total job{amount !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="font-semibold">
            <Filter className="h-4 w-4 mr-2" />
            Filter Jobs
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <RefreshCw className="h-8 w-8 animate-spin text-white" />
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">Loading Jobs</p>
            <p className="text-gray-500 font-medium">Please wait while we fetch the job listings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">No Jobs Found</p>
            <p className="text-gray-500 font-medium">There are no jobs in the {activeTab} category.</p>
          </div>
        ) : (
        <div className="divide-y divide-gray-100/80">
          {jobs.map((job) => (
            <div key={job.id} className="px-6 py-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 transition-all duration-200 group">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {getCompanyLogo(job.company)}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h4 className="font-bold text-gray-900 text-lg truncate group-hover:text-blue-700 transition-colors">{job.title}</h4>
                      {getStatusBadge(job.status)}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                      <span className="flex items-center gap-2 font-medium"><Building className="h-4 w-4 text-blue-500" />{job.company}</span>
                      <span className="flex items-center gap-2 font-medium"><MapPin className="h-4 w-4 text-green-500" />{job.location}</span>
                      <span className="flex items-center gap-2 font-medium"><Calendar className="h-4 w-4 text-purple-500" />{new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">{job.job_type}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">{job.job_level}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {job.status === 'pending' && (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 font-semibold shadow-sm transition-all hover:scale-105" onClick={() => updateJobStatus(job.id, 'approved')}>
                        <Check className="h-4 w-4 mr-1" />Approve
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 font-semibold shadow-sm transition-all hover:scale-105" onClick={() => updateJobStatus(job.id, 'rejected')}>
                        <X className="h-4 w-4 mr-1" />Reject
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline" className="font-semibold"><Eye className="h-4 w-4" /></Button>
                  <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 font-semibold" onClick={() => handleDeleteClick(job.id, job.title)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-gray-50/50 p-3 rounded-lg">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Email</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{job.company_email}</p>
                  </div>
                  <div className="bg-gray-50/50 p-3 rounded-lg">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Category</p>
                    <p className="text-sm font-semibold text-gray-900">{job.category}</p>
                  </div>
                  {job.salary_min && job.salary_max && (
                    <div className="bg-gray-50/50 p-3 rounded-lg">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Salary Range</p>
                      <p className="text-sm font-semibold text-gray-900">${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}</p>
                    </div>
                  )}
                  {job.reviewed_by && (
                    <div className="bg-gray-50/50 p-3 rounded-lg">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Reviewed By</p>
                      <p className="text-sm font-semibold text-gray-900">{job.reviewed_by}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Briefcase className="h-7 w-7 md:h-8 md:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 tracking-tight">Jobs Management</h1>
                <p className="text-blue-100 text-sm md:text-lg font-medium opacity-90">Review and manage job postings from companies</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
                <p className="text-xs font-semibold text-white/90 whitespace-nowrap">
                  {counts ? counts.pending + counts.approved + counts.rejected : '...'} Total Jobs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm group hover:scale-[1.02]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">Pending Jobs</p>
                <p className="text-2xl md:text-3xl font-black text-yellow-600">{counts ? counts.pending : '...'}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-yellow-100 shadow-sm group-hover:shadow-md transition-shadow">
                <Clock className="h-5 w-5 md:h-6 md:w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-600 font-medium mt-2">Awaiting review</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm group hover:scale-[1.02]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">Approved Jobs</p>
                <p className="text-2xl md:text-3xl font-black text-green-600">{counts ? counts.approved : '...'}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-green-100 shadow-sm group-hover:shadow-md transition-shadow">
                <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-600 font-medium mt-2">Live on website</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm group hover:scale-[1.02]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">Rejected Jobs</p>
                <p className="text-2xl md:text-3xl font-black text-red-600">{counts ? counts.rejected : '...'}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-red-100 shadow-sm group-hover:shadow-md transition-shadow">
                <XCircle className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-600 font-medium mt-2">Not approved</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filter Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="grid grid-cols-3 w-full sm:w-auto bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
            <TabsTrigger value="pending" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md font-bold text-xs md:text-sm px-4 py-2">
              Pending ({counts ? counts.pending : '...'})
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md font-bold text-xs md:text-sm px-4 py-2">
              Approved ({counts ? counts.approved : '...'})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-md font-bold text-xs md:text-sm px-4 py-2">
              Rejected ({counts ? counts.rejected : '...'})
            </TabsTrigger>
          </TabsList>
          <div className="text-sm text-gray-600 font-medium">
            Showing {jobs.length} job{jobs.length !== 1 ? 's' : ''}
          </div>
        </div>
        <TabsContent value="pending"><JobTable amount={counts ? counts.pending : 0} /></TabsContent>
        <TabsContent value="approved"><JobTable amount={counts ? counts.approved : 0} /></TabsContent>
        <TabsContent value="rejected"><JobTable amount={counts ? counts.rejected : 0} /></TabsContent>
      </Tabs>

      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({isOpen: false, jobId: '', jobTitle: ''})}
        onConfirm={deleteJob}
        title="Delete Job Posting"
        message={`Are you sure you want to delete "${deleteDialog.jobTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  )
}

