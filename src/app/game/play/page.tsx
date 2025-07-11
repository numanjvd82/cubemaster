"use client";

import { ClassicGame, TimeAttackGame } from "@/components/game";
import { Loader } from "@/components/ui";
import { GameDifficulty, GameMode } from "@/lib/types";
import { useSession } from "next-auth/react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function GamePlayContent() {
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
  }, [mode, router]);

  if (!mode) {
    return null;
  }

  if (status === "loading") {
    return <Loader text="Loading game..." />;
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

export default function GamePlayPage() {
  return (
    <Suspense fallback={<Loader text="Loading game..." />}>
      <GamePlayContent />
    </Suspense>
  );
}
