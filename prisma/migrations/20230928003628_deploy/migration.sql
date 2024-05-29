/*
  Warnings:

  - Made the column `profilePicId` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `coverPicId` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bio` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `livesin` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `worksAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profilePicId" SET NOT NULL,
ALTER COLUMN "profilePicId" DROP DEFAULT,
ALTER COLUMN "coverPicId" SET NOT NULL,
ALTER COLUMN "bio" SET NOT NULL,
ALTER COLUMN "livesin" SET NOT NULL,
ALTER COLUMN "worksAt" SET NOT NULL;
