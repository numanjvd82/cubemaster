"use client";

import { ClassicGame, DailyGame, TimeAttackGame } from "@/components/game";
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
  }, [mode]);

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
