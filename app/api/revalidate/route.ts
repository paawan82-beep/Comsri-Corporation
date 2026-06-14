import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import crypto from "crypto";

export const dynamic = "force-dynamic";

/** Constant-time string compare to avoid timing attacks on secrets/signatures. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/** Strip surrounding quotes and whitespace from configuration tokens. */
function cleanToken(val: string | undefined | null): string {
  if (!val) return "";
  return val.trim().replace(/^["']|["']$/g, "");
}

/**
 * WooCommerce Webhook Real-time Cache Invalidation Endpoint
 * Surgically purges ISR caches on-demand when items are altered on WordPress.
 */
export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-wc-webhook-signature") || "";
    const topic = req.headers.get("x-wc-webhook-topic") || "";
    const secret = process.env.WOOCOMMERCE_WEBHOOK_SECRET;
    const cleanedSecret = cleanToken(secret);

    if (!cleanedSecret) {
      console.error("[Revalidate API Error]: WOOCOMMERCE_WEBHOOK_SECRET is not configured.");
      return NextResponse.json({ error: "Webhook secret is empty on the server." }, { status: 500 });
    }

    const rawBody = await req.text();

    // Verify raw body HMAC signature from WooCommerce
    const expectedSignature = crypto
      .createHmac("sha256", cleanedSecret)
      .update(rawBody)
      .digest("base64");

    if (!safeEqual(signature, expectedSignature)) {
      // Allow manual/token-based bypass fallback if authorized via query token
      const token = req.nextUrl.searchParams.get("token");
      const revalToken = process.env.REVALIDATION_TOKEN;
      const cleanReqToken = cleanToken(token);
      const cleanEnvToken = cleanToken(revalToken);
      if (cleanReqToken && cleanEnvToken && safeEqual(cleanReqToken, cleanEnvToken)) {
        console.log("[Revalidate API]: Authorized manual token bypass triggered.");
        const targetTag = req.nextUrl.searchParams.get("tag") || "woocommerce";
        (revalidateTag as any)(targetTag, 'max');
        return NextResponse.json({ revalidated: true, manualTag: targetTag }, { status: 200 });
      }

      console.warn("[Revalidate API Warning]: Cryptographic signature verification mismatch.");
      return NextResponse.json({ error: "Signature verification mismatch." }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const productId = payload?.id;
    const slug = payload?.slug;

    console.log(`[Revalidate API]: Webhook triggered for topic "${topic}" with ID ${productId}`);

    // Surgical Cache Purges
    // Always purge the aggregate list layout caching trigger
    (revalidateTag as any)("woocommerce-products", 'max');

    if (productId) {
      // Purge the highly structured product model page cached on-demand
      (revalidateTag as any)(`woocommerce-product-${productId}`, 'max');
      console.log(`[Revalidate API]: Purged cache tag: woocommerce-product-${productId}`);
    }

    if (slug) {
      // Purge slug mapping cache
      (revalidateTag as any)(`woocommerce-slug-${slug}`, 'max');
      console.log(`[Revalidate API]: Purged cache tag: woocommerce-slug-${slug}`);
    }

    // Purge lists that are likely affected (related arrays)
    (revalidateTag as any)("woocommerce-related", 'max');

    return NextResponse.json(
      { 
        revalidated: true, 
        topic, 
        purged_id: productId, 
        purged_slug: slug, 
        timestamp: new Date().toISOString() 
      }, 
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Revalidate API Exception]:", error);
    return NextResponse.json(
      { error: "Internal cache revalidation error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Support standard manual GET requests for quick, token-secured manual operations
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    const tag = req.nextUrl.searchParams.get("tag") || "woocommerce";
    const revalToken = process.env.REVALIDATION_TOKEN;

    const cleanReqToken = cleanToken(token);
    const cleanEnvToken = cleanToken(revalToken);

    if (!cleanReqToken || !cleanEnvToken || !safeEqual(cleanReqToken, cleanEnvToken)) {
      return NextResponse.json({ error: "Unauthorized revalidation token." }, { status: 401 });
    }

    (revalidateTag as any)(tag, 'max');
    console.info(`[Revalidate API GET]: Manually purged cache tag "${tag}" successfully.`);

    return NextResponse.json({ revalidated: true, tag, source: "manual-get" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
