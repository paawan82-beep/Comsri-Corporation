import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "./seo/constants";

export const runtime = "edge";

export const alt = SITE_CONFIG.name;
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #172554 0%, #1e3a8a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "80px",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Tagline */}
          <span
            style={{
              background: "#374bf9",
              padding: "10px 20px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: "30px",
              width: "fit-content",
            }}
          >
            Premium Certified IT Hardware
          </span>
          
          {/* Main Headline */}
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "800",
              margin: 0,
              lineHeight: "1.15",
              maxWidth: "800px",
            }}
          >
            Refurbished Laptops & Desktops in India
          </h1>
          
          {/* Subheading */}
          <p
            style={{
              fontSize: "24px",
              color: "#bfdbfe",
              margin: "20px 0 0 0",
              fontWeight: "400",
            }}
          >
            Tested 40+ points. Free 1-Year Warranty. Free PAN-India Delivery.
          </p>
        </div>

        {/* Footer info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "2px solid rgba(255,255,255,0.1)",
            paddingTop: "40px",
          }}
        >
          <span
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#fcb643",
            }}
          >
            {SITE_CONFIG.name}
          </span>
          <span
            style={{
              fontSize: "20px",
              color: "#93c5fd",
            }}
          >
            {SITE_CONFIG.telephone} | {SITE_CONFIG.email}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
