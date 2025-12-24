"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Users, Trophy, Building } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EventLayout, EventHero, EventStats } from "@/features/events";
import { usePageAnimation } from "@/features/events/hooks";

export default function ConnectHackathon2024() {
  const { fadeInVariants } = usePageAnimation();

  const stats = [
    { icon: Users, number: "200+", label: "Participants", color: "text-purple-600" },
    { icon: Trophy, number: "56", label: "Projects Submitted", color: "text-pink-600" },
    { icon: Building, number: "15+", label: "Universities", color: "text-indigo-600" },
    { icon: Calendar, number: "10K+", label: "Prize Pool (USD)", color: "text-blue-600" }
  ];

  return (
    <EventLayout>
      <EventHero
        date="May 13 - June 30, 2024"
        title="XueDAO CONNECT Hackathon 2024"
        description="The XueDAO CONNECT Hackathon is the first student-only event in Taiwan, dedicated to showcasing the capabilities of Taiwanese students in web3 development!"
        gradientColors="bg-gradient-to-r from-purple-500 to-pink-500"
      />

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
            src="/past-events/connect-hackathon.webp"
            className="w-full h-auto"
            width={800}
            height={500}
            alt="CONNECT Hackathon 2024"
            priority
          />
        </motion.div>

        {/* Content Section */}
        <motion.div
          className="space-y-6"
          variants={fadeInVariants}
        >
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200 shadow-soft">
            <h2 className="text-3xl font-bold mb-4 text-purple-800">
              About the Event
            </h2>
            <p className="text-medium-contrast text-lg leading-relaxed mb-6">
              The XueDAO CONNECT Hackathon marked a historic milestone as Taiwan's first student-only hackathon. 
              Under XueDAO's vision "Show the World that Taiwanese Students Can BUILD," this event brought together 
              innovative minds to showcase Taiwan's next generation of tech talent in web3 development.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="text-medium-contrast">Virtual: May 13 | Sprint Camp: June 28-29 | Demo Day: June 30</span>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-purple-600" />
                <span className="text-medium-contrast">Location: ARK Taipei (In-person events)</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="text-medium-contrast">Eligibility: Current students or graduated within 2 years</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <EventStats title="Event Impact" stats={stats} />

      {/* Bounty Tracks Section */}
      <motion.div
        className="mb-12"
        variants={fadeInVariants}
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-high-contrast">
          Bounty Tracks & Prizes
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cathay Financial Holdings Track */}
          <motion.div
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-soft"
            variants={fadeInVariants}
          >
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-blue-800 mb-2">Cathay Financial Holdings</h3>
              <div className="text-2xl font-bold text-blue-600">$2K Prize Pool</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>1st Prize:</span>
                <span className="font-semibold">$1000</span>
              </div>
              <div className="flex justify-between">
                <span>2nd Prize:</span>
                <span className="font-semibold">$500</span>
              </div>
              <div className="flex justify-between">
                <span>Others:</span>
                <span className="font-semibold">$500 shared</span>
              </div>
            </div>
            <p className="text-xs text-blue-700 mt-4">
              Focus: AI + Blockchain, ZK, RWA, DID, ESG with financial applications
            </p>
          </motion.div>

          {/* Zeus Network Track */}
          <motion.div
            className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200 shadow-soft"
            variants={fadeInVariants}
          >
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-orange-800 mb-2">Zeus Network Olympic</h3>
              <div className="text-2xl font-bold text-orange-600">$2K Prize Pool</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>1st Prize:</span>
                <span className="font-semibold">$1000</span>
              </div>
              <div className="flex justify-between">
                <span>2nd Prize:</span>
                <span className="font-semibold">$500</span>
              </div>
              <div className="flex justify-between">
                <span>Others:</span>
                <span className="font-semibold">$500 shared</span>
              </div>
            </div>
            <p className="text-xs text-orange-700 mt-4">
              Focus: Bitcoin-Solana ecosystem synergies & general blockchain development
            </p>
          </motion.div>

          {/* SUI Track */}
          <motion.div
            className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200 shadow-soft"
            variants={fadeInVariants}
          >
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-cyan-800 mb-2">SUI Network</h3>
              <div className="text-2xl font-bold text-cyan-600">$3K Prize Pool</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>1st Prize:</span>
                <span className="font-semibold">$1500</span>
              </div>
              <div className="flex justify-between">
                <span>2nd Prize:</span>
                <span className="font-semibold">$1000</span>
              </div>
              <div className="flex justify-between">
                <span>Others:</span>
                <span className="font-semibold">$500 shared</span>
              </div>
            </div>
            <p className="text-xs text-cyan-700 mt-4">
              Focus: Applications integrating with Sui Network (mainnet/testnet/devnet)
            </p>
          </motion.div>

          {/* BGA Track */}
          <motion.div
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-soft"
            variants={fadeInVariants}
          >
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-green-800 mb-2">BGA & Aptos</h3>
              <div className="text-2xl font-bold text-green-600">$2K Prize Pool</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>1st Prize:</span>
                <span className="font-semibold">$1000</span>
              </div>
              <div className="flex justify-between">
                <span>2nd Prize:</span>
                <span className="font-semibold">$500</span>
              </div>
              <div className="flex justify-between">
                <span>Others:</span>
                <span className="font-semibold">$500 shared</span>
              </div>
            </div>
            <p className="text-xs text-green-700 mt-4">
              Focus: UN SDGs - Security, Health, Sustainability, Education, Equality
            </p>
          </motion.div>

          {/* Zircuit Track */}
          <motion.div
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 shadow-soft"
            variants={fadeInVariants}
          >
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-purple-800 mb-2">Zircuit</h3>
              <div className="text-2xl font-bold text-purple-600">$1.5K Prize Pool</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>1st Prize:</span>
                <span className="font-semibold">$700</span>
              </div>
              <div className="flex justify-between">
                <span>2nd Prize:</span>
                <span className="font-semibold">$400</span>
              </div>
              <div className="flex justify-between">
                <span>Others:</span>
                <span className="font-semibold">$400 shared</span>
              </div>
            </div>
            <p className="text-xs text-purple-700 mt-4">
              Focus: L2 public goods, Account Abstraction, ZK, cross-chain liquidity
            </p>
          </motion.div>

          {/* ETH Taipei Track */}
          <motion.div
            className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200 shadow-soft"
            variants={fadeInVariants}
          >
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-indigo-800 mb-2">ETH Taipei Community</h3>
              <div className="text-2xl font-bold text-indigo-600">$500 Prize Pool</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>1st Prize:</span>
                <span className="font-semibold">$300</span>
              </div>
              <div className="flex justify-between">
                <span>2nd Prize:</span>
                <span className="font-semibold">$200</span>
              </div>
            </div>
            <p className="text-xs text-indigo-700 mt-4">
              Focus: EVM/ETH ecosystem projects and tooling
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Event Timeline & Process */}
      <motion.div
        className="mb-12"
        variants={fadeInVariants}
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-high-contrast">
          Event Timeline & Process
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200 shadow-soft text-center"
            variants={fadeInVariants}
          >
            <div className="text-3xl mb-4">📝</div>
            <h3 className="text-xl font-bold mb-4 text-purple-800">
              Registration Process
            </h3>
            <div className="text-sm text-purple-700 space-y-2">
              <p><strong>Step 1:</strong> Individual registration with student email</p>
              <p><strong>Step 2:</strong> Team formation (2-5 members)</p>
              <p><strong>Step 3:</strong> Final submission by June 30</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-200 shadow-soft text-center"
            variants={fadeInVariants}
          >
            <div className="text-3xl mb-4">🏃‍♂️</div>
            <h3 className="text-xl font-bold mb-4 text-pink-800">
              Sprint Camp
            </h3>
            <div className="text-sm text-pink-700 space-y-2">
              <p><strong>June 28-29:</strong> In-person hacking at ARK Taipei</p>
              <p><strong>Location:</strong> No. 100, Sec. 7, Civic Blvd., Nangang Dist.</p>
              <p><strong>Purpose:</strong> Collaborative development & mentorship</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200 shadow-soft text-center"
            variants={fadeInVariants}
          >
            <div className="text-3xl mb-4">🎤</div>
            <h3 className="text-xl font-bold mb-4 text-indigo-800">
              Demo Day
            </h3>
            <div className="text-sm text-indigo-700 space-y-2">
              <p><strong>June 30:</strong> Final presentations & judging</p>
              <p><strong>Format:</strong> 1.5-10 minute demo/pitch videos</p>
              <p><strong>Outcome:</strong> Winners announced & prizes awarded</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Highlights Section */}
      <motion.div
        className="mb-12"
        variants={fadeInVariants}
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-high-contrast">
          Event Highlights
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-200 shadow-soft"
            variants={fadeInVariants}
          >
            <h3 className="text-2xl font-bold mb-4 text-purple-800">
              🏆 First Student-Only Event
            </h3>
            <p className="text-medium-contrast leading-relaxed">
              Taiwan's historic first student-only hackathon, emphasizing fair competition and showcasing 
              student innovation prowess across blockchain, AI, and sustainable technology domains.
            </p>
          </motion.div>
          
          <motion.div
            className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border border-pink-200 shadow-soft"
            variants={fadeInVariants}
          >
            <h3 className="text-2xl font-bold mb-4 text-pink-800">
              🌉 Industry Bridge
            </h3>
            <p className="text-medium-contrast leading-relaxed">
              The event served as a crucial bridge between students and the blockchain industry, 
              offering resources, ideas exchange, and career opportunities including internships.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Event Conclusion */}
      <motion.div
        className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white"
        variants={fadeInVariants}
      >
        <h2 className="text-3xl font-bold mb-4">
          Event Completed Successfully
        </h2>
        <p className="text-lg mb-8 opacity-90">
          Thank you to all participants who made this hackathon a huge success! Stay connected with XueDAO for future opportunities.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3"
        >
          <Link href="/apply">
            Join XueDAO Community
          </Link>
        </Button>
      </motion.div>
    </EventLayout>
  );
}