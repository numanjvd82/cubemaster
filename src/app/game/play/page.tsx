"use client";

import { ClassicGame, TimeAttackGame } from "@/components/game";
import { GameDifficulty, GameMode } from "@/lib/types";
import { useSession } from "next-auth/react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GamePlayPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();

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

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect("/signin");
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
      router.push("/game/play/daily");
      return null;

    default:
      router.push("/game/select");
      return null;
  }
}
