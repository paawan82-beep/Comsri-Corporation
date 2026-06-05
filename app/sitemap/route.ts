import { NextResponse } from "next/server";
import { getSitemapIndexXml } from "../sitemap";

export async function GET() {
  const xml = await getSitemapIndexXml();
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}


