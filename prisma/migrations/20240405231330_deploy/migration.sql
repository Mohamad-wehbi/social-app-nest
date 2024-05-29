/*
  Warnings:

  - You are about to drop the column `resetCode` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "resetCode",
ADD COLUMN     "passResetCode" INTEGER;
