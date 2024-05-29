/*
  Warnings:

  - You are about to drop the column `profileP` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "profileP",
ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "coverPicId" DROP NOT NULL,
ALTER COLUMN "livesin" DROP NOT NULL,
ALTER COLUMN "worksAt" DROP NOT NULL;
