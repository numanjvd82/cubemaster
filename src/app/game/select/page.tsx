"use client";

import { PatternOverlay } from "@/components/landing/PatternOverlay";
import { GameDifficulty, GameMode } from "@/lib/types";
import { Button } from "@headlessui/react";
import {
  BoltIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GameSelect() {
  const router = useRouter();

  const [mode, setMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<GameDifficulty | null>(null);

  const handleStart = () => {
    if (!mode) return;

    const query = new URLSearchParams();
    query.set("mode", mode);
    if (mode === "Classic" && difficulty) {
      query.set("difficulty", difficulty);
    }
    router.push(`/game/play?${query.toString()}`);
  };

  return (
    <PatternOverlay pattern="squares" opacity={0.08}>
      <main className="w-full flex flex-col items-center justify-center gap-8 p-4  bg-gradient-to-b from-indigo-900 to-black/50 min-h-screen">
        <div className="bg-black/30 backdrop-blur-md p-8 rounded-xl max-w-2xl w-full border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Choose Game Mode
            </h1>
            <p className="text-white/70">
              Select your preferred game mode and difficulty
            </p>
          </div>

          {/* Game Mode Selection */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BoltIcon className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-semibold text-white">Game Mode</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  key: "Classic",
                  label: "Classic",
                  desc: "Traditional cube solving",
                },
                {
                  key: "TimeAttack",
                  label: "Time Attack",
                  desc: "Race against the clock",
                },
                { key: "Daily", label: "Daily", desc: "Daily challenge" },
              ].map((m) => (
                <Button
                  key={m.key}
                  onClick={() => setMode(m.key as GameMode)}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    mode === m.key
                      ? "bg-indigo-600/80 border-indigo-400/50 text-white shadow-lg transform scale-105"
                      : "bg-black/20 border-white/20 hover:bg-indigo-800/30 hover:border-indigo-400/30 text-white/90"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold mb-1">{m.label}</div>
                    <div className="text-sm text-white/70">{m.desc}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection (only for Classic mode) */}
          {mode === "Classic" && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-semibold text-white">
                  Difficulty Level
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: "Easy", label: "Easy", desc: "5 scramble moves" },
                  { key: "Medium", label: "Medium", desc: "15 scramble moves" },
                  { key: "Hard", label: "Hard", desc: "30 scramble moves" },
                ].map((d) => {
                  const isSelected = difficulty === d.key;
                  const getColors = () => {
                    if (d.key === "Easy") {
                      return {
                        selected: "bg-green-600/20 border-green-400/50",
                        icon: "bg-green-500/20",
                        iconColor: "text-green-400",
                      };
                    } else if (d.key === "Medium") {
                      return {
                        selected: "bg-yellow-600/20 border-yellow-400/50",
                        icon: "bg-yellow-500/20",
                        iconColor: "text-yellow-400",
                      };
                    } else {
                      return {
                        selected: "bg-red-600/20 border-red-400/50",
                        icon: "bg-red-500/20",
                        iconColor: "text-red-400",
                      };
                    }
                  };

                  const colors = getColors();
                  const IconComponent =
                    d.key === "Easy"
                      ? CheckCircleIcon
                      : d.key === "Medium"
                      ? ExclamationTriangleIcon
                      : ExclamationCircleIcon;

                  return (
                    <Button
                      key={d.key}
                      onClick={() => setDifficulty(d.key as GameDifficulty)}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        isSelected
                          ? `${colors.selected} text-white shadow-lg transform scale-105`
                          : "bg-black/20 border-white/20 hover:bg-white/10 hover:border-white/30 text-white/90"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full ${colors.icon} flex items-center justify-center`}
                        >
                          <IconComponent
                            className={`w-4 h-4 ${colors.iconColor}`}
                          />
                        </div>
                        <div className="text-left">
                          <div className="font-bold">{d.label}</div>
                          <div className="text-sm text-white/70">{d.desc}</div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Start Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleStart}
              disabled={!mode || (mode === "Classic" && !difficulty)}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-medium transition-all duration-200 ${
                !mode || (mode === "Classic" && !difficulty)
                  ? "bg-gray-600/30 border border-gray-500/30 cursor-not-allowed text-gray-400"
                  : "bg-indigo-600/80 hover:bg-indigo-700/90 border border-indigo-400/50 hover:border-indigo-300/70 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
              }`}
            >
              <PlayIcon className="w-5 h-5" />
              Start Game
            </Button>
          </div>
        </div>
      </main>
    </PatternOverlay>
  );
}
