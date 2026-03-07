import { HomepageShell } from "@/components/home/homepage-shell";
import { getAllFlora } from "@/lib/flora-data";
import { getHomepageRegions } from "@/lib/region-data";

export default async function Home() {
  const [flora, regions] = await Promise.all([
    getAllFlora(),
    getHomepageRegions(),
  ]);

  return <HomepageShell flora={flora} regions={regions} />;
}
