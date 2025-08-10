"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Settings,
  Briefcase,
  Menu,
  X,
  LogOut,
  User,
  Globe,
} from "lucide-react";
import { useState, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Applications", href: "/admin/applications", icon: Users },
  { name: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClientComponentClient();

  // Get user authentication state
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Track breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = (e: MediaQueryList | MediaQueryListEvent) => {
      const desktop = "matches" in e ? e.matches : (e as MediaQueryList).matches;
      setIsDesktop(desktop);
      setIsMobileMenuOpen(false); // always close on breakpoint change
    };
    apply(mq);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);


  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (!isDesktop) document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isDesktop, isMobileMenuOpen])

  // Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };


  return (
    <>
      {/* Mobile Top Bar (fixed) - Clean minimal design */}
      {!isDesktop && (
        <div className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 bg-white">
          {/* Menu button */}
          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="p-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 hover:bg-gray-100 focus:ring-gray-400 text-gray-700"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      )}

      {/* Mobile Overlay Menu - Only show when menu is open */}
      {!isDesktop && isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/60" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
          
          {/* Slide-out Menu Panel */}
          <div className="fixed top-0 bottom-0 left-0 z-50 w-80 max-w-[85vw] bg-white">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                  <Image src="/XD_logo.png" alt="XueDAO" width={28} height={28} className="h-6 w-6 object-contain" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 tracking-wide">XueDAO</h2>
                  <p className="text-blue-600 text-xs font-medium">Admin Panel</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          
          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto px-3 pt-4 pb-20">
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-4 py-4 text-base font-semibold rounded-xl transition-all duration-200 w-full',
                      isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className={cn('mr-4 h-6 w-6 flex-shrink-0', 
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                    )} />
                    <span className="tracking-wide">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-80"></div>
                    )}
                  </Link>
                )}
              )}
            </div>
            

          </nav>
          
          {/* Mobile User Info at Bottom */}
          {user && (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <div className="flex items-center gap-3 text-gray-600 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500">Logged in as</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => {
                    window.location.href = '/';
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <Globe className="h-4 w-4" />
                  Website
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center">
                © 2025 XueDAO organization. All rights reserved.
              </p>
            </div>
          )}
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      {isDesktop && (
        <div className="fixed inset-y-0 left-0 z-40 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl w-64">
          <div className="flex h-20 items-center px-6 border-b border-slate-700 justify-between">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                <Image src="/XD_logo.png" alt="XueDAO" width={40} height={40} className="h-10 w-10 object-contain" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-200 tracking-wide">XueDAO</h2>
                <p className="text-blue-200 text-sm font-medium">Admin Panel</p>
              </div>
            </div>
          </div>
          <nav className="mt-2 px-2">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex items-center px-6 py-4 text-base font-semibold rounded-xl transition',
                        isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/70 hover:text-slate-100'
                      )}
                    >
                      <item.icon className={cn('mr-3 h-6 w-6 flex-shrink-0', isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-100')} />
                      <span className="tracking-wide">{item.name}</span>
                    </Link>
                  </li>
                )}
              )}
            </ul>
          </nav>
          
          {/* Desktop User Info at Bottom */}
          {user && (
            <div className="absolute bottom-0 left-0 right-0 bg-slate-800/50 border-t border-slate-700 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-slate-300 mb-3">
                <div className="w-10 h-10 bg-blue-600/30 rounded-xl flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-400">Logged in as</p>
                  <p className="text-sm font-semibold text-slate-200 truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => {
                    window.location.href = '/';
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-200 rounded-lg transition-colors text-sm font-medium"
                >
                  <Globe className="h-4 w-4" />
                  Website
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-red-300 hover:bg-red-600/20 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
              <p className="text-xs text-slate-400 text-center">
                © 2025 XueDAO. All rights reserved.
              </p>
            </div>
          )}

        </div>
      )}
    </>
  )
}
