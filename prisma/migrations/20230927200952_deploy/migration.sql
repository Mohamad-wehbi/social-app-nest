/*
  Warnings:

  - You are about to drop the column `userId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `coverPicId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `coverPicUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `followers` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `following` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `livesin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `worksAt` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bio",
DROP COLUMN "coverPicId",
DROP COLUMN "coverPicUrl",
DROP COLUMN "createdAt",
DROP COLUMN "followers",
DROP COLUMN "following",
DROP COLUMN "livesin",
DROP COLUMN "profilePicId",
DROP COLUMN "profilePicUrl",
DROP COLUMN "role",
DROP COLUMN "updatedAt",
DROP COLUMN "worksAt",
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "username" DROP NOT NULL;
