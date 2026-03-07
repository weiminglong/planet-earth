"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { RegionPreview } from "@/lib/region-data";

type RegionIndexClientProps = {
  regions: RegionPreview[];
};

export function RegionIndexClient({ regions }: RegionIndexClientProps) {
  const [query, setQuery] = useState("");
  const [continent, setContinent] = useState("all");
  const [biome, setBiome] = useState("all");

  const continentOptions = useMemo(
    () => [
      { label: "All continents", value: "all" },
      ...regions
        .map((region) => region.parentRegion)
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
    [regions],
  );

  const biomeOptions = useMemo(
    () => [
      { label: "All biomes", value: "all" },
      ...[...new Set(regions.flatMap((region) => region.biomeNames))]
        .sort((left, right) => left.localeCompare(right))
        .map((biomeName) => ({
          label: biomeName,
          value: biomeName,
        })),
    ],
    [regions],
  );

  const filteredRegions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return regions.filter((region) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        region.name.toLowerCase().includes(normalizedQuery) ||
        region.summary.toLowerCase().includes(normalizedQuery) ||
        region.biomeNames.some((biomeName) =>
          biomeName.toLowerCase().includes(normalizedQuery),
        );

      const matchesContinent =
        continent === "all" || region.parentRegion?.slug === continent;

      const matchesBiome =
        biome === "all" || region.biomeNames.some((biomeName) => biomeName === biome);

      return matchesQuery && matchesContinent && matchesBiome;
    });
  }, [biome, continent, query, regions]);

  return (
    <div className="mt-10 space-y-8">
      <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/6 p-5 backdrop-blur-xl lg:grid-cols-[minmax(0,1fr)_auto_auto]">
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-white/40">
            Search regions
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a region, climate, or biome..."
            className="w-full rounded-full border border-white/10 bg-slate-950/70 px-5 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/45"
          />
        </label>

        <FilterSelect
          label="Continent"
          value={continent}
          options={continentOptions}
          onChange={setContinent}
        />
        <FilterSelect
          label="Biome"
          value={biome}
          options={biomeOptions}
          onChange={setBiome}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredRegions.map((region) => (
          <Link
            key={region.slug}
            href={`/regions/${region.slug}`}
            className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.12),_transparent_24%),rgba(255,255,255,0.04)] p-6 transition hover:-translate-y-1 hover:border-white/20"
          >
            <div className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.24em] text-white/44">
              {region.parentRegion ? (
                <span className="rounded-full border border-white/10 px-3 py-1">
                  {region.parentRegion.name}
                </span>
              ) : null}
              <span className="rounded-full border border-white/10 px-3 py-1">
                {region.type.replaceAll("-", " ")}
              </span>
            </div>

            <h2 className="mt-5 font-display text-4xl text-white">{region.name}</h2>
            <p className="mt-4 text-sm leading-7 text-white/72">{region.summary}</p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <StatCard label="Flora stories" value={String(region.floraCount)} />
              <StatCard
                label="Endemic highlights"
                value={String(region.endemicFloraCount)}
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/60">
              {region.biomeNames.slice(0, 4).map((biomeName) => (
                <span
                  key={biomeName}
                  className="rounded-full border border-white/10 px-3 py-1"
                >
                  {biomeName}
                </span>
              ))}
            </div>
          </Link>
        ))}

        {!filteredRegions.length ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm leading-7 text-white/68 lg:col-span-2">
            No regions match that search yet. Try another continent, biome, or
            keyword.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{
    label: string;
    value: string;
  }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block lg:min-w-[13rem]">
      <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-white/40">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-full border border-white/10 bg-slate-950/70 px-5 py-3 text-sm text-white outline-none transition focus:border-cyan-300/45"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.35rem] border border-white/8 bg-black/20 p-4">
      <div className="font-display text-3xl text-white">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.26em] text-white/42">
        {label}
      </div>
    </div>
  );
}
