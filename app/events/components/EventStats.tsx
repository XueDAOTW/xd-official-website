"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { usePageAnimation } from "../hooks/usePageAnimation";

interface StatItem {
  icon: LucideIcon;
  number: string;
  label: string;
  color: string;
}

interface EventStatsProps {
  title: string;
  stats: StatItem[];
}

export function EventStats({ title, stats }: EventStatsProps) {
  const { fadeInVariants } = usePageAnimation();

  return (
    <motion.div
      className="mb-12"
      variants={fadeInVariants}
    >
      <h2 className="text-3xl font-bold text-center mb-12 text-high-contrast">
        {title}
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
  );
}