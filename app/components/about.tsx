import { useEffect, useRef } from 'react';
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from 'react-intersection-observer';

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
      <motion.div className="text-center mb-12" variants={fadeInVariants}>
        <motion.h2
          className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6 text-high-contrast"
          variants={fadeInVariants}
        >
          What is{" "}
          <span className="bg-gradient-to-r from-xuedao_blue via-xuedao_pink to-xuedao_yellow bg-clip-text text-transparent">
            XueDAO
          </span>
          ?
        </motion.h2>
        <motion.p
          className="text-xl text-medium-contrast max-w-3xl mx-auto leading-relaxed font-medium"
          variants={fadeInVariants}
        >
          XueDAO is the very first community in Taiwan focused on{" "}
          <span className="font-bold bg-gradient-to-r from-xuedao_blue to-xuedao_pink bg-clip-text text-transparent">Student Developers</span>{" "}
          led by{" "}
          <span className="font-bold bg-gradient-to-r from-xuedao_pink to-xuedao_yellow bg-clip-text text-transparent">Students</span>!
        </motion.p>
      </motion.div>
      <motion.div
        className="grid gap-8 lg:grid-cols-2 lg:gap-12 mb-12"
        variants={fadeInVariants}
      >
        <motion.div 
          className="group relative bg-gradient-to-br from-xuedao_blue/5 to-xuedao_blue/10 rounded-2xl p-8 border-l-4 border-xuedao_blue shadow-soft hover-lift cursor-pointer"
          whileHover={{ scale: 1.02 }}
          variants={fadeInVariants}
        >
          <motion.h3 className="text-2xl font-bold mb-4 text-xuedao_blue flex items-center gap-2" variants={fadeInVariants}>
            🎯 Our Vision
          </motion.h3>
          <motion.p
            className="text-medium-contrast leading-relaxed"
            variants={fadeInVariants}
          >
            Build an ultimate blockchain learning hub for students, and show the
            world that Taiwanese Students Can{" "}
            <span className="font-bold bg-gradient-to-r from-xuedao_blue to-xuedao_pink bg-clip-text text-transparent">
              BUIDL
            </span>
            !
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="group relative bg-gradient-to-br from-mission/5 to-mission/10 rounded-2xl p-8 border-l-4 border-mission shadow-soft hover-lift cursor-pointer"
          whileHover={{ scale: 1.02 }}
          variants={fadeInVariants}
        >
          <motion.h3 className="text-2xl font-bold mb-4 text-mission flex items-center gap-2" variants={fadeInVariants}>
            🚀 Our Mission
          </motion.h3>
          <motion.p
            className="text-medium-contrast leading-relaxed"
            variants={fadeInVariants}
          >
            Empower students by hosting{" "}
            <span className="font-semibold text-mission">Study Groups</span>,{" "}
            <span className="font-semibold text-mission">Networking Events</span>, and{" "}
            <span className="font-semibold text-mission">Hackathons</span>{" "}
            to connect them with the industry and the world!
          </motion.p>
        </motion.div>
      </motion.div>
      <motion.div
        className="bg-gradient-to-br from-xuedao_yellow/5 to-xuedao_yellow/10 rounded-2xl p-8 border-l-4 border-xuedao_yellow shadow-soft"
        variants={fadeInVariants}
      >
        <motion.h3 className="text-2xl font-bold mb-6 text-xuedao_yellow flex items-center gap-2" variants={fadeInVariants}>
          🌟 Our Contributors
        </motion.h3>
        <motion.p
          className="text-medium-contrast mb-8 text-lg leading-relaxed"
          variants={fadeInVariants}
        >
          The Contributor Team of XueDAO is currently formed by students from{" "}
          <span className="font-bold text-xuedao_yellow">12+ universities</span>{" "}
          globally, creating a diverse and vibrant community of blockchain enthusiasts.
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
                <motion.div
                  key={index}
                  className="w-[200px] md:w-[240px] flex-shrink-0 flex items-center justify-center group"
                  style={{
                    minHeight: 80,
                  }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={`/university/${uni.name}.png`}
                    alt={uni.name}
                    width={200}
                    height={80}
                    className="object-contain transition-all duration-300 group-hover:brightness-110 group-hover:drop-shadow-lg"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default About;
