/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `disc` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Story` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('SINGLE', 'MARRIED', 'SEPARATE', 'WIDOWER');

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "createdAt",
DROP COLUMN "disc",
DROP COLUMN "image",
DROP COLUMN "imageId",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "Status";

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disc" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ImageToStory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ImageToStory_AB_unique" ON "_ImageToStory"("A", "B");

-- CreateIndex
CREATE INDEX "_ImageToStory_B_index" ON "_ImageToStory"("B");

-- AddForeignKey
ALTER TABLE "_ImageToStory" ADD CONSTRAINT "_ImageToStory_A_fkey" FOREIGN KEY ("A") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageToStory" ADD CONSTRAINT "_ImageToStory_B_fkey" FOREIGN KEY ("B") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;
