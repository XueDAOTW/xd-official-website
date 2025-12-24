import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { ArrowRight, Users, Briefcase } from "lucide-react";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";

export function Logo() {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.1,
  });


  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  return (
    <div className="container px-4 md:px-6 max-w-7xl mx-auto" ref={ref}>
      <motion.div
        className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]"
        initial="hidden"
        animate={controls}
        variants={fadeInVariants}
      >
        <motion.div
          className="flex flex-col justify-center space-y-8 lg:space-y-10"
          initial={{ x: -100, opacity: 0 }}
          animate={controls}
          variants={{
            hidden: { x: -100, opacity: 0 },
            visible: {
              x: 0,
              opacity: 1,
              transition: { duration: 0.8, ease: "easeInOut" },
            },
          }}
        >
            <Image
              src="/XueDAO_logo.webp"
              alt="xuedao logo"
              className="mx-auto pt-2 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[350px]"
              width={350}
              height={58}
              priority={true}
              quality={90}
            />

            <motion.p
              className="text-center text-xl sm:text-2xl md:text-3xl max-w-[600px] sm:max-w-[700px] mx-auto text-gray-600 dark:text-gray-400 leading-relaxed px-2"
              variants={{
                hidden: { x: 100, opacity: 0 },
                visible: {
                  x: 0,
                  opacity: 1,
                  transition: { duration: 0.8, ease: "easeInOut" },
                },
              }}
            >
              Show the world that <br className="hidden sm:block" />
              Taiwanese Students <br className="hidden sm:block" />
              can{" "}
              <span className="font-bold text-black bg-gradient-to-r from-xuedao_blue to-xuedao_pink bg-clip-text text-transparent">
                BUIDL
              </span>
            </motion.p>

          <motion.div
            className="flex flex-col gap-4 justify-center items-center max-w-lg mx-auto px-4 sm:px-6"
            variants={{
              hidden: { y: 50, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.8, ease: "easeInOut" },
              },
            }}
          >
            {/* Primary CTA - Join XueDAO */}
            <Link href="/apply" className="w-full">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-xuedao_pink hover:bg-xuedao_pink/90 text-white font-semibold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full h-12 sm:h-14 touch-manipulation"
              >
                <span className="flex items-center justify-center gap-2">
                  <Users className="h-5 w-5" />
                  Join XueDAO Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>

            {/* Secondary CTA - Explore Jobs */}
            <Link href="/job" className="w-full">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-xuedao_blue hover:bg-xuedao_blue/90 text-white font-semibold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full h-12 sm:h-14 touch-manipulation"
              >
                <span className="flex items-center justify-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Explore Jobs
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          className="hidden lg:flex items-center justify-center relative"
          variants={{
            hidden: { x: 100, opacity: 0 },
            visible: {
              x: 0,
              opacity: 1,
              transition: { duration: 0.8, ease: "easeInOut" },
            },
          }}
        >
          <Image
            src="/puzzle.png"
            width={500}
            height={400}
            alt="puzzle"
            priority={true}
            quality={85}
            className="w-full h-auto max-w-full object-contain"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Logo;
