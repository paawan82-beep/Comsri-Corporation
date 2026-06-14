import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { woocommerce } from "@/lib/services/woocommerce";

/** Constant-time compare of two hex/base64 signature strings to avoid timing attacks. */
function safeSignatureEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// Strictly fetch raw body for cryptographic signature verification
export const dynamic = "force-dynamic";

/**
 * Idempotent Razorpay Webhook Handler
 * Protects against duplicate deliveries, handles secure signatures, and updates WooCommerce orders.
 */
export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-razorpay-signature") || "";
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[Razorpay Webhook Error]: Secret not configured under environment variables.");
      return NextResponse.json(
        { error: "Webhook signature secret is not configured on the server." },
        { status: 500 }
      );
    }

    // Read the raw body as clean text to preserve exact payload formatting for signature verification
    const rawBody = await req.text();

    // Verify cryptographic authenticity
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (!safeSignatureEqual(signature, expectedSignature)) {
      console.warn("[Razorpay Webhook Warning]: Invalid signature verification attempt.");
      return NextResponse.json({ error: "Invalid cryptographic signature." }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

      console.log(`[Razorpay Webhook]: Verified Event "${event}" received.`);
 
     // 1. Handle Payment Failure Alerts
     if (event === "payment.failed") {
       const paymentEntity = payload.payload?.payment?.entity;
       const paymentId = paymentEntity?.id;
       const errorCode = paymentEntity?.error_code;
       const errorDescription = paymentEntity?.error_description;
       const wooCommerceOrderIdRaw = paymentEntity?.notes?.woocommerce_order_id || paymentEntity?.description;

       console.error(
         `[SECURITY ALERT - FAILED PAYMENT]: Razorpay Payment ${paymentId} failed for WooCommerce Order Ref: ${wooCommerceOrderIdRaw}. Error Code: ${errorCode}, Description: ${errorDescription}`
       );

       if (wooCommerceOrderIdRaw) {
         const orderId = parseInt(wooCommerceOrderIdRaw, 10);
         try {
           await woocommerce.updateOrderStatus(orderId, "failed", "", [
             { key: "_payment_failed_at", value: new Date().toISOString() },
             { key: "_payment_failure_reason", value: `${errorCode}: ${errorDescription}` }
           ]);
           console.log(`[Razorpay Webhook]: Updated WooCommerce order ${orderId} status to "failed".`);
         } catch (err) {
           console.error(`[Razorpay Webhook Error]: Failed to update WooCommerce order ${orderId} status to failed`, err);
         }
       }
       return NextResponse.json({ received: true, status: "logged_failure" }, { status: 200 });
     }

     // 2. We process "payment.captured" for successful payment confirmation
     if (event === "payment.captured") {
       const paymentEntity = payload.payload?.payment?.entity;
       const paymentId = paymentEntity?.id;
       const razorpayOrderId = paymentEntity?.order_id;
       
       // Extract WooCommerce Order ID from the Razorpay Order Notes or Receipt
       const wooCommerceOrderIdRaw = 
         paymentEntity?.notes?.woocommerce_order_id || 
         paymentEntity?.description || // fallback
         paymentEntity?.notes?.order_id;

       if (!wooCommerceOrderIdRaw) {
         console.warn("[Razorpay Webhook]: Payment captured but no WooCommerce Order ID discovered in notes.");
         return NextResponse.json({ message: "No associate order found - skipping." }, { status: 200 });
       }

       const orderId = parseInt(wooCommerceOrderIdRaw, 10);

       // --- CRITICAL IDEMPOTENCY LOCK AND DUPLICATE DETECTION PATTERN ---
       // Fetch the target WooCommerce Order first to read its real-time transaction state.
       // This acts as a highly resilient single-source-of-truth lock.
       let order;
       try {
         order = await woocommerce.getOrderById(orderId);
       } catch (err) {
         console.error(`[Razorpay Webhook Error]: Failed retrieving WooCommerce order ${orderId}`, err);
         return NextResponse.json({ error: "WooCommerce order lookup failed." }, { status: 404 });
       }

       const currentStatus = (order as any).status;
       const currentTxId = (order as any).transaction_id;

       // Check if order is already completed or processing. If so, return immediately.
       // This prevents double warehouse fulfillment, multiple emails, and duplicated stats.
       if (["processing", "completed"].includes(currentStatus) || currentTxId === paymentId) {
         console.info(`[Razorpay Webhook Idempotency]: Order ${orderId} already marked paid (status: ${currentStatus}, txId: ${currentTxId}). Skipping duplicate update.`);
         return NextResponse.json(
           { 
             status: "success", 
             message: "Order already complete. Idempotently bypassed.", 
             woo_order_id: orderId 
           }, 
           { status: 200 }
         );
       }

       // Complete the payment transaction!
       // This updates status to 'processing' (standard WooCommerce status for successful payments)
       // and sets transaction ID. 
       // Also write metadata markers to block any concurrent webhook double-run.
       await woocommerce.updateOrderStatus(orderId, "processing", paymentId, [
         { key: "_razorpay_payment_id", value: paymentId },
         { key: "_razorpay_order_id", value: razorpayOrderId },
         { key: "_payment_completed_at", value: new Date().toISOString() },
         { key: "_webhook_idempotency_marker", value: "processed" }
       ]);

       console.log(`[Razorpay Webhook]: Securely updated WooCommerce order ${orderId} status to "processing" with Tx: ${paymentId}`);
     }

     return NextResponse.json({ received: true, status: "processed" }, { status: 200 });
  } catch (error: any) {
    console.error("[Razorpay Webhook Exception]:", error);
    return NextResponse.json(
      { error: "Error handling Razorpay Webhook", details: error.message },
      { status: 500 }
    );
  }
}
