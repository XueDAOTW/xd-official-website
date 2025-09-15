"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import { usePageAnimation } from "../hooks/usePageAnimation";

interface EventLayoutProps {
  children: React.ReactNode;
}

export function EventLayout({ children }: EventLayoutProps) {
  const { controls, fadeInVariants } = usePageAnimation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <motion.div
          className="container px-4 md:px-6"
          initial="hidden"
          animate={controls}
          variants={fadeInVariants}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}