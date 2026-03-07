import { Suspense } from "react";
import { FloraIndexClient } from "@/components/flora/flora-index-client";
import { SiteHeader } from "@/components/site/site-header";
import { getAllFlora } from "@/lib/flora-data";

export const metadata = {
  title: "Flora Index",
  description: "Browse the first curated flora entries in Living Flora Globe.",
};

export default async function FloraPage() {
  const flora = await getAllFlora();

  return (
    <div className="min-h-screen bg-[#02040a] text-white">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 md:px-6 xl:px-8">
        <SiteHeader compact />

        <section className="mt-10 rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_24%),radial-gradient(circle_at_90%_10%,_rgba(96,165,250,0.18),_transparent_28%),rgba(255,255,255,0.04)] p-8 backdrop-blur-xl md:p-10">
          <p className="text-xs uppercase tracking-[0.4em] text-white/42">
            Browse without the globe
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl leading-none text-white">
            An editorial index of the first living flora stories.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/68">
            This browse path complements the immersive homepage with searchable
            cards for every seeded flora entry in the current build.
          </p>

          <Suspense fallback={<FloraIndexFallback />}>
            <FloraIndexClient flora={flora} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}

function FloraIndexFallback() {
  return (
    <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm text-white/68">
      Loading flora filters...
    </div>
  );
}
