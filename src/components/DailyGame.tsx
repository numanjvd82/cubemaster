"use client";

import CameraControls from "@/components/CameraControls";
import CompletionModal from "@/components/CompletionModal";
import Confetti from "@/components/Confetti";
import Cube from "@/components/Cube";
import CubeControls from "@/components/CubeControls";
import ElapsedTimeTracker from "@/components/ElapsedTimeTracker";
import { useSound } from "@/hooks/useSound";
import { saveGameResult } from "@/lib/actions/saveGameResult";
import { useCubeStore } from "@/store/useCubeStore";
import {
  BoltIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";

export default function DailyGame() {
  const { playWinningSound } = useSound();

  const scramble = useCubeStore((s) => s.scramble);
  const moves = useCubeStore((s) => s.userMoves);
  const setMoves = useCubeStore((s) => s.setUserMoves);
  const resetCube = useCubeStore((s) => s.resetCube);
  const isCubeSolved = useCubeStore((s) => s.isCubeSolved);
  const setHistory = useCubeStore((s) => s.setHistory);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [scrambleMoves, setScrambleMoves] = useState(0);

  const handleGameSolved = useCallback(async () => {
    try {
      const result = await saveGameResult({
        mode: "Daily Challenge",
        time: Math.floor((endTime! - startTime!) / 1000), // Convert to seconds
        moves,
        isCubeSolved,
      });

      return result;
    } catch (error: any) {
      console.error("Error handling game solved:", error);
    }
  }, [endTime, startTime, moves, isCubeSolved]);

  useEffect(() => {
    const fetchDailyChallenge = async () => {
      try {
        const response = await fetch("/api/daily-challenge");

        const data = await response.json();

        setScrambleMoves(data.scrambleMoves || 50);
      } catch (error) {
        console.error("Error fetching daily challenge:", error);
      }
    };

    fetchDailyChallenge();
  }, []);

  useEffect(() => {
    // Reset and scramble cube for daily challenge
    resetCube();

    scramble(scrambleMoves);
    setMoves(0);
    setHistory([]); // Reset history

    setStartTime(Date.now());
    setEndTime(null);
    setShowCompletionModal(false);
    setShowConfetti(false);
  }, [scramble, resetCube, setMoves, scrambleMoves, setHistory]);

  useEffect(() => {
    if (isCubeSolved && startTime && !endTime) {
      setEndTime(Date.now());
      setShowConfetti(true);
      playWinningSound();
    }

    if (endTime) {
      handleGameSolved();
      const timer = setTimeout(() => {
        setShowCompletionModal(true);
      }, 3000); // 3s for confetti and sound effect

      return () => clearTimeout(timer);
    }
  }, [isCubeSolved, startTime, endTime, playWinningSound, handleGameSolved]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black/50 flex flex-col">
      {/* Header Section */}
      <div className="pt-20 pb-6 px-4 flex-shrink-0">
        <div className="flex flex-col items-center space-y-4">
          <ElapsedTimeTracker startTime={startTime} endTime={endTime} />

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
                  <span className="text-lg font-bold text-white">Daily</span>
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
