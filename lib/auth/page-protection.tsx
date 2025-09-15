'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createSupabaseClient } from '@/lib/supabase/client';

interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false,
  });

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/check-admin');
      const data = await response.json();
      
      setAuthState({
        user: data.user || null,
        loading: false,
        isAdmin: data.isAdmin || false,
      });
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthState({ user: null, loading: false, isAdmin: false });
    }
  };

  useEffect(() => {
    const supabase = createSupabaseClient();

    // Initial check
    checkAuthStatus();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          await checkAuthStatus();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return authState;
}

interface AdminProtectedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function AdminProtected({ 
  children, 
  fallback,
  redirectTo = '/api/auth/signin'
}: AdminProtectedProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User not logged in, redirect to signin
        const currentUrl = window.location.href;
        const redirectUrl = `${redirectTo}?callbackUrl=${encodeURIComponent(currentUrl)}`;
        window.location.href = redirectUrl;
        return;
      }

      if (!isAdmin) {
        // User logged in but not admin, redirect to home
        router.push('/');
        return;
      }
    }
  }, [user, loading, isAdmin, router, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// This file is now purely client-side
// Server-side auth checking is handled by the /api/auth/check-admin route