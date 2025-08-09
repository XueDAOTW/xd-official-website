"use client"

import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { LogOut, User as UserIcon } from 'lucide-react'

interface AdminHeaderProps {
  user?: User | null
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const handleSignOut = async () => {
    await fetch('/api/auth/signout', {
      method: 'POST',
    })
    window.location.href = '/'
  }

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="ml-64"> {/* Account for sidebar width */}
        <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <UserIcon className="h-4 w-4" />
          <span>{user?.email ?? 'Admin'}</span>
        </div>
        
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Button>
      </div>
    </header>
  )
}