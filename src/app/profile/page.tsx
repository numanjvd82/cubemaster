import { MovesChart, ProfileStats, TimeChart } from "@/components/analytics";
import { requireAuth } from "@/lib/auth-utils";
import { Button } from "@headlessui/react";
import Link from "next/link";

interface GameResult {
  id: string;
  mode: string;
  time: number;
  moves: number;
  difficulty: string;
  status: string;
  createdAt: string;
}

interface ProfileData {
  profile: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
  gameResults: GameResult[];
}

async function fetchProfileData(): Promise<ProfileData> {
  const session = await requireAuth();

  if (!session.user?.email) {
    throw new Error("User email not found");
  }

  const { prisma } = await import("@/lib/db");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const gameResults = await prisma.gameResult.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50, // Get more results for better statistics
  });

  return {
    profile: {
      name: user.name,
      email: user.email,
      image: user.image,
    },
    gameResults: gameResults.map((result) => ({
      id: result.id,
      mode: result.mode,
      time: result.timeTaken,
      moves: result.moves,
      difficulty: result.difficulty,
      status: result.status,
      createdAt: result.createdAt.toISOString(),
    })),
  };
}

export default async function ProfilePage() {
  // Auth check is handled in fetchProfileData
  let profileData: ProfileData | null = null;
  let error: string | null = null;

  try {
    profileData = await fetchProfileData();
  } catch (err) {
    console.error("Error fetching profile data:", err);
    error = "Failed to load profile data";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-md rounded-lg p-6 border border-red-500/30 mb-8">
            <div className="text-red-200">
              <h2 className="text-lg font-semibold mb-2">
                Error Loading Profile
              </h2>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end mb-8">
          <Link href="/game/select">
            <Button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 mb-4">
              Play Now
            </Button>
          </Link>
        </div>

        {/* Profile Content */}
        {profileData && (
          <div className="space-y-8">
            {/* Stats Section */}
            <div>
              <ProfileStats gameResults={profileData.gameResults} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MovesChart gameResults={profileData.gameResults} />
              <TimeChart gameResults={profileData.gameResults} />
            </div>
          </div>
        )}

        {/* No Data State */}
        {profileData && profileData.gameResults.length === 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 text-center">
            <div className="text-gray-300">
              <h2 className="text-xl font-semibold mb-4">No Games Yet</h2>
              <p className="mb-4">
                You haven&apos;t played any games yet. Start solving some cubes
                to see your statistics!
              </p>
              <a
                href="/game/select"
                className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                Start Playing
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
