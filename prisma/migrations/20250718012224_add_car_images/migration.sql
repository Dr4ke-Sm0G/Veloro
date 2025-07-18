/*
  Warnings:

  - You are about to drop the column `publicVisibility` on the `Variant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "publicVisibility";

-- CreateTable
CREATE TABLE "CarImage" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CarImage_variantId_idx" ON "CarImage"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "CarImage_variantId_order_key" ON "CarImage"("variantId", "order");

-- AddForeignKey
ALTER TABLE "CarImage" ADD CONSTRAINT "CarImage_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
