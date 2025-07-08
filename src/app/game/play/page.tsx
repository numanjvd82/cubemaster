"use client";

import CompletionModal from "@/components/CompletionModal";
import Confetti from "@/components/Confetti";
import Cube from "@/components/Cube";
import CubeControls from "@/components/CubeControls";
import ElapsedTimeTracker from "@/components/ElapsedTimeTracker";
import Timer from "@/components/Timer";
import { useSound } from "@/hooks/useSound";
import useTimer from "@/hooks/useTimer";
import { GameDifficulty, GameMode } from "@/lib/types";
import { useCubeStore } from "@/store/useCubeStore";
import {
  BoltIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const DEFAULT_TIME = 60 * 2; // 2 minutes in seconds

export default function GamePlayPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mode = searchParams.get("mode") as GameMode | null;
  const difficulty = searchParams.get("difficulty") as GameDifficulty | null;

  const scramble = useCubeStore((s) => s.scramble);
  const moves = useCubeStore((s) => s.userMoves);
  const setMoves = useCubeStore((s) => s.setUserMoves);
  const resetCube = useCubeStore((s) => s.resetCube);
  const isCubeSolved = useCubeStore((s) => s.isCubeSolved);

  const remainingTime = useTimer(DEFAULT_TIME, isCubeSolved);
  const { playWinningSound, playTickingSound, playUrgentSound } = useSound();

  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!mode) {
      router.push("/game/select");
      return;
    }

    // Reset cube
    resetCube();

    let scrambleMoves = 10;

    if (mode === "Classic") {
      scrambleMoves =
        difficulty === "Easy" ? 5 : difficulty === "Medium" ? 15 : 30;
    } else if (mode === "TimeAttack") {
      scrambleMoves = 20;
    } else if (mode === "Daily") {
      scrambleMoves = Math.random() * (100 - 50) + 50; // Random between 50 and 100
    }

    scramble(scrambleMoves);
    setMoves(0);

    setStartTime(Date.now());
    setEndTime(null);
  }, [mode, difficulty, router, scramble, resetCube, setMoves]);

  useEffect(() => {
    if (isCubeSolved && startTime && !endTime) {
      setEndTime(Date.now());
      setShowConfetti(true);
      playWinningSound();
    }
    setTimeout(() => {
      if (endTime) {
        setShowCompletionModal(true);
      }
    }, 3000); // 3s is the duration for confetti and sound effect
  }, [isCubeSolved, startTime, endTime, playWinningSound]);

  // Sound effect for urgent timer
  useEffect(() => {
    if (mode === "TimeAttack") {
      if (remainingTime <= 10 && remainingTime > 0 && !isCubeSolved) {
        playUrgentSound();
      } else if (remainingTime > 10) {
        playTickingSound();
      }
    }
  }, [remainingTime, mode, isCubeSolved, playUrgentSound, playTickingSound]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black/50 flex flex-col">
      {/* Header Section */}
      <div className="pt-20 pb-6 px-4 flex-shrink-0">
        <div className="flex flex-col items-center space-y-4">
          {mode === "Classic" || mode === "Daily" ? (
            <ElapsedTimeTracker startTime={startTime} endTime={endTime} />
          ) : null}
          {mode === "TimeAttack" && (
            <Timer time={remainingTime} isCubeSolved={isCubeSolved} />
          )}

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

      <Cube />

      <CubeControls
        showFreeLook={true}
        showReset={false}
        showScramble={false}
        showSolve={true}
      />

      <Confetti isActive={showConfetti} />

      <CompletionModal
        isOpen={showCompletionModal}
        startTime={startTime!}
        endTime={endTime!}
        moves={moves}
      />
    </div>
  );
}
