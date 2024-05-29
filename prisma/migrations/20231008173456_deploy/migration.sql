-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_userId_fkey";

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
