-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passResetCode" TEXT,
ADD COLUMN     "passResetExpires" INTEGER,
ADD COLUMN     "passResetVerified" BOOLEAN,
ALTER COLUMN "role" SET DEFAULT 'USER';
