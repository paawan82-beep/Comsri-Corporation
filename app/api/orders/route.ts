import { NextRequest, NextResponse } from "next/server";
import { woocommerce } from "@/lib/services/woocommerce";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const orders = await woocommerce.getCustomerOrders(email);
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    console.error("[API Orders Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
