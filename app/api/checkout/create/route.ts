import { NextRequest, NextResponse } from "next/server";
import { woocommerce } from "@/lib/services/woocommerce";

export const dynamic = "force-dynamic";

// Razorpay order creation is done via the REST API directly (instead of the
// `razorpay` Node SDK) to keep the Cloudflare Worker bundle within the free-plan
// size limit and to stay compatible with the Workers runtime.
async function createRazorpayOrder(options: {
  amount: number;
  currency: string;
  receipt: string;
  notes: Record<string, string>;
}): Promise<{ id: string; amount: number; currency: string }> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay API Keys are missing in the server's environment configuration.");
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(options),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Razorpay order creation failed (${res.status}): ${errText}`);
  }

  return res.json();
}

// Simple in-memory rate limiter store to protect API from flooding
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const LIMIT = 5; // Allow max 5 checkout requests
const WINDOW_MS = 60 * 1000; // per 1 minute window

/**
 * Checkout Transaction Initiator
 * Generates WooCommerce Order and corresponding Razorpay Transaction securely on the server.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Enforce API Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const now = Date.now();
    const clientLimit = rateLimitStore.get(ip);

    if (clientLimit) {
      if (now > clientLimit.resetTime) {
        // Window expired, reset limit
        rateLimitStore.set(ip, { count: 1, resetTime: now + WINDOW_MS });
      } else if (clientLimit.count >= LIMIT) {
        // Limit exceeded
        return NextResponse.json(
          { error: "Too many checkout requests. Please try again after 60 seconds." },
          { status: 429 }
        );
      } else {
        clientLimit.count++;
      }
    } else {
      rateLimitStore.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    }

    const { items, productId, quantity = 1, billing, shipping, couponCode } = await req.json();

    let orderItems: { product_id: number; quantity: number }[] = [];
    let totalLinePrice = 0;
    let descriptionNote = "";
    let firstProductName = "";

    if (items && Array.isArray(items) && items.length > 0) {
      console.log(`[Checkout API]: Processing multi-item order with ${items.length} items...`);
      for (const item of items) {
        const id = parseInt(item.productId || item.product_id, 10);
        const qty = parseInt(item.quantity, 10) || 1;

        const product = await woocommerce.getProductById(id);
        if (!firstProductName) {
          firstProductName = product.name;
        }
        if (product.stock_status !== "instock") {
          return NextResponse.json({ error: `Product "${product.name}" is currently out of stock.` }, { status: 400 });
        }
        if (product.manage_stock && product.stock_quantity !== null && product.stock_quantity < qty) {
          return NextResponse.json(
            { error: `Insufficient stock for "${product.name}". Only ${product.stock_quantity} units remaining.` },
            { status: 400 }
          );
        }

        const activePrice = parseFloat(product.price || "0.00");
        totalLinePrice += activePrice * qty;
        orderItems.push({ product_id: id, quantity: qty });
        descriptionNote += `${product.name} (x${qty}), `;
      }
      descriptionNote = descriptionNote.slice(0, 120);
    } else {
      if (!productId) {
        return NextResponse.json({ error: "Product ID or items list is required for checkout creation." }, { status: 400 });
      }
      const id = parseInt(productId, 10);
      const qty = parseInt(quantity, 10) || 1;

      const product = await woocommerce.getProductById(id);
      firstProductName = product.name;
      if (product.stock_status !== "instock") {
        return NextResponse.json({ error: "The selected item is currently out of stock." }, { status: 400 });
      }
      if (product.manage_stock && product.stock_quantity !== null && product.stock_quantity < qty) {
        return NextResponse.json(
          { error: `Insufficient stock. Only ${product.stock_quantity} units remaining in inventory.` },
          { status: 400 }
        );
      }

      const activePrice = parseFloat(product.price || "0.00");
      totalLinePrice = activePrice * qty;
      orderItems.push({ product_id: id, quantity: qty });
      descriptionNote = `${product.name} (x${qty})`;
    }

    // Apply Coupon Code Validation and Discount calculation server-side dynamically from WooCommerce
    let discountAmount = 0;
    if (couponCode) {
      const activeCoupon = await woocommerce.getCoupon(couponCode);
      if (!activeCoupon) {
        return NextResponse.json({ error: "Invalid or expired coupon code applied." }, { status: 400 });
      }

      const couponType = activeCoupon.discount_type; // e.g. 'percent' or 'fixed_cart'
      const amount = parseFloat(activeCoupon.amount || "0");

      if (couponType === "percent") {
        discountAmount = totalLinePrice * (amount / 100);
      } else if (couponType === "fixed_cart" || couponType === "fixed_product") {
        discountAmount = Math.min(amount, totalLinePrice);
      } else {
        // Fallback for custom percentage calculations
        discountAmount = totalLinePrice * (amount / 100);
      }

      totalLinePrice = Math.max(0, totalLinePrice - discountAmount);
      descriptionNote += ` [Discount Coupon: ${couponCode.toUpperCase()}]`;
    }

    if (totalLinePrice <= 0 && discountAmount === 0) {
      return NextResponse.json({ error: "Invalid checkout total transaction value." }, { status: 400 });
    }

    // 3. CREATE PENDING ORDER IN WOOCOMMERCE
    console.log(`[Checkout API]: Registering pending holding order in WooCommerce...`);
    const wooOrderPayload = {
      status: "pending" as const,
      currency: "INR",
      payment_method: "razorpay",
      payment_method_title: "Razorpay Payments Secured",
      billing: billing || {
        first_name: "John",
        last_name: "Doe",
        address_1: "123 Business Lane",
        city: "Mumbai",
        state: "Maharashtra",
        postcode: "400001",
        country: "IN",
        email: "guest_buyer@headlessstore.com",
        phone: "9876543210",
      },
      shipping: shipping || {
        first_name: "John",
        last_name: "Doe",
        address_1: "123 Business Lane",
        city: "Mumbai",
        state: "Maharashtra",
        postcode: "400001",
        country: "IN",
      },
      line_items: orderItems,
      discount_total: discountAmount.toString(),
      coupon_lines: couponCode ? [{ code: couponCode.toLowerCase() }] : [],
      meta_data: [
        { key: "_created_via_nextjs_headless", value: "yes" },
        ...(couponCode ? [{ key: "_applied_coupon_code", value: couponCode }] : []),
      ],
    };

    const createdWooOrder = await woocommerce.createOrder(wooOrderPayload);
    const wooOrderId = createdWooOrder.id;

    if (!wooOrderId) {
      throw new Error("WooCommerce yielded an invalid order structure with no identity ID.");
    }

    // 4. CREATE CORRESPONDING RAZORPAY PAYMENT TRANSACTION
    console.log(`[Checkout API]: Generating companion payment transaction inside Razorpay...`);

    // Razorpay works in Paisas (1 INR = 100 Paisa)
    const paisaAmount = Math.round(totalLinePrice * 100);

    const createdRzpOrder = await createRazorpayOrder({
      amount: paisaAmount,
      currency: "INR",
      receipt: wooOrderId.toString(),
      notes: {
        woocommerce_order_id: wooOrderId.toString(),
        description: descriptionNote,
      },
    });

    console.log(`[Checkout API]: Successfully synced order ${wooOrderId} with Razorpay Transaction ID: ${createdRzpOrder.id}`);

    return NextResponse.json(
      {
        success: true,
        wooCommerceOrderId: wooOrderId,
        razorpayOrderId: createdRzpOrder.id,
        amount: createdRzpOrder.amount,
        currency: createdRzpOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID || "",
        productName: firstProductName,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Checkout API Exception]:", error);
    return NextResponse.json(
      { error: "Error compounding transaction order checkout", details: error.message },
      { status: 500 }
    );
  }
}
