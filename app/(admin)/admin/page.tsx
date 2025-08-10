import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react'

async function getSupabase() {
  try {
    const mod = await import('@/lib/supabase/server')
    return mod.createServerSupabaseClient
  } catch {
    return null
  }
}

async function getApplicationStats() {
  const createServerSupabaseClient = await getSupabase()
  if (!createServerSupabaseClient) {
    return { total: 0, pending: 0, approved: 0, rejected: 0 }
  }
  const supabase = createServerSupabaseClient()
  const [
    { count: totalCount },
    { count: pendingCount },
    { count: approvedCount },
    { count: rejectedCount },
  ] = await Promise.all([
    supabase.from('applications').select('*', { count: 'exact', head: true }),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
  ])

  return {
    total: totalCount || 0,
    pending: pendingCount || 0,
    approved: approvedCount || 0,
    rejected: rejectedCount || 0,
  }
}

async function getRecentApplications() {
  const createServerSupabaseClient = await getSupabase()
  if (!createServerSupabaseClient) {
    return []
  }
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  return data || []
}

export default async function AdminDashboard() {
  const [stats, recentApplications] = await Promise.all([
    getApplicationStats(),
    getRecentApplications(),
  ])

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.total,
      description: 'All time applications',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      description: 'Awaiting review',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Approved',
      value: stats.approved,
      description: 'Successfully approved',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      description: 'Applications rejected',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ]

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <TrendingUp className="h-7 w-7 md:h-8 md:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-blue-100 mt-1 text-sm md:text-base font-medium opacity-90">Manage XueDAO applications, jobs, and settings</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
                <p className="text-xs font-semibold text-white/90">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm group hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="space-y-1">
                <CardTitle className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">{stat.title}</CardTitle>
                <div className="text-2xl md:text-3xl font-black text-gray-900">{stat.value}</div>
              </div>
              <div className={`p-2.5 md:p-3 rounded-xl ${stat.bgColor} shadow-sm group-hover:shadow-md transition-shadow`}>
                <stat.icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs md:text-sm text-gray-600 font-medium">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Applications Section */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/50 px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                Recent Applications
              </CardTitle>
              <CardDescription className="text-gray-600 font-medium mt-1">Latest 5 applications submitted to the community</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200/50">
                <span className="text-xs font-semibold text-blue-700">Live Updates</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recentApplications.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">Applications will appear here once users submit their community applications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100/80">
              {recentApplications.map((application) => (
                <div
                  key={application.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:shadow-lg transition-shadow">
                      {application.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-lg md:text-xl truncate group-hover:text-blue-700 transition-colors">{application.name}</h4>
                      <p className="text-sm md:text-base text-gray-600 font-semibold truncate">{application.email}</p>
                      <p className="text-sm text-gray-500 font-medium truncate">{application.university}</p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs md:text-sm font-bold shadow-sm border-2 transition-all ${
                      application.status === 'approved' 
                        ? 'bg-green-50 text-green-800 border-green-200 shadow-green-100'
                        : application.status === 'rejected'
                        ? 'bg-red-50 text-red-800 border-red-200 shadow-red-100'
                        : 'bg-yellow-50 text-yellow-800 border-yellow-200 shadow-yellow-100'
                    }`}>
                      {application.status === 'approved' && <CheckCircle className="h-3 w-3 md:h-4 md:w-4 mr-1.5" />}
                      {application.status === 'rejected' && <XCircle className="h-3 w-3 md:h-4 md:w-4 mr-1.5" />}
                      {application.status === 'pending' && <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1.5" />}
                      <span className="capitalize">{application.status}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-bold bg-gray-50 px-2 py-1 rounded-md">
                      {new Date(application.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}