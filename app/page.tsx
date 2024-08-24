"use client";

import Logo from "@/app/components/logo";
import ActiveMember from "@/app/components/activeMember";
import About from "@/app/components/about";
import Action from "@/app/components/action";
import Hackathon from "@/app/components/hackathon";
import Partnership from "@/app/components/partnership";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


import { Post, Workshop, Colearning } from "@/app/components/lastestNews";
import Navbar from "@/components/navbar";

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="w-full mt-12 py-12 md:py-18 lg:py-24 bg-gradient-to-b from-hero to-hero2">
          <Logo />
        </section>
        <section className="w-full py-12 md:py-18 lg:py-24 bg-gradient-to-b from-vision to-vision2">
          <About />
        </section>
        <section className="w-full py-12 md:py-18 lg:py-24 bg-gradient-to-b from-hackathon to-hackathon2">
          <Action />
        </section>
        <section className="w-full py-12 md:py-18 lg:py-24 bg-gradient-to-b from-event to-event2">
          <Hackathon />
        </section>
        <section className="w-full py-12 md:py-18 lg:py-24 bg-gradient-to-b from-partner to-partner2">
          <Partnership />
        </section>
        <section className="w-full py-12 md:py-18 lg:py-24 bg-gradient-to-b from-contributor to-contributor2">
          <ActiveMember />
        </section>
        <section className="w-full py-12 md:py-18 lg:py-24 bg-gradient-to-b from-lastnews to-lastnews2">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
              Latest News
            </h2>
            <Tabs defaultValue="ig" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ig">IG Post</TabsTrigger>
                <TabsTrigger value="learn">Co-learning Day</TabsTrigger>
                <TabsTrigger value="workshop">Workshop</TabsTrigger>
              </TabsList>
              <TabsContent value="ig">
                <Post />
              </TabsContent>
              <TabsContent value="learn">
                <Colearning />
              </TabsContent>
              <TabsContent value="workshop">
                <Workshop />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 XueDAO organization. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
