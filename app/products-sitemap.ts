import { NextResponse } from "next/server";
import { getAbsoluteUrl } from "./seo/seo-utils";
import { woocommerce } from "../lib/services/woocommerce";

export async function GET() {
  let urlEntries = "";

  try {
    // Source from the live WooCommerce catalogue (which has its own dump
    // fallback) so the sitemap reflects real, purchasable products instead of a
    // static dump that drifts out of sync with inventory.
    const products = await woocommerce.getAllProducts();

    products.forEach((prod: any) => {
      if (!prod.slug) return;

      // Prefer the product's genuine last-modified date; fall back to created
      // date, then now — never fabricate a uniform build-time timestamp.
      const lastmodRaw = prod.date_modified || prod.date_created || new Date().toISOString();
      const lastmod = new Date(lastmodRaw).toISOString();

      urlEntries += `
  <url>
    <loc>${getAbsoluteUrl(`/products/${prod.slug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
    });
  } catch (error) {
    console.error("Error building products sitemap:", error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
