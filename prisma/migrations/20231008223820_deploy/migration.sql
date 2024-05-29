/*
  Warnings:

  - You are about to drop the `Stories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Stories" DROP CONSTRAINT "Stories_userId_fkey";

-- DropTable
DROP TABLE "Stories";
