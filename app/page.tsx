"use client";

import { Button } from "@/components/ui/button";
import ActiveMember from "@/app/components/activeMember";
import About from "@/app/components/about";
import Action from "@/app/components/action";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Image from "next/image";
import Link from "next/link";
import { Post, Workshop, Colearning } from "@/app/components/lastestNews";
import Navbar from "@/components/navbar";


export default function Component() {



  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-hero to-hero2">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    <Image
                      src="/XueDAO_logo.png"
                      alt="xuedao logo"
                      className="px-6 pt-4"
                      width={600}
                      height={300}
                      priority
                    />
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    Show the world that Taiwanese Students can{" "}
                    <span className="font-bold">BUIDL</span>
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="https://t.me/+0Rvawr400uNhNTY1"
                    target="_blank"
                    passHref
                  >
                    <Button className="inline-flex h-16 w-72 sm:w-96 items-center justify-center border-4 rounded-full hover:shadow-[-18px_25px_14px_-10px_rgba(204,204,204,0.82)] hover:bg-white bg-white px-12 text-lg sm:text-lg font-bold text-black shadow focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                      Join NOW
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/puzzle.png"
                  width={650}
                  height={80}
                  alt="puzzle"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-vision to-vision2">
          <About />
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-hackathon to-hackathon2">
          <Action />
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-event to-event2">
          <ActiveMember />
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-partner to-partner2">
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
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
