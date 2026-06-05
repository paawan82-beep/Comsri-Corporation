import { NextResponse } from "next/server";
import { getAbsoluteUrl } from "./seo/seo-utils";
import * as fs from "fs";
import * as path from "path";

export async function GET() {
  const currentDate = new Date().toISOString();
  let urlEntries = "";

  // Add root logo image
  urlEntries += `
  <url>
    <loc>${getAbsoluteUrl("")}</loc>
    <image:image>
      <image:loc>${getAbsoluteUrl("/images/logo.png")}</image:loc>
      <image:title>Comsri Corporation Logo</image:title>
    </image:image>
  </url>`;

  // Add product images from dynamic dump
  try {
    const dumpPath = path.join(process.cwd(), "products_dump.json");
    if (fs.existsSync(dumpPath)) {
      const fileData = fs.readFileSync(dumpPath, "utf-8");
      const products: any[] = JSON.parse(fileData);

      products.forEach((prod) => {
        // Exclude placeholders or empty slugs
        if (prod.slug && prod.name) {
          // Find standard product images, skipping simple icons or low-res placeholders
          const productUrl = getAbsoluteUrl(`/products/${prod.slug}`);
          let imageLoc = "https://picsum.photos/seed/shop/800/600"; // fallback

          if (prod.images && prod.images.length > 0) {
            imageLoc = prod.images[0].src;
          } else if (prod.imgSrc) {
            imageLoc = prod.imgSrc;
          }

          urlEntries += `
  <url>
    <loc>${productUrl}</loc>
    <image:image>
      <image:loc>${imageLoc}</image:loc>
      <image:title>${prod.name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</image:title>
    </image:image>
  </url>`;
        }
      });
    }
  } catch (error) {
    console.error("Error reading image sitemap data:", error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urlEntries}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
