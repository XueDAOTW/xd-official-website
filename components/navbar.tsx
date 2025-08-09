"use client";

import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const NAV_MENU = [
    { name: "Events", href: "https://lu.ma/calendar/cal-Pj8ibnEe0RyZsPH" },
    { name: "Telegram", href: "https://t.me/+0Rvawr400uNhNTY1" },
    { name: "Discord", href: "https://discord.gg/ZzFuAv9u3A" },
  ];

  const SOCIAL_ICONS = [
    { name: "ig", href: "https://www.instagram.com/xue_dao_/" },
    { name: "fb", href: "https://www.facebook.com/profile.php?id=100094540248529" },
    { name: "tg", href: "https://t.me/+0Rvawr400uNhNTY1" },
    { name: "dc", href: "https://discord.gg/ZzFuAv9u3A" },
    { name: "yt", href: "https://www.youtube.com/@XueDAO2023" },
    { name: "x", href: "https://twitter.com/xuedao_tw" },
    { name: "in", href: "https://www.linkedin.com/company/xuedao/" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-14 flex items-center bg-white shadow">
      <Link href="/" className="flex items-center justify-center">
        <Image
          src="/XD_logo.png"
          alt="Xue DAO logo"
          width={70}
          height={80}
          priority
        />
        <span className="sr-only">XueDAO</span>
      </Link>

      <nav className="ml-auto flex gap-4 sm:gap-6">
        <div className="hidden md:flex gap-4">
          {NAV_MENU.map(({ name, href }) => (
            <Link key={name} href={href} passHref>
              {name}
            </Link>
          ))}
        </div>
      </nav>

      <nav className="ml-auto flex gap-4 sm:gap-6">
        <div className="hidden md:flex gap-4 items-center">
          {SOCIAL_ICONS.map(({ name, href }) => (
            <Link key={name} href={href} passHref>
              <Image
                src={`/social-icon/${name}.webp`}
                alt={name}
                width={24}
                height={24}
              />
            </Link>
          ))}
          
          {/* User authentication section */}
          {user && (
            <div className="flex items-center gap-2 ml-4 border-l pl-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span className="hidden lg:inline">{user.email}</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline ml-1">Logout</span>
              </Button>
            </div>
          )}
        </div>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger>
            <div className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </div>
          </SheetTrigger>

          <SheetContent side="top" className="bg-white">
            <nav className="flex flex-col gap-4">
              <Image
                src="/XD_logo.png"
                alt="Xue DAO logo"
                width={70}
                height={80}
                priority
              />
              {NAV_MENU.map(({ name, href }) => (
                <Link key={name} href={href} passHref>
                  {name}
                </Link>
              ))}
              <div className="flex gap-4">
                {SOCIAL_ICONS.map(({ name, href }) => (
                  <Link key={name} href={href} passHref>
                    <Image
                      src={`/social-icon/${name}.webp`}
                      alt={name}
                      width={24}
                      height={24}
                    />
                  </Link>
                ))}
              </div>
              
              {/* Mobile user authentication section */}
              {user && (
                <>
                  <Separator className="mt-4" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="ml-1">Logout</span>
                    </Button>
                  </div>
                </>
              )}
              
              <Separator className="mt-4" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                © 2024 XueDAO organization. All rights reserved.
              </p>
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
