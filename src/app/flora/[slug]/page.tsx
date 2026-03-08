import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site/site-header";
import { getFloraBySlug } from "@/lib/flora-data";
import { getFloraPalette } from "@/lib/visual-theme";

type FloraDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: FloraDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const flora = await getFloraBySlug(slug);

  if (!flora) {
    return {
      title: "Flora not found",
    };
  }

  return {
    title: flora.commonName,
    description: flora.shortDescription,
  };
}

export default async function FloraDetailPage({
  params,
}: FloraDetailPageProps) {
  const { slug } = await params;
  const flora = await getFloraBySlug(slug);

  if (!flora) {
    notFound();
  }

  const palette = getFloraPalette(flora);

  return (
    <div className="min-h-screen bg-[#02040a] text-white">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 md:px-6 xl:px-8">
        <SiteHeader compact />

        <section
          className="mt-10 overflow-hidden rounded-[2.6rem] border p-8 md:p-10"
          style={{
            borderColor: palette.border,
            background: `radial-gradient(circle at top left, ${palette.surface}, transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(2,6,23,0.9))`,
          }}
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)]">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.4em] text-white/42">
                Flora story
              </p>
              <div>
                <h1 className="font-display text-6xl leading-none text-white md:text-7xl">
                  {flora.commonName}
                </h1>
                <p className="mt-3 text-lg italic text-white/62">
                  {flora.scientificName}
                </p>
              </div>
              <p className="max-w-3xl text-base leading-8 text-white/74">
                {flora.longDescription}
              </p>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  label="Primary region"
                  value={flora.primaryRegion?.name ?? "Curated flora"}
                />
                <MetricCard
                  label="Biome"
                  value={flora.biomes[0]?.name ?? "No biome assigned"}
                />
                <MetricCard
                  label="Bloom season"
                  value={flora.bloomSeason ?? "Seasonal variation"}
                />
                <MetricCard
                  label="Status"
                  value={flora.conservationStatus ?? "Undocumented"}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {flora.primaryRegion ? (
                  <Link
                    href={`/regions/${flora.primaryRegion.slug}`}
                    className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/72 transition hover:border-white/20 hover:text-white"
                  >
                    Explore {flora.primaryRegion.name}
                  </Link>
                ) : null}
                <Link
                  href="/flora"
                  className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/72 transition hover:border-white/20 hover:text-white"
                >
                  Browse all flora
                </Link>
              </div>
            </div>

            <div className="space-y-5">
              <div
                className="rounded-[2rem] border p-6"
                style={{
                  background: `linear-gradient(180deg, ${palette.surface}, rgba(2, 6, 23, 0.44))`,
                  borderColor: palette.border,
                }}
              >
                <p className="text-xs uppercase tracking-[0.32em] text-white/44">
                  Taxonomy
                </p>
                <dl className="mt-5 space-y-4 text-sm text-white/74">
                  <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-3">
                    <dt>Family</dt>
                    <dd>{flora.family ?? "Unspecified"}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-3">
                    <dt>Genus</dt>
                    <dd>{flora.genus ?? "Unspecified"}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt>Species</dt>
                    <dd>{flora.species ?? "Unspecified"}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-[2rem] border border-white/8 bg-white/4 p-6">
                <p className="text-xs uppercase tracking-[0.32em] text-white/44">
                  Habitat and climate
                </p>
                <p className="mt-4 text-sm leading-7 text-white/72">
                  {flora.primaryRegion?.summary ??
                    "This first build stores the region summary as the editorial habitat note."}
                </p>
                {flora.primaryRegion?.climateNotes ? (
                  <p className="mt-4 text-sm leading-7 text-white/58">
                    {flora.primaryRegion.climateNotes}
                  </p>
                ) : null}
                {flora.biomes[0]?.climateProfile ? (
                  <p className="mt-4 text-sm leading-7 text-white/58">
                    {flora.biomes[0].climateProfile}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7">
            <p className="text-xs uppercase tracking-[0.35em] text-white/42">
              Distinctive facts
            </p>
            <div className="mt-5 space-y-4">
              {(flora.facts.length
                ? flora.facts
                : [flora.shortDescription]
              ).map((fact) => (
                <div
                  key={fact}
                  className="rounded-[1.5rem] border border-white/8 bg-black/20 p-4 text-sm leading-7 text-white/72"
                >
                  {fact}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7">
            <p className="text-xs uppercase tracking-[0.35em] text-white/42">
              Cultural context
            </p>
            <div className="mt-5 space-y-4">
              {(flora.culturalNotes.length
                ? flora.culturalNotes
                : [flora.longDescription]
              ).map((note) => (
                <div
                  key={note}
                  className="rounded-[1.5rem] border border-white/8 bg-black/20 p-4 text-sm leading-7 text-white/72"
                >
                  {note}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/42">
                Continue exploring
              </p>
              <h2 className="mt-2 font-display text-4xl text-white">
                Related flora stories
              </h2>
            </div>
            <Link
              href="/"
              className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/72 transition hover:border-white/20 hover:text-white"
            >
              Return to globe
            </Link>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {flora.relatedFlora.length ? (
              flora.relatedFlora.map((related) => {
                const relatedPalette = getFloraPalette(related);

                return (
                  <Link
                    key={related.slug}
                    href={`/flora/${related.slug}`}
                    className="rounded-[1.75rem] border p-5"
                    style={{
                      background: `linear-gradient(160deg, ${relatedPalette.surface}, rgba(15, 23, 42, 0.58))`,
                      borderColor: relatedPalette.border,
                    }}
                  >
                    <div className="flex flex-wrap gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-white/44">
                      {related.reasons.slice(0, 2).map((reason) => (
                        <span
                          key={reason}
                          className="rounded-full border border-white/10 px-3 py-1"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/44">
                      {related.primaryRegion?.name ?? "Curated flora"}
                    </p>
                    <h3 className="mt-4 font-display text-3xl text-white">
                      {related.commonName}
                    </h3>
                    <p className="mt-2 text-sm text-white/62">
                      {related.scientificName}
                    </p>
                  </Link>
                );
              })
            ) : (
              <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5 text-sm text-white/68 lg:col-span-3">
                More related flora will appear here as the collection expands.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-black/22 p-5">
      <p className="text-xs uppercase tracking-[0.28em] text-white/42">
        {label}
      </p>
      <p className="mt-3 font-display text-3xl text-white">{value}</p>
    </div>
  );
}
