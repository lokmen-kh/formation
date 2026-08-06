/*
  Warnings:

  - You are about to drop the column `durationMonths` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `oldPricePremium` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `oldPriceStandard` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `periodNameAr` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `periodNameEn` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `pricePremium` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `priceStandard` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "durationMonths",
DROP COLUMN "oldPricePremium",
DROP COLUMN "oldPriceStandard",
DROP COLUMN "periodNameAr",
DROP COLUMN "periodNameEn",
DROP COLUMN "pricePremium",
DROP COLUMN "priceStandard";

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "offerId" TEXT,
ALTER COLUMN "planType" SET DEFAULT 'STANDARD';

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "durationMonths" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION NOT NULL,
    "oldPrice" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
