/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Story` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_userId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Story_userId_key" ON "Story"("userId");

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
