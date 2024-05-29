/*
  Warnings:

  - Added the required column `userImg` to the `Followers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Followers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userImg` to the `Following` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Following` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Followers" ADD COLUMN     "userImg" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Following" ADD COLUMN     "userImg" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;
