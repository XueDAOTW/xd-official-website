"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Post from "@/app/components/post";
import { useState } from "react";

export default function Component() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "/events-photo/1.webp",
    "/events-photo/2.webp",
    "/events-photo/3.webp",
    "/events-photo/4.webp",
    "/events-photo/5.webp",
    "/events-photo/6.webp",
    "/events-photo/7.webp",
    "/events-photo/8.webp",
    "/events-photo/9.webp",
    "/events-photo/10.webp",
  ];

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

  const university = [
    { id: 1, name: "ntu" },
    { id: 2, name: "nccu" },
    { id: 3, name: "ncku" },
    { id: 4, name: "ncu" },
    { id: 5, name: "nkust" },
    { id: 6, name: "nthu" },
    { id: 7, name: "ntnu" },
    { id: 8, name: "ntpu" },
    { id: 9, name: "ntut" },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };
  const chunkedUniversity = university.reduce(
    (resultArray: Array<Array<any>>, item, index) => {
      const chunkIndex = Math.floor(index / 5);
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }
      resultArray[chunkIndex].push(item);
      return resultArray;
    },
    []
  );

  const members = [
    { name: "Kevin", role: "NTU | Econ" },
    { name: "Albert", role: "NTU | EE" },
    { name: "Allen", role: "NTU | IE" },
    { name: "Louis", role: "NTU | CSIE" },
    { name: "Johnny", role: "NTU | IB" },
    { name: "Terrance", role: "NTU | CSIE" },
    { name: "Moven", role: "NTU | Econ" },
    { name: "Paul", role: "NTU | CSIE" },
    { name: "HongRu", role: "NTU | EE" },
    { name: "Eric", role: "NTU | EE" },
    { name: "Tim", role: "NTU | IB" },
    { name: "Jourden", role: "NTU | EE" },
    { name: "Jake", role: "NKUST | CCE" },
    { name: "Jack", role: "NCCU | BA" },
    { name: "Andrew", role: "NCU | FIN" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
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
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-100 dark:bg-gray-800">
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
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
              What is XueDAO?
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
              XueDAO is the very first community in Taiwan focused on Student
              Developers led by Students!
            </p>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="border-l-4 border-xuedao_blue pl-8 space-y-4">
                <h3 className="text-2xl font-bold">Our Vision</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Build a ultimate blockchain learning hub for students, and
                  show the world that Taiwanese Students Can BUILD!
                </p>
              </div>
              <div className="border-l-4 border-mission pl-8 space-y-4">
                <h3 className="text-2xl font-bold">Our Mission</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Empower students by hosting Study Groups, Networking Events
                  and Hackathon to connect them with the industry and to the
                  world!
                </p>
              </div>
            </div>
            <p className="text-xl text-gray-500 dark:text-gray-400 mt-8">
              The Contributor Team of XueDAO is currently formed by students
              from 9 universities in Taiwan:
            </p>

            <div className="w-full border-l-4 border-xuedao_yellow mt-8 sm:w-auto sm:pl-8 sm:ml-4 sm:py-2">
              {chunkedUniversity.map((row, rowIndex) => (
                <div key={rowIndex} className="flex flex-wrap xl:ml-5">
                  {row.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="w-full sm:w-1/2 md:w-1/3 lg:w-1/6"
                    >
                      <Image
                        src={`/university/${item.name}.png`}
                        alt={item.name}
                        width={500}
                        height={200}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
              What we have done?
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Image
                  src={images[currentImageIndex]}
                  alt={`Global Network Image ${currentImageIndex + 1}`}
                  width={600}
                  height={400}
                  className="mx-auto rounded-lg shadow-lg"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">We Hack!</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  We join hackathons together and win several prizes already
                </p>
                <h3 className="text-2xl font-bold">We Learn!</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  We host bi-weekly co-learning day which is open for everyone
                  to join, also the study groups
                </p>
                <h3 className="text-2xl font-bold">We Connect!</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  We host side event during ETH Taipei, and Keynotes Speechs
                  with professions from the industry
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
              Active Members
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {members.map((member, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <Image
                    src={`/core-contributors/${member.name}.webp`}
                    alt={member.name}
                    width={60}
                    height={60}
                    className="rounded-full mb-2 object-cover"
                    style={{ width: "60px", height: "60px" }}
                  />
                  <h3 className="text-sm font-medium">{member.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
              Latest News
            </h2>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ig">IG Post</TabsTrigger>
                <TabsTrigger value="learn">Colearning Day</TabsTrigger>
                <TabsTrigger value="workshop">Workshop</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <div className="grid gap-6 mt-8">
                  {[
                    {
                      title: "XueDAO Reaches 10,000 Members",
                      date: "2023-06-15",
                    },
                    {
                      title: "New Blockchain Course Launched",
                      date: "2023-06-10",
                    },
                    {
                      title: "Annual DAO Conference Announced",
                      date: "2023-06-05",
                    },
                  ].map((news, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{news.title}</CardTitle>
                        <CardDescription>{news.date}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="ig">
                <Post />
              </TabsContent>
              <TabsContent value="learn">
                <div className="grid gap-6 mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>New Blockchain Course Launched</CardTitle>
                      <CardDescription>2023-06-10</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="workshop">
                <div className="grid gap-6 mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>New Blockchain Course Launched</CardTitle>
                      <CardDescription>2023-06-10</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
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
