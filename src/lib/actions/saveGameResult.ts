"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { prisma } from "../db";

export async function saveGameResult(
  mode: string,
  time: number,
  moves: number,
  isCubeSolved: boolean
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const gameResult = await prisma.gameResult.create({
    data: {
      userId: user.id,
      timeTaken: time,
      moves: moves,
      difficulty: "Medium", // This can be dynamic based on your game logic
      mode: mode,
      status: isCubeSolved ? "Completed" : "Failed",
    },
  });

  return gameResult;
}
