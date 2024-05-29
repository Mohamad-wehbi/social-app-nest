/*
  Warnings:

  - You are about to alter the column `expiresIn` on the `Story` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Story" ALTER COLUMN "expiresIn" SET DATA TYPE INTEGER;
