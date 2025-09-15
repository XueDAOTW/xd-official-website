"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { ArrowLeft, Calendar, Users, BookOpen, Clock, MapPin, Youtube } from "lucide-react";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";

export default function XueDAOWorkshop2025() {
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

  const stats = [
    { icon: Users, number: "100+", label: "Participants", color: "text-blue-600" },
    { icon: BookOpen, number: "6", label: "Workshop Sessions", color: "text-indigo-600" },
    { icon: Youtube, number: "6", label: "YouTube Recordings", color: "text-cyan-600" },
    { icon: Clock, number: "7hrs", label: "Full Day Event", color: "text-teal-600" }
  ];

  // Helper function to convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const workshopSessions = [
    {
      time: "10:40–11:30",
      title: "One Trillion Agents: Leveraging NEAR's Unique Capabilities",
      titleCn: "萬億代理時代：NEAR 的創新力量",
      speaker: "Lane Rettig | Head of Research | NEAR Foundation",
      icon: "🤖",
      youtubeUrl: "https://www.youtube.com/live/9r6L87ml1oA?si=ZbdDF0wXQAJa-y0o",
      embedUrl: "https://www.youtube.com/embed/9r6L87ml1oA"
    },
    {
      time: "11:40–12:30",
      title: "Agentic Finance and the Next Frontier of Agents Creation and Deployment",
      titleCn: "代理金融與智能代理創建與應用的新前沿",
      speaker: "Alan Wu | Founding PM, LJ Li | Founding Engineer | TrueNorth",
      icon: "💰",
      youtubeUrl: "https://www.youtube.com/live/N-hSi32VWNE?si=-3Z9hnbRwEKoObXG",
      embedUrl: "https://www.youtube.com/embed/N-hSi32VWNE"
    },
    {
      time: "13:30–14:20",
      title: "AI meets DeFi: Your Easy Guide to Understanding and Interact with On-Chain Protocols with AI",
      titleCn: "當AI遇見DeFi: 簡單的了解與利用AI與鏈上協議互動",
      speaker: "Allen Chu | Founder | DynaVest",
      icon: "🔄",
      youtubeUrl: "https://youtu.be/4xicXBJEn_4?si=mzAt5tgp7K0PXZw-",
      embedUrl: "https://www.youtube.com/embed/4xicXBJEn_4"
    },
    {
      time: "14:30–15:20",
      title: "Crypto Practices in the Age of AI Explosion",
      titleCn: "AI爆發中的加密實踐",
      speaker: "Lulu | Greater China Ecosystem Lead | Monad",
      icon: "⚡",
      youtubeUrl: "https://youtu.be/RWPO3rnr0wE?si=Sr-G45Te6c7n6-2W",
      embedUrl: "https://www.youtube.com/embed/RWPO3rnr0wE"
    },
    {
      time: "15:30–16:20",
      title: "Proof of Human: Privacy-Preserving Identity in the AI Era",
      titleCn: "人類證明：在人工智能時代下的隱私保護身份",
      speaker: "Kevin Lin | Software Integration Engineer | Self Protocol",
      icon: "🔐",
      youtubeUrl: "https://www.youtube.com/live/iqB8OY2zFGQ?si=cVceJ69L11qn6492",
      embedUrl: "https://www.youtube.com/embed/iqB8OY2zFGQ"
    },
    {
      time: "16:30–17:20",
      title: "Privacy-Preserving and Verifiable Off-Chain Computation",
      titleCn: "隱私保護和可驗證的鏈下計算",
      speaker: "Albert Cheng | Tech Ambassador | Oasis Protocol",
      icon: "🛡️",
      youtubeUrl: "https://www.youtube.com/live/TbEwgg_mEQA?si=JN3HMbddH-cK5Bbg",
      embedUrl: "https://www.youtube.com/embed/TbEwgg_mEQA"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <motion.div
          className="container px-4 md:px-6"
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeInVariants}
        >
          {/* Back Button */}
          <motion.div
            className="mb-8"
            variants={fadeInVariants}
          >
            <Button
              asChild
              variant="ghost"
              className="mb-4 hover-lift"
            >
              <Link href="/#past-events">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Events
              </Link>
            </Button>
          </motion.div>

          {/* Hero Section */}
          <motion.div
            className="text-center mb-12"
            variants={fadeInVariants}
          >
            <motion.div
              className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-sm font-medium mb-6"
              variants={fadeInVariants}
            >
              September 4, 2025
            </motion.div>
            <motion.h1
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent"
              variants={fadeInVariants}
            >
              XueDAO Workshop @ TBW 2025
            </motion.h1>
            <motion.p
              className="text-xl text-medium-contrast max-w-3xl mx-auto leading-relaxed mb-8"
              variants={fadeInVariants}
            >
              Join us for a full day of hands-on learning and builder-focused workshops hosted by XueDAO as part of Taipei Blockchain Week 2025. From technical deep-dives to community-driven sessions, this space is designed to equip local talent with Web3 and AI tools.
            </motion.p>
          </motion.div>

          {/* Main Content Grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12"
            variants={fadeInVariants}
          >
            {/* Image Section */}
            <motion.div
              className="relative w-full border-4 border-black rounded-3xl overflow-hidden shadow-medium hover-lift"
              variants={fadeInVariants}
            >
              <Image
                src="/past-events/xuedao-workshop.webp"
                className="w-full h-auto"
                width={800}
                height={500}
                alt="XueDAO Workshop @ TBW 2025"
                priority
              />
            </motion.div>

            {/* Content Section */}
            <motion.div
              className="space-y-6"
              variants={fadeInVariants}
            >
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 shadow-soft">
                <h2 className="text-3xl font-bold mb-4 text-blue-800">
                  About the Workshop
                </h2>
                <p className="text-medium-contrast text-lg leading-relaxed mb-6">
                  XueDAO Workshop @ Taipei Blockchain Week 2025 brought together developers, founders, and Web3 enthusiasts 
                  for a full day of intensive learning. Located at Songshan Cultural Park, the event featured six 
                  cutting-edge sessions covering AI agents, DeFi, and privacy-preserving technologies.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="text-medium-contrast">📍 September 4, 2025 | Songshan Cultural Park</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="text-medium-contrast">Workshop Room (W5) | Part of TBW 2025</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-medium-contrast">Target: Developers, Founders & Web3 Builders</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Youtube className="h-5 w-5 text-blue-600" />
                    <span className="text-medium-contrast">All Sessions Recorded & Available on YouTube</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="mb-12"
            variants={fadeInVariants}
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-high-contrast">
              Workshop Impact
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-6 text-center shadow-soft hover-lift border border-gray-100"
                  variants={fadeInVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                  <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                    {stat.number}
                  </div>
                  <div className="text-sm text-medium-contrast font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Workshop Schedule */}
          <motion.div
            className="mb-12"
            variants={fadeInVariants}
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-high-contrast">
              📅 Workshop Schedule
            </h2>
            <div className="space-y-6">
              {/* Lunch Break Notice */}
              <motion.div
                className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200 text-center"
                variants={fadeInVariants}
              >
                <h3 className="text-lg font-semibold text-orange-800 mb-2">12:30–13:30</h3>
                <p className="text-orange-700">🍽️ Lunch Break</p>
              </motion.div>

              {workshopSessions.map((session, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-soft hover-lift border border-gray-100"
                  variants={fadeInVariants}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="lg:w-1/2 lg:min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                        <div className="text-4xl">{session.icon}</div>
                        <div className="text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit">
                          {session.time}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-high-contrast leading-tight">
                        {session.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 italic">
                        {session.titleCn}
                      </p>
                      <p className="text-medium-contrast mb-4 font-medium">
                        Speaker: {session.speaker}
                      </p>
                    </div>
                    
                    <div className="lg:w-1/2 lg:min-w-0">
                      <div className="mb-3 flex items-center gap-2">
                        <Youtube className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-gray-700">Watch Session Recording</span>
                      </div>
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-md bg-gray-100">
                        <iframe
                          src={session.embedUrl}
                          title={session.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                          loading="lazy"
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          <Link href={session.youtubeUrl} target="_blank" rel="noopener noreferrer">
                            Open in YouTube
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Venue Information */}
          <motion.div
            className="mb-12"
            variants={fadeInVariants}
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-high-contrast">
              📍 Venue & Location
            </h2>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 shadow-soft">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-4 text-blue-800">
                  Songshan Cultural and Creative Park
                </h3>
                <div className="text-lg text-blue-700 mb-4">
                  📍 Workshop Room (W5) | Part of Taipei Blockchain Week 2025
                </div>
                <p className="text-medium-contrast">
                  No. 133, Guangfu S Rd, Xinyi District, Taipei City, Taiwan 11072
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h4 className="font-bold text-blue-800 mb-2">📅 Date & Time</h4>
                  <p className="text-medium-contrast">September 4, 2025 (Thursday)</p>
                  <p className="text-medium-contrast">10:40 AM - 5:20 PM</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h4 className="font-bold text-blue-800 mb-2">🎫 Entry Requirement</h4>
                  <p className="text-medium-contrast">Valid TBW2025 conference ticket required</p>
                  <p className="text-sm text-gray-600 italic">RSVP on Luma does not guarantee entry</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Event Highlights */}
          <motion.div
            className="mb-12"
            variants={fadeInVariants}
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-high-contrast">
              Event Highlights
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200 shadow-soft text-center"
                variants={fadeInVariants}
              >
                <div className="text-3xl mb-4">🤖</div>
                <h3 className="text-xl font-bold mb-4 text-purple-800">
                  AI & Web3 Convergence
                </h3>
                <p className="text-medium-contrast leading-relaxed text-sm">
                  Cutting-edge sessions on AI agents, agentic finance, and the intersection of artificial intelligence with blockchain technology.
                </p>
              </motion.div>
              
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 shadow-soft text-center"
                variants={fadeInVariants}
              >
                <div className="text-3xl mb-4">🔐</div>
                <h3 className="text-xl font-bold mb-4 text-blue-800">
                  Privacy & Security
                </h3>
                <p className="text-medium-contrast leading-relaxed text-sm">
                  Deep dives into privacy-preserving technologies, proof of human protocols, and verifiable off-chain computation.
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-soft text-center"
                variants={fadeInVariants}
              >
                <div className="text-3xl mb-4">🎥</div>
                <h3 className="text-xl font-bold mb-4 text-green-800">
                  Full Recordings Available
                </h3>
                <p className="text-medium-contrast leading-relaxed text-sm">
                  All sessions professionally recorded and available on YouTube for extended learning and community access.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Workshop Conclusion */}
          <motion.div
            className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white"
            variants={fadeInVariants}
          >
            <h2 className="text-3xl font-bold mb-4">
              XueDAO Workshop @ TBW 2025 Completed Successfully
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Thank you to all participants who joined us at Taipei Blockchain Week 2025! All sessions are available on YouTube. Let's onboard, build, and rise together.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3"
            >
              <Link href="/apply">
                Join XueDAO Community
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}