"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { FloraPreview } from "@/lib/flora-data";
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
};

export function HomepageShell({ flora }: HomepageShellProps) {
  const [query, setQuery] = useState("");
  const [activeBiome, setActiveBiome] = useState("All biomes");
  const [activeRegion, setActiveRegion] = useState("All regions");
  const selectedSlug = useExploreStore((state) => state.selectedSlug);
  const setSelectedSlug = useExploreStore((state) => state.setSelectedSlug);

  const biomeFilters = useMemo(
    () => [
      "All biomes",
      ...new Set(flora.flatMap((item) => item.biomes.map((biome) => biome.name))),
    ],
    [flora],
  );

  const regionFilters = useMemo(
    () => [
      "All regions",
      ...new Set(
        flora
          .map((item) => item.primaryRegion?.name)
          .filter((value): value is string => Boolean(value)),
      ),
    ],
    [flora],
  );

  const filteredFlora = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return flora.filter((item) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        item.commonName.toLowerCase().includes(normalizedQuery) ||
        item.scientificName.toLowerCase().includes(normalizedQuery) ||
        item.primaryRegion?.name.toLowerCase().includes(normalizedQuery) ||
        item.biomes.some((biome) => biome.name.toLowerCase().includes(normalizedQuery));

      const matchesBiome =
        activeBiome === "All biomes" ||
        item.biomes.some((biome) => biome.name === activeBiome);

      const matchesRegion =
        activeRegion === "All regions" || item.primaryRegion?.name === activeRegion;

      return matchesQuery && matchesBiome && matchesRegion;
    });
  }, [activeBiome, activeRegion, flora, query]);

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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#02040a] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(74,222,128,0.14),_transparent_28%),radial-gradient(circle_at_75%_15%,_rgba(96,165,250,0.18),_transparent_24%),radial-gradient(circle_at_50%_120%,_rgba(236,72,153,0.12),_transparent_28%)]" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-cyan-400/8 blur-3xl" />

      <div className="relative z-10 px-4 pb-8 pt-4 md:px-6 xl:px-8">
        <SiteHeader />
      </div>

      <main className="relative z-10 grid gap-10 px-4 pb-8 md:px-6 lg:min-h-[calc(100vh-6rem)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:px-8">
        <section className="flex flex-col justify-center gap-8 py-4 lg:py-10">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.45em] text-emerald-200/72">
              Cinematic botanical atlas
            </p>
            <h1 className="max-w-3xl font-display text-6xl leading-none text-white sm:text-7xl">
              A living globe for wandering through the world&apos;s flora.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
              Rotate a luminous Earth, discover curated botanical stories, and
              open elegant field notes for plants rooted in the Amazon, the
              Mediterranean, and Japan.
            </p>
          </div>

          <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/6 p-4 backdrop-blur-xl sm:grid-cols-[minmax(0,1fr)_auto]">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-white/40">
                Search flora, region, or biome
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try cherry blossom, Amazon, Mediterranean..."
                className="w-full rounded-full border border-white/10 bg-slate-950/70 px-5 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/45"
              />
            </label>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[15rem]">
              <StatCard value={`${flora.length}`} label="Seeded flora" />
              <StatCard
                value={`${new Set(flora.map((item) => item.primaryRegion?.slug)).size}`}
                label="Regions"
              />
            </div>

            <FilterRow
              label="Biome"
              options={biomeFilters}
              activeValue={activeBiome}
              onSelect={setActiveBiome}
            />
            <FilterRow
              label="Region"
              options={regionFilters}
              activeValue={activeRegion}
              onSelect={setActiveRegion}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              "Subtle motion and atmospheric glow make the homepage feel alive.",
              "Every marker opens a botanical preview with memorable facts.",
              "Detail pages translate exploration into richer educational stories.",
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
                  Featured flora
                </p>
                <h2 className="mt-2 font-display text-3xl text-white">
                  Curated entries from the first build
                </h2>
              </div>
              <Link
                href="/flora"
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/72 transition hover:border-white/20 hover:text-white"
              >
                Open flora index
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
                        <span className="rounded-full border border-white/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.24em] text-white/58">
                          {item.primaryRegion?.name ?? "Featured"}
                        </span>
                        <span className="text-xs text-white/42">
                          {item.biomes[0]?.name ?? "Curated flora"}
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
                    </motion.button>
                  );
                })
              ) : (
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 text-sm leading-7 text-white/68 xl:col-span-3">
                  No flora match the current search and filter combination. Try
                  clearing a filter to reveal more of the current collection.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="relative flex min-h-[32rem] items-stretch py-2 lg:min-h-[calc(100vh-10rem)] lg:py-8">
          <div className="absolute inset-0 rounded-[2.2rem] border border-white/8 bg-white/4 backdrop-blur-[1px]" />
          <div className="relative flex-1 overflow-hidden rounded-[2.2rem]">
            <InteractiveGlobe flora={filteredFlora} />
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

function FilterRow({
  label,
  options,
  activeValue,
  onSelect,
}: {
  label: string;
  options: string[];
  activeValue: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-[0.28em] text-white/40">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.18em] transition ${
              activeValue === option
                ? "border-cyan-300/55 bg-cyan-300/12 text-cyan-100"
                : "border-white/10 bg-black/15 text-white/58 hover:border-white/18 hover:text-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
