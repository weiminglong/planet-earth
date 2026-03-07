import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://ubuntu:password@localhost:5432/living_flora_globe",
});
const prisma = new PrismaClient({ adapter });

type SeedBiome = {
  name: string;
  slug: string;
  description: string;
  climateProfile: string;
  visualTheme: string;
};

type SeedRegion = {
  name: string;
  slug: string;
  type: string;
  lat: number;
  lng: number;
  summary: string;
  climateNotes: string;
  parentSlug?: string;
};

type SeedFlora = {
  commonName: string;
  scientificName: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  family: string;
  genus: string;
  species: string;
  conservationStatus: string;
  bloomSeason: string;
  featured: boolean;
  regionSlug: string;
  biomeSlugs: string[];
  native: boolean;
  endemic: boolean;
  occurrenceNotes: string;
  facts: string[];
  culturalNotes: string[];
};

const biomes: SeedBiome[] = [
  {
    name: "Tropical Rainforest",
    slug: "tropical-rainforest",
    description:
      "Warm, wet forests near the equator with year-round growth and exceptional biodiversity.",
    climateProfile: "Hot and humid year-round, typically 2000-10000mm annual rainfall",
    visualTheme: "lush-green",
  },
  {
    name: "Wetland",
    slug: "wetland",
    description:
      "Flooded or seasonally saturated landscapes that support floating, rooted, and moisture-loving plants.",
    climateProfile: "Standing or slow-moving water, frequent flooding, nutrient-rich soils",
    visualTheme: "teal-wetland",
  },
  {
    name: "Cloud Forest",
    slug: "cloud-forest",
    description:
      "Mist-wrapped mountain forests where frequent fog shapes lush mosses, orchids, and medicinal trees.",
    climateProfile: "Cool to mild temperatures, persistent fog, high humidity",
    visualTheme: "misty-violet",
  },
  {
    name: "Mediterranean",
    slug: "mediterranean",
    description:
      "Mild, wet winters and hot, dry summers favoring aromatic, drought-adapted flora.",
    climateProfile: "Mild winters, hot dry summers, 300-900mm rainfall",
    visualTheme: "golden-warm",
  },
  {
    name: "Temperate Forest",
    slug: "temperate-forest",
    description:
      "Seasonal woodlands with layered canopies, rich leaf litter, and dramatic spring and autumn change.",
    climateProfile: "Distinct seasons, moderate rainfall, fertile forest soils",
    visualTheme: "indigo-night",
  },
  {
    name: "Alpine",
    slug: "alpine",
    description:
      "High-elevation landscapes with intense sunlight, cold nights, and short, brilliant growing seasons.",
    climateProfile: "Thin air, cold temperatures, snowmelt-fed moisture, rocky soils",
    visualTheme: "crimson-alpine",
  },
  {
    name: "Fynbos Shrubland",
    slug: "fynbos-shrubland",
    description:
      "A fire-adapted South African shrubland famed for proteas, restios, and extraordinarily high endemism.",
    climateProfile: "Winter rainfall, dry summers, nutrient-poor soils, periodic fire",
    visualTheme: "sunset-fynbos",
  },
  {
    name: "Seasonal Dry Forest",
    slug: "seasonal-dry-forest",
    description:
      "Tropical woodlands with pronounced wet and dry seasons that reward water-storing and drought-deciduous plants.",
    climateProfile: "Long dry season, short wet season, heat-adapted flora",
    visualTheme: "earth-desert",
  },
  {
    name: "Desert Steppe",
    slug: "desert-steppe",
    description:
      "Arid open landscapes where ancient, highly specialized plants survive on fog, dew, and infrequent rain.",
    climateProfile: "Extremely low rainfall, intense sun, large day-night temperature swings",
    visualTheme: "earth-desert",
  },
];

