import { MetadataRoute } from "next";
import { SITE_CONFIG } from "./seo/constants";

// Dummy default export to satisfy Next.js native sitemap loader
export default function sitemapDefault(): MetadataRoute.Sitemap {
  return [];
}

// Custom XML generation logic used by the custom route handler
export async function getSitemapIndexXml() {
  const currentDate = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_CONFIG.url}/products-sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_CONFIG.url}/categories-sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_CONFIG.url}/blog-sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_CONFIG.url}/images-sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;
}
