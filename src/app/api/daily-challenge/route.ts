import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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

    const dailyChallenge = await prisma.dailyChallenge.findFirst({
      orderBy: { date: "desc" },
    });

    if (!dailyChallenge) {
      throw new Error("Daily challenge not found");
    }

    return NextResponse.json({
      id: dailyChallenge.id,
      date: dailyChallenge.date,
      scramble: dailyChallenge.scramble,
    });
  } catch (error) {
    console.error("Error fetching daily challenge:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily challenge" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
