import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const members = [
  { name: "Jennifer", role: "NCCU | IB" },
  { name: "Kevin", role: "NTU | Econ" },
  { name: "Albert", role: "NTU | EE" },
  { name: "Johnny", role: "NTU | IB" },
  { name: "HongRu", role: "NTU | EE" },
  { name: "Eric", role: "NTU | EE" },
  { name: "Terrance", role: "NTU | CSIE" },
  { name: "Jack", role: "NCCU | BA" },
  { name: "CG", role: "NTNU | MBA" },
  { name: "Andrew", role: "NCU | FIN" },
  { name: "Hank", role: "NCKU | IB" },
  { name: "Ken", role: "NTUT | IFM" },
  { name: "Maxwell", role: "NTU | FIN" },
  { name: "Jason", role: "NCKU | CE" },
  { name: "Johnson", role: "USC | ADS" },
  { name: "Leaf", role: "CSMU | MI" },
  { name: "Patrick", role: "NTNU | IT/CSIE" },
  { name: "Steven", role: "NCCU | PF/CL" },
  { name: "Pin", role: "NCU | PHYS" },
  { name: "Ali", role: "FJU | CSIE" },

  { name: "Jake", role: "NKUST | CCE" },
  { name: "Paul", role: "NTU | CSIE" },
  { name: "Louis", role: "NTU | CSIE" },
  { name: "Allen", role: "NTU | IE" },
  { name: "Rita", role: "NCCU | Law" },
  { name: "Benson", role: "NCCU | Econ" },

  // { name: "RC", role: "NCCU | LLM" },
  // { name: "Moven", role: "NTU | Econ" },
  // { name: "Tim", role: "NTU | IB" },
  // { name: "Jourden", role: "NTU | EE" },
  // { name: "Vincent", role: "NCCU | RMI" },
  // { name: "Sara", role: "NTPU | BA" },
  // { name: "Itarn", role: "NTHU | MS" },
  // { name: "Debby", role: "NTU | LING" },
  // { name: "Bill", role: "NCCU | FIN" },

];

const flipVariants = {
  hidden: { rotateX: -90, opacity: 0 },
  visible: { rotateX: 0, opacity: 1, transition: { duration: 0.6 } },
  reverse: { rotateX: 90, opacity: 0, transition: { duration: 0.6 } },
};

export function ActiveMember() {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("reverse");
    }
  }, [controls, inView]);

  return (
    <div className="container px-4 md:px-6" ref={ref}>
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
        Active Members
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {members.map((member, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center text-center"
            initial="hidden"
            animate={controls}
            variants={flipVariants}
          >
            <Image
              src={`/core-contributors/${member.name}.webp`}
              alt={member.name}
              width={100}
              height={100}
              className="rounded-full mb-2 object-cover"
              style={{ width: "100px", height: "100px" }}
            />
            <h3 className="text-sm font-medium">{member.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {member.role}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ActiveMember;
