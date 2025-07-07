"use client";

import { a, useSpring } from "@react-spring/three";
import { Float, Sparkles, Stars, Trail } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Group, Mesh } from "three";

// Animated floating cube group that appears around the main cube
export function FloatingCubes() {
  return (
    <group>
      {Array.from({ length: 8 }).map((_, i) => (
        <FloatingCube key={i} index={i} />
      ))}
    </group>
  );
}

// Individual floating mini cube
function FloatingCube({ index }: { index: number }) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Calculate position based on index
  const theta = (index / 8) * Math.PI * 2;
  const y = Math.sin(index) * 2;
  const posX = Math.sin(theta) * 6;
  const posZ = Math.cos(theta) * 6;

  // Animation for hover effect
  const { scale } = useSpring({
    scale: hovered ? 1.4 : 1,
    config: { mass: 1, tension: 280, friction: 60 },
  });

  // Rotate and move slightly
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;

      // Add slight movement
      const t = state.clock.getElapsedTime() + index * 1000;
      meshRef.current.position.y = y + Math.sin(t * 0.5) * 0.5;
      meshRef.current.position.x = posX + Math.sin(t * 0.2) * 0.3;
      meshRef.current.position.z = posZ + Math.cos(t * 0.2) * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2}>
      {" "}
      <Trail
        width={1}
        color="#4c6ef5"
        length={5}
        decay={1}
        attenuation={(width) => width}
      >
        <a.mesh
          ref={meshRef}
          position={[posX, y, posZ]}
          scale={scale}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial
            color={hovered ? "#8c5efa" : "#5e34eb"}
            emissive={hovered ? "#8c5efa" : "#2a10b0"}
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.2}
          />
        </a.mesh>
      </Trail>
    </Float>
  );
}

// Animated background particles
export function BackgroundParticles() {
  return (
    <>
      {/* Distant stars */}
      <Stars
        radius={50}
        depth={50}
        count={1000}
        factor={4}
        saturation={0.6}
        fade
        speed={1}
      />

      {/* Sparkles for more dynamic particles */}
      <Sparkles count={100} scale={10} size={1} speed={0.3} color="#8b5cf6" />

      <Sparkles count={50} scale={15} size={2} speed={0.2} color="#3b82f6" />
    </>
  );
}

// Orbital ring that surrounds the main cube
export function OrbitalRing() {
  const ringRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  const { opacity, scale } = useSpring({
    opacity: hovered ? 1 : 0.6,
    scale: hovered ? 1.05 : 1,
    config: { mass: 1, tension: 280, friction: 60 },
  });

  useFrame((state) => {
    if (ringRef.current) {
      // Rotate the ring
      ringRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
      ringRef.current.rotation.x =
        Math.sin(state.clock.getElapsedTime() * 0.2) * 0.2;
    }
  });

  return (
    <a.group
      ref={ringRef}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <a.mesh>
        <torusGeometry args={[5, 0.1, 16, 100]} />
        <a.meshStandardMaterial
          color="#8b5cf6"
          emissive="#4c1d95"
          emissiveIntensity={0.5}
          transparent
          opacity={opacity}
        />
      </a.mesh>

      <a.mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[5.5, 0.05, 16, 100]} />
        <a.meshStandardMaterial
          color="#3b82f6"
          emissive="#1e40af"
          emissiveIntensity={0.5}
          transparent
          opacity={opacity}
        />
      </a.mesh>
    </a.group>
  );
}
