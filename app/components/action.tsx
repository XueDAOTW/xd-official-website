import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { Card } from "@/components/ui/card";

const IMAGE_COUNT = 12;
const AUTOPLAY_INTERVAL = 2500;

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const imageVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 400, damping: 30 },
      opacity: { duration: 0.3 },
      scale: { duration: 0.3 },
    },
  },
  exit: (dir: number) => ({
    zIndex: 0,
    x: dir < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
    transition: {
      x: { type: "spring", stiffness: 400, damping: 30 },
      opacity: { duration: 0.3 },
      scale: { duration: 0.3 },
    },
  }),
};

function useCarousel(images: string[]) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getIndex = (idx: number) => (idx + images.length) % images.length;

  const slideTo = (idx: number, dir: number) => {
    setDirection(dir);
    setCurrent(getIndex(idx));
  };

  const startAutoplay = React.useCallback(() => {
    stopAutoplay();
    intervalRef.current = setInterval(() => {
      slideTo(current + 1, 1);
    }, AUTOPLAY_INTERVAL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const stopAutoplay = React.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [current, startAutoplay, stopAutoplay]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") slideTo(current - 1, -1);
      else if (e.key === "ArrowRight") slideTo(current + 1, 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  return {
    current,
    direction,
    prevIdx: getIndex(current - 1),
    nextIdx: getIndex(current + 1),
    slideTo,
    startAutoplay,
    stopAutoplay,
  };
}

export function Action() {
  const images = React.useMemo(
    () => Array.from({ length: IMAGE_COUNT }, (_, i) => `/events-photo/${i + 1}.webp`),
    []
  );

  const {
    current,
    direction,
    prevIdx,
    nextIdx,
    slideTo,
    startAutoplay,
    stopAutoplay,
  } = useCarousel(images);

  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    controls.start(inView ? "visible" : "hidden");
  }, [controls, inView]);

  return (
    <motion.div
      className="container px-4 md:px-6"
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeInVariants}
    >
      <motion.h2
        className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center"
        variants={fadeInVariants}
      >
        What we have done?
      </motion.h2>
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        variants={fadeInVariants}
      >
        <motion.div
          className="relative w-full max-w-xl mx-auto lg:max-w-none"
          variants={fadeInVariants}
        >
          <div
            className="relative w-full h-[400px] flex items-center justify-center overflow-hidden"
            onMouseEnter={stopAutoplay}
            onMouseLeave={startAutoplay}
          >
            {/* Previous image (blurred, for context) */}
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 opacity-30 z-0 pointer-events-none"
              style={{ filter: "blur(2px)" }}
            >
              <Card>
                <Image
                  src={images[prevIdx]}
                  alt={`Global Network Image ${prevIdx + 1}`}
                  width={260}
                  height={200}
                  className="rounded-lg object-cover"
                  draggable={false}
                />
              </Card>
            </motion.div>
            {/* Main image with smooth slide animation */}
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={current}
                className="relative z-10 w-2/3 mx-auto"
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                style={{ position: "absolute", left: "16.66%", right: "16.66%" }}
              >
                <Card>
                  <Image
                    src={images[current]}
                    alt={`Global Network Image ${current + 1}`}
                    width={800}
                    height={600}
                    className="rounded-lg object-cover"
                    priority
                    draggable={false}
                  />
                </Card>
              </motion.div>
            </AnimatePresence>
            {/* Next image (blurred, for context) */}
            <motion.div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 opacity-30 z-0 pointer-events-none"
              style={{ filter: "blur(2px)" }}
            >
              <Card>
                <Image
                  src={images[nextIdx]}
                  alt={`Global Network Image ${nextIdx + 1}`}
                  width={260}
                  height={200}
                  className="rounded-lg object-cover"
                  draggable={false}
                />
              </Card>
            </motion.div>
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full ${idx === current ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-gray-600"}`}
                  style={{ transition: "background 0.2s" }}
                  onClick={() => slideTo(idx, idx > current ? 1 : -1)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            {/* Navigation arrows */}
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/70 dark:bg-black/40 rounded-full p-2 shadow hover:bg-white/90 dark:hover:bg-black/60 transition"
              onClick={() => slideTo(current - 1, -1)}
              aria-label="Previous"
              tabIndex={0}
              style={{ outline: "none" }}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/70 dark:bg-black/40 rounded-full p-2 shadow hover:bg-white/90 dark:hover:bg-black/60 transition"
              onClick={() => slideTo(current + 1, 1)}
              aria-label="Next"
              tabIndex={0}
              style={{ outline: "none" }}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </motion.div>
        <motion.div className="space-y-4" variants={fadeInVariants}>
          <h3 className="text-2xl font-bold">We Hack!</h3>
          <p className="text-gray-500 dark:text-gray-400">
            We join hackathons together and win several prizes already
          </p>
          <h3 className="text-2xl font-bold">We Learn!</h3>
          <p className="text-gray-500 dark:text-gray-400">
            We host bi-weekly co-learning day which is open for everyone to
            join, also the study groups
          </p>
          <h3 className="text-2xl font-bold">We Connect!</h3>
          <p className="text-gray-500 dark:text-gray-400">
            We host side event during ETH Taipei, and Keynotes Speechs with
            professions from the industry
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Action;
