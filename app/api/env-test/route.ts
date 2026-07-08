import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    WOOCOMMERCE_URL: process.env.WOOCOMMERCE_URL ?? null,
    WOOCOMMERCE_CONSUMER_KEY: process.env.WOOCOMMERCE_CONSUMER_KEY ? "exists" : null,
    WOOCOMMERCE_CONSUMER_SECRET: process.env.WOOCOMMERCE_CONSUMER_SECRET ? "exists" : null,
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "exists" : null,
  });
}
