"use client";

import Cube from "@/components/Cube";
import CubeControls from "@/components/CubeControls";
import Timer from "@/components/Timer";
import { useCubeStore } from "@/store/useCubeStore";
import {
  BoltIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { randomInt } from "crypto";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function GamePlayPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mode = searchParams.get("mode");
  const difficulty = searchParams.get("difficulty");

  const scramble = useCubeStore((s) => s.scramble);
  const moves = useCubeStore((s) => s.userMoves);
  const setMoves = useCubeStore((s) => s.setUserMoves);
  const resetCube = useCubeStore((s) => s.resetCube);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  useEffect(() => {
    if (!mode) {
      router.push("/game/select");
      return;
    }

    // Reset cube and moves
    resetCube();
    setMoves(0);

    let scrambleMoves = 10;

    if (mode === "Classic") {
      scrambleMoves =
        difficulty === "Easy" ? 5 : difficulty === "Medium" ? 15 : 30;
    } else if (mode === "TimeAttack") {
      scrambleMoves = 20;
    } else if (mode === "Daily") {
      scrambleMoves = randomInt(50, 100);
    }

    scramble(scrambleMoves);

    setStartTime(Date.now());
    setEndTime(null);
  }, [mode, difficulty, router, scramble, resetCube, setMoves]);

  // Example completion detection (replace with your solved check logic)
  useEffect(() => {
    const isSolved = false; // TODO: replace with real solved check
    if (isSolved && startTime && !endTime) {
      setEndTime(Date.now());
    }
  }, [moves, startTime, endTime]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black/50 flex flex-col">
      {/* Header Section */}
      <div className="pt-20 pb-6 px-4 flex-shrink-0">
        <div className="flex flex-col items-center space-y-4">
          <Timer startTime={startTime} endTime={endTime} />

          {/* Game Info Cards */}
          <div className="flex flex-wrap justify-center gap-3">
            {/* Game Mode Card */}
            <div className="bg-black/30 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <BoltIcon className="w-3 h-3 text-purple-400" />
                </div>
                <div>
                  <span className="text-xs text-white/60 uppercase tracking-wider font-medium block">
                    Mode
                  </span>
                  <span className="text-lg font-bold text-white">{mode}</span>
                </div>
              </div>
            </div>

            {/* Difficulty Card (only for Classic mode) */}
            {mode === "Classic" && (
              <div className="bg-black/30 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20 shadow-lg">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      difficulty === "Easy"
                        ? "bg-green-500/20"
                        : difficulty === "Medium"
                        ? "bg-yellow-500/20"
                        : "bg-red-500/20"
                    }`}
                  >
                    {difficulty === "Easy" ? (
                      <CheckCircleIcon className="w-3 h-3 text-green-400" />
                    ) : difficulty === "Medium" ? (
                      <ExclamationTriangleIcon className="w-3 h-3 text-yellow-400" />
                    ) : (
                      <ExclamationCircleIcon className="w-3 h-3 text-red-400" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-white/60 uppercase tracking-wider font-medium block">
                      Difficulty
                    </span>
                    <span className="text-lg font-bold text-white">
                      {difficulty}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Moves Counter Card */}
            <div className="bg-black/30 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <ClipboardDocumentListIcon className="w-3 h-3 text-blue-400" />
                </div>
                <div>
                  <span className="text-xs text-white/60 uppercase tracking-wider font-medium block">
                    Moves
                  </span>
                  <span className="text-lg font-bold text-white font-mono">
                    {moves}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - This will take remaining space */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Cube Section - Takes most space */}
        <div className="flex-1 flex items-center justify-center px-4 relative">
          <div className="w-full h-full max-w-4xl flex justify-center items-center">
            <Cube />
          </div>

          <CubeControls
            showFreeLook={true}
            showReset={false}
            showScramble={false}
            showSolve={false}
          />
        </div>
      </div>

      {/* Completion Modal Overlay */}
      {endTime && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl text-center max-w-md mx-4 border border-white/20">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-6">Cube Solved!</h2>

            <div className="space-y-4 mb-8">
              {/* Final Time Card */}
              <div className="bg-black/30 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <ClockIcon className="w-3 h-3 text-green-400" />
                  </div>
                  <div>
                    <span className="text-xs text-white/60 uppercase tracking-wider font-medium">
                      Final Time
                    </span>
                    <div className="text-xl font-bold text-white font-mono">
                      {Math.floor((endTime - startTime!) / 1000 / 60)
                        .toString()
                        .padStart(2, "0")}
                      :
                      {(Math.floor((endTime - startTime!) / 1000) % 60)
                        .toString()
                        .padStart(2, "0")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Moves Card */}
              <div className="bg-black/30 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <ClipboardDocumentListIcon className="w-3 h-3 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-xs text-white/60 uppercase tracking-wider font-medium">
                      Total Moves
                    </span>
                    <div className="text-xl font-bold text-white font-mono">
                      {moves}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push("/game/select")}
              className="w-full px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
