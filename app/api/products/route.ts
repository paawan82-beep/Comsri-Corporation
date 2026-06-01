import { NextRequest, NextResponse } from "next/server";
import { getFilteredCatalog } from "@/lib/services/catalog";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const per_page = parseInt(searchParams.get("per_page") || "12", 10);
  const min_price = searchParams.get("min_price") || undefined;
  const max_price = searchParams.get("max_price") || undefined;
  const on_sale = searchParams.get("on_sale") === "true" ? true : undefined;
  const orderbyParam = searchParams.get("orderby") || "date";

  try {
    const catalogResult = await getFilteredCatalog({
      category,
      search,
      page,
      per_page,
      min_price,
      max_price,
      on_sale,
      orderby: orderbyParam,
    });

    return NextResponse.json(catalogResult);
  } catch (error: any) {
    console.error("[API Products Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
