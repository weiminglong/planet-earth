"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { FloraPreview } from "@/lib/flora-data";
import { getFloraPalette } from "@/lib/visual-theme";

type SelectionDrawerProps = {
  flora: FloraPreview | null;
};

export function SelectionDrawer({ flora }: SelectionDrawerProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mt-auto flex justify-end p-3 lg:inset-y-0 lg:left-auto lg:w-[24rem] lg:p-5">
      <AnimatePresence mode="wait">
        {flora ? (
          <DrawerCard key={flora.slug} flora={flora} />
        ) : (
          <motion.aside
            key="empty"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="pointer-events-auto w-full max-w-sm rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-2xl"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-white/45">
              Select a marker
            </p>
            <h2 className="mt-3 font-display text-3xl text-white">
              Follow a living thread.
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/65">
              Click a glowing marker on the globe to open a botanical preview
              with habitat, bloom season, and a direct route into the story.
            </p>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

function DrawerCard({ flora }: { flora: FloraPreview }) {
  const palette = getFloraPalette(flora);

  return (
    <motion.aside
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-[2rem] border bg-slate-950/78 p-6 shadow-2xl backdrop-blur-2xl"
      style={{
        borderColor: palette.border,
        boxShadow: `0 24px 90px -34px ${palette.glow}`,
      }}
      aria-live="polite"
    >
      <div
        className="rounded-[1.5rem] border p-5"
        style={{
          background: `linear-gradient(160deg, ${palette.surface}, rgba(2, 6, 23, 0.48))`,
          borderColor: palette.border,
        }}
      >
        <div className="flex flex-wrap gap-2 text-[0.68rem] uppercase tracking-[0.28em] text-white/70">
          <span className="rounded-full border border-white/10 px-3 py-1">
            {flora.primaryRegion?.name ?? "Global selection"}
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            {flora.floraType}
          </span>
          {flora.biomes[0] ? (
            <span className="rounded-full border border-white/10 px-3 py-1">
              {flora.biomes[0].name}
            </span>
          ) : null}
        </div>

        <h2 className="mt-5 font-display text-4xl leading-none text-white">
          {flora.commonName}
        </h2>
        <p className="mt-2 text-sm italic text-white/70">
          {flora.scientificName}
        </p>
        <p className="mt-4 text-sm leading-7 text-white/72">
          {flora.shortDescription}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-white/8 bg-white/4 p-3">
            <dt className="text-xs uppercase tracking-[0.22em] text-white/45">
              Seasonality
            </dt>
            <dd className="mt-2 text-white/88">
              {flora.bloomSeason ?? "Seasonal variation"}
            </dd>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/4 p-3">
            <dt className="text-xs uppercase tracking-[0.22em] text-white/45">
              Status
            </dt>
            <dd className="mt-2 text-white/88">
              {flora.conservationStatus ?? "Undocumented"}
            </dd>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/4 p-3">
            <dt className="text-xs uppercase tracking-[0.22em] text-white/45">
              Origin
            </dt>
            <dd className="mt-2 text-white/88">
              {flora.hasEndemicOccurrence
                ? "Endemic"
                : flora.hasNativeOccurrence
                  ? "Native"
                  : "Introduced"}
            </dd>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/4 p-3">
            <dt className="text-xs uppercase tracking-[0.22em] text-white/45">
              Flora type
            </dt>
            <dd className="mt-2 text-white/88">{flora.floraType}</dd>
          </div>
        </dl>

        {flora.facts[0] ? (
          <div className="mt-6 rounded-2xl border border-white/8 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.26em] text-white/45">
              Memorable fact
            </p>
            <p className="mt-3 text-sm leading-7 text-white/72">
              {flora.facts[0]}
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          href={`/flora/${flora.slug}`}
          className="rounded-full px-5 py-3 text-sm font-medium text-slate-950 transition hover:brightness-110"
          style={{
            background: `linear-gradient(135deg, ${palette.accentSoft}, ${palette.accent})`,
          }}
        >
          Open flora story
        </Link>
        {flora.primaryRegion ? (
          <Link
            href={`/regions/${flora.primaryRegion.slug}`}
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/75 transition hover:border-white/20 hover:text-white"
          >
            Explore region
          </Link>
        ) : null}
        <Link
          href="/flora"
          className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/75 transition hover:border-white/20 hover:text-white"
        >
          Browse all flora
        </Link>
      </div>
    </motion.aside>
  );
}
