'use client';

import { AdminProtected } from '@/lib/auth/page-protection';
import AdminSidebar from '@/features/admin/components/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtected>
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
    </AdminProtected>
  );
}