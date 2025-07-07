"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: "🎮",
    title: "Interactive 3D Simulation",
    description:
      "Fully interactive 3D Rubik's Cube with realistic physics and smooth animations.",
  },
  {
    icon: "🎯",
    title: "Multiple Game Modes",
    description:
      "Challenge yourself with Classic, Time Attack, and Daily Challenges.",
  },
  {
    icon: "📊",
    title: "Track Your Progress",
    description:
      "Monitor your improvement with detailed statistics and global leaderboards.",
  },
  {
    icon: "📱",
    title: "Play Anywhere",
    description: "Responsive design lets you practice on any device, anytime.",
  },
  {
    icon: "🎓",
    title: "Learn Step-by-Step",
    description:
      "Follow comprehensive tutorials from beginner to advanced techniques.",
  },
  {
    icon: "🏆",
    title: "Compete Globally",
    description:
      "Join competitions and see how you rank against other cube enthusiasts.",
  },
];

export function LandingFeatures() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Powerful Features
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Everything you need to become a Rubik&apos;s Cube master, from
          beginner to speedcuber.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-black/20 backdrop-blur-sm p-8 rounded-xl hover:bg-black/30 transition-colors"
            variants={itemVariants}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-300">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
