"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePageAnimation } from "../hooks/usePageAnimation";

interface EventHeroProps {
  date: string;
  title: string;
  description: string;
  gradientColors: string;
}

export function EventHero({ date, title, description, gradientColors }: EventHeroProps) {
  const { fadeInVariants } = usePageAnimation();

  return (
    <>
      {/* Back Button */}
      <motion.div
        className="mb-8"
        variants={fadeInVariants}
      >
        <Button
          asChild
          variant="ghost"
          className="mb-4 hover-lift"
        >
          <Link href="/#past-events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        className="text-center mb-12"
        variants={fadeInVariants}
      >
        <motion.div
          className={`inline-block px-4 py-2 ${gradientColors} text-white rounded-full text-sm font-medium mb-6`}
          variants={fadeInVariants}
        >
          {date}
        </motion.div>
        <motion.h1
          className={`text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-6 ${gradientColors.replace('bg-gradient-to-r', 'bg-gradient-to-r')} bg-clip-text text-transparent`}
          variants={fadeInVariants}
        >
          {title}
        </motion.h1>
        <motion.p
          className="text-xl text-medium-contrast max-w-3xl mx-auto leading-relaxed mb-8"
          variants={fadeInVariants}
        >
          {description}
        </motion.p>
      </motion.div>
    </>
  );
}