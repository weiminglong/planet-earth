"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { FloraPreview } from "@/lib/flora-data";
import { filterFloraCollection } from "@/lib/flora-filters";
import { getFloraPalette } from "@/lib/visual-theme";

type FloraIndexClientProps = {
  flora: FloraPreview[];
};

export function FloraIndexClient({ flora }: FloraIndexClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const biome = searchParams.get("biome") ?? "all";
  const continent = searchParams.get("continent") ?? "all";
  const status = searchParams.get("status") ?? "all";
  const season = searchParams.get("season") ?? "all";
  const origin = searchParams.get("origin") ?? "all";

  const biomeOptions = useMemo(
    () => [
      { label: "All biomes", value: "all" },
      ...flora
        .flatMap((item) => item.biomes)
        .filter(
          (current, index, collection) =>
            collection.findIndex((candidate) => candidate.slug === current.slug) === index,
        )
        .sort((left, right) => left.name.localeCompare(right.name))
        .map((biomeItem) => ({
          label: biomeItem.name,
          value: biomeItem.slug,
        })),
    ],
    [flora],
  );

  const continentOptions = useMemo(
    () => [
      { label: "All continents", value: "all" },
      ...flora
        .flatMap((item) => item.continents)
        .filter(
          (current, index, collection) =>
            collection.findIndex((candidate) => candidate.slug === current.slug) === index,
        )
        .sort((left, right) => left.name.localeCompare(right.name))
        .map((continentItem) => ({
          label: continentItem.name,
          value: continentItem.slug,
        })),
    ],
    [flora],
  );

  const statusOptions = useMemo(
    () => [
      { label: "All statuses", value: "all" },
      ...[
        ...new Set(
          flora
            .map((item) => item.conservationStatus)
            .filter((statusItem): statusItem is string => Boolean(statusItem)),
        ),
      ]
        .sort((left, right) => left.localeCompare(right))
        .map((statusItem) => ({
          label: statusItem,
          value: statusItem,
        })),
    ],
    [flora],
  );

  const seasonOptions = useMemo(
    () => [
      { label: "All seasons", value: "all" },
      ...[...new Set(flora.flatMap((item) => item.bloomWindows))]
        .sort((left, right) => left.localeCompare(right))
        .map((seasonItem) => ({
          label: seasonItem,
          value: seasonItem,
        })),
    ],
    [flora],
  );

  const filteredFlora = useMemo(() => {
    return filterFloraCollection(flora, {
      query,
      biome,
      continent,
      status,
      season,
      origin,
    });
  }, [biome, continent, flora, origin, query, season, status]);

  function updateParam(key: string, value: string) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }

    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }

  return (
    <div className="mt-10 space-y-8">
      <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/6 p-5 backdrop-blur-xl lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,0.72fr))]">
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-white/40">
            Search flora
          </span>
          <input
            value={query}
            onChange={(event) => updateParam("q", event.target.value)}
            placeholder="Search by common name, scientific name, region, or biome..."
            className="w-full rounded-full border border-white/10 bg-slate-950/70 px-5 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/45"
          />
        </label>

        <FilterSelect
          label="Continent"
          value={continent}
          options={continentOptions}
          onChange={(value) => updateParam("continent", value)}
        />
        <FilterSelect
          label="Biome"
          value={biome}
          options={biomeOptions}
          onChange={(value) => updateParam("biome", value)}
        />
        <FilterSelect
          label="Bloom"
          value={season}
          options={seasonOptions}
          onChange={(value) => updateParam("season", value)}
        />
        <FilterSelect
          label="Status"
          value={status}
          options={statusOptions}
          onChange={(value) => updateParam("status", value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { label: "All origins", value: "all" },
          { label: "Native", value: "native" },
          { label: "Endemic", value: "endemic" },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => updateParam("origin", option.value)}
            className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.18em] transition ${
              origin === option.value
                ? "border-cyan-300/55 bg-cyan-300/12 text-cyan-100"
                : "border-white/10 bg-black/15 text-white/58 hover:border-white/18 hover:text-white"
            }`}
          >
            {option.label}
          </button>
        ))}

        <button
          type="button"
          onClick={() => router.replace(pathname, { scroll: false })}
          className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/58 transition hover:border-white/18 hover:text-white"
        >
          Reset filters
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredFlora.map((item) => {
          const palette = getFloraPalette(item);

          return (
            <Link
              key={item.slug}
              href={`/flora/${item.slug}`}
              className="rounded-[2rem] border p-6 transition hover:-translate-y-1"
              style={{
                background: `linear-gradient(160deg, ${palette.surface}, rgba(15, 23, 42, 0.56))`,
                borderColor: palette.border,
              }}
            >
              <div className="flex flex-wrap gap-2 text-[0.68rem] uppercase tracking-[0.24em] text-white/44">
                {item.primaryContinent ? (
                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {item.primaryContinent.name}
                  </span>
                ) : null}
                <span className="rounded-full border border-white/10 px-3 py-1">
                  {item.primaryRegion?.name ?? "Curated flora"}
                </span>
                {item.biomes[0] ? (
                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {item.biomes[0].name}
                  </span>
                ) : null}
                {item.hasEndemicOccurrence ? (
                  <span className="rounded-full border border-rose-300/25 px-3 py-1 text-rose-200/85">
                    Endemic
                  </span>
                ) : null}
              </div>

              <h2 className="mt-5 font-display text-4xl text-white">
                {item.commonName}
              </h2>
              <p className="mt-2 text-sm italic text-white/62">
                {item.scientificName}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/72">
                {item.shortDescription}
              </p>
            </Link>
          );
        })}

        {!filteredFlora.length ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm leading-7 text-white/68 lg:col-span-2">
            No flora match that search yet. Try another region, biome, or plant
            name.
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
    <label className="block">
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
