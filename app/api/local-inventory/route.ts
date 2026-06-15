import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { SITE_CONFIG } from "../../seo/constants";
import { woocommerce } from "../../../lib/services/woocommerce";

export async function GET() {
  let itemEntries = "";
  const storeCode = process.env.LOCAL_STORE_CODE || "13865714257187921753";
  let products: any[] = [];
  let fetchedLive = false;

  try {
    // Attempt dynamic fetch from WooCommerce API
    const liveCatalog = await woocommerce.getProducts({ per_page: 100, status: "publish" });
    if (liveCatalog && liveCatalog.data && liveCatalog.data.length > 0) {
      products = liveCatalog.data;
      fetchedLive = true;
      console.log(`[Local Inventory Feed]: Fetched ${products.length} live products dynamically from WooCommerce API.`);
    }
  } catch (error) {
    console.warn("[Local Inventory Feed Warning]: WooCommerce live fetch failed, using fallback database:", error);
  }

  // Fallback to static products dump if live fetch failed
  if (!fetchedLive) {
    try {
      const dumpPath = path.join(process.cwd(), "products_dump.json");
      if (fs.existsSync(dumpPath)) {
        const fileData = fs.readFileSync(dumpPath, "utf-8");
        products = JSON.parse(fileData);
        console.log(`[Local Inventory Feed]: Loaded ${products.length} products from static fallback database.`);
      }
    } catch (error) {
      console.error("[Local Inventory Feed Error]: Failed to read static fallback catalog:", error);
    }
  }

  // Escape characters that would break XML
  const esc = (value: unknown) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  try {
    products.forEach((prod) => {
      if (!prod.slug) return;

      const id = prod.id || prod.slug;
      const availability = prod.stock_status === "instock" ? "in_stock" : "out_of_stock";
      const quantity = prod.stock_quantity !== null && prod.stock_quantity !== undefined ? prod.stock_quantity : 5; // Default fallback quantity to 5 if manage stock is off

      // Only emit a price when we have a valid positive number; an empty
      // price is invalid and triggers "missing inventory data" in Merchant Center.
      const rawPrice = prod.regular_price || prod.price;
      const hasPrice = rawPrice !== "" && rawPrice !== null && rawPrice !== undefined && !isNaN(parseFloat(rawPrice)) && parseFloat(rawPrice) > 0;
      const priceXml = hasPrice ? `\n      <g:price>${esc(rawPrice)} INR</g:price>` : "";

      itemEntries += `
    <item>
      <g:item_id>${esc(id)}</g:item_id>
      <g:store_code>${esc(storeCode)}</g:store_code>
      <g:availability>${availability}</g:availability>${priceXml}
      <g:quantity>${esc(quantity)}</g:quantity>
    </item>`;
    });
  } catch (error) {
    console.error("Error generating Local Inventory Feed:", error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${SITE_CONFIG.name} Local Inventory Feed</title>
    <link>${SITE_CONFIG.url}</link>
    <description>Local product inventory mapping for physical stores</description>${itemEntries}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
