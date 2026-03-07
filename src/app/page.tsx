import { HomepageShell } from "@/components/home/homepage-shell";
import { getHomepageFlora } from "@/lib/flora-data";

export default async function Home() {
  const flora = await getHomepageFlora();

  return <HomepageShell flora={flora} />;
}
