import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { woocommerce } from "@/lib/services/woocommerce";

export const dynamic = "force-dynamic";

/** Constant-time string compare to avoid timing attacks on the diagnostic token. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const revalToken = process.env.REVALIDATION_TOKEN;
  if (!token || !revalToken || !safeEqual(token, revalToken)) {
    return NextResponse.json({ error: "Unauthorized diagnostic handshake." }, { status: 401 });
  }

  const startTime = Date.now();

  const configCheck = {
    urlConfigured: !!process.env.WOOCOMMERCE_URL,
    url: process.env.WOOCOMMERCE_URL || "(not configured)",
    keyConfigured: !!process.env.WOOCOMMERCE_CONSUMER_KEY,
    keyPrefix: process.env.WOOCOMMERCE_CONSUMER_KEY
      ? `${process.env.WOOCOMMERCE_CONSUMER_KEY.slice(0, 5)}...`
      : "(missing)",
    secretConfigured: !!process.env.WOOCOMMERCE_CONSUMER_SECRET,
    webhookSecretConfigured: !!process.env.WOOCOMMERCE_WEBHOOK_SECRET,
  };

  if (!configCheck.urlConfigured || !configCheck.keyConfigured || !configCheck.secretConfigured) {
    return NextResponse.json(
      {
        success: false,
        status: "unconfigured",
        message: "WooCommerce environment variables are not fully configured in AI Studio's settings.",
        configCheck,
        latencyMs: 0,
      },
      { status: 200 } // Return 200 so the diagnostics UI can render the onboarding guide beautifully
    );
  }

  try {
    console.log(`[Diagnostics API]: Attempting credentials hand-shake with: ${configCheck.url}`);
    
    // Test fetch: get categories with per_page=5 (fast, light-weight handshake query)
    const testFetchStart = Date.now();
    const categories = await woocommerce.getCategories();
    const handshakeLatency = Date.now() - testFetchStart;

    // Test fetch: get products page
    const productsResult = await woocommerce.getProducts({ per_page: 5, status: "publish" });

    const totalLatency = Date.now() - startTime;

    return NextResponse.json(
      {
        success: true,
        status: "connected",
        message: "Live WooCommerce secure connection verified successfully!",
        latencyMs: totalLatency,
        handshakeLatencyMs: handshakeLatency,
        apiHost: configCheck.url,
        stats: {
          categoriesFetched: categories.length,
          productsFoundInCatalog: productsResult.totalItems,
          totalPagesCount: productsResult.totalPages,
          sampleReturnedCount: productsResult.data.length,
        },
        sampleProducts: productsResult.data.slice(0, 2).map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          regular_price: p.regular_price,
          stock_status: p.stock_status,
          images: p.images.map(img => img.src),
        })),
        configCheck,
      },
      { status: 200 }
    );
  } catch (error: any) {
    const totalLatency = Date.now() - startTime;
    console.error("[Diagnostics API Error]: Connection handshake failed:", error);

    return NextResponse.json(
      {
        success: false,
        status: "error",
        message: "Failed to establish validation handshake with WooCommerce.",
        errorMessage: error.message || "Unknown WooCommerce response deviation.",
        latencyMs: totalLatency,
        configCheck,
        troubleshooting: [
          "Check if your WordPress server is online.",
          "Ensure your REST API URL uses the correct prefix (e.g. https://yourdomain.com).",
          "Verify your WooCommerce Consumer Key (ck_...) and Consumer Secret (cs_...) have both Read and Write capabilities.",
          "Confirm your webserver does not have a firewall blocking REST API basic auth requests.",
        ],
      },
      { status: 200 }
    );
  }
}
