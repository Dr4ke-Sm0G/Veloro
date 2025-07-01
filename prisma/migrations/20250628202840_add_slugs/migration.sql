/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Model` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,brandId]` on the table `Model` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,modelId,year]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Variant` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Model_name_brandId_key";

-- DropIndex
DROP INDEX "Variant_name_modelId_year_key";

-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Variant" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Model_slug_key" ON "Model"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Model_slug_brandId_key" ON "Model"("slug", "brandId");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_slug_key" ON "Variant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_slug_modelId_year_key" ON "Variant"("slug", "modelId", "year");
