import { NextResponse } from "next/server";
import { getAbsoluteUrl } from "./seo/seo-utils";

export async function GET() {
  const currentDate = new Date().toISOString();
  let posts: any[] = [];

  try {
    const res = await fetch("https://comsri.com/wp-json/wp/v2/posts?per_page=20", {
      next: { revalidate: 3600 }
    });
    if (res.ok) {
      posts = await res.json();
    }
  } catch (error) {
    console.error("Error fetching WP posts for sitemap:", error);
  }

  let urlEntries = "";
  
  // Static blog landing page
  urlEntries += `
  <url>
    <loc>${getAbsoluteUrl("/blog")}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;

  if (posts.length > 0) {
    posts.forEach((post) => {
      if (post.slug) {
        urlEntries += `
  <url>
    <loc>${getAbsoluteUrl(`/blog/${post.slug}`)}</loc>
    <lastmod>${post.modified || currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }
    });
  } else {
    // Static fallback posts
    const fallbackSlugs = [
      "bulk-refurbished-computers-dealers",
      "bulk-refurbished-laptops-for-offices",
      "e-waste-recycling-explained"
    ];
    fallbackSlugs.forEach((slug) => {
      urlEntries += `
  <url>
    <loc>${getAbsoluteUrl(`/blog/${slug}`)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });
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
