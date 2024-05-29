/*
  Warnings:

  - You are about to drop the column `text` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `userImg` on the `Followers` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Followers` table. All the data in the column will be lost.
  - You are about to drop the column `userImg` on the `Following` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Following` table. All the data in the column will be lost.
  - You are about to drop the column `disc` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `disc` on the `Story` table. All the data in the column will be lost.
  - Added the required column `desc` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desc` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desc` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "text",
ADD COLUMN     "desc" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Followers" DROP COLUMN "userImg",
DROP COLUMN "username";

-- AlterTable
ALTER TABLE "Following" DROP COLUMN "userImg",
DROP COLUMN "username";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "disc",
ADD COLUMN     "desc" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "disc",
ADD COLUMN     "desc" TEXT NOT NULL;
