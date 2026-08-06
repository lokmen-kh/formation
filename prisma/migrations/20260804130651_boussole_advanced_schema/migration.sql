-- CreateEnum
CREATE TYPE "Audience" AS ENUM ('STUDENT', 'PARENT');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'CLUB_REP';

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "durationMonths" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "oldPricePremium" DOUBLE PRECISION,
ADD COLUMN     "oldPriceStandard" DOUBLE PRECISION,
ADD COLUMN     "periodNameAr" TEXT,
ADD COLUMN     "periodNameEn" TEXT,
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "whatYouWillLearnAr" TEXT,
ADD COLUMN     "whatYouWillLearnEn" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "audience" "Audience" NOT NULL DEFAULT 'STUDENT';

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubTableBooking" (
    "id" TEXT NOT NULL,
    "clubNameAr" TEXT NOT NULL,
    "clubNameEn" TEXT NOT NULL,
    "representativeId" TEXT NOT NULL,
    "tableNumber" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "eventDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubTableBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubTableBooking" ADD CONSTRAINT "ClubTableBooking_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
