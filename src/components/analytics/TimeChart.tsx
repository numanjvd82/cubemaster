"use client";

import { motion } from "motion/react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface GameResult {
  id: string;
  mode: string;
  time: number;
  moves: number;
  difficulty: string;
  status: string;
  createdAt: string;
}

interface TimeChartProps {
  gameResults: GameResult[];
}

interface ChartDataPoint {
  index: number;
  time: number;
  difficulty: string;
  mode: string;
  date: string;
  fullDate: string;
  moves: number;
  gameId: string;
}

export default function TimeChart({ gameResults }: TimeChartProps) {
  // Filter for completed games and sort by date
  const completedGames = gameResults
    .filter((game) => game.status === "solved")
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .slice(-10); // Show last 10 completed games

  if (completedGames.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Time Trend</h2>
        <div className="text-center text-gray-400 py-8">
          No completed games to display
        </div>
      </motion.div>
    );
  }

  // Format data for Recharts
  const chartData = completedGames.map((game, index) => ({
    index: index + 1,
    time: game.time,
    difficulty: game.difficulty || "N/A",
    mode: game.mode,
    date: new Date(game.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    fullDate: game.createdAt,
    moves: game.moves,
    gameId: game.id,
  }));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "#10B981"; // green
      case "medium":
        return "#F59E0B"; // yellow
      case "hard":
        return "#EF4444"; // red
      default:
        return "#6B7280"; // gray
    }
  };

  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: ChartDataPoint; value: number }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/80 backdrop-blur-md rounded-lg p-3 border border-white/20 text-white shadow-lg"
        >
          <p className="text-sm font-medium">{data.date}</p>
          <p className="text-green-300">{formatTime(data.time)}</p>
          <p className="text-gray-300 text-xs">
            {data.difficulty} • {data.mode}
          </p>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20"
    >
      <h2 className="text-xl font-semibold text-white mb-4">
        Time Trend (Last 10 Games)
      </h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full h-64"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.1)"
            />
            <XAxis
              dataKey="index"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255, 255, 255, 0.6)", fontSize: 12 }}
              tickFormatter={(value, index) => {
                return chartData[index]?.date || value;
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255, 255, 255, 0.6)", fontSize: 12 }}
              tickFormatter={formatTime}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="time"
              stroke="url(#timeGradient)"
              strokeWidth={3}
              dot={{ r: 4, fill: "#10B981", stroke: "white", strokeWidth: 2 }}
              activeDot={{
                r: 6,
                stroke: "white",
                strokeWidth: 2,
                fill: "#10B981",
              }}
            />
            <defs>
              <linearGradient
                id="timeGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Legend with animation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-4 flex justify-center gap-4 text-sm"
      >
        {["Easy", "Medium", "Hard"].map((difficulty, index) => (
          <motion.div
            key={difficulty}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            className="flex items-center gap-2"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getDifficultyColor(difficulty) }}
            />
            <span className="text-gray-300">{difficulty}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
