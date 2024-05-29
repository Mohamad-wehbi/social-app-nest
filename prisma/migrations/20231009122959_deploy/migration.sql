-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "noticeAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "userImg" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_NotificationToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_NotificationToUser_AB_unique" ON "_NotificationToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_NotificationToUser_B_index" ON "_NotificationToUser"("B");

-- AddForeignKey
ALTER TABLE "_NotificationToUser" ADD CONSTRAINT "_NotificationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotificationToUser" ADD CONSTRAINT "_NotificationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
