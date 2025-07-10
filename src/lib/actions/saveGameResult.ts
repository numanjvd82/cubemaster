"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { prisma } from "../db";

type Input = {
  mode: string;
  time: number;
  moves: number;
  difficulty?: string;
  isCubeSolved: boolean;
};

export async function saveGameResult(input: Input) {
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

  const { mode, time, moves, isCubeSolved } = input;
  const gameResult = await prisma.gameResult.create({
    data: {
      userId: user.id,
      mode,
      timeTaken: time,
      moves,
      difficulty: input.difficulty || "",
      status: isCubeSolved ? "solved" : "failed",
    },
  });

  return gameResult;
}
