import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

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
  { name: "Shirley", role: "NTNU | EDU" },
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {members.map((member, index) => (
          <motion.div
            key={index}
            initial="hidden"
            animate={controls}
            variants={flipVariants}
            className="hover-lift"
          >
            <Card className="p-4 text-center bg-gradient-to-br from-white/50 to-white/30 hover:shadow-avatar border-transparent hover:border-xuedao_blue/20 transition-all duration-300">
              <CardContent className="p-0 flex flex-col items-center space-y-3">
                <Avatar className="w-20 h-20 ring-2 ring-xuedao_blue/10 hover:ring-xuedao_blue/30 transition-all duration-300">
                  <AvatarImage 
                    src={`/core-contributors/${member.name}.webp`} 
                    alt={member.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-xuedao_blue to-xuedao_pink text-white font-semibold text-lg">
                    {member.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-high-contrast">{member.name}</h3>
                  <p className="text-xs text-subtle leading-relaxed">
                    {member.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ActiveMember;
