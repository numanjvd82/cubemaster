"use client";

import {
  ClipboardDocumentListIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Modal from "./Modal";

interface CompletionModalProps {
  isOpen: boolean;
  startTime: number;
  endTime: number;
  moves: number;
  isSolved: boolean;
}

export default function CompletionModal({
  isOpen,
  startTime,
  endTime,
  moves,
  isSolved,
}: CompletionModalProps) {
  const router = useRouter();

  return (
    <Modal isOpen={isOpen} className="text-center">
      <div className="text-6xl mb-4">{isSolved ? "🎉" : "⏰"}</div>
      <h2 className="text-3xl font-bold text-white mb-6">
        {isSolved ? "Cube Solved!" : "Time's Up!"}
      </h2>

      <div className="space-y-4 mb-8">
        {/* Final Time Card */}
        <div className="bg-black/30 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
          <div className="flex items-center justify-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isSolved ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              <ClockIcon
                className={`w-3 h-3 ${
                  isSolved ? "text-green-400" : "text-red-400"
                }`}
              />
            </div>
            <div>
              <span className="text-xs text-white/60 uppercase tracking-wider font-medium">
                {isSolved ? "Final Time" : "Time Used"}
              </span>
              <div className="text-xl font-bold text-white font-mono">
                {Math.floor((endTime - startTime) / 1000 / 60)
                  .toString()
                  .padStart(2, "0")}
                :
                {(Math.floor((endTime - startTime) / 1000) % 60)
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
        className={`w-full px-8 py-3 rounded-lg text-white font-medium transition-colors ${
          isSolved
            ? "bg-indigo-600 hover:bg-indigo-700"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {isSolved ? "Play Again" : "Try Again"}
      </button>
    </Modal>
  );
}
