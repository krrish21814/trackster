/*
  Warnings:

  - Added the required column `type` to the `Medal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medal" ADD COLUMN     "type" "MedalType" NOT NULL;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "completedAt" DROP NOT NULL;
