/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `bio` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coverPicId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `livesin` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePicId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `worksAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "bio" TEXT NOT NULL,
ADD COLUMN     "coverPicId" TEXT NOT NULL,
ADD COLUMN     "coverPicUrl" TEXT NOT NULL DEFAULT 'https://flowbite.com/docs/images/examples/image-3@2x.jpg',
ADD COLUMN     "followers" JSONB[],
ADD COLUMN     "following" JSONB[],
ADD COLUMN     "livesin" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "profilePicId" TEXT NOT NULL,
ADD COLUMN     "profilePicUrl" TEXT NOT NULL DEFAULT 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png',
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "username" TEXT NOT NULL,
ADD COLUMN     "worksAt" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "disc" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "likes" JSONB[],
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "postId" INTEGER NOT NULL,
    "user" JSONB NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
