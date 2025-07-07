"use client";

import { GameDifficulty, GameMode } from "@/lib/types";
import { Button } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GameSelect() {
  const router = useRouter();

  const [mode, setMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<GameDifficulty | null>(null);

  const handleStart = () => {
    if (!mode) return;

    // Redirect with query params
    const query = new URLSearchParams();
    query.set("mode", mode);
    if (mode === "Classic" && difficulty) {
      query.set("difficulty", difficulty);
    }
    router.push(`/game/play?${query.toString()}`);
  };

  return (
    <main className="w-full flex flex-col items-center justify-center gap-8 px-4 py-8 bg-gradient-to-b from-indigo-900 to-black min-h-screen">
      <div className="bg-black/50 backdrop-blur-md p-8 rounded-xl max-w-lg w-full">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Choose Game Mode
        </h1>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {["Classic", "TimeAttack", "Daily"].map((m) => (
            <Button
              key={m}
              onClick={() => setMode(m as GameMode)}
              className={`px-6 py-3 rounded-lg transition-colors ${
                mode === m
                  ? "bg-indigo-600/90 text-white"
                  : "bg-indigo-800/40 hover:bg-indigo-700/60 text-white"
              }`}
            >
              {m}
            </Button>
          ))}
        </div>

        {mode === "Classic" && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white text-center mb-4">
              Select Difficulty
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {["Easy", "Medium", "Hard"].map((d) => (
                <Button
                  key={d}
                  onClick={() => setDifficulty(d as GameDifficulty)}
                  className={`px-5 py-2 rounded-lg transition-colors ${
                    difficulty === d
                      ? "bg-indigo-600/90 text-white"
                      : "bg-indigo-800/40 hover:bg-indigo-700/60 text-white"
                  }`}
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <Button
            onClick={handleStart}
            disabled={!mode || (mode === "Classic" && !difficulty)}
            className={`px-8 py-3 rounded-lg text-lg font-medium transition-colors ${
              !mode || (mode === "Classic" && !difficulty)
                ? "bg-gray-600/50 cursor-not-allowed text-gray-300"
                : "bg-indigo-600/80 hover:bg-indigo-700/90 text-white"
            }`}
          >
            Start Game
          </Button>
        </div>
      </div>
    </main>
  );
}
