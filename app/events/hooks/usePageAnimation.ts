import { useEffect } from "react";
import { useAnimation } from "framer-motion";

export function usePageAnimation() {
  const controls = useAnimation();

  useEffect(() => {
    // Start animation immediately when component mounts
    controls.start("visible");
  }, [controls]);

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  return {
    controls,
    fadeInVariants,
  };
}