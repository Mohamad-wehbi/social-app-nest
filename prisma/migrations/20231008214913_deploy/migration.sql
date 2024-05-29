/*
  Warnings:

  - Made the column `userId` on table `Story` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_userId_fkey";

-- DropIndex
DROP INDEX "Story_userId_key";

-- AlterTable
ALTER TABLE "Story" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "expiresIn" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
