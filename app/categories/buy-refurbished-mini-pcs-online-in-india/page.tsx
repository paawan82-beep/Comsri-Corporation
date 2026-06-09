import Link from "next/link";
import {
  MessageCircle,
  Play,
  Apple,
  Facebook,
  Instagram,
  Youtube,
  ChevronRight,
  ShieldCheck,
  Star,
  Zap,
  Leaf,
  Headphones,
  Award,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Metadata } from "next";
import { woocommerce } from "@/lib/services/woocommerce";
import { getFilteredCatalog } from "@/lib/services/catalog";
import Header from "../../Header";
import ShopCatalogClient from "../../shop/ShopCatalogClient";
import { constructMetadata } from "../../seo/metadata";
import { SITE_CONFIG } from "../../seo/constants";

export const dynamic = "force-dynamic";

const CATEGORY_ID = "137"; // Refurbished Mini PCs Category ID
const PAGE_TITLE = "Buy Refurbished Mini PCs Online in India";
const PAGE_DESCRIPTION =
  "Buy refurbished Mini PCs online in India from Comsri. Affordable Mini PCs, professionally tested with warranty. Perfect for office, business & home use.";
const PAGE_PATH = "/categories/buy-refurbished-mini-pcs-online-in-india";

interface CategoryPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    min_price?: string;
    max_price?: string;
    on_sale?: string;
    orderby?: string;
  }>;
}

export async function generateMetadata({ searchParams }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const hasSortingOrFilters =
    resolvedParams.orderby ||
    resolvedParams.min_price ||
    resolvedParams.max_price ||
    resolvedParams.on_sale ||
    resolvedParams.search ||
    resolvedParams.page;
  const noIndex = !!hasSortingOrFilters;

  return constructMetadata({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: PAGE_PATH,
    canonical: PAGE_PATH,
    keywords: [
      "Buy Refurbished Mini PCs Online",
      "Buy Refurbished Mini PCs Online in India",
      "best refurbished mini PCs in India",
      "buy used mini computers online",
      "where to buy refurbished mini PCs in India",
      "refurbished micro computers in India",
      "certified refurbished mini PCs",
      "refurbished Dell micro PC India",
      "refurbished HP mini PC India",
      "refurbished Lenovo tiny PC India",
      "refurbished Mac Mini India",
      "cheap tiny computers India",
      "used micro PCs with warranty",
    ],
    noIndex,
  });
}

