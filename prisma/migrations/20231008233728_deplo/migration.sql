/*
  Warnings:

  - Changed the type of `expiresIn` on the `Story` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Story" DROP COLUMN "expiresIn",
ADD COLUMN     "expiresIn" JSONB NOT NULL;
