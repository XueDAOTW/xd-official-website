import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Events() {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.1,
  });
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

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

  const pastEvents = [
    {
      id: "connect-hackathon",
      name: "CONNECT Hackathon 2024",
      subtitle: "Student-Only Hackathon",
      year: "2024",
      date: "May-June 2024",
      description: "Co-hosting with BuZhiDAO, we delivered the very first student-only hackathon in Taiwan!",
      backgroundImage: "/past-events/connect.webp",
      stats: [
        { number: "200+", label: "Participants" },
        { number: "25", label: "Projects Submitted" },
        { number: "15+", label: "Universities" },
        { number: "20+", label: "Sponsors" }
      ]
    },
    {
      id: "xuedao-workshop",
      name: "XueDAO Workshop 2025",
      subtitle: "Web3 Learning Workshop",
      year: "2025",
      date: "January 2025",
      description: "An intensive Web3 learning workshop for students to dive deep into blockchain technology and DeFi protocols!",
      backgroundImage: "/past-events/workshop.webp",
      stats: [
        { number: "150+", label: "Participants" },
        { number: "5", label: "Workshop Sessions" },
        { number: "10+", label: "Universities" },
        { number: "3", label: "Days" }
      ]
    }
  ];

  if (selectedEvent) {
    const event = pastEvents.find(e => e.id === selectedEvent);
    
    if (!event) {
      return null;
    }
    
    return (
      <motion.div
        className="container px-4 md:px-6"
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={fadeInVariants}
      >
        <motion.div
          className="mb-8"
          variants={fadeInVariants}
        >
          <Button
            variant="ghost"
            onClick={() => setSelectedEvent(null)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
            {event.name}
          </h2>
        </motion.div>

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
              {event.name}
            </h3>
            <h4 className="text-2xl font-bold xl:text-3xl text-center">
              {event.subtitle}
            </h4>
            <p className="text-gray-500 dark:text-gray-400 xl:text-lg text-center">
              {event.description}
            </p>
            <div className="grid grid-cols-2 gap-12 pt-8">
              {event.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center justify-center p-6 border-4 border-black rounded-3xl bg-white"
                  variants={fadeInVariants}
                >
                  <h3 className="text-2xl font-bold">{stat.number}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container px-4 md:px-6"
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeInVariants}
    >
      {/* Past Events Banner */}
      <motion.div
        className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl"
        variants={fadeInVariants}
      >
        <div 
          className="h-64 md:h-80 bg-cover bg-center bg-no-repeat relative"
          style={{
            backgroundImage: `url(/events-photo/11.webp)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-blue-900/60 to-teal-900/80" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.h2
              className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl text-center px-4"
              variants={fadeInVariants}
            >
              Past Events
            </motion.h2>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto"
        variants={fadeInVariants}
      >
        {pastEvents.map((event, index) => (
          <motion.div
            key={event.id}
            className="h-full border-black bg-white rounded-3xl"
            variants={fadeInVariants}
          >
            <Card 
              className="cursor-pointer hover:shadow-2xl transition-all duration-300 border border-gray-200/50 overflow-hidden bg-white/95 backdrop-blur-sm"
              onClick={() => setSelectedEvent(event.id)}
            >
              <CardHeader className={`pb-4 ${
                index === 0 
                  ? 'bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500' 
                  : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600'
              } text-white`}>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold text-white drop-shadow-sm">{event.name}</CardTitle>
                    <CardDescription className="text-xl font-semibold text-white/90 mt-2">
                      {event.subtitle}
                    </CardDescription>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    index === 0 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white/20 text-white'
                  }`}>
                    {event.year}
                  </span>
                </div>
                <CardDescription className="text-white/80 text-base mt-2">
                  {event.date}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 relative z-10">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <p className="text-gray-800 mb-6 text-base leading-relaxed font-medium">{event.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {event.stats.slice(0, 4).map((stat, statIndex) => (
                      <div key={statIndex} className="text-center p-4 bg-white/90 rounded-xl border border-gray-200/30 shadow-sm backdrop-blur-sm">
                        <div className={`text-2xl font-bold ${
                          index === 0 ? 'text-purple-600' : 'text-indigo-600'
                        }`}>
                          {stat.number}
                        </div>
                        <div className="text-sm text-gray-700 font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  <Button className={`w-full font-semibold py-3 text-white shadow-lg hover:shadow-xl transition-all duration-200 ${
                    index === 0 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                  }`}>
                    View Details →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {pastEvents.length === 0 && (
        <motion.div
          className="text-center py-12"
          variants={fadeInVariants}
        >
          <h3 className="text-xl font-semibold mb-4">No Past Events</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Check back later for past event information!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Events;