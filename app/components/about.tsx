import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef } from 'react';

const university = [
  { id: 0, name: "usc" },
  { id: 1, name: "ntu" },
  { id: 2, name: "nccu" },
  { id: 3, name: "ncku" },
  { id: 4, name: "ncu" },
  { id: 5, name: "nkust" },
  { id: 6, name: "nthu" },
  { id: 7, name: "ntnu" },
  { id: 8, name: "ntpu" },
  { id: 9, name: "ntut" },
  { id: 10, name: "fju" },
  { id: 11, name: "csmu" },
];

export function About() {
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

  // Carousel pause/resume logic
  const logoTrackRef = useRef<HTMLDivElement>(null);

  const handlePause = () => {
    if (logoTrackRef.current) {
      logoTrackRef.current.style.animationPlayState = 'paused';
    }
  };

  const handleResume = () => {
    if (logoTrackRef.current) {
      logoTrackRef.current.style.animationPlayState = 'running';
    }
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
        className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8"
        variants={fadeInVariants}
      >
        What is XueDAO?
      </motion.h2>
      <motion.p
        className="text-xl text-gray-500 dark:text-gray-400 mb-4"
        variants={fadeInVariants}
      >
        XueDAO is the very first community in Taiwan focused on Student
        Developers led by Students!
      </motion.p>
      <motion.div
        className="grid gap-6 lg:grid-cols-2 lg:gap-12"
        variants={fadeInVariants}
      >
        <div className="border-l-4 border-xuedao_blue pl-8 space-y-4">
          <motion.h3 className="text-2xl font-bold" variants={fadeInVariants}>
            Our Vision
          </motion.h3>
          <motion.p
            className="text-gray-500 dark:text-gray-400"
            variants={fadeInVariants}
          >
            Build an ultimate blockchain learning hub for students, and show the
            world that Taiwanese Students Can BUILD!
          </motion.p>
        </div>
        <div className="border-l-4 border-mission pl-8 space-y-4">
          <motion.h3 className="text-2xl font-bold" variants={fadeInVariants}>
            Our Mission
          </motion.h3>
          <motion.p
            className="text-gray-500 dark:text-gray-400"
            variants={fadeInVariants}
          >
            Empower students by hosting Study Groups, Networking Events, and
            Hackathons to connect them with the industry and the world!
          </motion.p>
        </div>
      </motion.div>
      <motion.div
        className="border-l-4 border-xuedao_yellow pl-8 space-y-4 mt-8"
        variants={fadeInVariants}
      >
        <motion.h3 className="text-2xl font-bold" variants={fadeInVariants}>
          Our Contributor
        </motion.h3>
        <motion.p
          className="text-gray-500 dark:text-gray-400"
          variants={fadeInVariants}
        >
          The Contributor Team of XueDAO is currently formed by students from 12 universities globally.
        </motion.p>
        <motion.div className="container px-4 md:px-6" variants={fadeInVariants}>
          <div className="relative w-full overflow-x-hidden" aria-label="Partner logos">
            <div
              className="logo-carousel-track flex gap-x-8 md:gap-x-12 mt-4"
              ref={logoTrackRef}
              onMouseEnter={handlePause}
              onMouseLeave={handleResume}
              onTouchStart={handlePause}
              onTouchEnd={handleResume}
            >
              {[...university, ...university].map((uni, index) => (
                <div
                  key={index}
                  className="w-[200px] md:w-[240px] flex-shrink-0 flex items-center justify-center"
                  style={{
                    minHeight: 80,
                  }}
                >
                  <Image
                    src={`/university/${uni.name}.png`}
                    alt={uni.name}
                    width={200}
                    height={80}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default About;
