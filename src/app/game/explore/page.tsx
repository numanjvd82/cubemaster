"use client";

import Cube from "@/components/Cube";
import CubeControls from "@/components/CubeControls";

export default function Explore() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)] h-screen w-screen relative overflow-hidden bg-gradient-to-b from-indigo-900 to-black">
      <main className="h-full w-full flex flex-col items-center justify-center">
        <CubeControls
          showReset={true}
          showScramble={true}
          showSolve={true}
          showFreeLook={true}
        />
        <Cube />
      </main>
    </div>
  );
}
