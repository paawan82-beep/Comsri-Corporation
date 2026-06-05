import { NextResponse } from "next/server";
import { getAbsoluteUrl } from "./seo/seo-utils";
import * as fs from "fs";
import * as path from "path";

export async function GET() {
  const currentDate = new Date().toISOString();
  let urlEntries = "";

  try {
    const dumpPath = path.join(process.cwd(), "products_dump.json");
    if (fs.existsSync(dumpPath)) {
      const fileData = fs.readFileSync(dumpPath, "utf-8");
      const products: any[] = JSON.parse(fileData);

      products.forEach((prod) => {
        if (prod.slug) {
          urlEntries += `
  <url>
    <loc>${getAbsoluteUrl(`/products/${prod.slug}`)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        }
      });
    }
  } catch (error) {
    console.error("Error reading products sitemap data:", error);
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
