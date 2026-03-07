"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { FloraPreview } from "@/lib/flora-data";
import { getFloraPalette } from "@/lib/visual-theme";

type FloraIndexClientProps = {
  flora: FloraPreview[];
};

export function FloraIndexClient({ flora }: FloraIndexClientProps) {
  const [query, setQuery] = useState("");

  const filteredFlora = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return flora;
    }

    return flora.filter((item) => {
      return (
        item.commonName.toLowerCase().includes(normalizedQuery) ||
        item.scientificName.toLowerCase().includes(normalizedQuery) ||
        item.primaryRegion?.name.toLowerCase().includes(normalizedQuery) ||
        item.biomes.some((biome) => biome.name.toLowerCase().includes(normalizedQuery))
      );
    });
  }, [flora, query]);

  return (
    <div className="mt-10 space-y-8">
      <div className="rounded-[2rem] border border-white/10 bg-white/6 p-5 backdrop-blur-xl">
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-white/40">
            Search flora
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by common name, scientific name, region, or biome..."
            className="w-full rounded-full border border-white/10 bg-slate-950/70 px-5 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/45"
          />
        </label>
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
                <span className="rounded-full border border-white/10 px-3 py-1">
                  {item.primaryRegion?.name ?? "Curated flora"}
                </span>
                {item.biomes[0] ? (
                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {item.biomes[0].name}
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
