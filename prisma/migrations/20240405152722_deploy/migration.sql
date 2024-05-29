/*
  Warnings:

  - You are about to drop the column `passResetExpires` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "passResetExpires",
ADD COLUMN     "expiresTime" TIMESTAMP(3);
