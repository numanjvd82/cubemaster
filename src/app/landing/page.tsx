"use client";

import {
  BackgroundParticles,
  OrbitalRing,
} from "@/components/landing/BackgroundEffects";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingInfo } from "@/components/landing/LandingInfo";
import { PatternOverlay } from "@/components/landing/PatternOverlay";
import SectionDivider from "@/components/landing/SectionDivider";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { motion } from "motion/react";
import Link from "next/link";
import { Suspense } from "react";

export default function LandingPage() {
  return (
    <div className="relative w-full bg-gradient-to-b from-indigo-900 to-black/20">
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [3, 3, 5], fov: 45 }} shadows>
            <Suspense fallback={null}>
              <ambientLight intensity={0.4} />
              <directionalLight
                position={[5, 5, 5]}
                intensity={0.8}
                castShadow
              />
              <directionalLight position={[-5, -5, -5]} intensity={0.4} />
              <spotLight
                position={[0, 8, 0]}
                intensity={0.6}
                angle={0.6}
                castShadow
                penumbra={1}
              />

              <BackgroundParticles />
              <OrbitalRing />

              <Environment preset="city" />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 4}
              />
            </Suspense>
          </Canvas>
        </div>

        <LandingHero />
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <button
            onClick={() => {
              const featuresSection = document.getElementById("features");
              featuresSection?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600/80 hover:bg-indigo-700/90 rounded-lg text-white transition-all"
          >
            <span>Explore Features</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </motion.div>
      </section>

      <SectionDivider
        type="slant"
        height={120}
        withPattern={true}
        patternOpacity={0.1}
        primaryColor="rgba(0, 0, 0, 0.3)"
        secondaryColor="rgba(79, 70, 229, 0.15)"
      />

      {/* Features Section with 3D background */}
      <section
        id="features"
        className="relative py-20 px-4 md:px-8 bg-black/30 backdrop-blur-md overflow-hidden"
      >
        {/* 3D background for features */}
        <div className="absolute inset-0 z-0 opacity-30">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.2} />
              <BackgroundParticles />
            </Suspense>
          </Canvas>
        </div>

        <PatternOverlay pattern="hexagons" opacity={0.07} className="z-[1]">
          <div className="relative z-10">
            <LandingFeatures />
          </div>
        </PatternOverlay>
      </section>

      {/* Divider between features and info */}
      <SectionDivider
        type="wave"
        height={100}
        withPattern={true}
        primaryColor="rgba(79, 70, 229, 0.1)"
      />

      {/* Info Section */}
      <section id="info" className="relative py-20 px-4 md:px-8">
        <PatternOverlay pattern="circuit" opacity={0.1} className="z-[1]">
          <LandingInfo />
        </PatternOverlay>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 md:px-8 bg-black/30 backdrop-blur-md text-center overflow-hidden">
        <PatternOverlay pattern="circuit" opacity={0.07} className="z-[1]">
          <div className="relative max-w-4xl mx-auto z-10">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Ready to Master the Cube?
            </motion.h2>

            <motion.p
              className="text-xl text-gray-300 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Challenge yourself with different game modes and track your
              progress.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/game/select"
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-lg font-medium transition-all inline-block shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50"
                >
                  Start Playing Now
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </PatternOverlay>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 md:px-8 text-center text-gray-400 relative overflow-hidden">
        <PatternOverlay pattern="dots" opacity={0.1} className="z-[1]">
          <motion.div
            className="absolute inset-0 z-0 "
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          />

          <motion.div
            className="max-w-7xl mx-auto relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-wrap justify-center gap-8 mb-6">
              <motion.a
                href="#"
                className="text-gray-300 hover:text-indigo-400 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                About
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-300 hover:text-indigo-400 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                Contact
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-300 hover:text-indigo-400 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                Privacy
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-300 hover:text-indigo-400 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                Terms
              </motion.a>
            </div>

            <p>
              © {new Date().getFullYear()} Cube Master. All rights reserved.
            </p>
          </motion.div>
        </PatternOverlay>
      </footer>
    </div>
  );
}
