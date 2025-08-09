import { getUser, isAdmin } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/features/admin/components/admin-sidebar'
import AdminHeader from '@/features/admin/components/admin-header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect('/api/auth/signin?callbackUrl=/admin')
  }

  const userIsAdmin = await isAdmin(user.email)
  if (!userIsAdmin) {
    redirect('/')
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