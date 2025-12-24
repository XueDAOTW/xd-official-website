"use client";

import { Logo, About, Action, Events, Partnership, ActiveMember, LatestNews } from "@/features/homepage";
import Navbar from "@/components/navbar";
import { FloatingActionButton } from "@/components/ui/floating-action-button";

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Navbar />
        <section className="w-full section-padding-xl bg-gradient-to-b from-hero to-vision">
          <Logo />
        </section>
        <section className="w-full section-padding bg-gradient-to-b from-vision to-action">
          <About />
        </section>
        <section className="w-full section-padding bg-gradient-to-b from-action to-event">
          <Action />
        </section>
        {/* <section className="w-full section-padding bg-gradient-to-b from-event to-partner">
          <Partnership />
        </section> */}
        <section className="w-full section-padding bg-gradient-to-b from-event to-contributor">
          <ActiveMember />
        </section>
        <section className="w-full section-padding bg-gradient-to-b from-contributor to-lastnews">
          <LatestNews />
        </section>
        <section id="past-events" className="w-full section-padding bg-gradient-to-b from-lastnews to-pastevent">
          <Events />
        </section>
      </main>
      <FloatingActionButton />
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2025 XueDAO organization. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
