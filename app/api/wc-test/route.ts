import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY!;
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET!;
  const url = `${process.env.WOOCOMMERCE_URL}/wp-json/wc/v3/products?consumer_key=${key}&consumer_secret=${secret}`;

  const res = await fetch(url);

  return NextResponse.json({
    status: res.status,
    body: await res.text(),
  });
}
