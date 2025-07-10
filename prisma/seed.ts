import { PrismaClient } from "@/generated/prisma";

const primsa = new PrismaClient();

async function main() {
  // Create a daily challenge
  const today = new Date().toISOString();
  const scrambleMoves = Math.floor(Math.random() * 51) + 50; // Random moves between 50 and 100
  const dailyChallenge = await primsa.dailyChallenge.create({
    data: {
      date: today,
      scramble: scrambleMoves,
    },
  });

  console.log(
    `Daily challenge for ${today} created with ${scrambleMoves} moves.`
  );

  return dailyChallenge;
}

main()
  .then(() => {
    console.log("Seeding completed successfully.");
  })
  .catch((e) => {
    console.error("Error during seeding:", e);
  })
  .finally(async () => {
    await primsa.$disconnect();
  });
