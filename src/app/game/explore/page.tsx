"use client";

import Cube from "@/components/Cube";
import CubeControls from "@/components/CubeControls";
import { Button } from "@headlessui/react";
import { ArrowRightIcon, PlayIcon } from "@heroicons/react/24/outline";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Explore() {
  const { data: session } = useSession();
  const router = useRouter();

  const handlePlayMore = () => {
    if (session) {
      router.push("/game/select");
    } else {
      signIn("google");
    }
  };

  return (
    <div className="font-[family-name:var(--font-geist-sans)] h-screen w-screen relative overflow-hidden bg-gradient-to-b from-indigo-900 to-black">
      {/* Login prompt for more game modes */}
      {!session && (
        <div className="absolute top-2 right-6 z-40 text-center bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-2xl max-w-xs">
          <h2 className="text-lg font-bold text-white mb-2">
            Unlock More Game Modes
          </h2>
          <p className="text-white/70 mb-3 text-xs">
            Sign in to access Time Attack, Daily Challenges, track your
            progress, and compete on leaderboards!
          </p>
          <Button
            onClick={handlePlayMore}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600/80 hover:bg-indigo-700/90 border border-indigo-400/50 hover:border-indigo-300/70 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer mx-auto text-sm"
          >
            <PlayIcon className="w-4 h-4" />
            <span>Sign In & Play More</span>
            <ArrowRightIcon className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Existing game for logged in users */}
      {session && (
        <div className="absolute top-2 right-6 z-40 text-center">
          <Button
            onClick={() => router.push("/game/select")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600/80 hover:bg-indigo-700/90 border border-indigo-400/50 hover:border-indigo-300/70 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer text-sm"
          >
            <PlayIcon className="w-4 h-4" />
            <span>Play More Game Modes</span>
            <ArrowRightIcon className="w-3 h-3" />
          </Button>
        </div>
      )}

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
