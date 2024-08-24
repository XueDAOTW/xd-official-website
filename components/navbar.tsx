"use client";
import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NAV_MENU = [
    {
      name: "Events",
      href: "https://lu.ma/calendar/cal-Pj8ibnEe0RyZsPH",
    },
    {
      name: "Telegram",
      href: "https://t.me/+0Rvawr400uNhNTY1",
    },
    {
      name: "Discord",
      href: "https://discord.gg/ZzFuAv9u3A",
    },
  ];
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-14 flex items-center bg-white shadow">
      <Link className="flex items-center justify-center" href="/">
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
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4">
              {NAV_MENU.map(({ name, href }) => (
                <Link key={name} href={href} passHref>
                  {name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
