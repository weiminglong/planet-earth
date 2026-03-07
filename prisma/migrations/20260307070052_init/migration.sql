-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "parentRegionId" TEXT,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "summary" TEXT NOT NULL,
    "climateNotes" TEXT,
    "heroImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flora" (
    "id" TEXT NOT NULL,
    "commonName" TEXT NOT NULL,
    "scientificName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "family" TEXT,
    "genus" TEXT,
    "species" TEXT,
    "conservationStatus" TEXT,
    "bloomSeason" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Biome" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "climateProfile" TEXT,
    "visualTheme" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Biome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FloraRegionOccurrence" (
    "id" TEXT NOT NULL,
    "floraId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "abundanceScore" DOUBLE PRECISION,
    "isNative" BOOLEAN NOT NULL DEFAULT true,
    "isEndemic" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "FloraRegionOccurrence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FloraBiome" (
    "id" TEXT NOT NULL,
    "floraId" TEXT NOT NULL,
    "biomeId" TEXT NOT NULL,

    CONSTRAINT "FloraBiome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FloraFact" (
    "id" TEXT NOT NULL,
    "floraId" TEXT NOT NULL,
    "fact" TEXT NOT NULL,

    CONSTRAINT "FloraFact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FloraCulturalNote" (
    "id" TEXT NOT NULL,
    "floraId" TEXT NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "FloraCulturalNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "credit" TEXT,
    "license" TEXT,
    "floraId" TEXT,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "floraId" TEXT,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Region_slug_key" ON "Region"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Flora_slug_key" ON "Flora"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Biome_slug_key" ON "Biome"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "FloraRegionOccurrence_floraId_regionId_key" ON "FloraRegionOccurrence"("floraId", "regionId");

-- CreateIndex
CREATE UNIQUE INDEX "FloraBiome_floraId_biomeId_key" ON "FloraBiome"("floraId", "biomeId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_parentRegionId_fkey" FOREIGN KEY ("parentRegionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloraRegionOccurrence" ADD CONSTRAINT "FloraRegionOccurrence_floraId_fkey" FOREIGN KEY ("floraId") REFERENCES "Flora"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloraRegionOccurrence" ADD CONSTRAINT "FloraRegionOccurrence_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloraBiome" ADD CONSTRAINT "FloraBiome_floraId_fkey" FOREIGN KEY ("floraId") REFERENCES "Flora"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloraBiome" ADD CONSTRAINT "FloraBiome_biomeId_fkey" FOREIGN KEY ("biomeId") REFERENCES "Biome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloraFact" ADD CONSTRAINT "FloraFact_floraId_fkey" FOREIGN KEY ("floraId") REFERENCES "Flora"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloraCulturalNote" ADD CONSTRAINT "FloraCulturalNote_floraId_fkey" FOREIGN KEY ("floraId") REFERENCES "Flora"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_floraId_fkey" FOREIGN KEY ("floraId") REFERENCES "Flora"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_floraId_fkey" FOREIGN KEY ("floraId") REFERENCES "Flora"("id") ON DELETE CASCADE ON UPDATE CASCADE;
