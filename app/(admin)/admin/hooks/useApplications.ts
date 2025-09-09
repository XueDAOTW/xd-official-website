import { useState, useEffect, useCallback } from 'react'
import type { Application, AppCounts, ApplicationStatus } from '../types'

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>('all')
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

  const filteredApplications = applications.filter(app => {
    if (selectedStatus === 'all') return true
    return app.status === selectedStatus
  })

  return {
    applications: filteredApplications,
    loading,
    selectedStatus,
    setSelectedStatus,
    counts,
    updateApplicationStatus,
    deleteApplication,
  }
}