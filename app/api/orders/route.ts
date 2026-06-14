import { NextRequest, NextResponse } from "next/server";
import { woocommerce } from "@/lib/services/woocommerce";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * Returns the authenticated customer's WooCommerce orders.
 *
 * SECURITY: the caller MUST present a valid Supabase access token via the
 * `Authorization: Bearer <token>` header. The email used for the lookup is
 * derived from that verified token — never from a client-supplied query param.
 * This prevents the previous IDOR where anyone could read any customer's
 * order history (PII) just by passing ?email=.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : "";

  if (!token) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  // Validate the JWT against Supabase Auth and pull the trusted identity.
  const { data, error: authError } = await supabase.auth.getUser(token);
  const email = data?.user?.email;

  if (authError || !email) {
    return NextResponse.json({ error: "Invalid or expired session." }, { status: 401 });
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
