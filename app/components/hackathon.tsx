import { useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

export function Hackathon() {
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
        Connect Hackathon
      </motion.h2>
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        variants={fadeInVariants}
      >
        <motion.div
          className="relative w-full max-w-xl mx-auto lg:max-w-none border-4 border-black rounded-3xl"
          variants={fadeInVariants}
        >
          <Image
            src={"/hackathonInfo.webp"}
            className="rounded-2xl"
            width={800}
            height={500}
            alt="HackathonInfo"
            priority
          />
        </motion.div>
        <motion.div
          className="space-y-4 h-full p-8 lg:p-12 border-4 border-black bg-white rounded-3xl"
          variants={fadeInVariants}
        >
          <h3 className="text-2xl font-bold xl:text-3xl text-center">
            XueDAO CONNECT
          </h3>
          <h4 className="text-2xl font-bold xl:text-3xl text-center">
            Student-Only Hackathon
          </h4>
          <p className="text-gray-500 dark:text-gray-400 xl:text-lg text-center">
            Co-hosting with BuZhiDAO, we are delivering the very first
            student-only hackathon in Taiwan in May-June 2024!
          </p>
          {/* Indicators Section */}
          <div className="grid grid-cols-2 gap-12 pt-8">
            <motion.div
              className="flex flex-col items-center justify-center p-6 border-4 border-black rounded-3xl bg-white"
              variants={fadeInVariants}
            >
              <h3 className="text-2xl font-bold">200+</h3>
              <p className="text-gray-500 dark:text-gray-400">Participants</p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center justify-center p-6 border-4 border-black rounded-3xl bg-white"
              variants={fadeInVariants}
            >
              <h3 className="text-2xl font-bold">25</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Projects Submitted
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center justify-center p-6 border-4 border-black rounded-3xl bg-white"
              variants={fadeInVariants}
            >
              <h3 className="text-2xl font-bold">15+</h3>
              <p className="text-gray-500 dark:text-gray-400">Universities</p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center justify-center p-6 border-4 border-black rounded-3xl bg-white"
              variants={fadeInVariants}
            >
              <h3 className="text-2xl font-bold">20+</h3>
              <p className="text-gray-500 dark:text-gray-400">Sponsors</p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Hackathon;
