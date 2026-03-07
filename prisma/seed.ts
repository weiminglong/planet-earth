import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://ubuntu:password@localhost:5432/living_flora_globe",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const tropicalRainforest = await prisma.biome.upsert({
    where: { slug: "tropical-rainforest" },
    update: {},
    create: {
      name: "Tropical Rainforest",
      slug: "tropical-rainforest",
      description:
        "Warm, wet forests near the equator with incredible biodiversity.",
      climateProfile: "Hot and humid year-round, 2000-10000mm annual rainfall",
      visualTheme: "lush-green",
    },
  });

  const mediterranean = await prisma.biome.upsert({
    where: { slug: "mediterranean" },
    update: {},
    create: {
      name: "Mediterranean",
      slug: "mediterranean",
      description:
        "Mild, wet winters and hot, dry summers with drought-adapted flora.",
      climateProfile: "Mild winters, hot dry summers, 300-900mm rainfall",
      visualTheme: "golden-warm",
    },
  });

  const amazon = await prisma.region.upsert({
    where: { slug: "amazon-basin" },
    update: {},
    create: {
      name: "Amazon Basin",
      slug: "amazon-basin",
      type: "ecoregion",
      lat: -3.4653,
      lng: -62.2159,
      summary:
        "The Amazon Basin is the largest tropical rainforest on Earth, spanning nine countries in South America.",
      climateNotes: "Equatorial climate with high humidity and rainfall",
    },
  });

  const medRegion = await prisma.region.upsert({
    where: { slug: "mediterranean-region" },
    update: {},
    create: {
      name: "Mediterranean Region",
      slug: "mediterranean-region",
      type: "ecoregion",
      lat: 38.0,
      lng: 20.0,
      summary:
        "Coastal regions surrounding the Mediterranean Sea, known for aromatic herbs and ancient olive groves.",
      climateNotes: "Warm dry summers and mild wet winters",
    },
  });

  const japan = await prisma.region.upsert({
    where: { slug: "japan" },
    update: {},
    create: {
      name: "Japan",
      slug: "japan",
      type: "country",
      lat: 36.2048,
      lng: 138.2529,
      summary:
        "An island nation with diverse flora spanning from subtropical Okinawa to subarctic Hokkaido.",
      climateNotes: "Varied from subtropical to subarctic",
    },
  });

  const victoriaAmazonica = await prisma.flora.upsert({
    where: { slug: "victoria-amazonica" },
    update: {},
    create: {
      commonName: "Giant Water Lily",
      scientificName: "Victoria amazonica",
      slug: "victoria-amazonica",
      shortDescription:
        "The largest water lily in the world, with leaves that can span over 3 meters.",
      longDescription:
        "Victoria amazonica is a species of flowering plant native to the shallow waters of the Amazon River basin. Its enormous circular leaves can grow up to 3 meters in diameter and are strong enough to support the weight of a small child. The flowers bloom white on the first night, turning pink on the second, and are pollinated by beetles attracted to their warmth and fragrance.",
      family: "Nymphaeaceae",
      genus: "Victoria",
      species: "amazonica",
      conservationStatus: "Least Concern",
      bloomSeason: "June to December",
      featured: true,
    },
  });

  const oliveTree = await prisma.flora.upsert({
    where: { slug: "olea-europaea" },
    update: {},
    create: {
      commonName: "Olive Tree",
      scientificName: "Olea europaea",
      slug: "olea-europaea",
      shortDescription:
        "An ancient and culturally significant tree that has shaped Mediterranean civilizations for millennia.",
      longDescription:
        "The olive tree is one of the oldest cultivated trees in human history, with some specimens living for over 2,000 years. Native to the Mediterranean Basin, it produces the olive fruit used for oil and food. The tree is deeply embedded in Mediterranean culture, symbolizing peace, wisdom, and prosperity across Greek, Roman, and Middle Eastern traditions.",
      family: "Oleaceae",
      genus: "Olea",
      species: "europaea",
      conservationStatus: "Least Concern",
      bloomSeason: "April to June",
      featured: true,
    },
  });

  const cherryBlossom = await prisma.flora.upsert({
    where: { slug: "prunus-serrulata" },
    update: {},
    create: {
      commonName: "Cherry Blossom",
      scientificName: "Prunus serrulata",
      slug: "prunus-serrulata",
      shortDescription:
        "Japan's iconic flowering tree, celebrated each spring during hanami festivals.",
      longDescription:
        "Prunus serrulata, commonly known as the Japanese cherry or sakura, is one of the most culturally significant plants in Japan. Each spring, millions of people gather for hanami — the traditional custom of enjoying the transient beauty of cherry blossoms. The fleeting bloom, lasting only one to two weeks, is a powerful symbol of the ephemeral nature of life in Japanese philosophy.",
      family: "Rosaceae",
      genus: "Prunus",
      species: "serrulata",
      conservationStatus: "Least Concern",
      bloomSeason: "March to May",
      featured: true,
    },
  });

  await prisma.floraRegionOccurrence.upsert({
    where: {
      floraId_regionId: {
        floraId: victoriaAmazonica.id,
        regionId: amazon.id,
      },
    },
    update: {},
    create: {
      floraId: victoriaAmazonica.id,
      regionId: amazon.id,
      isNative: true,
      isEndemic: true,
      notes: "Found in oxbow lakes and slow-moving waters of the Amazon",
    },
  });

  await prisma.floraRegionOccurrence.upsert({
    where: {
      floraId_regionId: { floraId: oliveTree.id, regionId: medRegion.id },
    },
    update: {},
    create: {
      floraId: oliveTree.id,
      regionId: medRegion.id,
      isNative: true,
      isEndemic: false,
      notes: "Cultivated throughout the Mediterranean for over 6,000 years",
    },
  });

  await prisma.floraRegionOccurrence.upsert({
    where: {
      floraId_regionId: { floraId: cherryBlossom.id, regionId: japan.id },
    },
    update: {},
    create: {
      floraId: cherryBlossom.id,
      regionId: japan.id,
      isNative: true,
      isEndemic: false,
      notes: "Found throughout Japan, especially in Tokyo, Kyoto, and Osaka",
    },
  });

  await prisma.floraBiome.upsert({
    where: {
      floraId_biomeId: {
        floraId: victoriaAmazonica.id,
        biomeId: tropicalRainforest.id,
      },
    },
    update: {},
    create: {
      floraId: victoriaAmazonica.id,
      biomeId: tropicalRainforest.id,
    },
  });

  await prisma.floraBiome.upsert({
    where: {
      floraId_biomeId: {
        floraId: oliveTree.id,
        biomeId: mediterranean.id,
      },
    },
    update: {},
    create: {
      floraId: oliveTree.id,
      biomeId: mediterranean.id,
    },
  });

  await prisma.floraFact.create({
    data: {
      floraId: victoriaAmazonica.id,
      fact: "The underside of each leaf is covered in sharp spines to protect against herbivorous fish.",
    },
  });

  await prisma.floraFact.create({
    data: {
      floraId: cherryBlossom.id,
      fact: "Japan's cherry blossom forecast (sakura-zensen) is a nationally anticipated annual event tracked by weather agencies.",
    },
  });

  console.log("Seed complete: 3 regions, 2 biomes, 3 flora entries created.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
