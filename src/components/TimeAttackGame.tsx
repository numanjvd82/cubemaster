"use client";

import CameraControls from "@/components/CameraControls";
import CompletionModal from "@/components/CompletionModal";
import Confetti from "@/components/Confetti";
import Cube from "@/components/Cube";
import CubeControls from "@/components/CubeControls";
import Timer from "@/components/Timer";
import { useSound } from "@/hooks/useSound";
import useTimer from "@/hooks/useTimer";
import { saveGameResult } from "@/lib/actions/saveGameResult";
import { useCubeStore } from "@/store/useCubeStore";
import {
  BoltIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";

const DEFAULT_TIME = 60 * 2; // 2 minutes in seconds

export default function TimeAttackGame() {
  const { playWinningSound, playTickingSound, playUrgentSound } = useSound();

  const scramble = useCubeStore((s) => s.scramble);
  const moves = useCubeStore((s) => s.userMoves);
  const setMoves = useCubeStore((s) => s.setUserMoves);
  const resetCube = useCubeStore((s) => s.resetCube);
  const isCubeSolved = useCubeStore((s) => s.isCubeSolved);
  const setHistory = useCubeStore((s) => s.setHistory);

  const remainingTime = useTimer(DEFAULT_TIME, isCubeSolved);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleGameSolved = useCallback(async () => {
    try {
      const result = await saveGameResult({
        mode: "Time Attack",
        time: isCubeSolved
          ? Math.floor((endTime! - startTime!) / 1000) // Convert to seconds
          : DEFAULT_TIME,
        moves,
        isCubeSolved,
      });

      return result;
    } catch (error: any) {
      console.error("Error handling game solved:", error);
    }
  }, [endTime, startTime, moves, isCubeSolved]);

  useEffect(() => {
    resetCube();
    scramble(20); // Fixed 20 moves for time attack
    setMoves(0);
    setHistory([]); // Reset history

    setStartTime(Date.now());
    setEndTime(null);
    setShowCompletionModal(false);
    setShowConfetti(false);
  }, [scramble, resetCube, setMoves, setHistory]);

  // Handle cube solved
  useEffect(() => {
    if (isCubeSolved && startTime && !endTime) {
      setEndTime(Date.now());
      setShowConfetti(true);
      playWinningSound();
    }

    if (endTime && isCubeSolved) {
      handleGameSolved();
      const timer = setTimeout(() => {
        setShowCompletionModal(true);
      }, 3000); // 3s for confetti and sound effect

      return () => clearTimeout(timer);
    }
  }, [isCubeSolved, startTime, endTime, playWinningSound, handleGameSolved]);

  // Handle timer running out
  useEffect(() => {
    if (remainingTime === 0 && !isCubeSolved && !endTime) {
      // Set endTime to startTime + DEFAULT_TIME to show full time was used
      setEndTime(startTime! + DEFAULT_TIME * 1000);
      setShowConfetti(false);
      playUrgentSound();
      handleGameSolved();
      setTimeout(() => {
        setShowCompletionModal(true);
      }, 1000);
    }
  }, [
    remainingTime,
    isCubeSolved,
    endTime,
    startTime,
    playUrgentSound,
    handleGameSolved,
  ]);

  // Sound effects for urgent timer
  useEffect(() => {
    if (remainingTime <= 10 && remainingTime > 0 && !isCubeSolved) {
      playUrgentSound();
    } else if (
      remainingTime > 10 &&
      remainingTime <= 30 &&
      remainingTime % 5 === 0 &&
      !isCubeSolved
    ) {
      playTickingSound();
    }
  }, [remainingTime, isCubeSolved, playUrgentSound, playTickingSound]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black/50 flex flex-col">
      {/* Header Section */}
      <div className="pt-20 pb-6 px-4 flex-shrink-0">
        <div className="flex flex-col items-center space-y-4">
          <Timer time={remainingTime} isCubeSolved={isCubeSolved} />

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
                  <span className="text-lg font-bold text-white">
                    Time Attack
                  </span>
                </div>
              </div>
            </div>

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

      <CameraControls className="top-18" />
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
        isSolved={isCubeSolved}
      />
    </div>
  );
}
