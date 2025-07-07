"use client";

import { motion } from "framer-motion";

export function LandingHero() {
  return (
    <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Master the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Rubik&apos;s Cube
          </span>{" "}
          with Interactive 3D
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Learn, practice, and perfect your cube-solving skills with our
          interactive 3D simulator and step-by-step guides.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <motion.a
            href="/game/select"
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-lg font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Playing
          </motion.a>

          <motion.a
            href="#features"
            className="px-8 py-4 bg-transparent border border-white/30 hover:bg-white/10 rounded-lg text-white text-lg font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Learn More
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
}