const continents: SeedRegion[] = [
  {
    name: "South America",
    slug: "south-america",
    type: "continent",
    lat: -15,
    lng: -60,
    summary:
      "A continent of rainforests, Andes summits, wetlands, and botanical lineages shaped by altitude and water.",
    climateNotes: "Tropical, temperate, alpine, and arid climates coexist across dramatic elevation shifts",
  },
  {
    name: "Europe",
    slug: "europe",
    type: "continent",
    lat: 54,
    lng: 15,
    summary:
      "A patchwork of temperate forests, coastlines, and cultural landscapes where cultivated plants became civilizational symbols.",
    climateNotes: "Predominantly temperate with Mediterranean warmth in the south and cooler maritime zones in the west",
  },
  {
    name: "Asia",
    slug: "asia",
    type: "continent",
    lat: 34,
    lng: 95,
    summary:
      "An immense continent spanning monsoon forests, island archipelagos, and some of the highest mountains on Earth.",
    climateNotes: "Ranges from humid subtropical coasts to alpine and continental interiors",
  },
  {
    name: "Africa",
    slug: "africa",
    type: "continent",
    lat: 2,
    lng: 20,
    summary:
      "A continent of deserts, island endemism, and biodiversity hotspots where climatic extremes shape iconic flora.",
    climateNotes: "Includes equatorial humidity, Mediterranean winter-rainfall, and hyper-arid coastal deserts",
  },
  {
    name: "Oceania",
    slug: "oceania",
    type: "continent",
    lat: -24,
    lng: 140,
    summary:
      "Island-rich southern landscapes where isolation has produced distinctive forests, shrubs, and fern lineages.",
    climateNotes: "Ranges from cool maritime forests to warm eucalyptus-dominated woodlands",
  },
];

const regions: SeedRegion[] = [
  {
    name: "Amazon Basin",
    slug: "amazon-basin",
    type: "ecoregion",
    parentSlug: "south-america",
    lat: -3.4653,
    lng: -62.2159,
    summary:
      "The Amazon Basin is the largest tropical rainforest on Earth, threaded by vast rivers, oxbow lakes, and floating plant communities.",
    climateNotes: "Equatorial climate with high humidity, intense rainfall, and year-round warmth",
  },
  {
    name: "Andes Highlands",
    slug: "andes-highlands",
    type: "mountain-range",
    parentSlug: "south-america",
    lat: -13.1631,
    lng: -72.545,
    summary:
      "The high Andes host medicinal trees, giant bromeliads, and plant forms adapted to ultraviolet light, cold nights, and thin air.",
    climateNotes: "Rapidly shifting temperature by elevation, cool cloud forests below and alpine grasslands above",
  },
  {
    name: "Mediterranean Region",
    slug: "mediterranean-region",
    type: "ecoregion",
    parentSlug: "europe",
    lat: 38,
    lng: 20,
    summary:
      "Coastal landscapes surrounding the Mediterranean Sea are shaped by heat, stone, and centuries of agriculture and exchange.",
    climateNotes: "Warm dry summers, mild wet winters, frequent drought stress",
  },
  {
    name: "Japan",
    slug: "japan",
    type: "country",
    parentSlug: "asia",
    lat: 36.2048,
    lng: 138.2529,
    summary:
      "Japan's archipelago hosts celebrated spring bloomers, maple-rich forests, and a refined seasonal culture of plant observation.",
    climateNotes: "Varies from humid subtropical south to snowy temperate and subarctic north",
  },
  {
    name: "Himalayas",
    slug: "himalayas",
    type: "mountain-range",
    parentSlug: "asia",
    lat: 28.5983,
    lng: 83.9311,
    summary:
      "The Himalayas combine deep valleys, monsoon moisture, and high-altitude meadows that produce some of the world's most dramatic flowering plants.",
    climateNotes: "Cold alpine conditions above, monsoon-fed temperate forests below",
  },
  {
    name: "Madagascar",
    slug: "madagascar",
    type: "island",
    parentSlug: "africa",
    lat: -18.7669,
    lng: 46.8691,
    summary:
      "Madagascar's long isolation created one of the planet's richest concentrations of endemic plants and unusual growth forms.",
    climateNotes: "From humid eastern forests to strongly seasonal western dry forests",
  },
  {
    name: "Cape Floristic Region",
    slug: "cape-floristic-region",
    type: "ecoregion",
    parentSlug: "africa",
    lat: -33.9249,
    lng: 18.4241,
    summary:
      "A compact South African hotspot famed for proteas, silver shrubs, and exceptional local endemism.",
    climateNotes: "Winter rainfall, dry summers, fire-shaped shrubland ecology",
  },
  {
    name: "Namib Desert",
    slug: "namib-desert",
    type: "ecoregion",
    parentSlug: "africa",
    lat: -24.6545,
    lng: 15.8148,
    summary:
      "One of the oldest deserts on Earth, where fog and patience sustain astonishingly ancient plant survivors.",
    climateNotes: "Hyper-arid, low rainfall, but frequent coastal fog along parts of the desert margin",
  },
  {
    name: "Australian Southeast Forests",
    slug: "australian-southeast-forests",
    type: "ecoregion",
    parentSlug: "oceania",
    lat: -37.8136,
    lng: 145.0,
    summary:
      "Tall eucalyptus forests and shrub-rich woodlands define southeastern Australia's botanical character.",
    climateNotes: "Temperate with moderate rainfall, periodic fire, and cool wet winters in uplands",
  },
  {
    name: "New Zealand",
    slug: "new-zealand",
    type: "country",
    parentSlug: "oceania",
    lat: -40.9006,
    lng: 174.886,
    summary:
      "New Zealand's island forests combine fern-dominated understories with flowering trees celebrated in Maori and settler landscapes alike.",
    climateNotes: "Cool maritime climate, frequent rain, mild summers, and lush evergreen forest growth",
  },
];

