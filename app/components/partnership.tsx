import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export function Partnership() {
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
        We bridge students with the Industry
      </motion.h2>
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        variants={fadeInVariants}
      >
        <motion.div
          className="relative w-full max-w-xl mx-auto lg:max-w-none"
          variants={fadeInVariants}
        >
          <Image
            src={"/partner/partner1.png"}
            width={800}
            height={500}
            alt="Partner Image 1"
            priority
          />
        </motion.div>
        <motion.div
          className="relative w-full max-w-xl mx-auto lg:max-w-none"
          variants={fadeInVariants}
        >
          <Image
            src={"/partner/partner2.png"}
            width={800}
            height={500}
            alt="Partner Image 2"
            priority
          />
        </motion.div>
      </motion.div>
      <motion.div
        className="relative w-full max-w-xl mx-auto lg:max-w-none mt-8 flex justify-center"
        variants={fadeInVariants}
      >
        <Image
          src={"/partner/partner3.png"}
          width={800}
          height={500}
          alt="Partner Image 3"
          priority
        />
      </motion.div>
    </motion.div>
  );
}

export default Partnership;
