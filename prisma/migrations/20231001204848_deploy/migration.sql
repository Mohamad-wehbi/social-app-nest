-- DropForeignKey
ALTER TABLE "Followers" DROP CONSTRAINT "Followers_userId_fkey";

-- DropForeignKey
ALTER TABLE "Following" DROP CONSTRAINT "Following_userId_fkey";

-- CreateTable
CREATE TABLE "_FollowingToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_FollowersToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FollowingToUser_AB_unique" ON "_FollowingToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_FollowingToUser_B_index" ON "_FollowingToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FollowersToUser_AB_unique" ON "_FollowersToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_FollowersToUser_B_index" ON "_FollowersToUser"("B");

-- AddForeignKey
ALTER TABLE "_FollowingToUser" ADD CONSTRAINT "_FollowingToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Following"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FollowingToUser" ADD CONSTRAINT "_FollowingToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FollowersToUser" ADD CONSTRAINT "_FollowersToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Followers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FollowersToUser" ADD CONSTRAINT "_FollowersToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
