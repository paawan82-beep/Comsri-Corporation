import { NextResponse } from "next/server";
import { getAbsoluteUrl } from "../../seo/seo-utils";
import * as fs from "fs";
import * as path from "path";
import { SITE_CONFIG } from "../../seo/constants";
import { woocommerce } from "../../../lib/services/woocommerce";

export async function GET() {
  let itemEntries = "";
  let products: any[] = [];
  let fetchedLive = false;

  try {
    // Attempt dynamic fetch from WooCommerce API
    const liveCatalog = await woocommerce.getProducts({ per_page: 100, status: "publish" });
    if (liveCatalog && liveCatalog.data && liveCatalog.data.length > 0) {
      products = liveCatalog.data;
      fetchedLive = true;
      console.log(`[Merchant Feed API]: Fetched ${products.length} live products dynamically from WooCommerce API.`);
    }
  } catch (error) {
    console.warn("[Merchant Feed API Warning]: WooCommerce live fetch failed, using fallback database:", error);
  }

  // Fallback to static products dump if live fetch failed
  if (!fetchedLive) {
    try {
      const dumpPath = path.join(process.cwd(), "products_dump.json");
      if (fs.existsSync(dumpPath)) {
        const fileData = fs.readFileSync(dumpPath, "utf-8");
        products = JSON.parse(fileData);
        console.log(`[Merchant Feed API]: Loaded ${products.length} products from static fallback database.`);
      }
    } catch (error) {
      console.error("[Merchant Feed API Error]: Failed to read static fallback catalog:", error);
    }
  }

  try {
    products.forEach((prod) => {
      if (!prod.slug) return;

      // A product with no valid price will be disapproved by Merchant Center,
      // so skip it rather than emit an empty <g:price>.
      const rawPrice = prod.regular_price || prod.price;
      const hasPrice = rawPrice !== "" && rawPrice !== null && rawPrice !== undefined && !isNaN(parseFloat(rawPrice)) && parseFloat(rawPrice) > 0;
      if (!hasPrice) return;

      const id = prod.id || prod.slug;
      const title = prod.name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      
      // Clean HTML description to plain text
      let cleanDescription = prod.short_description || prod.description || "Premium refurbished computer hardware from Comsri Corporation.";
      cleanDescription = cleanDescription
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .trim();
      cleanDescription = cleanDescription.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

      const link = getAbsoluteUrl(`/products/${prod.slug}`);
      let imageLink = prod.images?.[0]?.src || `${SITE_CONFIG.url}/images/og-default.jpg`;
      // Serve WooCommerce media from the cms subdomain. Match the bare domain
      // only (with the // boundary) so already-correct cms.comsri.com URLs
      // aren't double-prefixed into the unreachable cms.cms.comsri.com.
      if (imageLink.includes("//comsri.com/wp-content/")) {
        imageLink = imageLink.replace("//comsri.com/wp-content/", "//cms.comsri.com/wp-content/");
      }

      const price = `${rawPrice} INR`;
      const salePriceXml = prod.on_sale && prod.sale_price ? `\n      <g:sale_price>${prod.sale_price} INR</g:sale_price>` : "";
      const availability = prod.stock_status === "instock" ? "in_stock" : "out_of_stock";

      // Normalize categories (handles both WooCommerce object array and mock string array)
      const categories: string[] = prod.categories?.map((c: any) => typeof c === "object" ? c.name : c) || [];

      // Determine condition
      const isRefurbished = prod.name.toLowerCase().includes("refurbished") || 
                            categories.some((c: string) => c.toLowerCase().includes("refurbished"));
      const condition = isRefurbished ? "refurbished" : "new";

      // Determine Brand
      const lowerName = prod.name.toLowerCase();
      let brand = "Comsri";
      if (lowerName.includes("apple") || lowerName.includes("macbook")) brand = "Apple";
      else if (lowerName.includes("dell")) brand = "Dell";
      else if (lowerName.includes("hp") || lowerName.includes("hewlett")) brand = "HP";
      else if (lowerName.includes("lenovo") || lowerName.includes("thinkpad")) brand = "Lenovo";
      else if (lowerName.includes("microsoft") || lowerName.includes("surface")) brand = "Microsoft";
      else if (lowerName.includes("acer")) brand = "Acer";
      else if (lowerName.includes("asus")) brand = "Asus";

      // Determine Google Product Category
      let googleProductCategory = "Electronics > Computers";
      const catString = categories.join(" ").toLowerCase();
      if (catString.includes("laptop")) {
        googleProductCategory = "Electronics > Computers > Laptops";
      } else if (catString.includes("desktop") || catString.includes("workstation") || catString.includes("mini pc")) {
        googleProductCategory = "Electronics > Computers > Desktop Computers";
      }

      itemEntries += `
  <item>
    <g:id>${id}</g:id>
    <g:title>${title}</g:title>
    <g:description>${cleanDescription}</g:description>
    <g:link>${link}</g:link>
    <g:image_link>${imageLink}</g:image_link>
    <g:price>${price}</g:price>${salePriceXml}
    <g:availability>${availability}</g:availability>
    <g:condition>${condition}</g:condition>
    <g:brand>${brand}</g:brand>
    <g:google_product_category>${googleProductCategory}</g:google_product_category>
  </item>`;
    });
  } catch (error) {
    console.error("Error generating Google Merchant Feed:", error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${SITE_CONFIG.name}</title>
    <link>${SITE_CONFIG.url}</link>
    <description>${SITE_CONFIG.description}</description>${itemEntries}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
