import { useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface Partner {
  id: string;
  name: string;
  image: string;
  alt: string;
}

interface PartnerCardProps {
  partner: Partner;
  variants: any;
}

const partners: Partner[] = [
  { id: "1", name: "Partner 1", image: "/partner/partner1.png", alt: "Partner 1" },
  { id: "2", name: "Partner 2", image: "/partner/partner2.png", alt: "Partner 2" },
  { id: "3", name: "Partner 1", image: "/partner/partner1.png", alt: "Partner 1" },
  { id: "4", name: "Partner 2", image: "/partner/partner2.png", alt: "Partner 2" },
  { id: "5", name: "Partner 1", image: "/partner/partner1.png", alt: "Partner 1" },
  { id: "6", name: "Partner 2", image: "/partner/partner2.png", alt: "Partner 2" },
  { id: "7", name: "Partner 1", image: "/partner/partner1.png", alt: "Partner 1" },
  { id: "8", name: "Partner 2", image: "/partner/partner2.png", alt: "Partner 2" },
  { id: "9", name: "Partner 1", image: "/partner/partner1.png", alt: "Partner 1" },
  { id: "10", name: "Partner 2", image: "/partner/partner2.png", alt: "Partner 2" },
];

function PartnerCard({ partner, variants }: PartnerCardProps) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-center aspect-[3/2] hover:shadow-md transition-shadow"
      variants={variants}
    >
      <Image
        src={partner.image}
        width={140}
        height={80}
        alt={partner.alt}
        className="object-contain"
      />
    </motion.div>
  );
}

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
        Past Partners
      </motion.h2>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-8xl mx-auto"
        variants={fadeInVariants}
      >
        {partners.map((partner) => (
          <PartnerCard
            key={partner.id}
            partner={partner}
            variants={fadeInVariants}
          />
        ))}
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
