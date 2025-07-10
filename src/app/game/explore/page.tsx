"use client";

import { Cube, CubeControls } from "@/components/game";
import { CameraControls } from "@/components/three";
import { Button } from "@headlessui/react";
import { ArrowRightIcon, PlayIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Explore() {
  const { data: session } = useSession();
  const router = useRouter();

  const handlePlayMore = () => {
    if (session) {
      router.push("/game/select");
    } else {
      router.push("/signin");
    }
  };

  return (
    <div className="font-[family-name:var(--font-geist-sans)] h-screen w-screen relative overflow-hidden bg-gradient-to-b from-indigo-900 to-black">
      {/* Play More Game Modes Button */}
      <div className="absolute top-2 right-6 z-40 text-center">
        <Button
          onClick={handlePlayMore}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600/80 hover:bg-indigo-700/90 border border-indigo-400/50 hover:border-indigo-300/70 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer text-sm"
        >
          <PlayIcon className="w-4 h-4" />
          <span>
            {session ? "Play More Game Modes" : "Sign In to Play More"}
          </span>
          <ArrowRightIcon className="w-3 h-3" />
        </Button>
      </div>

      <main className="h-full w-full flex flex-col items-center justify-center">
        <CameraControls />
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
