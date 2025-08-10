export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import AdminSidebar from '@/features/admin/components/admin-sidebar'

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 md:ml-80 pt-16 md:pt-8 max-w-full overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="min-h-[calc(100vh-8rem)]">
              {children}
            </div>
          </div>
        </main>
      </div>
  )
}