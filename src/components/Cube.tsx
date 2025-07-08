"use client";
import { useCubeStore } from "@/store/useCubeStore";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";

export default function Cube() {
  const freeLook = useCubeStore((s) => s.freeLook);

  return (
    <Canvas className="w-full h-full" camera={{ position: [6, 6, 6], fov: 50 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <OrbitControls
        minDistance={4}
        maxDistance={10}
        enableZoom={false}
        enabled={freeLook}
      />
      <Scene />
    </Canvas>
  );
}