export default async function RefurbishedMiniPCsPage({ searchParams }: CategoryPageProps) {
  const resolvedParams = await searchParams;
  const currentQuery = resolvedParams.search || "";
  const currentPage = parseInt(resolvedParams.page || "1", 10);
  const currentMinPrice = resolvedParams.min_price || "";
  const currentMaxPrice = resolvedParams.max_price || "";
  const currentOnSaleOnly = resolvedParams.on_sale === "true";
  const currentSorting = resolvedParams.orderby || "date";

  let productsResult = { data: [] as any[], totalItems: 0, totalPages: 1, counts: null as any };
  let categories: any[] = [];
  let fetchError = "";

  try {
    const [catalogResult, categoriesData] = await Promise.all([
      getFilteredCatalog({
        category: CATEGORY_ID,
        search: currentQuery,
        page: currentPage,
        per_page: 12,
        min_price: currentMinPrice || undefined,
        max_price: currentMaxPrice || undefined,
        on_sale: currentOnSaleOnly || undefined,
        orderby: currentSorting,
      }),
      woocommerce.getCategories(),
    ]);

    productsResult = catalogResult;
    categories = (categoriesData || []).filter(
      (cat: any) =>
        cat.name.toLowerCase() !== "new products" &&
        cat.name.toLowerCase() !== "refurbished products"
    );
  } catch (err: any) {
    console.error("[Mini PCs Category Server Loading Error]:", err);
    fetchError = err.message || "Could not synchronize with the WordPress catalog database.";
  }

  // ─── STRUCTURED DATA SCHEMAS ─────────────────────────────────────────────

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${SITE_CONFIG.url}${PAGE_PATH}/#breadcrumb`,
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_CONFIG.url },
      { "@type": "ListItem", "position": 2, "name": "Shop", "item": `${SITE_CONFIG.url}/shop` },
      { "@type": "ListItem", "position": 3, "name": "Refurbished Mini PCs", "item": `${SITE_CONFIG.url}${PAGE_PATH}` },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_CONFIG.url}${PAGE_PATH}/#webpage`,
    "name": PAGE_TITLE,
    "description": PAGE_DESCRIPTION,
    "url": `${SITE_CONFIG.url}${PAGE_PATH}`,
    "isPartOf": { "@id": `${SITE_CONFIG.url}/#website` },
    "about": [
      { "@type": "Thing", "name": "Refurbished Mini PCs" },
      { "@type": "Thing", "name": "Certified Pre-owned Tiny Computers" },
    ],
    "breadcrumb": { "@id": `${SITE_CONFIG.url}${PAGE_PATH}/#breadcrumb` },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["#page-h1", "#page-intro", "#faq-section"],
    },
    "dateModified": new Date().toISOString().split("T")[0],
    "inLanguage": "en-IN",
    "publisher": {
      "@type": "Organization",
      "@id": `${SITE_CONFIG.url}/#organization`,
    },
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE_CONFIG.url}${PAGE_PATH}/#article`,
    "headline": "Buy Refurbished Mini PCs Online in India – Complete Buyer's Guide",
    "description": "A comprehensive guide to buying certified refurbished mini PCs and micro factor computers online in India. Covers space savings, brands, reliability, and costs.",
    "author": {
      "@type": "Organization",
      "@id": `${SITE_CONFIG.url}/#organization`,
      "name": SITE_CONFIG.name,
    },
    "publisher": {
      "@type": "Organization",
      "@id": `${SITE_CONFIG.url}/#organization`,
      "name": SITE_CONFIG.name,
      "logo": { "@type": "ImageObject", "url": `${SITE_CONFIG.url}/images/logo.png` },
    },
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split("T")[0],
    "mainEntityOfPage": { "@id": `${SITE_CONFIG.url}${PAGE_PATH}/#webpage` },
    "image": `${SITE_CONFIG.url}/images/og-default.jpg`,
    "about": { "@type": "Thing", "name": "Refurbished Mini PCs" },
    "mentions": [
      { "@type": "Brand", "name": "Dell" },
      { "@type": "Brand", "name": "HP" },
      { "@type": "Brand", "name": "Lenovo" },
      { "@type": "Brand", "name": "Apple" }
    ],
    "keywords": "refurbished mini PC, buy micro computer India, certified tiny PC",
    "articleSection": "Buyer's Guide",
  };

  const offerCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${SITE_CONFIG.url}${PAGE_PATH}/#catalog`,
    "name": "Refurbished Mini PCs Catalog – India",
    "description": "Certified refurbished commercial-grade mini PCs and tiny factor computers available online in India with 1-year warranty.",
    "numberOfItems": productsResult.totalItems || productsResult.data?.length || 0,
    "url": `${SITE_CONFIG.url}${PAGE_PATH}`,
    "itemListElement": (productsResult.data || []).map((prod: any, idx: number) => ({
      "@type": "Offer",
      "position": idx + 1,
      "name": prod.name,
      "url": `${SITE_CONFIG.url}/products/${prod.slug}`,
      "image": prod.images?.[0]?.src || `${SITE_CONFIG.url}/images/og-default.jpg`,
      "priceCurrency": "INR",
      "price": prod.price || "0",
      "itemCondition": "https://schema.org/RefurbishedCondition",
      "availability": prod.stock_status === "instock"
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": SITE_CONFIG.name,
        "url": SITE_CONFIG.url,
      },
    })),
  };

  const faqItems = [
    {
      q: "Where to buy refurbished mini PCs in India?",
      a: "Comsri Corporation is a leading provider of certified refurbished mini PCs, ultra-small form factor (USFF) computers, and tiny PCs in India. Every device passes 40+ point diagnostic checks, includes a 1-year replacement warranty, and comes with free shipping pan-India. Browse and buy online at comsri.com.",
    },
    {
      q: "What is a mini PC or tiny computer?",
      a: "A mini PC (also known as a Micro PC, Tiny PC, or Ultra-Small Form Factor PC) is a full-fledged computer built into an extremely compact chassis (typically around 1 liter in volume). Models like Dell OptiPlex Micro, HP Desktop Mini (DM), and Lenovo ThinkCentre Tiny offer desktop-grade performance while consuming very little power and space.",
    },
    {
      q: "Are refurbished mini PCs good for office work and coding?",
      a: "Yes, they are excellent. Sourced from corporate environments, these commercial-grade machines (equipped with Intel Core i5/i7 or AMD Ryzen processors, fast SSDs, and expandable RAM) easily handle productivity tools, MS Office, accounting software (like Tally), web browsing, software development, and 24/7 server tasks.",
    },
    {
      q: "Can I upgrade the RAM and storage in a refurbished mini PC?",
      a: "Yes. Despite their small size, commercial mini PCs from Dell, HP, and Lenovo are highly modular. You can easily open the tool-less chassis to upgrade or replace the DDR4/DDR5 SO-DIMM RAM and M.2 NVMe SSD storage, ensuring long-term usability.",
    },
    {
      q: "What is the warranty on refurbished mini PCs at Comsri?",
      a: "All certified refurbished mini PCs from Comsri Corporation are covered by a 1-year replacement warranty. If any hardware component or functional defect arises post-purchase, we will replace the unit or components quickly, giving you complete peace of mind.",
    },
    {
      q: "How much power does a mini PC consume?",
      a: "Mini PCs are highly energy-efficient. They typically run on low-voltage processors (T-series or mobile chips) and consume between 15W to 65W of power under load. This is significantly lower than a standard desktop tower (which often draws 150W to 300W+), resulting in massive electricity savings.",
    },
    {
      q: "Do refurbished mini PCs come with Wi-Fi and Bluetooth?",
      a: "Most commercial-grade mini PCs include built-in Wi-Fi and Bluetooth cards or come bundled with external USB Wi-Fi dongles. Please check the specific product specifications page or options under each model to confirm exact connectivity.",
    },
    {
      q: "How does a refurbished mini PC compare to a second-hand mini PC?",
      a: "Certified refurbished mini PCs from Comsri undergo a thorough 40+ point diagnostic test (RAM, storage health, CPU stress, ports, cooling fans), are deep cleaned, reloaded with a fresh Windows OS, and backed by a 1-year replacement warranty. Standard second-hand PCs are sold as-is with no verification, carrying a high risk of failure.",
    },
    {
      q: "Can a mini PC be mounted behind a monitor?",
      a: "Yes, most mini PCs feature standard VESA mounting holes or are compatible with VESA brackets. This allows you to mount the CPU directly to the back of your monitor or underneath your desk, creating a clean, wire-free workspace similar to an All-in-One (AIO) desktop.",
    },
    {
      q: "What operating system comes pre-installed?",
      a: "All Comsri refurbished mini PCs are shipped with a clean, fresh installation of Windows 10 Pro or Windows 11 Pro (depending on system compatibility), including all standard system drivers. Apple Mac Minis are shipped with the latest compatible macOS version.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_CONFIG.url}${PAGE_PATH}/#faqpage`,
    "mainEntity": faqItems.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${SITE_CONFIG.url}${PAGE_PATH}/#howto`,
    "name": "How to Buy a Refurbished Mini PC Online in India",
    "description": "Step-by-step guide to safely purchasing a certified refurbished mini PC online.",
    "totalTime": "PT10M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Define Your Use Case",
        "text": "Determine if you need a mini PC for basic home/office use, programming, media streaming, or continuous server tasks.",
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Select Your Preferred Brand",
        "text": "Choose from top enterprise line-ups such as Dell OptiPlex Micro, HP EliteDesk/ProDesk Mini, Lenovo ThinkCentre Tiny, or Apple Mac Mini.",
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Choose Processor & RAM",
        "text": "Pick the processor generation (e.g., Intel 6th to 10th Gen Core i5/i7) and memory (8GB or 16GB RAM) to suit your speed requirements.",
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Confirm Storage Needs",
        "text": "Verify SSD size (256GB or 512GB NVMe SSD) to ensure enough high-speed storage space for your apps and files.",
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Place Order with Warranty",
        "text": "Complete your secure purchase online at comsri.com to enjoy free pan-India shipping and our standard 1-year replacement warranty.",
      },
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_CONFIG.url}/#organization`,
    "name": SITE_CONFIG.name,
    "image": `${SITE_CONFIG.url}/images/logo.png`,
    "telephone": SITE_CONFIG.telephone,
    "email": SITE_CONFIG.email,
    "url": SITE_CONFIG.url,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": SITE_CONFIG.address.streetAddress,
      "addressLocality": SITE_CONFIG.address.addressLocality,
      "addressRegion": SITE_CONFIG.address.addressRegion,
      "postalCode": SITE_CONFIG.address.postalCode,
      "addressCountry": SITE_CONFIG.address.addressCountry,
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "19.1196",
      "longitude": "72.8665"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        "opens": "10:00",
        "closes": "19:00"
      }
    ],
    "sameAs": [
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.youtube,
      SITE_CONFIG.social.twitter
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "584",
      "bestRating": "5",
      "worstRating": "1"
    },
    "priceRange": "₹₹"
  };

  return (
    <div className="min-h-screen bg-[#F6F5F8] flex flex-col font-sans">
      {/* ─── ALL JSON-LD SCHEMAS ─────────────────────────────────────── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

      <Header />

      {/* ─── VISIBLE BREADCRUMB ──────────────────────────────────────── */}
      <div className="bg-[#f2ece4] w-full py-2.5">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-start gap-4">
          <span className="text-[28px] font-medium text-[#111] tracking-tight">Refurbished Mini PCs</span>
          <p className="text-[15px] text-[#777] font-medium mt-1">
            <Link href="/" className="hover:text-[#3452ef] transition-colors">Home</Link>
            <span className="mx-1.5 text-gray-400">/</span>
            <Link href="/shop" className="hover:text-[#3452ef] transition-colors">Shop</Link>
            <span className="mx-1.5 text-gray-400">/</span>
            <span className="text-[#111] font-bold">Refurbished Mini PCs</span>
          </p>
        </div>
      </div>

      {/* ─── HERO SECTION ────────────────────────────────────────────── */}
      <section
        className="bg-slate-900 text-white py-14 px-6 lg:px-12 relative overflow-hidden"
        id="shop-hero"
        aria-labelledby="page-h1"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#faba5b]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[200px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-[#faba5b] bg-[#faba5b]/10 px-3.5 py-1.5 rounded-full border border-[#faba5b]/20 inline-block">
                40-Point Certified Quality
              </span>
              <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3.5 py-1.5 rounded-full border border-emerald-400/20 inline-block">
                1-Year Free Warranty
              </span>
              <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-sky-400 bg-sky-400/10 px-3.5 py-1.5 rounded-full border border-sky-400/20 inline-block">
                Space-Saving Efficiency
              </span>
            </div>

            <h1 id="page-h1" className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-2">
              Buy Refurbished Mini PCs<br className="hidden md:block" /> Online in India
            </h1>
            <p className="text-sm text-slate-400 font-medium mb-5 tracking-wide">Starting from <strong className="text-[#faba5b] text-base">₹7,999</strong> · Free Pan-India Shipping</p>

            <p id="page-intro" className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl speakable">
              Buy refurbished mini PCs online in India from certified brands at unbeatable prices. Sourced from high-grade corporate leases, our second hand mini PCs and tiny factor computers undergo a 40+ point certification check, come with 1-year replacement warranty, and feature clean OS setups.
            </p>

            {/* Trust Bar */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-400">
              {[
                { icon: <ShieldCheck size={13} className="text-emerald-400" />, label: "1-Year Warranty" },
                { icon: <CheckCircle2 size={13} className="text-blue-400" />, label: "40+ Point Inspection" },
                { icon: <Star size={13} className="text-[#faba5b]" />, label: "4.8★ Customer Rating" },
                { icon: <TrendingUp size={13} className="text-purple-400" />, label: "Ultra-Small Factor" },
                { icon: <Award size={13} className="text-rose-400" />, label: "Certified Refurbished" },
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              ))}
            </div>

            {/* Category Quick Links */}
            <div className="mt-7 flex flex-wrap gap-2.5">
              <span className="text-xs text-slate-500 font-medium self-center mr-1">Browse Categories:</span>
              {[
                { label: "Refurbished Laptops", path: "/categories/buy-refurbished-laptops-online-in-india" },
                { label: "Refurbished Desktops", path: "/categories/buy-high-quality-refurbished-desktops" },
                { label: "Workstations", path: "/categories/buy-refurbished-workstations-online-in-india" },
                { label: "Mini PCs", path: "/categories/buy-refurbished-mini-pcs-online-in-india" },
              ].map((cat) => (
                <Link
                  key={cat.path}
                  href={cat.path}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all ${cat.path === PAGE_PATH
                    ? "text-white bg-blue-600 border border-blue-600"
                    : "text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 hover:text-white"
                    }`}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRODUCT CATALOG SECTION ─────────────────────────────────── */}
      <main
        id="products-section"
        className="flex-1 max-w-[1600px] mx-auto px-6 lg:px-12 py-10 w-full"
        aria-label="Refurbished Mini PCs Product Catalog"
      >
        {fetchError ? (
          <div className="bg-rose-50 border border-rose-100 text-rose-800 p-8 rounded-3xl text-center shadow-sm">
            <p className="text-3xl">⚠️</p>
            <h3 className="text-lg font-black text-rose-950 mt-2">Catalog temporarily unavailable</h3>
            <p className="text-xs text-rose-600 max-w-lg mx-auto mt-2 leading-relaxed">
              WooCommerce service is offline: <code className="bg-rose-100/60 px-1 py-0.5 rounded text-rose-900">{fetchError}</code>
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/shop" className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition">
                Retry Connection
              </Link>
            </div>
          </div>
        ) : (
          <ShopCatalogClient
            initialProducts={productsResult.data}
            initialTotalItems={productsResult.totalItems}
            initialTotalPages={productsResult.totalPages}
            initialCounts={productsResult.counts}
            categories={categories}
            initialParams={{
              category: CATEGORY_ID,
              search: currentQuery,
              page: currentPage,
              min_price: currentMinPrice,
              max_price: currentMaxPrice,
              on_sale: currentOnSaleOnly,
              orderby: currentSorting,
            }}
          />
        )}
      </main>

      {/* ─── BUYER'S GUIDE + CONTENT SECTION ────────────────────────── */}
      <article
        id="buyers-guide"
        aria-label="Complete Buyer's Guide for Refurbished Mini PCs in India"
        className="bg-white border border-slate-100 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.015)] max-w-[1600px] mx-auto px-8 md:px-12 py-12 w-[calc(100%-3rem)] mb-12"
      >
        {/* Section Header */}
        <header className="text-center mb-12">
          <span className="text-[#374bf9] font-mono text-xs uppercase tracking-widest font-bold bg-[#374bf9]/5 px-4 py-2 rounded-full inline-block mb-3">
            Comprehensive Buyer's Guide
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Buy Refurbished Mini PCs Online in India
          </h2>
          <div className="h-1 w-20 bg-[#374bf9] rounded-full mx-auto mt-4" />
        </header>

        {/* ── Intro Paragraphs ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-50 p-6 md:p-8 rounded-[24px] hover:translate-y-[-2px] transition-transform duration-300 border border-slate-100/50">
            <p className="text-sm text-slate-600 leading-relaxed">
              In modern computing, bulk towers are no longer the default option. For home offices, business desks, IT hubs, and retail outlets, space is at a premium. This shift has accelerated the popularity of ultra-compact computing. If you are looking to save space and reduce utility costs while keeping performance high, choosing to <strong>Buy Refurbished Mini PCs Online in India</strong> is the smartest decision you can make. If you want to <strong>Buy Refurbished Mini PCs Online</strong>, our catalog offers the best configurations ready for delivery.
            </p>
          </div>
          <div className="bg-slate-50 p-6 md:p-8 rounded-[24px] hover:translate-y-[-2px] transition-transform duration-300 border border-slate-100/50">
            <p className="text-sm text-slate-600 leading-relaxed">
              Our <strong>certified refurbished mini PCs</strong> and <strong>refurbished micro computers in India</strong> undergo exhaustive testing, motherboard diagnostics, memory stress audits, storage health verification, and dynamic cleaning. This rigorous refurbishing process ensures that every device meets strict functionality criteria. You get a reliable, high-speed computer loaded with a licensed, fresh operating system, matching the performance of a new machine at a much lower cost.
            </p>
          </div>
        </div>

        {/* ── Large Collection Section ── */}
        <div className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-[#374bf9]">■</span> Large Collection of Refurbished Mini PCs
          </h3>
          <div className="text-sm text-slate-600 leading-relaxed space-y-4">
            <p>
              We stock a wide variety of the <strong>best refurbished mini PCs in India</strong>, sourced from premium enterprise deployments. If you are researching <strong>where to buy refurbished mini PCs in India</strong>, you have come to the right place. You can choose from leading corporate families like a <strong>refurbished Dell micro PC India</strong>, a <strong>refurbished HP mini PC India</strong>, a <strong>refurbished Lenovo tiny PC India</strong>, or a <strong>refurbished Mac Mini India</strong> depending on your platform preference.
            </p>
            <p>
              If you want to <strong>buy used mini computers online</strong>, certified pre-owned units from Comsri Corporation offer a much safer option than dealing with random peer-to-peer <strong>second hand mini PC</strong> sales. Every tiny computer is thoroughly inspected, certified, and dispatched securely with tracking numbers, ensuring a reliable shopping experience across India.
            </p>
          </div>
        </div>

        {/* ── Comparison Table ── */}
        <div className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-[#374bf9]">■</span> Refurbished vs New vs Second-Hand — Which is Best?
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Feature</th>
                  <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider text-[#faba5b]">Certified Refurbished</th>
                  <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Brand New</th>
                  <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Second-Hand</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Price Range", "₹7,999 – ₹35,000", "₹25,000 – ₹90,000+", "₹5,000 – ₹20,000"],
                  ["Quality Check", "✅ 40+ point audit", "✅ Factory checked", "❌ No verification"],
                  ["Warranty Protection", "✅ 1-Year free warranty", "✅ 1–3 Year brand warranty", "❌ None"],
                  ["Fresh OS Setup", "✅ Yes (Fresh installation)", "✅ Yes", "⚠️ Not guaranteed"],
                  ["Average Price Savings", "40% – 70% savings", "—", "50% – 80% (high risk)"],
                  ["Power & Space Efficiency", "✅ Exceptional (1 liter size)", "✅ High", "⚠️ May vary"],
                  ["Reliability Index", "✅ High – technician approved", "✅ Excellent", "⚠️ Low – unknown usage history"],
                ].map(([feature, refurb, newItem, secondHand], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="px-5 py-3.5 font-medium text-slate-700 border-t border-slate-100">{feature}</td>
                    <td className="px-5 py-3.5 text-slate-800 font-medium border-t border-slate-100 bg-blue-50/50">{refurb}</td>
                    <td className="px-5 py-3.5 text-slate-600 border-t border-slate-100">{newItem}</td>
                    <td className="px-5 py-3.5 text-slate-600 border-t border-slate-100">{secondHand}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Top Reasons Cards ── */}
        <div className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-8 text-center">
            Top Reasons to Choose Certified Refurbished Mini PCs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <ShieldCheck size={20} />, title: "Ultra-Compact Footprint", desc: "Weighing around 1-1.5kg and under 1.5 liters in volume, these systems can sit neatly on any desk or mount behind VESA-compatible monitors." },
              { icon: <CheckCircle2 size={20} />, title: "Exceptional Energy Efficiency", desc: "Mini PCs use energy-optimized components that consume between 15W to 65W of power under load, saving up to 80% on electricity compared to full desktop towers." },
              { icon: <TrendingUp size={20} />, title: "Massive Cost Savings", desc: "Enjoy savings of 40%–70% compared to brand-new units, allowing you to afford faster processors, extra RAM, or high-capacity solid-state storage." },
              { icon: <Leaf size={20} />, title: "Eco-Friendly Computing", desc: "Opting for refurbished hardware keeps functional electronic components out of landfills, significantly lowering carbon emissions and electronic waste." },
              { icon: <Headphones size={20} />, title: "1-Year Comsri Warranty", desc: "All certified refurbished mini PCs come with a 1-year replacement warranty, dedicated customer support, and secure packaging." },
              { icon: <Zap size={20} />, title: "Enterprise Durability", desc: "Built with commercial-grade motherboards, metal chassis casings, and premium cooling fans designed to run reliably 24/7." },
            ].map((reason, i) => (
              <div
                key={i}
                className="bg-slate-50/50 hover:bg-white p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col gap-3 group"
              >
                <span className="w-10 h-10 rounded-xl bg-[#374bf9]/10 text-[#374bf9] flex items-center justify-center group-hover:bg-[#374bf9] group-hover:text-white transition-colors duration-300">
                  {reason.icon}
                </span>
                <h4 className="font-bold text-slate-900 group-hover:text-[#374bf9] transition-colors">{reason.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── How to Buy Section ── */}
        <div className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
            <span className="text-[#374bf9]">■</span> How to Buy a Refurbished Mini PC Online in India
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              { step: "01", title: "Define Your Use Case", desc: "Identify if you need it for office work, media server deployment, student homework, or 24/7 operation." },
              { step: "02", title: "Select Core Brands", desc: "Pick from top enterprise families: Dell OptiPlex Micro, HP ProDesk Mini, Lenovo Tiny, or Apple Mac Mini." },
              { step: "03", title: "Configure RAM & SSD", desc: "Pick your configuration. 8GB or 16GB RAM is recommended, coupled with a fast M.2 NVMe SSD." },
              { step: "04", title: "Verify Warranty details", desc: "Ensure your selected PC is certified refurbished and covered by a 1-year replacement warranty." },
              { step: "05", title: "Order Pan-India", desc: "Securely checkout online. We deliver securely with tracked logistics across India." },
            ].map((s, i) => (
              <div key={i} className="relative flex flex-col gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all group">
                <span className="text-4xl font-black text-[#374bf9]/10 group-hover:text-[#374bf9]/20 transition-colors leading-none">{s.step}</span>
                <h4 className="font-bold text-slate-900 text-sm">{s.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Why Refurbished > Second-Hand ── */}
        <div className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-[#374bf9]">■</span> Why Refurbished Mini PCs Are Better Than Ordinary Second-Hand Devices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600 leading-relaxed">
            <div className="bg-slate-50 p-6 rounded-2xl hover:shadow-sm transition-shadow">
              <p>Buying direct <strong>second hand mini PCs</strong> is highly risky. Since mini PCs feature densely packed internal motherboards, poor thermal management or micro-fissures from previous usage can cause unexpected component failure shortly after purchase, with zero recourse.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl hover:shadow-sm transition-shadow">
              <p>Certified refurbished units eliminate these concerns. Specialists replace worn thermal compounds, run complex memory diagnostics, inspect capacitors under magnification, and test internal fan speeds, ensuring the system runs smoothly and cool.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl hover:shadow-sm transition-shadow">
              <p>When comparing second hand mini PCs vs refurbished micro computers, getting <strong>used micro PCs with warranty</strong> and choosing <strong>cheap tiny computers India</strong> from Comsri Corporation offers unmatched transactional safety, longevity, and support.</p>
            </div>
          </div>
        </div>

        {/* ── E-E-A-T / Trust Section ── */}
        <div className="mb-12 bg-gradient-to-br from-[#374bf9]/5 to-indigo-50 border border-blue-100 rounded-[24px] p-8 md:p-10">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
            Why Trust Comsri Corporation?
          </h3>
          <p className="text-sm text-slate-500 mb-8">Your trusted destination for certified refurbished computer hardware across India.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { stat: "10,000+", label: "Computers Delivered", sub: "Pan-India Shipping" },
              { stat: "4.8★", label: "User Rating", sub: "From verified buyers" },
              { stat: "1 Year", label: "Replacement Warranty", sub: "On every single unit" },
              { stat: "40+", label: "Quality Checkpoints", sub: "Passed before packaging" },
            ].map((item, i) => (
              <div key={i} className="text-center bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="text-3xl font-black text-[#374bf9] mb-1">{item.stat}</div>
                <div className="font-bold text-slate-800 text-sm">{item.label}</div>
                <div className="text-xs text-slate-500 mt-1">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Conclusion ── */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-8 md:p-10 rounded-[24px] relative overflow-hidden shadow-lg mb-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <h3 className="text-lg font-bold text-[#fcb643] mb-4">Conclusion</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Acquiring a certified <strong>refurbished mini PC</strong> is a smart, forward-thinking decision for both home and business setups. It delivers all the processing power, reliability, and expandability of a standard desktop computer in a form factor that fits in the palm of your hand, saving both electricity and desk space.
            </p>
            <p className="text-sm text-slate-200 leading-relaxed font-semibold">
              If you are researching <em>where to buy refurbished mini PCs in India</em>, Comsri Corporation offers professional configurations, full 1-year replacement warranties, and complete post-purchase support.
            </p>
          </div>
        </div>

        {/* ── FAQ Accordion ── */}
        <div id="faq-section" className="mb-4" aria-label="Frequently Asked Questions about Refurbished Mini PCs">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 text-center">
            Frequently Asked Questions
          </h3>
          <p className="text-sm text-slate-500 text-center mb-8">Everything you need to know before buying a refurbished mini PC computer online in India.</p>
          <div className="space-y-3 max-w-4xl mx-auto">
            {faqItems.map((faq, i) => (
              <details
                key={i}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-slate-200 group cursor-pointer transition-all duration-300 hover:shadow-sm"
              >
                <summary className="font-bold text-slate-900 list-none flex justify-between items-center select-none gap-4">
                  <span className="text-sm md:text-base">{faq.q}</span>
                  <span className="text-[#374bf9] text-xl flex-shrink-0 transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed pl-1 border-t border-slate-100 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </article>

      {/* ─── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="bg-[#fcb643] pt-16 pb-12 w-full relative">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col gap-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 justify-between">
            <div className="flex flex-col pr-4">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Address</h3>
              <address className="text-[14px] font-semibold text-[#2d2d2d] leading-relaxed mb-6 not-italic">
                Office No.-T-15 Pinnacle Business Park MC Rd Shanti Nagar Andheri East Mumbai Maharashtra – 400093
              </address>
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Contact Us</h3>
              <p className="text-[14px] font-semibold text-[#2d2d2d] mb-1.5">+91 8601-899-899</p>
              <p className="text-[14px] font-semibold text-[#2d2d2d]">Email: info@comsri.com</p>
            </div>

            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Refurbished Products</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Refurbished Desktops", path: "/categories/buy-high-quality-refurbished-desktops" },
                  { label: "Refurbished Laptops", path: "/categories/buy-refurbished-laptops-online-in-india" },
                  { label: "Refurbished Workstations", path: "/categories/buy-refurbished-workstations-online-in-india" },
                  { label: "Refurbished Macbooks", path: "/categories/buy-refurbished-laptops-online-in-india" },
                  { label: "Refurbished Mini PCs", path: "/categories/buy-refurbished-mini-pcs-online-in-india" },
                ].map((item, i) => (
                  <Link key={i} href={item.path} className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item.label}</Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">New Products</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "New Laptops", path: "/shop" },
                  { label: "New Desktops", path: "/shop" },
                  { label: "New Macbooks", path: "/shop" },
                  { label: "New All in One", path: "/shop" },
                  { label: "New Mini PCs", path: "/shop" },
                ].map((item, i) => (
                  <Link key={i} href={item.path} className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item.label}</Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Useful Links</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Contact Us", path: "/contact-us" },
                  { label: "Terms & Conditions", path: "/terms-conditions?tab=terms" },
                  { label: "Privacy Policy", path: "/privacy-policy?tab=privacy" },
                  { label: "Return & Refund Policy", path: "/return-refund?tab=refund" },
                  { label: "Warranty Policy", path: "/privacy-policy?tab=warranty" },
                  { label: "Shipping Policy", path: "/privacy-policy?tab=shipping" },
                ].map((item, i) => (
                  <Link key={i} href={item.path} className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item.label}</Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Available On:</h3>
              <div className="flex flex-wrap xl:flex-nowrap gap-3 mb-8">
                <a href="#" className="bg-black text-white px-3 py-1.5 rounded-[6px] flex items-center gap-2 hover:bg-gray-800 transition-colors border border-black min-w-[130px] justify-center">
                  <Play size={18} className="fill-white" />
                  <div className="flex flex-col items-start justify-center">
                    <span className="text-[8px] font-medium leading-none mb-0.5">GET IT ON</span>
                    <span className="text-[13px] font-semibold leading-none tracking-tight">Google Play</span>
                  </div>
                </a>
                <a href="#" className="bg-white text-black px-3 py-1.5 rounded-[6px] flex items-center gap-2 border border-black hover:bg-gray-50 transition-colors min-w-[130px] justify-center">
                  <Apple size={20} className="fill-black" />
                  <div className="flex flex-col items-start justify-center">
                    <span className="text-[8px] font-medium leading-none mb-0.5 mt-0.5">Download on the</span>
                    <span className="text-[13px] font-semibold leading-none tracking-tight">App Store</span>
                  </div>
                </a>
              </div>

              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Social links:</h3>
              <div className="flex gap-2">
                <a href={SITE_CONFIG.social.facebook} aria-label="Facebook" className="w-[32px] h-[32px] rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:bg-[#2b4170] transition-colors shadow-sm">
                  <Facebook size={16} className="fill-white" strokeWidth={0} />
                </a>
                <a href={SITE_CONFIG.social.twitter} aria-label="X / Twitter" className="w-[32px] h-[32px] rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors shadow-sm">
                  <span className="text-white font-bold text-[14px] italic pr-0.5 leading-none mt-0.5">X</span>
                </a>
                <a href={SITE_CONFIG.social.instagram} aria-label="Instagram" className="w-[32px] h-[32px] rounded-full bg-[#833ab4] flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full"></div>
                  <Instagram size={16} className="text-white relative z-10" />
                </a>
                <a href={SITE_CONFIG.social.youtube} aria-label="Youtube" className="w-[32px] h-[32px] rounded-full bg-[#ff0000] text-white flex items-center justify-center hover:bg-[#cc0000] transition-colors shadow-sm">
                  <Youtube size={14} className="fill-white" strokeWidth={0} />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-[#3452ef] rounded-[24px] px-8 md:px-12 py-10 flex flex-col lg:flex-row items-center justify-between gap-8 mt-2 w-full">
            <div className="flex flex-col text-white flex-1 text-center lg:text-left">
              <h2 className="text-[28px] md:text-[32px] font-bold mb-1.5 tracking-tight">Sign Up to our Newsletter</h2>
              <p className="text-[14px] text-white/90 font-medium">Be the First to Know. Sign up to newsletter today</p>
            </div>
            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 items-center">
              <input
                type="email"
                placeholder="Your email address"
                className="px-6 py-3.5 rounded-full text-[14px] focus:outline-none font-medium h-[48px] text-black w-full min-w-[280px] md:w-[340px]"
              />
              <button className="bg-[#fcb643] hover:bg-[#fca61f] text-[#111] px-8 h-[48px] rounded-full font-bold text-[15px] transition-colors whitespace-nowrap shadow-sm">
                Sign Up
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between mt-1 gap-4 w-full">
            <p className="text-[14px] font-bold text-[#111]">Copyright 2026 by Comsri Corporation All Right Reserved.</p>
            <div className="flex gap-1.5">
              <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-full object-contain" alt="Mastercard" />
              </div>
              <div className="bg-[#1a1f71] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-[75%] object-contain mt-[1px]" alt="Visa" />
              </div>
              <div className="bg-[#003087] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png" className="h-[12px] object-contain" alt="PayPal" />
              </div>
              <div className="bg-[#2d9cdb] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" className="h-[80%] object-contain" alt="Amex" />
              </div>
              <div className="bg-[#6772e5] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png" className="h-[14px] object-contain invert hue-rotate-[180deg] brightness-200" alt="Stripe" />
              </div>
              <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center px-1">
                <span className="text-white text-[10px]">G</span><span className="text-white text-[12px] font-bold">Pay</span>
              </div>
              <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center px-1 border border-gray-700">
                <Apple size={14} className="fill-white text-white mr-0.5" /><span className="text-white text-[10px] font-semibold mt-[1px]">Pay</span>
              </div>
              <div className="bg-[#004b87] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/UnionPay_logo.svg/1280px-UnionPay_logo.svg.png" className="h-[80%] object-contain" alt="UnionPay" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-6 bottom-6 w-14 h-14 bg-[#3452ef] rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform z-50">
          <MessageCircle size={28} className="text-white fill-white" />
        </div>
      </footer>
    </div>
  );
}
