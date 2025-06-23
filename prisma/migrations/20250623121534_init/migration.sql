-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "year" INTEGER,
    "bodyType" TEXT,
    "drive" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "availableFrom" TIMESTAMP(3),
    "availableTo" TIMESTAMP(3),

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatterySpec" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "nominalCapacity" DECIMAL(65,30),
    "useableCapacity" DECIMAL(65,30),
    "batteryType" TEXT,
    "architecture" TEXT,
    "cathodeMaterial" TEXT,
    "packConfiguration" TEXT,
    "nominalVoltage" DECIMAL(65,30),
    "formFactor" TEXT,
    "warrantyPeriod" TEXT,
    "warrantyMileage" TEXT,

    CONSTRAINT "BatterySpec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChargingSpec" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "acPortType" TEXT,
    "acPowerKW" DECIMAL(65,30),
    "acChargeTime" TEXT,
    "acChargeSpeedKmH" INTEGER,
    "dcPortType" TEXT,
    "dcMaxPowerKW" DECIMAL(65,30),
    "dcPower10to80KW" DECIMAL(65,30),
    "dcChargeSpeedKmH" INTEGER,
    "portLocation" TEXT,
    "autochargeSupported" BOOLEAN,
    "plugAndChargeSupported" BOOLEAN,
    "iso15118Supported" BOOLEAN,
    "preconditioningPossible" BOOLEAN,
    "preconditioningNav" BOOLEAN,

    CONSTRAINT "ChargingSpec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceSpec" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "acceleration0100Sec" DECIMAL(65,30),
    "topSpeedKmh" INTEGER,
    "electricRangeKm" INTEGER,
    "totalPowerKw" DECIMAL(65,30),
    "totalTorqueNm" DECIMAL(65,30),
    "drive" TEXT,

    CONSTRAINT "PerformanceSpec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EfficiencySpec" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "rangeKm" INTEGER,
    "vehicleConsumptionWhKm" INTEGER,
    "ratedConsumptionWhKm" INTEGER,
    "vehicleFuelEqL100km" DECIMAL(65,30),
    "ratedFuelEqL100km" DECIMAL(65,30),
    "co2EmissionsGKm" INTEGER,

    CONSTRAINT "EfficiencySpec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RealConsumptionSpec" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "cityColdWhKm" INTEGER,
    "highwayColdWhKm" INTEGER,
    "combinedColdWhKm" INTEGER,
    "cityMildWhKm" INTEGER,
    "highwayMildWhKm" INTEGER,
    "combinedMildWhKm" INTEGER,

    CONSTRAINT "RealConsumptionSpec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DimensionSpec" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "lengthMm" INTEGER,
    "widthMm" INTEGER,
    "widthWithMirrorsMm" INTEGER,
    "heightMm" INTEGER,
    "wheelbaseMm" INTEGER,
    "weightUnladenKg" INTEGER,
    "grossVehicleWeightKg" INTEGER,
    "maxPayloadKg" INTEGER,
    "cargoVolumeL" INTEGER,
    "cargoVolumeMaxL" INTEGER,
    "frunkVolumeL" INTEGER,
    "roofLoadKg" INTEGER,
    "towHitchPossible" BOOLEAN,
    "towingWeightUnbrakedKg" INTEGER,
    "towingWeightBrakedKg" INTEGER,
    "verticalLoadMaxKg" INTEGER,
    "seats" INTEGER,
    "isofix" BOOLEAN,
    "turningCircleM" DECIMAL(65,30),
    "platform" TEXT,
    "evDedicatedPlatform" BOOLEAN,
    "carBody" TEXT,
    "segment" TEXT,
    "roofRails" BOOLEAN,
    "heatPump" BOOLEAN,

    CONSTRAINT "DimensionSpec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyRating" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "ratingYear" INTEGER,
    "adultOccupantPercent" INTEGER,
    "childOccupantPercent" INTEGER,
    "vulnerableRoadUsersPct" INTEGER,
    "safetyAssistPercent" INTEGER,

    CONSTRAINT "SafetyRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "V2XSpec" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "v2lSupported" BOOLEAN,
    "exteriorOutlet" TEXT,
    "interiorOutlet" TEXT,
    "v2hAcSupported" BOOLEAN,
    "v2hDcSupported" BOOLEAN,
    "v2gAcSupported" BOOLEAN,
    "v2gDcSupported" BOOLEAN,

    CONSTRAINT "V2XSpec_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Model_name_brandId_key" ON "Model"("name", "brandId");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_name_modelId_year_key" ON "Variant"("name", "modelId", "year");

-- CreateIndex
CREATE INDEX "Price_variantId_country_idx" ON "Price"("variantId", "country");

-- CreateIndex
CREATE UNIQUE INDEX "Availability_variantId_key" ON "Availability"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "BatterySpec_variantId_key" ON "BatterySpec"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "ChargingSpec_variantId_key" ON "ChargingSpec"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "PerformanceSpec_variantId_key" ON "PerformanceSpec"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "EfficiencySpec_variantId_key" ON "EfficiencySpec"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "RealConsumptionSpec_variantId_key" ON "RealConsumptionSpec"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "DimensionSpec_variantId_key" ON "DimensionSpec"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "SafetyRating_variantId_key" ON "SafetyRating"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "V2XSpec_variantId_key" ON "V2XSpec"("variantId");

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatterySpec" ADD CONSTRAINT "BatterySpec_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChargingSpec" ADD CONSTRAINT "ChargingSpec_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceSpec" ADD CONSTRAINT "PerformanceSpec_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EfficiencySpec" ADD CONSTRAINT "EfficiencySpec_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealConsumptionSpec" ADD CONSTRAINT "RealConsumptionSpec_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DimensionSpec" ADD CONSTRAINT "DimensionSpec_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SafetyRating" ADD CONSTRAINT "SafetyRating_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "V2XSpec" ADD CONSTRAINT "V2XSpec_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
