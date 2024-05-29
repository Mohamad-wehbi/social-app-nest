/*
  Warnings:

  - You are about to drop the column `user` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `followers` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `following` on the `User` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "user",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "likes";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "followers",
DROP COLUMN "following";

-- CreateTable
CREATE TABLE "Likes" (
    "id" SERIAL NOT NULL,
    "likedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Following" (
    "id" SERIAL NOT NULL,
    "followedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Following_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Followers" (
    "id" SERIAL NOT NULL,
    "followredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Followers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followers" ADD CONSTRAINT "Followers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
