import { NextResponse } from "next/server";
import { getAbsoluteUrl } from "../../seo/seo-utils";
import * as fs from "fs";
import * as path from "path";
import { SITE_CONFIG } from "../../seo/constants";

export async function GET() {
  let itemEntries = "";

  try {
    const dumpPath = path.join(process.cwd(), "products_dump.json");
    if (fs.existsSync(dumpPath)) {
      const fileData = fs.readFileSync(dumpPath, "utf-8");
      const products: any[] = JSON.parse(fileData);

      products.forEach((prod) => {
        if (!prod.slug) return;

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
        const imageLink = prod.images?.[0]?.src || `${SITE_CONFIG.url}/images/og-default.jpg`;

        const price = `${prod.regular_price || prod.price} INR`;
        const salePriceXml = prod.on_sale && prod.sale_price ? `\n      <g:sale_price>${prod.sale_price} INR</g:sale_price>` : "";
        const availability = prod.stock_status === "instock" ? "in_stock" : "out_of_stock";

        // Determine condition
        const isRefurbished = prod.name.toLowerCase().includes("refurbished") || 
                              prod.categories?.some((c: string) => c.toLowerCase().includes("refurbished"));
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
        const catString = prod.categories?.join(" ").toLowerCase() || "";
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
    }
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
