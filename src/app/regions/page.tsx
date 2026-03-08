import { RegionIndexClient } from "@/components/regions/region-index-client";
import { SiteHeader } from "@/components/site/site-header";
import { getAllRegions } from "@/lib/region-data";

export const metadata = {
  title: "Regions",
  description:
    "Browse the regions and habitats featured in Living Flora Globe.",
};

export default async function RegionsPage() {
  const regions = await getAllRegions();

  return (
    <div className="min-h-screen bg-[#02040a] text-white">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 md:px-6 xl:px-8">
        <SiteHeader compact />

        <section className="mt-10 rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_24%),radial-gradient(circle_at_90%_10%,_rgba(96,165,250,0.18),_transparent_28%),rgba(255,255,255,0.04)] p-8 backdrop-blur-xl md:p-10">
          <p className="text-xs uppercase tracking-[0.4em] text-white/42">
            Explore by place
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl leading-none text-white">
            Regions, climates, and habitats behind each flora story.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/68">
            Move from the globe into richer geographic browsing with region
            profiles, habitat notes, endemic highlights, and linked flora.
          </p>

          <RegionIndexClient regions={regions} />
        </section>
      </div>
    </div>
  );
}
