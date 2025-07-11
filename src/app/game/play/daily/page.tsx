import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import DailyGameClient from "./DailyGameClient";

// Force dynamic rendering since we use authentication
export const dynamic = "force-dynamic";

export default async function DailyGamePage() {
  const session = await requireAuth();

  if (!session || !session.user || !session.user.email) {
    redirect("/signin");
  }

  // Fetch the daily challenge data on the server
  let dailyChallenge;
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    dailyChallenge = await prisma.dailyChallenge.findFirst({
      orderBy: { date: "desc" },
    });

    if (!dailyChallenge) {
      throw new Error("Daily challenge not found");
    }
  } catch (error) {
    console.error("Error fetching daily challenge:", error);
    // Fallback to default scramble moves if there's an error
    dailyChallenge = { scramble: 50 };
  }

  return <DailyGameClient scrambleMoves={dailyChallenge.scramble} />;
}