const floraEntries: SeedFlora[] = [
  {
    commonName: "Giant Water Lily",
    scientificName: "Victoria amazonica",
    slug: "victoria-amazonica",
    shortDescription:
      "The largest water lily in the world, with circular leaves that can span more than 3 meters.",
    longDescription:
      "Victoria amazonica is a spectacular aquatic flowering plant native to the still and slow-moving waters of the Amazon Basin. Its vast ribbed leaves float like engineered rafts, while its flowers bloom white on the first night, blush pink on the second, and briefly warm themselves to attract pollinating beetles.",
    family: "Nymphaeaceae",
    genus: "Victoria",
    species: "amazonica",
    conservationStatus: "Least Concern",
    bloomSeason: "June to December",
    featured: true,
    regionSlug: "amazon-basin",
    biomeSlugs: ["tropical-rainforest", "wetland"],
    native: true,
    endemic: true,
    occurrenceNotes: "Thrives in oxbow lakes and calm river edges where wide floating leaves can spread unbroken.",
    facts: [
      "The underside of each leaf is strengthened by a lattice of ribs and spines that discourages herbivorous fish.",
    ],
    culturalNotes: [
      "Its dramatic scale made it a 19th-century horticultural sensation and a symbol of tropical abundance in glasshouse design.",
    ],
  },
  {
    commonName: "Rubber Tree",
    scientificName: "Hevea brasiliensis",
    slug: "hevea-brasiliensis",
    shortDescription:
      "The Amazonian tree whose milky latex transformed transportation, industry, and colonial trade.",
    longDescription:
      "Hevea brasiliensis is a tall tropical tree best known as the most important commercial source of natural rubber. Native to the Amazon, it stores latex in specialized vessels beneath the bark, a defense that humans learned to tap and process into one of the modern world's most consequential materials.",
    family: "Euphorbiaceae",
    genus: "Hevea",
    species: "brasiliensis",
    conservationStatus: "Least Concern",
    bloomSeason: "August to October",
    featured: false,
    regionSlug: "amazon-basin",
    biomeSlugs: ["tropical-rainforest"],
    native: true,
    endemic: false,
    occurrenceNotes: "Occurs in humid lowland forest where rainfall remains abundant and temperatures stay warm.",
    facts: [
      "Before global plantations expanded, the Amazon rubber boom reshaped entire river cities and trade routes.",
    ],
    culturalNotes: [
      "The story of rubber links Indigenous knowledge, industrial demand, and one of the most dramatic commodity booms in South American history.",
    ],
  },
  {
    commonName: "Cinchona Tree",
    scientificName: "Cinchona officinalis",
    slug: "cinchona-officinalis",
    shortDescription:
      "A mist-forest tree whose bark yielded quinine, once the world's most famous antimalarial medicine.",
    longDescription:
      "Cinchona officinalis belongs to a group of Andean trees treasured for alkaloids concentrated in their bark. In cloud forests and montane slopes, cinchona became botanically renowned because quinine extracted from related species transformed the treatment of malaria and changed the history of medicine, empire, and tropical travel.",
    family: "Rubiaceae",
    genus: "Cinchona",
    species: "officinalis",
    conservationStatus: "Near Threatened",
    bloomSeason: "May to August",
    featured: true,
    regionSlug: "andes-highlands",
    biomeSlugs: ["cloud-forest"],
    native: true,
    endemic: false,
    occurrenceNotes: "Found on humid Andean slopes where fog and steep terrain shelter medicinal forest species.",
    facts: [
      "Quinine from cinchona bark was one of the first globally significant plant-derived pharmaceuticals.",
    ],
    culturalNotes: [
      "Its bark moved from Andean healing traditions into European medicine and global botanical expeditions.",
    ],
  },
  {
    commonName: "Queen of the Andes",
    scientificName: "Puya raimondii",
    slug: "puya-raimondii",
    shortDescription:
      "A monumental bromeliad that can wait decades before sending up a towering flowering spike.",
    longDescription:
      "Puya raimondii is one of the Andes' most astonishing plants, forming a giant rosette for decades before producing a flower spike that can rise above nearby people like a natural mast. Its strategy is slow, dramatic, and deeply tied to high-elevation ecosystems where seasons are short and conditions harsh.",
    family: "Bromeliaceae",
    genus: "Puya",
    species: "raimondii",
    conservationStatus: "Endangered",
    bloomSeason: "July to September",
    featured: true,
    regionSlug: "andes-highlands",
    biomeSlugs: ["alpine"],
    native: true,
    endemic: true,
    occurrenceNotes: "Occurs in open, high-elevation puna landscapes exposed to cold nights and intense sun.",
    facts: [
      "A single flowering spike may carry thousands of blossoms and can take many decades to appear.",
    ],
    culturalNotes: [
      "Its improbable scale has made it a botanical emblem of the high Andes and their fragile alpine habitats.",
    ],
  },
  {
    commonName: "Olive Tree",
    scientificName: "Olea europaea",
    slug: "olea-europaea",
    shortDescription:
      "An ancient and culturally significant tree that has shaped Mediterranean civilizations for millennia.",
    longDescription:
      "The olive tree is one of the oldest cultivated trees in human history, with some specimens living for over two thousand years. Native to the Mediterranean Basin, it produces fruit prized for food and oil while carrying deep symbolic weight in Greek, Roman, Middle Eastern, and modern Mediterranean cultures.",
    family: "Oleaceae",
    genus: "Olea",
    species: "europaea",
    conservationStatus: "Least Concern",
    bloomSeason: "April to June",
    featured: true,
    regionSlug: "mediterranean-region",
    biomeSlugs: ["mediterranean"],
    native: true,
    endemic: false,
    occurrenceNotes: "Thrives on rocky, sunlit slopes and in long-inhabited agricultural landscapes.",
    facts: [
      "Some olive groves in the Mediterranean still produce fruit from trees believed to be many centuries old.",
    ],
    culturalNotes: [
      "The olive branch became a near-universal symbol of peace, continuity, and cultivated abundance.",
    ],
  },
  {
    commonName: "Lavender",
    scientificName: "Lavandula angustifolia",
    slug: "lavandula-angustifolia",
    shortDescription:
      "A fragrant Mediterranean shrub celebrated for scent, pollinators, and luminous summer fields.",
    longDescription:
      "Lavandula angustifolia is a compact woody shrub that perfumes hillsides and gardens with oils concentrated in narrow silver-green leaves and flower spikes. Well adapted to sun, poor soils, and dry summers, lavender has long lived at the intersection of herbal medicine, perfumery, and visual romance.",
    family: "Lamiaceae",
    genus: "Lavandula",
    species: "angustifolia",
    conservationStatus: "Least Concern",
    bloomSeason: "June to August",
    featured: true,
    regionSlug: "mediterranean-region",
    biomeSlugs: ["mediterranean"],
    native: true,
    endemic: false,
    occurrenceNotes: "Common on sun-baked slopes and in well-drained soils with long dry summers.",
    facts: [
      "Lavender oils evolved partly as aromatic defense compounds and became treasured by people for exactly that intensity.",
    ],
    culturalNotes: [
      "It is as much a visual icon of Provence and Mediterranean gardening as it is an ingredient in soaps and perfumes.",
    ],
  },
  {
    commonName: "Cherry Blossom",
    scientificName: "Prunus serrulata",
    slug: "prunus-serrulata",
    shortDescription:
      "Japan's iconic flowering tree, celebrated each spring during hanami festivals.",
    longDescription:
      "Prunus serrulata, commonly called sakura, is among Japan's most beloved ornamental trees. The brief spring flush of blossom transforms avenues, riverbanks, and temple grounds into seasonal stages for hanami, the communal appreciation of beauty that arrives suddenly and disappears just as quickly.",
    family: "Rosaceae",
    genus: "Prunus",
    species: "serrulata",
    conservationStatus: "Least Concern",
    bloomSeason: "March to May",
    featured: true,
    regionSlug: "japan",
    biomeSlugs: ["temperate-forest"],
    native: true,
    endemic: false,
    occurrenceNotes: "Grows in temperate landscapes from parks to forest margins where seasonal change is strongly felt.",
    facts: [
      "Japan's cherry blossom forecast, or sakura-zensen, is followed each year like a cultural weather map.",
    ],
    culturalNotes: [
      "Sakura became a central symbol of impermanence and renewal in Japanese poetry, painting, and public ritual.",
    ],
  },
  {
    commonName: "Japanese Maple",
    scientificName: "Acer palmatum",
    slug: "acer-palmatum",
    shortDescription:
      "A finely divided maple prized for graceful form and luminous autumn color.",
    longDescription:
      "Acer palmatum is a small tree of woodland edges and cultivated gardens whose palm-like leaves can range from bright chartreuse to deep crimson. In Japan it is admired both for refined branching in winter and for the glowing spectacle of autumn foliage known as momijigari.",
    family: "Sapindaceae",
    genus: "Acer",
    species: "palmatum",
    conservationStatus: "Least Concern",
    bloomSeason: "April to May",
    featured: true,
    regionSlug: "japan",
    biomeSlugs: ["temperate-forest"],
    native: true,
    endemic: true,
    occurrenceNotes: "Occurs in moist temperate woodlands and is widely cultivated in gardens for shape and foliage color.",
    facts: [
      "Many ornamental cultivars descend from centuries of deliberate Japanese horticultural selection.",
    ],
    culturalNotes: [
      "Autumn maple viewing is celebrated alongside spring blossom viewing as another seasonal ritual of attention.",
    ],
  },
  {
    commonName: "Himalayan Blue Poppy",
    scientificName: "Meconopsis grandis",
    slug: "meconopsis-grandis",
    shortDescription:
      "A high-altitude flower famed for petals that seem improbably blue against mountain air.",
    longDescription:
      "Meconopsis grandis is one of the Himalayas' most sought-after flowers, producing luminous blue blooms in cool alpine and subalpine conditions. Its beauty lies not only in color but in context: a brief seasonal flare amid rock, snowmelt, and thin air.",
    family: "Papaveraceae",
    genus: "Meconopsis",
    species: "grandis",
    conservationStatus: "Vulnerable",
    bloomSeason: "June to July",
    featured: true,
    regionSlug: "himalayas",
    biomeSlugs: ["alpine"],
    native: true,
    endemic: true,
    occurrenceNotes: "Found in alpine meadows and moist mountain slopes fed by melting snow and monsoon moisture.",
    facts: [
      "Its saturated blue petals make it one of the most visually distinctive alpine flowers in the world.",
    ],
    culturalNotes: [
      "Blue poppies are woven into Himalayan garden lore and into the imagination of mountain plant collectors far beyond Asia.",
    ],
  },
  {
    commonName: "Himalayan Rhododendron",
    scientificName: "Rhododendron arboreum",
    slug: "rhododendron-arboreum",
    shortDescription:
      "A tree rhododendron whose crimson bloom lights up Himalayan slopes before the monsoon deepens.",
    longDescription:
      "Rhododendron arboreum grows from forested hills into higher elevations across the Himalayas, where its waxy leaves and clustered blossoms brighten mountain roads and ridges. It is both a charismatic wild plant and a familiar cultural presence in local food, medicine, and festivals.",
    family: "Ericaceae",
    genus: "Rhododendron",
    species: "arboreum",
    conservationStatus: "Least Concern",
    bloomSeason: "February to April",
    featured: false,
    regionSlug: "himalayas",
    biomeSlugs: ["temperate-forest", "alpine"],
    native: true,
    endemic: false,
    occurrenceNotes: "Appears along temperate forest margins and on open hillsides where spring warmth reaches first.",
    facts: [
      "In some Himalayan regions the flowers are made into brightly colored syrups and drinks.",
    ],
    culturalNotes: [
      "Its bloom is celebrated as a herald of seasonal change and is officially honored in parts of the Himalayan region.",
    ],
  },
  {
    commonName: "Grandidier's Baobab",
    scientificName: "Adansonia grandidieri",
    slug: "adansonia-grandidieri",
    shortDescription:
      "A monumental baobab whose bottle-shaped trunk stores water through Madagascar's long dry season.",
    longDescription:
      "Adansonia grandidieri is among the most iconic trees of Madagascar, rising like a living column above dry western landscapes. Its swollen trunk stores water, its bark reflects heat, and its silhouette has become inseparable from images of the island's singular natural history.",
    family: "Malvaceae",
    genus: "Adansonia",
    species: "grandidieri",
    conservationStatus: "Endangered",
    bloomSeason: "May to August",
    featured: true,
    regionSlug: "madagascar",
    biomeSlugs: ["seasonal-dry-forest"],
    native: true,
    endemic: true,
    occurrenceNotes: "Occurs in Madagascar's seasonally dry western lowlands where stored water is a survival strategy.",
    facts: [
      "Its trunk can hold extraordinary quantities of water, allowing the tree to outlast prolonged drought.",
    ],
    culturalNotes: [
      "Baobabs anchor some of Madagascar's most recognizable landscapes and often carry strong local cultural associations.",
    ],
  },
  {
    commonName: "Traveller's Palm",
    scientificName: "Ravenala madagascariensis",
    slug: "ravenala-madagascariensis",
    shortDescription:
      "Madagascar's fan-shaped giant, famous for leaf bases that can hold rainwater.",
    longDescription:
      "Despite its common name, Ravenala madagascariensis is not a true palm but a large bird-of-paradise relative. Its leaves spread in a dramatic fan, and the plant is associated with moisture storage, architectural symmetry, and one of the most recognizable silhouettes in tropical horticulture.",
    family: "Strelitziaceae",
    genus: "Ravenala",
    species: "madagascariensis",
    conservationStatus: "Least Concern",
    bloomSeason: "Year-round",
    featured: false,
    regionSlug: "madagascar",
    biomeSlugs: ["tropical-rainforest", "wetland"],
    native: true,
    endemic: true,
    occurrenceNotes: "Occurs in humid and seasonally wet parts of Madagascar, especially where water is abundant.",
    facts: [
      "Its leaf bases can collect water, inspiring the story that thirsty travelers once used it as a natural reservoir.",
    ],
    culturalNotes: [
      "The fan form made it an ornamental ambassador for Madagascar well beyond the island itself.",
    ],
  },
  {
    commonName: "King Protea",
    scientificName: "Protea cynaroides",
    slug: "protea-cynaroides",
    shortDescription:
      "South Africa's national flower, with a massive bloom adapted to fire-shaped shrublands.",
    longDescription:
      "Protea cynaroides bears one of the largest flower heads in the protea family, opening like a sculpted crown above leathery leaves. In the fynbos, it belongs to a plant community shaped by nutrient-poor soils and periodic fire, conditions that reward resilience and rebirth.",
    family: "Proteaceae",
    genus: "Protea",
    species: "cynaroides",
    conservationStatus: "Least Concern",
    bloomSeason: "Winter to Spring",
    featured: true,
    regionSlug: "cape-floristic-region",
    biomeSlugs: ["fynbos-shrubland"],
    native: true,
    endemic: true,
    occurrenceNotes: "Thrives in open fynbos where fires periodically reset vegetation and clear space for renewal.",
    facts: [
      "Some proteas resprout after fire while others rely on seed released into newly cleared landscapes.",
    ],
    culturalNotes: [
      "The king protea became a symbol of South African biodiversity and a floral emblem of resilience.",
    ],
  },
  {
    commonName: "Silver Tree",
    scientificName: "Leucadendron argenteum",
    slug: "leucadendron-argenteum",
    shortDescription:
      "A shimmering fynbos tree with leaves coated in silky hairs that catch coastal light.",
    longDescription:
      "Leucadendron argenteum is one of the most striking plants of the Cape Peninsula, with narrow leaves that flash silver in sun and wind. It belongs to the protea family and reflects the Cape Floristic Region's gift for turning evolutionary specialization into pure visual drama.",
    family: "Proteaceae",
    genus: "Leucadendron",
    species: "argenteum",
    conservationStatus: "Vulnerable",
    bloomSeason: "Spring",
    featured: false,
    regionSlug: "cape-floristic-region",
    biomeSlugs: ["fynbos-shrubland"],
    native: true,
    endemic: true,
    occurrenceNotes: "Naturally restricted to Cape Peninsula slopes where wind, fire, and poor soils shape survival.",
    facts: [
      "The leaf sheen comes from dense silky hairs that help reflect intense light and reduce moisture loss.",
    ],
    culturalNotes: [
      "Its rarity and beauty made it a botanical signature of Cape Town's surrounding mountains.",
    ],
  },
  {
    commonName: "Welwitschia",
    scientificName: "Welwitschia mirabilis",
    slug: "welwitschia-mirabilis",
    shortDescription:
      "An ancient desert plant that spends centuries growing only two continually fraying leaves.",
    longDescription:
      "Welwitschia mirabilis is one of the botanical world's great enigmas, producing just two leaves that persist and split over a lifespan that can exceed many human generations. In the Namib it survives on minimal rainfall and frequent fog, looking less like a shrub than a relic from another age.",
    family: "Welwitschiaceae",
    genus: "Welwitschia",
    species: "mirabilis",
    conservationStatus: "Near Threatened",
    bloomSeason: "Summer",
    featured: true,
    regionSlug: "namib-desert",
    biomeSlugs: ["desert-steppe"],
    native: true,
    endemic: true,
    occurrenceNotes: "Survives in Namibia's arid landscapes where fog and deep roots compensate for sparse rainfall.",
    facts: [
      "Some individuals are believed to be over a thousand years old while still bearing only two true leaves.",
    ],
    culturalNotes: [
      "Welwitschia is often treated as a living fossil and a symbol of extreme adaptation in desert life.",
    ],
  },
  {
    commonName: "Mountain Ash",
    scientificName: "Eucalyptus regnans",
    slug: "eucalyptus-regnans",
    shortDescription:
      "One of the tallest flowering plants on Earth, rising through cool southeastern Australian forests.",
    longDescription:
      "Eucalyptus regnans, commonly called mountain ash, forms extraordinarily tall forests in southeastern Australia. Its towering trunks, shedding bark, and post-fire regeneration make it a defining tree of landscapes where height, fire, and moisture are locked together.",
    family: "Myrtaceae",
    genus: "Eucalyptus",
    species: "regnans",
    conservationStatus: "Endangered",
    bloomSeason: "December to March",
    featured: true,
    regionSlug: "australian-southeast-forests",
    biomeSlugs: ["temperate-forest"],
    native: true,
    endemic: true,
    occurrenceNotes: "Found in cool, moist forests where deep soils and regular rainfall can sustain giant tree growth.",
    facts: [
      "It is one of the tallest angiosperms in the world, rivaling many conifers in height.",
    ],
    culturalNotes: [
      "Its forests are central to debates about fire, conservation, carbon storage, and old-growth logging in Australia.",
    ],
  },
  {
    commonName: "Waratah",
    scientificName: "Telopea speciosissima",
    slug: "telopea-speciosissima",
    shortDescription:
      "A spectacular crimson bloom of eastern Australia, striking against dark post-fire shrublands.",
    longDescription:
      "Telopea speciosissima produces a bold dome of red flowers that has become a floral emblem of New South Wales. Like many Australian shrubs, it is adapted to nutrient-poor soils and periodic fire, using disturbance not just as a threat but as part of its ecological rhythm.",
    family: "Proteaceae",
    genus: "Telopea",
    species: "speciosissima",
    conservationStatus: "Least Concern",
    bloomSeason: "September to November",
    featured: false,
    regionSlug: "australian-southeast-forests",
    biomeSlugs: ["temperate-forest"],
    native: true,
    endemic: true,
    occurrenceNotes: "Occurs in open forest and shrubland, often responding vigorously after fire and disturbance.",
    facts: [
      "The bold inflorescence is made of many small flowers packed into a single dramatic head.",
    ],
    culturalNotes: [
      "It has become an enduring civic symbol in southeastern Australia and a favorite of native plant gardens.",
    ],
  },
  {
    commonName: "Silver Fern",
    scientificName: "Cyathea dealbata",
    slug: "cyathea-dealbata",
    shortDescription:
      "New Zealand's iconic tree fern, recognizable by the silver undersides of its fronds.",
    longDescription:
      "Cyathea dealbata is a tall tree fern of damp New Zealand forests whose fronds gleam pale beneath. That contrasting underside made it both useful for navigation and symbolic enough to become one of the nation's best-known botanical emblems.",
    family: "Cyatheaceae",
    genus: "Cyathea",
    species: "dealbata",
    conservationStatus: "Least Concern",
    bloomSeason: "Non-flowering fern",
    featured: true,
    regionSlug: "new-zealand",
    biomeSlugs: ["temperate-forest"],
    native: true,
    endemic: true,
    occurrenceNotes: "Thrives in humid forest understories where filtered light and moisture remain stable.",
    facts: [
      "As a fern, it reproduces by spores rather than flowers, yet remains as iconic as any blossom-bearing plant.",
    ],
    culturalNotes: [
      "The silver fern is deeply tied to national identity in New Zealand and widely used in sport and design.",
    ],
  },
  {
    commonName: "Kowhai",
    scientificName: "Sophora microphylla",
    slug: "sophora-microphylla",
    shortDescription:
      "A small New Zealand tree whose yellow flowers draw birds into brilliant spring displays.",
    longDescription:
      "Sophora microphylla is a graceful flowering tree found across New Zealand, admired for pendulous yellow blooms that appear when many landscapes are still cool and subdued. Its flowers are especially valuable to nectar-feeding native birds, making it an ecological as well as ornamental favorite.",
    family: "Fabaceae",
    genus: "Sophora",
    species: "microphylla",
    conservationStatus: "Least Concern",
    bloomSeason: "August to October",
    featured: false,
    regionSlug: "new-zealand",
    biomeSlugs: ["temperate-forest"],
    native: true,
    endemic: false,
    occurrenceNotes: "Occurs along forest margins, rivers, and open habitats where birds can easily access nectar-rich blooms.",
    facts: [
      "Its flowers are especially attractive to tui and bellbirds during the New Zealand spring.",
    ],
    culturalNotes: [
      "Kowhai is a familiar seasonal marker in New Zealand and one of the country's most cherished flowering trees.",
    ],
  },
];

