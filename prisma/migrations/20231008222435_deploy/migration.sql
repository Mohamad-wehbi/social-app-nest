-- CreateTable
CREATE TABLE "Stories" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "disc" TEXT NOT NULL,
    "expiresIn" BIGINT NOT NULL,
    "image" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Stories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stories" ADD CONSTRAINT "Stories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
