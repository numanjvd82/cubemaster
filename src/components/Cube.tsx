"use client";
import { useCubeStore } from "@/store/useCubeStore";
import { Button } from "@headlessui/react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";

export default function Cube() {
  const freeLook = useCubeStore((s) => s.freeLook);
  const setFreeLook = useCubeStore((s) => s.setFreeLook);
  const undo = useCubeStore((s) => s.undo);
  const redo = useCubeStore((s) => s.redo);
  const history = useCubeStore((s) => s.history);
  const future = useCubeStore((s) => s.future);
  const resetCube = useCubeStore((s) => s.resetCube);
  const scramble = useCubeStore((s) => s.scramble);
  const solve = useCubeStore((s) => s.solve);
  const canUndo = history.length > 0;
  const canRedo = future.length > 0;

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
      <Button
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 10,
        }}
        disabled={!canUndo}
        onClick={() => undo()}
        className="rounded bg-red-600 px-4 py-2 text-sm text-white data-active:bg-red-700 data-hover:bg-red-500 data-disabled:opacity-50 data-disabled:cursor-not-allowed"
      >
        Undo
      </Button>
      <Button
        style={{
          position: "absolute",
          top: 10,
          left: 80,
          zIndex: 10,
        }}
        disabled={!canRedo}
        onClick={() => redo()}
        className="rounded bg-green-600 px-4 py-2 text-sm text-white
        data-active:bg-green-700 data-hover:bg-green-500 data-disabled:opacity-50 data-disabled:cursor-not-allowed"
      >
        Redo
      </Button>

      <Button
        style={{
          position: "absolute",
          top: 10,
          left: 210,
          zIndex: 10,
        }}
        onClick={() => resetCube()}
        className="rounded bg-gray-600 px-4 py-2 text-sm text-white data-active:bg-gray-700 data-hover:bg-gray-500"
      >
        Reset Cube
      </Button>

      <Button
        style={{
          position: "absolute",
          top: 10,
          left: 320,
          zIndex: 10,
        }}
        onClick={() => scramble(10)}
        className="rounded bg-yellow-600 px-4 py-2 text-sm text-white data-active:bg-yellow-700 data-hover:bg-yellow-500"
      >
        Scramble Cube
      </Button>

      <Button
        style={{
          position: "absolute",
          top: 10,
          left: 455,
          zIndex: 10,
        }}
        onClick={() => solve()}
        className="rounded bg-blue-600 px-4 py-2 text-sm text-white data-active:bg-blue-700 data-hover:bg-blue-500"
      >
        Solve Cube
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
