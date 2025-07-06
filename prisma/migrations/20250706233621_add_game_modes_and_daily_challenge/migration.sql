/*
  Warnings:

  - Added the required column `difficulty` to the `GameResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mode` to the `GameResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameResult" ADD COLUMN     "difficulty" TEXT NOT NULL,
ADD COLUMN     "mode" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "DailyChallenge" (
    "id" TEXT NOT NULL,
    "scramble" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyChallenge_date_key" ON "DailyChallenge"("date");
