/*
  Warnings:

  - Made the column `coverPicUrl` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `profilePicUrl` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "coverPicUrl" SET NOT NULL,
ALTER COLUMN "profilePicUrl" SET NOT NULL;
