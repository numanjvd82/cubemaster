"use client";
import { useCubeStore } from "@/store/useCubeStore";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";

export default function Cube() {
  const inputLocked = useCubeStore((s) => s.inputLocked);

  return (
    <Canvas camera={{ position: [6, 6, 6], fov: 50 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls
        minDistance={4}
        maxDistance={10}
        enableZoom={false}
        enabled={!inputLocked}
      />
      <Scene />
    </Canvas>
  );
}
