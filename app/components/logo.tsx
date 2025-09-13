import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";
import { OptimizedImage, useBatchImagePreload } from "@/components/ui/optimized-image";

export function Logo() {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  // Preload critical images
  useBatchImagePreload([
    '/XueDAO_logo.webp',
    '/puzzle.png'
  ], true);

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
    <div className="container px-4 md:px-6" ref={ref}>
      <motion.div
        className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]"
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
            visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } },
          }}
        >
          <div className="space-y-6 lg:space-y-8">
            <motion.div
              className="text-center space-y-6"
              variants={{
                hidden: { x: -100, opacity: 0 },
                visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } },
              }}
            >
              <OptimizedImage
                src="/XueDAO_logo.webp"
                alt="xuedao logo"
                className="mx-auto pt-4"
                width={600}
                height={300}
                priority={true}
                quality={90}
                format="webp"
                lazy={false}
              />
            </motion.div>
            
            <motion.p
              className="text-center text-2xl md:text-3xl max-w-[700px] mx-auto text-gray-600 dark:text-gray-400 leading-relaxed"
              variants={{
                hidden: { x: 100, opacity: 0 },
                visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } },
              }}
            >
              Show the world that <br className="hidden sm:block" /> 
              Taiwanese Students <br className="hidden sm:block" /> 
              can{" "}
              <span className="font-bold text-black bg-gradient-to-r from-xuedao_blue to-xuedao_pink bg-clip-text text-transparent">
                BUIDL
              </span>
            </motion.p>
          </div>
          <motion.div
            className="flex flex-col gap-4 justify-center items-center max-w-lg mx-auto"
            variants={{
              hidden: { y: 50, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } },
            }}
          >
            {/* Primary CTA - Join XueDAO */}
            <Link href="/apply" className="w-full">
              <Button 
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-xuedao_blue to-xuedao_pink hover:from-xuedao_pink hover:to-xuedao_blue text-white font-semibold text-base px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full h-14 touch-manipulation"
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
                className="group relative overflow-hidden bg-gradient-to-r from-xuedao_yellow to-orange-400 hover:from-orange-400 hover:to-xuedao_yellow text-white font-semibold text-base px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full h-14 touch-manipulation"
              >
                <span className="flex items-center justify-center gap-2">
                  💼 Explore Jobs
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          className="hidden lg:flex items-center justify-center"
          variants={{
            hidden: { x: 100, opacity: 0 },
            visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } },
          }}
        >
          <OptimizedImage
            src="/puzzle.png"
            width={1000}
            height={800}
            alt="puzzle"
            priority={true}
            quality={85}
            format="webp"
            className="w-full h-full"
            lazy={false}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Logo;
