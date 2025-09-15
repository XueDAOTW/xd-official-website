import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useAnimation, stagger } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Calendar, Users, Trophy, Clock, ArrowRight, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Events() {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: "backOut",
        delay: 0.2,
      },
    },
  };

  const pastEvents = [
    {
      id: "connect-hackathon-2024",
      name: "XueDAO CONNECT Hackathon 2024",
      subtitle: "Taiwan's First Student-Only Web3 Hackathon",
      year: "2024",
      date: "May 13 - June 30, 2024",
      description: "The XueDAO CONNECT Hackathon is the first student-only event in Taiwan, dedicated to showcasing the capabilities of Taiwanese students in web3 development! Featured virtual start, in-person Sprint Camp (June 28-29), and Demo Day (June 30).",
      image: "/past-events/connect-hackathon.webp",
      path: "/events/connect-hackathon-2024",
      category: "Hackathon",
      theme: {
        primary: "from-purple-600 to-pink-600",
        secondary: "from-purple-500/10 to-pink-500/10",
        accent: "purple",
        text: "text-purple-700"
      },
      stats: [
        { number: "200+", label: "Participants", icon: Users },
        { number: "56", label: "Projects Submitted", icon: Trophy },
        { number: "15+", label: "Universities", icon: ExternalLink },
        { number: "10K+", label: "Prize Pool (USD)", icon: Trophy }
      ]
    },
    {
      id: "xuedao-workshop-2025",
      name: "XueDAO Workshop @ TBW 2025",
      subtitle: "AI & Web3 Builder-Focused Sessions",
      year: "2025",
      date: "September 4, 2025",
      description: "Full day of hands-on learning hosted by XueDAO at Taipei Blockchain Week 2025. From AI agents to privacy-preserving tech, designed to equip developers with cutting-edge Web3 and AI tools.",
      image: "/past-events/xuedao-workshop.webp",
      path: "/events/xuedao-workshop-2025",
      category: "Workshop",
      theme: {
        primary: "from-blue-600 to-indigo-600",
        secondary: "from-blue-500/10 to-indigo-500/10",
        accent: "blue",
        text: "text-blue-700"
      },
      stats: [
        { number: "100+", label: "Participants", icon: Users },
        { number: "6", label: "Expert Sessions", icon: Clock },
        { number: "6", label: "YouTube Videos", icon: ExternalLink },
        { number: "7hrs", label: "Full Day Event", icon: Calendar }
      ]
    }
  ];
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
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            variants={cardVariants}
          >
            <Badge 
              variant="secondary" 
              className="mb-4 px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200"
            >
              Community Events
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Past Events
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover the exciting events that have shaped our Web3 developer community
            </p>
          </motion.div>
          
          <motion.div
            className="grid gap-8 lg:gap-12 md:grid-cols-2 max-w-7xl mx-auto"
            variants={containerVariants}
          >
            {pastEvents.map((event, index) => (
              <motion.div
                key={event.id}
                className="group relative"
                variants={cardVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Link 
                  href={event.path}
                  className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded-2xl"
                  aria-label={`Learn more about ${event.name}`}
                >
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-sm group-hover:bg-white">
                    
                    {/* Enhanced Image Section */}
                    <div className="relative h-56 sm:h-64 overflow-hidden">
                      <Image
                        src={event.image}
                        alt={`${event.name} event photo`}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110"
                        priority={index < 2}
                        quality={85}
                      />
                      
                      {/* Subtle overlay instead of heavy gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      
                      {/* Top badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <Badge 
                          variant="secondary"
                          className={`bg-white/90 backdrop-blur-sm text-${event.theme.accent}-700 border-white/20 font-medium`}
                        >
                          {event.category}
                        </Badge>
                        <Badge 
                          variant="outline"
                          className="bg-white/10 backdrop-blur-sm text-white border-white/30 font-medium"
                        >
                          {event.year}
                        </Badge>
                      </div>
                      
                      {/* Bottom content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                        <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <CardContent className="p-6 sm:p-8">
                      {/* Header */}
                      <div className="mb-6">
                        <CardTitle className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-gray-900 transition-colors">
                          {event.name}
                        </CardTitle>
                        <CardDescription className={`text-base font-semibold mb-3 bg-gradient-to-r ${event.theme.primary} bg-clip-text text-transparent`}>
                          {event.subtitle}
                        </CardDescription>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      {/* Enhanced Stats Grid */}
                      <motion.div 
                        className="grid grid-cols-2 gap-3 sm:gap-4 mb-8"
                        variants={statsVariants}
                      >
                        {event.stats.map((stat, statIndex) => {
                          const IconComponent = stat.icon;
                          return (
                            <motion.div 
                              key={statIndex}
                              className={`relative p-4 rounded-xl bg-gradient-to-br ${event.theme.secondary} border border-gray-100 group-hover:border-${event.theme.accent}-200 transition-all duration-300`}
                              whileHover={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-gradient-to-r ${event.theme.primary} text-white shadow-sm`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className={`text-xl sm:text-2xl font-bold ${event.theme.text}`}>
                                    {stat.number}
                                  </div>
                                  <div className="text-xs sm:text-sm text-gray-600 font-medium leading-tight">
                                    {stat.label}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>

                      {/* Call to Action */}
                      <Button 
                        className={`w-full group/btn font-semibold py-3 h-12 bg-gradient-to-r ${event.theme.primary} hover:shadow-lg transition-all duration-300 text-white border-0 group-hover:shadow-xl`}
                        size="lg"
                      >
                        <span className="flex items-center justify-center gap-2">
                          Learn More
                          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </span>
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Empty State */}
          {pastEvents.length === 0 && (
            <motion.div
              className="text-center py-20"
              variants={cardVariants}
            >
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">No Past Events</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Check back later for past event information and exciting community updates!
              </p>
            </motion.div>
          )}
        </motion.div>
  );
}

export default Events;