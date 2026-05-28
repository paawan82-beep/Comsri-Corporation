import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { woocommerce } from "@/lib/services/woocommerce";

export const dynamic = "force-dynamic";

// Helper to initialize Razorpay safely with API guards
const getRazorpayInstance = (): Razorpay => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay API Keys are missing in the server's environment configuration.");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

/**
 * Checkout Transaction Initiator
 * Generates WooCommerce Order and corresponding Razorpay Transaction securely on the server.
 */
export async function POST(req: NextRequest) {
  try {
    const { productId, quantity = 1, billing, shipping } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required for checkout creation." }, { status: 400 });
    }

    // 1. SURGICAL PRODUCT RETRIEVAL & ERROR HANDLING (Problem 2 Fix)
    // Avoids downloading the entire catalog by retrieving the single target product.
    console.log(`[Checkout API]: Verifying product ID: ${productId} with WooCommerce...`);
    let product;
    try {
      product = await woocommerce.getProductById(parseInt(productId, 10));
    } catch (err: any) {
      return NextResponse.json({ error: `Product not found: ${err.message}` }, { status: 404 });
    }

    // 2. SERVER-SIDE STOCK VERIFICATION & INVENTORY CHECK
    if (product.stock_status !== "instock") {
      return NextResponse.json({ error: "The selected item is currently out of stock." }, { status: 400 });
    }

    if (product.manage_stock && product.stock_quantity !== null && product.stock_quantity < quantity) {
      return NextResponse.json(
        { error: `Insufficient stock. Only ${product.stock_quantity} units remaining in inventory.` },
        { status: 400 }
      );
    }

    // Compute correct price. Supports sale prices if active.
    const activePrice = parseFloat(product.price || "0.00");
    const totalLinePrice = activePrice * quantity;

    if (totalLinePrice <= 0) {
      return NextResponse.json({ error: "Invalid product total transaction value." }, { status: 400 });
    }

    // 3. CREATE PENDING ORDER IN WOOCOMMERCE
    // Holds the item in a "pending" status until payment is officially confirmed via webhook.
    console.log(`[Checkout API]: Registering pending holding order in WooCommerce...`);
    const lineItem = {
      product_id: product.id,
      quantity,
    };

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
      line_items: [lineItem],
      meta_data: [{ key: "_created_via_nextjs_headless", value: "yes" }],
    };

    const createdWooOrder = await woocommerce.createOrder(wooOrderPayload);
    const wooOrderId = createdWooOrder.id;

    if (!wooOrderId) {
      throw new Error("WooCommerce yielded an invalid order structure with no identity ID.");
    }

    // 4. CREATE CORRESPONDING RAZORPAY PAYMENT TRANSACTION
    console.log(`[Checkout API]: Generating companion payment transaction inside Razorpay...`);
    const razorpay = getRazorpayInstance();

    // Razorpay works in Paisas (1 INR = 100 Paisa)
    const paisaAmount = Math.round(totalLinePrice * 100);

    const rzpOrderOptions = {
      amount: paisaAmount,
      currency: "INR",
      receipt: wooOrderId.toString(), // Hard links WooCommerce Order ID to Razorpay receipt reference
      notes: {
        woocommerce_order_id: wooOrderId.toString(),
        product_name: product.name,
        quantity: quantity.toString(),
      },
    };

    const createdRzpOrder = await razorpay.orders.create(rzpOrderOptions);

    console.log(`[Checkout API]: Successfully synced order ${wooOrderId} with Razorpay Transaction ID: ${createdRzpOrder.id}`);

    // Return the bundle key vectors, total amounts, and payment codes to the UI Client overlay
    return NextResponse.json(
      {
        success: true,
        wooCommerceOrderId: wooOrderId,
        razorpayOrderId: createdRzpOrder.id,
        amount: createdRzpOrder.amount,
        currency: createdRzpOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID || "",
        productName: product.name,
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
