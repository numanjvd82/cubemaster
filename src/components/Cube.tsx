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
      <div className="absolute top-20 left-0 right-0 flex flex-wrap justify-center gap-2 px-4 z-10">
        <Button
          onClick={() => undo()}
          disabled={!canUndo}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600/80 hover:bg-indigo-700/80 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Undo
        </Button>

        <Button
          onClick={() => redo()}
          disabled={!canRedo}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600/80 hover:bg-indigo-700/80 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Redo
        </Button>

        <Button
          onClick={() => resetCube()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600/80 hover:bg-indigo-700/80 rounded-lg text-white transition-colors"
        >
          Reset Cube
        </Button>

        <Button
          onClick={() => scramble(10)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600/80 hover:bg-indigo-700/80 rounded-lg text-white transition-colors"
        >
          Scramble Cube
        </Button>

        <Button
          onClick={() => solve()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600/80 hover:bg-indigo-700/80 rounded-lg text-white transition-colors"
        >
          Solve Cube
        </Button>

        <Button
          onClick={() => setFreeLook(!freeLook)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600/80 hover:bg-indigo-700/80 rounded-lg text-white transition-colors"
        >
          {freeLook ? "🚫 Exit Free Look" : "🧭 Enter Free Look"}
        </Button>
      </div>

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
