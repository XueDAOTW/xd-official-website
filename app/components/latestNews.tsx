import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Colearning from "@/app/components/latestNews/colearning";
import Post from "@/app/components/latestNews/post";
import Workshop from "@/app/components/latestNews/workshop";

export function LatestNews() {
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
        Latest News
      </motion.h2>
      <motion.div variants={fadeInVariants}>
        <Tabs defaultValue="ig" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ig">IG Post</TabsTrigger>
            <TabsTrigger value="learn">Co-learning Day</TabsTrigger>
            <TabsTrigger value="workshop">Workshop</TabsTrigger>
          </TabsList>
          <TabsContent value="ig">
            <Post />
          </TabsContent>
          <TabsContent value="learn">
            <Colearning />
          </TabsContent>
          <TabsContent value="workshop">
            <Workshop />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

export default LatestNews;
