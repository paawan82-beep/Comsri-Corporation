import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { constructMetadata } from "./seo/metadata";
import { getFilteredCatalog } from "@/lib/services/catalog";

// Render on every request so a WooCommerce outage can never bake the
// products_dump.json fallback (placeholder ₹15,000 prices) into a
// statically-cached homepage for up to an hour. The underlying catalog
// fetches still use the Data Cache (revalidate 3600), so live requests
// stay fast while the full-route HTML is never served stale.
export const dynamic = "force-dynamic";

export const metadata: Metadata = constructMetadata({
  title: "Buy Refurbished Laptops & Desktops Online in India",
  description: "Premium refurbished laptops, desktops, workstations, and corporate IT hardware online in India. Fully tested 40+ points quality certified with 1-year warranty.",
  path: "/",
  keywords: ["refurbished laptops", "refurbished desktops", "refurbished computers", "headless e-commerce", "cheap laptops India"],
});

export default async function Home() {
  let initialLaptops: any[] = [];
  let initialDesktops: any[] = [];
  let latestPosts: any[] = [];

  try {
    const [laptopsData, desktopsData, postsRes] = await Promise.all([
      getFilteredCatalog({ category: "112", per_page: 15 }),
      getFilteredCatalog({ category: "129", per_page: 15 }),
      fetch("https://cms.comsri.com/wp-json/wp/v2/posts?_embed=true&per_page=6", {
        next: { revalidate: 3600 },
      })
    ]);
    initialLaptops = laptopsData?.data || [];
    initialDesktops = desktopsData?.data || [];
    if (postsRes.ok) {
      latestPosts = await postsRes.json();
    }
  } catch (error) {
    console.error("Failed to load server-side catalog/posts on page mount:", error);
  }

  return (
    <HomeClient 
      initialLaptops={initialLaptops} 
      initialDesktops={initialDesktops} 
      latestPosts={latestPosts}
    />
  );
}
