"use client";

import { Logo, About, Action, Events, Partnership, ActiveMember, LatestNews } from "@/app/components";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Component() {

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Navbar />
        <section className="w-full py-16 md:py-16 lg:py-18 bg-gradient-to-b from-hero to-vision">
          <Logo />
          <div className="mt-6 flex justify-center">
            <Button asChild size="lg">
              <Link href="/job">Explore Jobs</Link>
            </Button>
          </div>
        </section>
        <section className="w-full py-12 md:py-18 lg:py-24 bg-gradient-to-b from-vision to-action">
          <About />
        </section>
        <section className="w-full py-12 md:py-18 lg:py-24 bg-gradient-to-b from-action to-event">
          <Action />
        </section>
        <section className="w-full py-12 md:py-18 lg:py-24 bg-gradient-to-b from-event to-partner">
          <Partnership />
        </section>
        <section className="w-full py-12 md:py-18 lg:py-24 bg-gradient-to-b from-partner to-contributor">
          <ActiveMember />
        </section>
        <section className="w-full py-12 md:py-18 lg:py-24 bg-gradient-to-b from-contributor to-lastnews">
          <LatestNews />
        </section>
        <section id="past-events" className="w-full py-12 md:py-18 lg:py-24 bg-gradient-to-b from-lastnews to-pastevent">
          <Events />
        </section>
        {/* <section className="w-full py-12 md:py-18 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
            <ApprovedMembers />
        </section> */}
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2025 XueDAO organization. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
