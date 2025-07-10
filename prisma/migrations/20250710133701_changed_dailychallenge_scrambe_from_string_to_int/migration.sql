/*
  Warnings:

  - Changed the type of `scramble` on the `DailyChallenge` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `status` to the `GameResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyChallenge" DROP COLUMN "scramble",
ADD COLUMN     "scramble" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "GameResult" ADD COLUMN     "status" TEXT NOT NULL;
