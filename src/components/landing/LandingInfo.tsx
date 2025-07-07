"use client";

import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";

export function LandingInfo() {
  const steps = [
    {
      number: "01",
      title: "Choose a Game Mode",
      description:
        "Select from Classic mode, Time Attack, or the Daily Challenge to test your skills.",
    },
    {
      number: "02",
      title: "Practice Your Moves",
      description:
        "Use our interactive 3D cube to learn and perfect your solving techniques.",
    },
    {
      number: "03",
      title: "Track Your Progress",
      description:
        "See your improvement over time and compare your results with others.",
    },
    {
      number: "04",
      title: "Master the Cube",
      description:
        "Become a speedcuber with consistent practice and advanced techniques.",
    },
  ];

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
          How It Works
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          From beginner to expert, our platform makes learning the Rubik&apos;s
          Cube intuitive and fun.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="relative h-[500px] w-full rounded-lg overflow-hidden bg-black/20 backdrop-blur-md">
            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <pointLight position={[-10, -10, -10]} />

              <mesh>
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshStandardMaterial
                  color="#6366f1"
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>

              <Environment preset="city" />
              <OrbitControls autoRotate enableZoom={false} />
            </Canvas>
          </div>
        </div>

        <div>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="mb-10 flex"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="mr-6 flex-shrink-0">
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white font-bold">
                  {step.number}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-black/20 backdrop-blur-sm p-8 rounded-xl text-center">
          <motion.div
            className="text-4xl md:text-5xl font-bold text-white mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            10,000+
          </motion.div>
          <p className="text-gray-400">Active Players</p>
        </div>

        <div className="bg-black/20 backdrop-blur-sm p-8 rounded-xl text-center">
          <motion.div
            className="text-4xl md:text-5xl font-bold text-white mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            500,000+
          </motion.div>
          <p className="text-gray-400">Cubes Solved</p>
        </div>

        <div className="bg-black/20 backdrop-blur-sm p-8 rounded-xl text-center">
          <motion.div
            className="text-4xl md:text-5xl font-bold text-white mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            4.9/5
          </motion.div>
          <p className="text-gray-400">User Rating</p>
        </div>
      </motion.div>
    </div>
  );
}
