/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ImageToStory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `disc` to the `Story` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Story` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageId` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ImageToStory" DROP CONSTRAINT "_ImageToStory_A_fkey";

-- DropForeignKey
ALTER TABLE "_ImageToStory" DROP CONSTRAINT "_ImageToStory_B_fkey";

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "disc" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "imageId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Image";

-- DropTable
DROP TABLE "_ImageToStory";
