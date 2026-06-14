import { NextResponse } from "next/server";
import { getAbsoluteUrl } from "./seo/seo-utils";

export async function GET() {
  const currentDate = new Date().toISOString();
  
  const urls = [
    // Static Pages
    "",
    "/about-us",
    "/terms-conditions",
    "/privacy-policy",
    "/return-refund",
    "/shipping-policy",
    "/faq",
    "/bulk-orders",
    "/cart",
    "/shop",
    // Categories
    "/categories/new-laptops",
    "/categories/new-all-in-one",
    "/categories/buy-refurbished-laptops-online-in-india",
    "/categories/buy-high-quality-refurbished-desktops",
    "/categories/buy-refurbished-workstations-online-in-india",
    "/categories/buy-refurbished-mini-pcs-online-in-india",
    // Brands
    "/brands/dell",
    "/brands/hp",
    "/brands/apple",
    "/brands/lenovo",
    "/brands/microsoft",
    // Collections
    "/collections/business-laptops",
    "/collections/student-laptops",
  ];

  let urlEntries = "";
  urls.forEach((route) => {
    urlEntries += `
  <url>
    <loc>${getAbsoluteUrl(route)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${route === "" ? "1.0" : "0.85"}</priority>
  </url>`;
  });

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
