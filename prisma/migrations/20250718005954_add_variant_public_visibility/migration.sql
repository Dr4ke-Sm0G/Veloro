/*
  Warnings:

  - You are about to drop the column `visibility` on the `Variant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "visibility",
ADD COLUMN     "publicVisibility" JSONB;
