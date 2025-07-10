"use client";

import { motion } from "motion/react";

interface GameResult {
  id: string;
  mode: string;
  time: number;
  moves: number;
  difficulty: string;
  status: string;
  createdAt: string;
}

interface ProfileStatsProps {
  gameResults: GameResult[];
}

export default function ProfileStats({ gameResults }: ProfileStatsProps) {
  // Calculate statistics from game results
  const totalGames = gameResults.length;
  const solvedGames = gameResults.filter(
    (game) => game.status === "solved"
  ).length;
  const winRate =
    totalGames > 0 ? Math.round((solvedGames / totalGames) * 100) : 0;

  // Calculate average solving time for completed games
  const completedGames = gameResults.filter((game) => game.status === "solved");
  const averageTime =
    completedGames.length > 0
      ? Math.round(
          completedGames.reduce((sum, game) => sum + Math.round(game.time), 0) /
            completedGames.length
        )
      : 0;

  // Calculate average moves for completed games
  const averageMoves =
    completedGames.length > 0
      ? Math.round(
          completedGames.reduce((sum, game) => sum + game.moves, 0) /
            completedGames.length
        )
      : 0;

  // Get best time (fastest completion)
  const bestTime =
    completedGames.length > 0
      ? Math.min(...completedGames.map((game) => Math.round(game.time)))
      : 0;

  // Get best moves (fewest moves)
  const bestMoves =
    completedGames.length > 0
      ? Math.min(...completedGames.map((game) => game.moves))
      : 0;

  // Calculate mode breakdown
  const modeStats = gameResults.reduce((acc, game) => {
    if (!acc[game.mode]) {
      acc[game.mode] = { total: 0, solved: 0 };
    }
    acc[game.mode].total++;
    if (game.status === "solved") {
      acc[game.mode].solved++;
    }
    return acc;
  }, {} as Record<string, { total: number; solved: number }>);

  // Calculate difficulty breakdown
  const difficultyStats = gameResults.reduce((acc, game) => {
    if (!game.difficulty && game.mode === "Daily Challenge") {
      game.difficulty = "Daily Challenge"; // Handle missing difficulty
    }
    if (!game.difficulty) {
      game.difficulty = "Time Attack"; // Default for games without difficulty
    }
    if (!acc[game.difficulty]) {
      acc[game.difficulty] = { total: 0, solved: 0 };
    }
    acc[game.difficulty].total++;
    if (game.status === "solved") {
      acc[game.difficulty].solved++;
    }
    return acc;
  }, {} as Record<string, { total: number; solved: number }>);

  console.log(difficultyStats);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: totalGames, label: "Total Games", color: "text-cyan-300" },
            { value: solvedGames, label: "Solved", color: "text-green-300" },
            {
              value: `${winRate}%`,
              label: "Win Rate",
              color: "text-yellow-300",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className={`text-2xl font-bold ${stat.color}`}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Performance Stats */}
      {completedGames.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Performance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                value: formatTime(averageTime),
                label: "Avg Time",
                color: "text-blue-300",
              },
              {
                value: formatTime(bestTime),
                label: "Best Time",
                color: "text-green-300",
              },
              {
                value: averageMoves,
                label: "Avg Moves",
                color: "text-orange-300",
              },
              { value: bestMoves, label: "Best Moves", color: "text-red-300" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="text-center"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className={`text-2xl font-bold ${stat.color}`}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Game Modes */}
      {Object.keys(modeStats).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Game Modes</h2>
          <div className="space-y-3">
            {Object.entries(modeStats).map(([mode, stats], index) => (
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                className="flex justify-between items-center"
              >
                <span className="text-gray-300">{mode}</span>
                <div className="flex items-center gap-4">
                  <span className="text-white">
                    {stats.solved}/{stats.total}
                  </span>
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          stats.total > 0
                            ? (stats.solved / stats.total) * 100
                            : 0
                        }%`,
                      }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.2 }}
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-10">
                    {stats.total > 0
                      ? Math.round((stats.solved / stats.total) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Difficulty Breakdown */}
      {Object.keys(difficultyStats).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Difficulty Breakdown
          </h2>
          <div className="space-y-3">
            {Object.entries(difficultyStats).map(
              ([difficulty, stats], index) => (
                <motion.div
                  key={difficulty}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                  className="flex justify-between items-center"
                >
                  <span className="text-gray-300">{difficulty}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-white">
                      {stats.solved}/{stats.total}
                    </span>
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            stats.total > 0
                              ? (stats.solved / stats.total) * 100
                              : 0
                          }%`,
                        }}
                        transition={{ duration: 1, delay: 1.0 + index * 0.2 }}
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-10">
                      {stats.total > 0
                        ? Math.round((stats.solved / stats.total) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
