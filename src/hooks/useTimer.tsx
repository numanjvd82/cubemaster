import { useEffect, useState } from "react";

/*
 * Custom hook to manage a countdown timer.
 *
 * @param time - Initial time in seconds.
 * @param isCubeSolved - Whether the cube is solved (stops the timer).
 * @returns Remaining time in seconds.
 */
export default function useTimer(time: number, isCubeSolved: boolean = false) {
  const [remainingTime, setRemainingTime] = useState<number>(time);

  useEffect(() => {
    if (time <= 0 || isCubeSolved) {
      return;
    }

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 0 || isCubeSolved) return prev;
        return Math.max(prev - 1, 0);
      });
    }, 1000);

    if (remainingTime <= 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [time, remainingTime, isCubeSolved]);

  return remainingTime;
}
