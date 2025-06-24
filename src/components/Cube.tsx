"use client";
import { useCubeStore } from "@/store/useCubeStore";
import { Button } from "@headlessui/react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";

export default function Cube() {
  const freeLook = useCubeStore((s) => s.freeLook);
  const setFreeLook = useCubeStore((s) => s.setFreeLook);
  return (
    <>
      <Button
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,
        }}
        onClick={() => setFreeLook(!freeLook)}
        className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500"
      >
        {freeLook ? "🚫 Exit Free Look" : "🧭 Enter Free Look"}
      </Button>
      <Canvas camera={{ position: [6, 6, 6], fov: 50 }}>
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
    </>
  );
}
