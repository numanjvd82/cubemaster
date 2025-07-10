"use client";

import ClassicGame from "@/components/ClassicGame";
import DailyGame from "@/components/DailyGame";
import TimeAttackGame from "@/components/TimeAttackGame";
import { GameDifficulty, GameMode } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GamePlayPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mode = searchParams.get("mode") as GameMode | null;
  const difficulty = searchParams.get("difficulty") as GameDifficulty | null;

  useEffect(() => {
    if (!mode) {
      router.push("/game/select");
      return;
    }
  }, [mode, router]);

  if (!mode) {
    return null;
  }

  switch (mode) {
    case "Classic":
      if (!difficulty) {
        router.push("/game/select");
        return null;
      }
      return <ClassicGame difficulty={difficulty} />;

    case "TimeAttack":
      return <TimeAttackGame />;

    case "Daily":
      return <DailyGame />;

    default:
      router.push("/game/select");
      return null;
  }
}
