/*
  Warnings:

  - You are about to drop the column `passResetCode` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "passResetCode",
ADD COLUMN     "resetCode" INTEGER;
