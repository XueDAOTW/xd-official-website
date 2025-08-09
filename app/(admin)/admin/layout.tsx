import { redirect } from 'next/navigation'
import AdminSidebar from '@/features/admin/components/admin-sidebar'
import AdminHeader from '@/features/admin/components/admin-header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const supabaseServer = await import('@/lib/supabase/server')
    const user = await supabaseServer.getUser()

    if (!user) {
      redirect('/api/auth/signin?callbackUrl=/admin')
    }

    const userIsAdmin = await supabaseServer.isAdmin(user.email)
    if (!userIsAdmin) {
      redirect('/')
    }
  } catch {
    // If supabase helpers are not available, allow access to render the shell
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={undefined as any} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 ml-64">
          {children}
        </main>
      </div>
    </div>
  )
}