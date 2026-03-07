"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { GlobeMapMode } from "@/components/globe/interactive-globe";
import type { FloraPreview } from "@/lib/flora-data";
import { filterFloraCollection } from "@/lib/flora-filters";
import type { RegionPreview } from "@/lib/region-data";
import { getFloraPalette } from "@/lib/visual-theme";
import { SiteHeader } from "@/components/site/site-header";
import { SelectionDrawer } from "@/components/home/selection-drawer";
import { useExploreStore } from "@/store/explore-store";

const InteractiveGlobe = dynamic(
  () =>
    import("@/components/globe/interactive-globe").then(
      (module) => module.InteractiveGlobe,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[32rem] items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 text-sm text-white/60 backdrop-blur-xl">
        Loading immersive globe...
      </div>
    ),
  },
);

type HomepageShellProps = {
  flora: FloraPreview[];
  regions: RegionPreview[];
};

export function HomepageShell({ flora, regions }: HomepageShellProps) {
  const [query, setQuery] = useState("");
  const [activeBiome, setActiveBiome] = useState("all");
  const [activeRegion, setActiveRegion] = useState("all");
  const [activeContinent, setActiveContinent] = useState("all");
  const [activeFloraType, setActiveFloraType] = useState("all");
  const [activeSeasonality, setActiveSeasonality] = useState("all");
  const [activeOrigin, setActiveOrigin] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");
  const [mapMode, setMapMode] = useState<GlobeMapMode>("map");
  const selectedSlug = useExploreStore((state) => state.selectedSlug);
  const setSelectedSlug = useExploreStore((state) => state.setSelectedSlug);

  const biomeFilters = useMemo(
    () => [
      { label: "All biomes", value: "all" },
      ...flora
        .flatMap((item) => item.biomes)
        .filter(
          (biome, index, collection) =>
            collection.findIndex((candidate) => candidate.slug === biome.slug) === index,
        )
        .sort((left, right) => left.name.localeCompare(right.name))
        .map((biome) => ({
          label: biome.name,
          value: biome.slug,
        })),
    ],
    [flora],
  );

  const regionFilters = useMemo(
    () => [
      { label: "All regions", value: "all" },
      ...flora
        .map((item) => item.primaryRegion)
        .filter((region): region is NonNullable<typeof region> => Boolean(region))
        .filter(
          (region, index, collection) =>
            collection.findIndex((candidate) => candidate.slug === region.slug) === index,
        )
        .sort((left, right) => left.name.localeCompare(right.name))
        .map((region) => ({
          label: region.name,
          value: region.slug,
        })),
    ],
    [flora],
  );

  const continentFilters = useMemo(
    () => [
      { label: "All continents", value: "all" },
      ...flora
        .flatMap((item) => item.continents)
        .filter(
          (continent, index, collection) =>
            collection.findIndex((candidate) => candidate.slug === continent.slug) === index,
        )
        .sort((left, right) => left.name.localeCompare(right.name))
        .map((continent) => ({
          label: continent.name,
          value: continent.slug,
        })),
    ],
    [flora],
  );

  const floraTypeFilters = useMemo(
    () => [
      { label: "All flora types", value: "all" },
      ...Array.from(new Set(flora.map((item) => item.floraType)))
        .sort((left, right) => left.localeCompare(right))
        .map((floraType) => ({
          label: floraType,
          value: floraType,
        })),
    ],
    [flora],
  );

  const seasonalityFilters = useMemo(() => {
    const orderedOptions = [
      "Spring",
      "Summer",
      "Autumn",
      "Winter",
      "Year-round",
      "Non-flowering",
    ];

    return [
      { label: "All seasonality", value: "all" },
      ...orderedOptions
        .filter((season) =>
          flora.some(
            (item) =>
              item.bloomWindows.includes(season) ||
              (season === "Year-round" && item.bloomSeason === "Year-round") ||
              (season === "Non-flowering" && item.bloomSeason === "Non-flowering fern"),
          ),
        )
        .map((season) => ({
          label: season,
          value: season,
        })),
    ];
  }, [flora]);

  const originFilters = useMemo(
    () => [
      { label: "All origins", value: "all" },
      { label: "Native", value: "native" },
      { label: "Endemic", value: "endemic" },
      { label: "Introduced", value: "introduced" },
    ],
    [],
  );

  const statusFilters = useMemo(
    () => [
      { label: "All statuses", value: "all" },
      ...Array.from(
        new Set(
          flora
            .map((item) => item.conservationStatus)
            .filter((status): status is string => Boolean(status)),
        ),
      )
        .sort((left, right) => left.localeCompare(right))
        .map((status) => ({
          label: status,
          value: status,
        })),
    ],
    [flora],
  );

  const filteredFlora = useMemo(() => {
    return filterFloraCollection(flora, {
      query,
      biome: activeBiome,
      region: activeRegion,
      continent: activeContinent,
      floraType: activeFloraType,
      season: activeSeasonality,
      origin: activeOrigin,
      status: activeStatus,
    });
  }, [
    activeBiome,
    activeContinent,
    activeFloraType,
    activeOrigin,
    activeRegion,
    activeSeasonality,
    activeStatus,
    flora,
    query,
  ]);

  const visibleContinentCount = useMemo(() => {
    return new Set(
      filteredFlora
        .map((item) => item.primaryContinent?.slug)
        .filter((slug): slug is string => Boolean(slug)),
    ).size;
  }, [filteredFlora]);

  const activeFilterCount = [
    query.trim(),
    activeBiome !== "all" ? activeBiome : "",
    activeRegion !== "all" ? activeRegion : "",
    activeContinent !== "all" ? activeContinent : "",
    activeFloraType !== "all" ? activeFloraType : "",
    activeSeasonality !== "all" ? activeSeasonality : "",
    activeOrigin !== "all" ? activeOrigin : "",
    activeStatus !== "all" ? activeStatus : "",
  ].filter(Boolean).length;

  useEffect(() => {
    if (!filteredFlora.length) {
      if (selectedSlug) {
        setSelectedSlug(null);
      }
      return;
    }

    if (!selectedSlug || !filteredFlora.some((item) => item.slug === selectedSlug)) {
      setSelectedSlug(filteredFlora[0].slug);
    }
  }, [filteredFlora, selectedSlug, setSelectedSlug]);

  const selectedFlora =
    filteredFlora.find((item) => item.slug === selectedSlug) ?? filteredFlora[0] ?? null;

  const resetFilters = () => {
    setQuery("");
    setActiveBiome("all");
    setActiveRegion("all");
    setActiveContinent("all");
    setActiveFloraType("all");
    setActiveSeasonality("all");
    setActiveOrigin("all");
    setActiveStatus("all");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#02040a] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(74,222,128,0.14),_transparent_28%),radial-gradient(circle_at_75%_15%,_rgba(96,165,250,0.18),_transparent_24%),radial-gradient(circle_at_50%_120%,_rgba(236,72,153,0.12),_transparent_28%)]" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-cyan-400/8 blur-3xl" />

      <div className="relative z-10 px-4 pb-8 pt-4 md:px-6 xl:px-8">
        <SiteHeader />
      </div>

      <main className="relative z-10 grid gap-10 px-4 pb-8 md:px-6 lg:min-h-[calc(100vh-6rem)] lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] xl:px-8">
        <section className="flex flex-col justify-center gap-8 py-4 lg:py-10">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.45em] text-emerald-200/72">
              Geographic botanical atlas
            </p>
            <h1 className="max-w-3xl font-display text-6xl leading-none text-white sm:text-7xl">
              Explore flora on a real Earth, not an abstract sphere.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
              Rotate a geographic globe, browse living plant clusters rooted in
              real regions, and narrow the collection by seasonality, flora
              type, biome, origin, and conservation status.
            </p>
          </div>

          <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/6 p-4 backdrop-blur-xl sm:grid-cols-[minmax(0,1fr)_auto]">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-white/40">
                Search flora, region, biome, or scientific name
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try cherry blossom, Amazon, lavender, maple..."
                className="w-full rounded-full border border-white/10 bg-slate-950/70 px-5 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/45"
              />
            </label>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[16rem]">
              <StatCard value={`${filteredFlora.length}`} label="Visible flora" />
              <StatCard value={`${visibleContinentCount}`} label="Continents" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <FilterSelect
                label="Continent"
                options={continentFilters}
                value={activeContinent}
                onChange={setActiveContinent}
              />
              <FilterSelect
                label="Region"
                options={regionFilters}
                value={activeRegion}
                onChange={setActiveRegion}
              />
              <FilterSelect
                label="Biome"
                options={biomeFilters}
                value={activeBiome}
                onChange={setActiveBiome}
              />
              <FilterSelect
                label="Flora type"
                options={floraTypeFilters}
                value={activeFloraType}
                onChange={setActiveFloraType}
              />
              <FilterSelect
                label="Seasonality"
                options={seasonalityFilters}
                value={activeSeasonality}
                onChange={setActiveSeasonality}
              />
              <FilterSelect
                label="Origin"
                options={originFilters}
                value={activeOrigin}
                onChange={setActiveOrigin}
              />
              <FilterSelect
                label="Conservation"
                options={statusFilters}
                value={activeStatus}
                onChange={setActiveStatus}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.4rem] border border-white/8 bg-black/18 px-4 py-3">
              <div className="flex flex-wrap gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-white/48">
                <span className="rounded-full border border-white/10 px-3 py-1">
                  {flora.length} total flora
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1">
                  {activeFilterCount} active filters
                </span>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/70 transition hover:border-white/20 hover:text-white"
              >
                Reset filters
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              "Geographic land and ocean layers anchor each flora cluster to a recognizable place.",
              "Seasonality, flora type, origin, and conservation filters all update the globe instantly.",
              "Selecting any bloom on Earth opens a richer botanical preview and detail route.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4 text-sm leading-7 text-white/68"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/38">
                  Live globe collection
                </p>
                <h2 className="mt-2 font-display text-3xl text-white">
                  Flora matching the current Earth filters
                </h2>
              </div>
              <Link
                href="/flora"
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/72 transition hover:border-white/20 hover:text-white"
              >
                Open full flora index
              </Link>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              {filteredFlora.length ? (
                filteredFlora.map((item, index) => {
                  const palette = getFloraPalette(item);
                  const isSelected = item.slug === selectedFlora?.slug;

                  return (
                    <motion.button
                      key={item.slug}
                      type="button"
                      onClick={() => setSelectedSlug(item.slug)}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      className="group rounded-[1.75rem] border p-5 text-left transition hover:-translate-y-1"
                      style={{
                        background: `linear-gradient(160deg, ${palette.surface}, rgba(15, 23, 42, 0.58))`,
                        borderColor: isSelected ? palette.border : "rgba(255,255,255,0.08)",
                        boxShadow: isSelected
                          ? `0 20px 60px -34px ${palette.glow}`
                          : "none",
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full border border-white/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.24em] text-white/58">
                            {item.primaryRegion?.name ?? "Global selection"}
                          </span>
                          <span className="rounded-full border border-white/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.24em] text-white/58">
                            {item.floraType}
                          </span>
                        </div>
                        <span className="text-xs text-white/42">
                          {item.biomes[0]?.name ?? "Botanical story"}
                        </span>
                      </div>
                      <h3 className="mt-5 font-display text-3xl text-white">
                        {item.commonName}
                      </h3>
                      <p className="mt-2 text-sm italic text-white/64">
                        {item.scientificName}
                      </p>
                      <p className="mt-4 text-sm leading-7 text-white/72">
                        {item.shortDescription}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-white/50">
                        {item.bloomWindows[0] ? (
                          <span className="rounded-full border border-white/10 px-3 py-1">
                            {item.bloomWindows.join(" / ")}
                          </span>
                        ) : null}
                        {item.conservationStatus ? (
                          <span className="rounded-full border border-white/10 px-3 py-1">
                            {item.conservationStatus}
                          </span>
                        ) : null}
                      </div>
                    </motion.button>
                  );
                })
              ) : (
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 text-sm leading-7 text-white/68 xl:col-span-3">
                  No flora match the current search and filter combination. Try
                  clearing a filter to reveal more of the collection.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/38">
                  Featured regions
                </p>
                <h2 className="mt-2 font-display text-3xl text-white">
                  Geography to open after the globe
                </h2>
              </div>
              <Link
                href="/regions"
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/72 transition hover:border-white/20 hover:text-white"
              >
                Open region index
              </Link>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {regions.map((region) => (
                <Link
                  key={region.slug}
                  href={`/regions/${region.slug}`}
                  className="rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.12),_transparent_24%),rgba(255,255,255,0.04)] p-5 transition hover:-translate-y-1 hover:border-white/20"
                >
                  <div className="flex flex-wrap gap-2 text-[0.68rem] uppercase tracking-[0.24em] text-white/44">
                    {region.parentRegion ? (
                      <span className="rounded-full border border-white/10 px-3 py-1">
                        {region.parentRegion.name}
                      </span>
                    ) : null}
                    <span className="rounded-full border border-white/10 px-3 py-1">
                      {region.floraCount} flora
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-3xl text-white">
                    {region.name}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/72">
                    {region.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative flex h-[32rem] self-start items-stretch py-2 lg:h-[calc(100vh-10rem)] lg:py-8">
          <div className="absolute inset-0 rounded-[2.2rem] border border-white/8 bg-white/4 backdrop-blur-[1px]" />
          <div className="relative flex-1 overflow-hidden rounded-[2.2rem]">
            <MapModeToggle mapMode={mapMode} onChange={setMapMode} />
            <GlobeHud
              flora={filteredFlora}
              query={query}
              activeSeasonality={activeSeasonality}
              activeFloraType={activeFloraType}
              mapMode={mapMode}
            />
            <InteractiveGlobe flora={filteredFlora} mapMode={mapMode} />
            <SelectionDrawer flora={selectedFlora} />
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[1.35rem] border border-white/8 bg-black/20 p-4">
      <div className="font-display text-3xl text-white">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.26em] text-white/42">
        {label}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{
    label: string;
    value: string;
  }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-white/40">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[1rem] border border-white/10 bg-slate-950/76 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/45"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-950">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function GlobeHud({
  flora,
  query,
  activeSeasonality,
  activeFloraType,
  mapMode,
}: {
  flora: FloraPreview[];
  query: string;
  activeSeasonality: string;
  activeFloraType: string;
  mapMode: GlobeMapMode;
}) {
  return (
    <>
      <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-[20rem] rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4 backdrop-blur-xl">
        <p className="text-[0.65rem] uppercase tracking-[0.34em] text-cyan-100/65">
          Earth flora atlas
        </p>
        <h2 className="mt-3 font-display text-3xl text-white">
          {flora.length} flora visible
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/62">
          Geographic landmasses, atmospheric glow, and botanical clusters update
          together as filters change.
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex max-w-[30rem] flex-wrap gap-2">
        <HudChip label="View" value={mapMode === "map" ? "Map" : "Satellite"} />
        <HudChip label="Search" value={query.trim() || "All flora"} />
        <HudChip
          label="Seasonality"
          value={activeSeasonality === "all" ? "Any" : activeSeasonality}
        />
        <HudChip
          label="Flora type"
          value={activeFloraType === "all" ? "Any" : activeFloraType}
        />
      </div>
    </>
  );
}

function MapModeToggle({
  mapMode,
  onChange,
}: {
  mapMode: GlobeMapMode;
  onChange: (mode: GlobeMapMode) => void;
}) {
  return (
    <div className="absolute right-4 top-4 z-20 flex rounded-full border border-white/10 bg-slate-950/62 p-1 backdrop-blur-xl">
      {[
        { label: "Map", value: "map" },
        { label: "Satellite", value: "satellite" },
      ].map((option) => {
        const active = mapMode === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value as GlobeMapMode)}
            className={`rounded-full px-4 py-2 text-[0.68rem] uppercase tracking-[0.24em] transition ${
              active
                ? "bg-white text-slate-950 shadow-[0_8px_24px_-16px_rgba(255,255,255,0.9)]"
                : "text-white/62 hover:text-white"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function HudChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-white/10 bg-slate-950/68 px-4 py-2 text-[0.68rem] uppercase tracking-[0.24em] text-white/62 backdrop-blur-lg">
      <span className="text-white/38">{label}</span> {value}
    </div>
  );
}
