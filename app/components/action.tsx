import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";

export function Action() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

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
          <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-xm mx-auto"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <Image
                        src={image}
                        alt={`Global Network Image ${index + 1}`}
                        width={800}
                        height={600}
                        className="rounded-lg"
                      />
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
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
