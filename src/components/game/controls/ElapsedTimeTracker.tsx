"use client";

import { formatTime } from "@/lib/utils";
import { ClockIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type Props = {
  startTime: number | null;
  endTime: number | null;
};

export default function ElapsedTimeTracker({ startTime, endTime }: Props) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (startTime && !endTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    } else if (endTime) {
      setElapsedTime(Math.floor((endTime - startTime!) / 1000));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTime, endTime]);

  return (
    <div className="relative">
      <motion.div
        className="bg-black/30 backdrop-blur-md rounded-xl px-6 py-3 border border-white/20 shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          {/* Timer Icon */}
          <motion.div
            className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center"
            animate={
              startTime && !endTime ? { scale: [1, 1.1, 1] } : { scale: 1 }
            }
            transition={{
              duration: 1,
              repeat: startTime && !endTime ? Infinity : 0,
            }}
          >
            <ClockIcon className="w-3 h-3" />
          </motion.div>

          {/* Timer Display */}
          <div className="flex flex-col">
            <span className="text-xs text-white/60 uppercase tracking-wider font-medium">
              {endTime ? "Final Time" : "Elapsed Time"}
            </span>

            <AnimatePresence mode="wait">
              {startTime ? (
                <motion.div
                  key={elapsedTime}
                  className="text-2xl font-bold text-white font-mono"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {formatTime(elapsedTime)}
                </motion.div>
              ) : (
                <motion.span
                  className="text-2xl font-bold text-white/50 font-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  00:00
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Status Indicator */}
          <motion.div
            className={`w-2 h-2 rounded-full ${
              endTime
                ? "bg-green-400"
                : startTime
                ? "bg-yellow-400"
                : "bg-gray-400"
            }`}
            animate={
              startTime && !endTime ? { opacity: [1, 0.3, 1] } : { opacity: 1 }
            }
            transition={{
              duration: 1,
              repeat: startTime && !endTime ? Infinity : 0,
            }}
          />
        </div>

        {startTime && !endTime && (
          <motion.div
            className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-400"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
