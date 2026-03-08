import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site/site-header";
import { getFloraPalette } from "@/lib/visual-theme";
import { getRegionBySlug } from "@/lib/region-data";

type RegionDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: RegionDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = await getRegionBySlug(slug);

  if (!region) {
    return {
      title: "Region not found",
    };
  }

  return {
    title: region.name,
    description: region.summary,
  };
}

export default async function RegionDetailPage({
  params,
}: RegionDetailPageProps) {
  const { slug } = await params;
  const region = await getRegionBySlug(slug);

  if (!region) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#02040a] text-white">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 md:px-6 xl:px-8">
        <SiteHeader compact />

        <section className="mt-10 overflow-hidden rounded-[2.6rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.12),_transparent_22%),radial-gradient(circle_at_90%_15%,_rgba(96,165,250,0.14),_transparent_26%),rgba(255,255,255,0.04)] p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)]">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.4em] text-white/42">
                Region profile
              </p>
              <div>
                <h1 className="font-display text-6xl leading-none text-white md:text-7xl">
                  {region.name}
                </h1>
                <p className="mt-3 text-sm uppercase tracking-[0.26em] text-white/52">
                  {region.parentRegion
                    ? `${region.parentRegion.name} · ${region.type.replaceAll("-", " ")}`
                    : region.type.replaceAll("-", " ")}
                </p>
              </div>

              <p className="max-w-3xl text-base leading-8 text-white/74">
                {region.summary}
              </p>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  label="Flora stories"
                  value={String(region.floraCount)}
                />
                <MetricCard
                  label="Endemic highlights"
                  value={String(region.endemicFloraCount)}
                />
                <MetricCard label="Latitude" value={region.lat.toFixed(1)} />
                <MetricCard label="Longitude" value={region.lng.toFixed(1)} />
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-[2rem] border border-white/8 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.32em] text-white/44">
                  Climate notes
                </p>
                <p className="mt-4 text-sm leading-7 text-white/72">
                  {region.climateNotes ??
                    "Climate notes will be expanded as the editorial atlas grows."}
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/8 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.32em] text-white/44">
                  Habitat palette
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {region.biomeNames.map((biomeName) => (
                    <span
                      key={biomeName}
                      className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/72"
                    >
                      {biomeName}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/8 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.32em] text-white/44">
                  Quick navigation
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/regions"
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/72 transition hover:border-white/20 hover:text-white"
                  >
                    All regions
                  </Link>
                  <Link
                    href="/flora"
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/72 transition hover:border-white/20 hover:text-white"
                  >
                    Flora index
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/42">
                Flora in this region
              </p>
              <h2 className="mt-2 font-display text-4xl text-white">
                Botanical stories rooted in {region.name}
              </h2>
            </div>
            {region.parentRegion ? (
              <p className="text-sm text-white/58">
                Within {region.parentRegion.name}
              </p>
            ) : null}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {region.flora.map((flora) => {
              const palette = getFloraPalette({
                slug: flora.slug,
                visualTheme: flora.visualTheme,
              });

              return (
                <Link
                  key={flora.slug}
                  href={`/flora/${flora.slug}`}
                  className="rounded-[1.75rem] border p-5 transition hover:-translate-y-1"
                  style={{
                    background: `linear-gradient(160deg, ${palette.surface}, rgba(15, 23, 42, 0.56))`,
                    borderColor: palette.border,
                  }}
                >
                  <div className="flex flex-wrap gap-2 text-[0.68rem] uppercase tracking-[0.24em] text-white/44">
                    {flora.biomes.map((biome) => (
                      <span
                        key={biome.slug}
                        className="rounded-full border border-white/10 px-3 py-1"
                      >
                        {biome.name}
                      </span>
                    ))}
                    {flora.isEndemic ? (
                      <span className="rounded-full border border-rose-300/25 px-3 py-1 text-rose-200/85">
                        Endemic
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-5 font-display text-4xl text-white">
                    {flora.commonName}
                  </h3>
                  <p className="mt-2 text-sm italic text-white/62">
                    {flora.scientificName}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-white/72">
                    {flora.shortDescription}
                  </p>
                </Link>
              );
            })}
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
