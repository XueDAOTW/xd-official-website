export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import AdminSidebar from '@/features/admin/components/admin-sidebar'
import AdminHeader from '@/features/admin/components/admin-header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user: any = null
  try {
    const supabaseServer = await import('@/lib/supabase/server')
    user = await supabaseServer.getUser()

    if (!user) {
      redirect('/api/auth/signin?callbackUrl=/admin')
    }

    const userIsAdmin = await supabaseServer.isAdmin(user.email)
    if (!userIsAdmin) {
      redirect('/')
    }
  } catch {
    // If supabase helpers are not available, render layout without user context
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={user} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 ml-64">
          {children}
        </main>
      </div>
    </div>
  )
}