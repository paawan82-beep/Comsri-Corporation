"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

// 1. TypeScript Interfaces for Google Customer Reviews Opt-In parameters
export interface GoogleCustomerReviewsProduct {
  gtin?: string;
}

export interface GoogleCustomerReviewsProps {
  orderId: string | number;
  email: string;
  deliveryCountry?: string;
  estimatedDeliveryDate: string; // Must be in YYYY-MM-DD format
  products?: GoogleCustomerReviewsProduct[];
  merchantId?: number; // Optional override, defaults to 665941511
}

// 2. Extend global Window interface to support Google GAPI structure
declare global {
  interface Window {
    gapi?: any;
    renderOptIn?: () => void;
  }
}

export default function GoogleCustomerReviews({
  orderId,
  email,
  deliveryCountry = "IN",
  estimatedDeliveryDate,
  products = [],
  merchantId = 665941511,
}: GoogleCustomerReviewsProps) {
  const renderedRef = useRef(false);

  useEffect(() => {
    // Define the callback globally so platform.js can invoke it on load
    window.renderOptIn = () => {
      if (renderedRef.current) return;
      renderedRef.current = true;

      if (window.gapi && window.gapi.load) {
        window.gapi.load("surveyoptin", () => {
          // Gracefully filter out any products with missing or invalid GTINs
          const formattedProducts = products
            .filter((p) => p && p.gtin && p.gtin.trim() !== "")
            .map((p) => ({ gtin: p.gtin?.trim() }));

          const config: any = {
            merchant_id: merchantId,
            order_id: String(orderId),
            email: email,
            delivery_country: deliveryCountry,
            estimated_delivery_date: estimatedDeliveryDate,
          };

          // Only append products array if we have valid GTINs
          if (formattedProducts.length > 0) {
            config.products = formattedProducts;
          }

          window.gapi.surveyoptin.render(config);
        });
      }
    };

    // If gapi is already loaded and surveyoptin is ready, invoke it directly
    if (window.gapi && window.gapi.surveyoptin) {
      window.renderOptIn();
    }

    // Cleanup global declaration on unmount
    return () => {
      delete window.renderOptIn;
    };
  }, [orderId, email, deliveryCountry, estimatedDeliveryDate, products, merchantId]);

  return (
    <>
      {/* 
        Use Next.js Script component to load Google Customer Reviews script asynchronously.
        Strategy is 'afterInteractive' to prevent blockages on main LCP content load.
      */}
      <Script
        id="google-customer-reviews-js"
        src="https://apis.google.com/js/platform.js?onload=renderOptIn"
        strategy="afterInteractive"
      />
    </>
  );
}
