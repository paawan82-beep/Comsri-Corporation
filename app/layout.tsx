import type { Metadata } from 'next';
import { Fredoka, Albert_Sans } from 'next/font/google';
import './globals.css'; // Global styles
import { CartProvider } from "@/context/CartContext";
import JsonLd from "./components/JsonLd";
import { getOrganizationSchema, getLocalBusinessSchema, getSearchActionSchema } from "./seo/schemas";
import { SITE_CONFIG } from "./seo/constants";

const fredoka = Fredoka({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fredoka',
  weight: ['300', '400', '500', '600', '700'],
});

const albertSans = Albert_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-albert-sans',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} | Refurbished Laptops & Desktops India`,
    template: `%s | ${SITE_CONFIG.shortName}`,
  },
  description: SITE_CONFIG.description,
  keywords: ["refurbished laptops", "refurbished desktops", "refurbished computers", "headless e-commerce", "cheap laptops India"],
  alternates: {
    canonical: SITE_CONFIG.url,
    languages: {
      "en-IN": SITE_CONFIG.url,
      "x-default": SITE_CONFIG.url,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: `${SITE_CONFIG.name} | Refurbished Laptops & Desktops`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} | Refurbished Laptops & Desktops`,
    description: SITE_CONFIG.description,
    creator: "@comsri_corp",
  },
};

import ChatBotWrapper from "./components/ChatBotWrapper";

export default function RootLayout({children}: {children: React.ReactNode}) {
  const fetchSetterPolyfill = `
    (function() {
      try {
        var targets = [typeof window !== "undefined" ? window : null, typeof globalThis !== "undefined" ? globalThis : null, typeof self !== "undefined" ? self : null];
        targets.forEach(function(target) {
          if (!target) return;
          try {
            var originalFetch = target.fetch;
            if (typeof originalFetch === 'function') {
              var customFetch = originalFetch;
              Object.defineProperty(target, 'fetch', {
                get: function() { return customFetch; },
                set: function(val) { customFetch = val; },
                configurable: true,
                enumerable: true
              });
            }
          } catch (err) {
            console.warn('Failed to define fetch setter on target:', err);
          }
        });
      } catch (e) {
        console.warn('Fetch setter patch exception:', e);
      }
    })();
  `;

  // Dynamic schemas for GEO engines
  const orgSchema = getOrganizationSchema();
  const localBusinessSchema = getLocalBusinessSchema();
  const searchActionSchema = getSearchActionSchema();

  return (
    <html lang="en" className="bg-[#f6f5f8]">
      <head suppressHydrationWarning>
        <link rel="preconnect" href="https://hglntgfpbilqvdcazjsv.supabase.co" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: fetchSetterPolyfill }} suppressHydrationWarning />
        <JsonLd schema={orgSchema} />
        <JsonLd schema={localBusinessSchema} />
        <JsonLd schema={searchActionSchema} />
      </head>
      <body className={`${fredoka.variable} ${albertSans.variable} font-sans antialiased bg-[#f6f5f8]`} suppressHydrationWarning>
        <CartProvider>
          {children}
          <ChatBotWrapper />
        </CartProvider>
      </body>
    </html>
  );
}