async function resetDatabase() {
  await prisma.tag.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.floraCulturalNote.deleteMany();
  await prisma.floraFact.deleteMany();
  await prisma.floraBiome.deleteMany();
  await prisma.floraRegionOccurrence.deleteMany();
  await prisma.flora.deleteMany();
  await prisma.region.deleteMany();
  await prisma.biome.deleteMany();
}

async function main() {
  await resetDatabase();

  const biomeMap = new Map<string, string>();
  for (const biome of biomes) {
    const created = await prisma.biome.create({ data: biome });
    biomeMap.set(biome.slug, created.id);
  }

  const regionMap = new Map<string, string>();
  for (const region of continents) {
    const created = await prisma.region.create({
      data: {
        name: region.name,
        slug: region.slug,
        type: region.type,
        lat: region.lat,
        lng: region.lng,
        summary: region.summary,
        climateNotes: region.climateNotes,
      },
    });
    regionMap.set(region.slug, created.id);
  }

  for (const region of regions) {
    const created = await prisma.region.create({
      data: {
        name: region.name,
        slug: region.slug,
        type: region.type,
        parentRegionId: region.parentSlug ? regionMap.get(region.parentSlug) : undefined,
        lat: region.lat,
        lng: region.lng,
        summary: region.summary,
        climateNotes: region.climateNotes,
      },
    });
    regionMap.set(region.slug, created.id);
  }

  for (const flora of floraEntries) {
    const created = await prisma.flora.create({
      data: {
        commonName: flora.commonName,
        scientificName: flora.scientificName,
        slug: flora.slug,
        shortDescription: flora.shortDescription,
        longDescription: flora.longDescription,
        family: flora.family,
        genus: flora.genus,
        species: flora.species,
        conservationStatus: flora.conservationStatus,
        bloomSeason: flora.bloomSeason,
        featured: flora.featured,
      },
    });

    await prisma.floraRegionOccurrence.create({
      data: {
        floraId: created.id,
        regionId: regionMap.get(flora.regionSlug)!,
        isNative: flora.native,
        isEndemic: flora.endemic,
        notes: flora.occurrenceNotes,
      },
    });

    await prisma.floraBiome.createMany({
      data: flora.biomeSlugs.map((biomeSlug) => ({
        floraId: created.id,
        biomeId: biomeMap.get(biomeSlug)!,
      })),
    });

    await prisma.floraFact.createMany({
      data: flora.facts.map((fact) => ({
        floraId: created.id,
        fact,
      })),
    });

    await prisma.floraCulturalNote.createMany({
      data: flora.culturalNotes.map((note) => ({
        floraId: created.id,
        note,
      })),
    });
  }

  console.log(
    `Seed complete: ${continents.length + regions.length} regions, ${biomes.length} biomes, ${floraEntries.length} flora entries created.`,
  );
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
