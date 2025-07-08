import { formatTime } from "@/lib/utils";
import { ClockIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "motion/react";

type Props = {
  time: number; // Time in seconds
  isCubeSolved: boolean;
};

export default function Timer({ time, isCubeSolved }: Props) {
  const shouldAnimate = time > 0 && !isCubeSolved;

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
            animate={shouldAnimate ? { scale: [1, 1.1, 1] } : { scale: 1 }}
            transition={{
              duration: 1,
              repeat: shouldAnimate ? Infinity : 0,
            }}
          >
            <ClockIcon className="w-3 h-3" />
          </motion.div>

          {/* Timer Display */}
          <div className="flex flex-col">
            <span className="text-xs text-white/60 uppercase tracking-wider font-medium">
              {isCubeSolved
                ? "Final Time"
                : time === 0
                ? "Time's Up!"
                : "Remaining Time"}
            </span>

            <AnimatePresence mode="wait">
              {time > 0 ? (
                <motion.div
                  key={time}
                  className="text-2xl font-bold text-white font-mono"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {formatTime(time)}
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
              isCubeSolved
                ? "bg-green-400"
                : time > 0
                ? "bg-yellow-400"
                : "bg-red-500"
            }`}
            animate={shouldAnimate ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
            transition={{
              duration: 1,
              repeat: shouldAnimate ? Infinity : 0,
            }}
          />
        </div>

        {shouldAnimate && (
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
