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

const CATEGORY_ID = "129"; // Refurbished Desktops Category ID
const PAGE_TITLE = "Buy High Quality Refurbished Desktops";
const PAGE_DESCRIPTION =
  "Buy high quality refurbished desktops online in India with warranty. Get top brands, fully tested PCs, best prices, and fast delivery. Upgrade your workspace today.";
const PAGE_PATH = "/categories/buy-high-quality-refurbished-desktops";

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
      "Buy High Quality Refurbished Desktops",
      "refurbished desktops online",
      "buy refurbished desktops in India",
      "refurbished PCs with warranty",
      "refurbished desktop computers",
      "where to buy refurbished desktops in India",
      "refurbished computers in India",
      "certified refurbished desktops",
      "refurbished Dell desktops India",
      "refurbished HP desktops India",
      "refurbished Lenovo desktops India",
      "cheap computers India",
      "used desktops with warranty",
    ],
    noIndex,
  });
}

export default async function RefurbishedDesktopsPage({ searchParams }: CategoryPageProps) {
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
    console.error("[Desktops Category Server Loading Error]:", err);
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
      { "@type": "ListItem", "position": 3, "name": "Refurbished Desktops", "item": `${SITE_CONFIG.url}${PAGE_PATH}` },
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
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
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

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_CONFIG.url}${PAGE_PATH}/#webpage`,
    "name": PAGE_TITLE,
    "description": PAGE_DESCRIPTION,
    "url": `${SITE_CONFIG.url}${PAGE_PATH}`,
    "isPartOf": { "@id": `${SITE_CONFIG.url}/#website` },
    "about": [
      { "@type": "Thing", "name": "Refurbished Desktops" },
      { "@type": "Thing", "name": "Certified Pre-owned Computers" },
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
    "headline": "Buy Refurbished Desktops Online in India – Complete Buyer's Guide",
    "description": "A comprehensive guide to buying certified refurbished desktops and computers online in India. Covers specs, E-E-A-T, and top desktop brands.",
    "image": `${SITE_CONFIG.url}/images/og-default.jpg`,
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
    "about": { "@type": "Thing", "name": "Refurbished Desktops" },
    "mentions": [
      { "@type": "Brand", "name": "Dell" },
      { "@type": "Brand", "name": "HP" },
      { "@type": "Brand", "name": "Lenovo" },
      { "@type": "Brand", "name": "Apple" }
    ],
    "keywords": "refurbished desktops, buy refurbished desktops India, certified used computers",
    "articleSection": "Buyer's Guide",
  };

  const offerCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${SITE_CONFIG.url}${PAGE_PATH}/#catalog`,
    "name": "Refurbished Desktops Catalog – India",
    "description": "Certified refurbished commercial-grade desktops, towers and mini PCs available for purchase online in India with warranty.",
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
      q: "Where to buy refurbished desktops in India?",
      a: "Comsri Corporation is India's premier online store for certified refurbished desktops and IT hardware. All computers pass 40+ point quality audits, include a 1-year replacement warranty, and come with free nationwide shipping. View products online at comsri.com.",
    },
    {
      q: "Are refurbished desktops reliable for business use?",
      a: "Absolutely. Professionally refurbished desktops from Comsri are sourced from enterprise leases (commercial ranges like Dell OptiPlex, HP ProDesk/EliteDesk, Lenovo ThinkCentre). They are built with high-durability components, fully tested, and reloaded with clean operating systems, ensuring reliable business performance.",
    },
    {
      q: "What is the difference between refurbished and second-hand computers?",
      a: "Refurbished computers are audited, repaired, tested, cleaned, and certified by professional technicians, and backed by a warranty. Second-hand computers are sold directly by previous owners as-is, carrying significant risk of failure without any warranty protection.",
    },
    {
      q: "Which are the best brands for refurbished desktops?",
      a: "The most robust and repairable refurbished options are business-grade systems: Dell OptiPlex, HP EliteDesk/ProDesk, Lenovo ThinkCentre, and Apple Mac Mini. These systems offer superior longevity and easy hardware upgrade paths.",
    },
    {
      q: "Does Comsri offer a warranty on refurbished desktops?",
      a: "Yes. All certified refurbished desktops purchased from Comsri come with our standard 1-year free replacement warranty. This covers hardware component defects and functional issues.",
    },
    {
      q: "How much money can I save by choosing refurbished PCs?",
      a: "By choosing certified refurbished desktops from Comsri, you can save 40% to 70% compared to purchasing equivalent brand-new commercial desktop systems.",
    },
    {
      q: "Do refurbished desktops come with keyboard and mouse?",
      a: "Unless specifically marked as a bundle package or an 'All-in-One' PC, our standard desktop catalog lists the CPU tower/unit alone. Monitors, keyboards, and mice can be added to your order separately.",
    },
    {
      q: "Do refurbished computers come with pre-installed operating systems?",
      a: "Yes. Comsri refurbished desktops are shipped with a fresh, clean installation of Windows 10 Pro or Windows 11 Pro (depending on system compatibility), including all required drivers. Apple systems come with the latest compatible macOS.",
    },
    {
      q: "Is it safe to buy refurbished desktops online in India?",
      a: "Yes, provided you buy from a verified company like Comsri that offers secure checkouts, transparent condition grading, dedicated warranties, and customer support. Avoid purchasing from direct individual local sellers without return options.",
    },
    {
      q: "What does the 40+ point diagnostic check include?",
      a: "Our thorough checklist includes motherboard inspection, CPU stress testing, RAM diagnostics, SSD speed and sector health tests, power supply unit (PSU) stability audits, cooling fan functionality, port verification, and complete cosmetic cleaning.",
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
    "name": "How to Buy a Refurbished Desktop Online in India",
    "description": "Step-by-step guide to purchasing a reliable certified refurbished desktop online.",
    "totalTime": "PT10M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Select Form Factor",
        "text": "Pick from Tower PCs, Space-saving Mini PCs, or integrated All-in-One systems.",
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Choose Core Specs",
        "text": "Verify required processor levels, RAM size (8GB/16GB), and SSD storage volumes.",
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Verify Warranty details",
        "text": "Confirm the product includes a 1-year replacement warranty for peace of mind.",
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Review Accessories",
        "text": "Add matching monitors, keyboard sets, and Wi-Fi dongles to complete your setup.",
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Secure Nationwide Shipping",
        "text": "Place your order for secure pan-India shipping with tracked logistics handlers.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F6F5F8] flex flex-col font-sans">
      {/* ─── ALL JSON-LD SCHEMAS ─────────────────────────────────────── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <Header />

      {/* ─── VISIBLE BREADCRUMB ──────────────────────────────────────── */}
      <div className="bg-[#f2ece4] w-full py-2.5">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-start gap-4">
          <span className="text-[28px] font-medium text-[#111] tracking-tight">Refurbished Desktops</span>
          <p className="text-[15px] text-[#777] font-medium mt-1">
            <Link href="/" className="hover:text-[#3452ef] transition-colors">Home</Link>
            <span className="mx-1.5 text-gray-400">/</span>
            <Link href="/shop" className="hover:text-[#3452ef] transition-colors">Shop</Link>
            <span className="mx-1.5 text-gray-400">/</span>
            <span className="text-[#111] font-bold">Refurbished Desktops</span>
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
                Nationwide Delivery
              </span>
            </div>

            <h1 id="page-h1" className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-2">
              Buy High Quality Refurbished Desktops
            </h1>
            <p className="text-sm text-slate-400 font-medium mb-5 tracking-wide">Starting from <strong className="text-[#faba5b] text-base">₹8,999</strong> · Stocks updated daily</p>

            <p id="page-intro" className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl speakable">
              Certified refurbished desktops are professionally audited, repaired, and warranty-backed computers sold at 40% to 70% savings compared to new PCs, available online across India at Comsri Corporation. Explore second hand computers, certified used desktops, and refurbished towers in India with a 1-year warranty and fast pan-India delivery.
            </p>

            {/* Trust Bar */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-400">
              {[
                { icon: <ShieldCheck size={13} className="text-emerald-400" />, label: "1-Year Warranty" },
                { icon: <CheckCircle2 size={13} className="text-blue-400" />, label: "40+ Point Inspection" },
                { icon: <Star size={13} className="text-[#faba5b]" />, label: "4.8★ Customer Rating" },
                { icon: <TrendingUp size={13} className="text-purple-400" />, label: "Save up to 70%" },
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
        aria-label="Refurbished Desktops Product Catalog"
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
        aria-label="Complete Buyer's Guide for Refurbished Desktops in India"
        className="bg-white border border-slate-100 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.015)] max-w-[1600px] mx-auto px-8 md:px-12 py-12 w-[calc(100%-3rem)] mb-12"
      >
        {/* Section Header */}
        <header className="text-center mb-12">
          <span className="text-[#374bf9] font-mono text-xs uppercase tracking-widest font-bold bg-[#374bf9]/5 px-4 py-2 rounded-full inline-block mb-3">
            Comprehensive Buyer's Guide
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Buy High Quality Refurbished Desktops
          </h2>
          <div className="h-1 w-20 bg-[#374bf9] rounded-full mx-auto mt-4" />
        </header>

        {/* ── Intro Paragraphs ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-50 p-6 md:p-8 rounded-[24px] hover:translate-y-[-2px] transition-transform duration-300 border border-slate-100/50">
            <p className="text-sm text-slate-600 leading-relaxed">
              In today's fast-moving business and educational landscape, having access to a high-speed, durable computer is an absolute standard requirement. Whether setup for intensive office tasks, programming, educational projects, or daily home management, desktops remain the gold standard for long-term work endurance. However, rising retail prices of new enterprise computers have led smart buyers to seek quality alternatives. Choosing to <strong>buy refurbished desktops in India</strong> allows you to acquire enterprise-grade desktop performance at a fraction of standard market costs. Browse and <strong>Buy High Quality Refurbished Desktops</strong> online today.
            </p>
          </div>
          <div className="bg-slate-50 p-6 md:p-8 rounded-[24px] hover:translate-y-[-2px] transition-transform duration-300 border border-slate-100/50">
            <p className="text-sm text-slate-600 leading-relaxed">
              Our <strong>certified refurbished desktops</strong> undergo strict factory audit processes, replacement repairs, physical cleaning, and multi-stage testing before being approved for distribution. Core components like the motherboard, RAM, power supply unit (PSU), and storage sectors are certified functionally optimal. A clean, licensed copy of the operating system is freshly loaded, delivering a setup and usage experience matching that of a brand-new desktop computer system with massive savings.
            </p>
          </div>
        </div>

        {/* ── Large Collection Section ── */}
        <div className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-[#374bf9]">■</span> Diverse Range of Refurbished Desktop Computers
          </h3>
          <div className="text-sm text-slate-600 leading-relaxed space-y-4">
            <p>
              When searching for the best <strong>refurbished desktop computers</strong>, you can select from top-tier corporate collections including <strong>Dell OptiPlex, HP ProDesk/EliteDesk, Lenovo ThinkCentre, and Apple Mac Mini/iMac</strong>. These models represent high-grade business ranges built for reliable, continuous performance and seamless hardware expandability.
            </p>
            <p>
              For customers aiming to order <strong>refurbished desktops online</strong>, purchasing professionally audited refurbished computers from Comsri Corporation offers verified reliability far superior to ordinary peer-to-peer second-hand sales. All devices are securely dispatched nationwide, making finding certified <strong>refurbished computers in India</strong> highly convenient and risk-free.
            </p>
          </div>
        </div>

        {/* ── Comparison Table ── */}
        <div className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-[#374bf9]">■</span> Certified Refurbished Desktops vs New vs Second-Hand Desktops
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
                  ["Price Range", "₹8,999 – ₹45,000", "₹35,000 – ₹1,20,000+", "₹4,000 – ₹25,000"],
                  ["Diagnostic Check", "✅ 40+ point audit", "✅ Factory checked", "❌ No verification"],
                  ["Warranty Protection", "✅ 1-Year free warranty", "✅ 1–3 Year brand warranty", "❌ None"],
                  ["Clean OS Setup", "✅ Yes (Fresh installation)", "✅ Yes", "⚠️ Not guaranteed"],
                  ["Average Price Savings", "40% – 70% savings", "—", "50% – 80% (high risk)"],
                  ["Electronic Waste Impact", "✅ Positive (Reduces waste)", "❌ High resources used", "⚠️ Partial benefit"],
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
            Top Reasons to Choose Refurbished PCs with Warranty
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <ShieldCheck size={20} />, title: "Certified Performance", desc: "Each refurbished desktop unit undergoes diagnostic testing covering motherboard cap, memory modules, and processing cores." },
              { icon: <CheckCircle2 size={20} />, title: "Detailed Audits", desc: "Transparent system grading levels and structural information are provided to help you pick the right PC for your setup." },
              { icon: <TrendingUp size={20} />, title: "Outstanding Savings", desc: "Save 40%–70% relative to buying new computers, freeing up budget space for higher memory configurations or monitor size upgrades." },
              { icon: <Leaf size={20} />, title: "Ecological Choice", desc: "Opting for refurbished hardware actively redirects functional parts away from e-waste landfills, lowering your carbon footprint." },
              { icon: <Headphones size={20} />, title: "1-Year Comsri Warranty", desc: "All Comsri refurbished desktops are covered by our 1-year replacement warranty, accompanied by active online support." },
              { icon: <Zap size={20} />, title: "Corporate Durability", desc: "Sourced from premier commercial lease setups, ensuring rugged build chassis designs made to run safely for years." },
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
            <span className="text-[#374bf9]">■</span> How to Buy Refurbished Desktop Computers Online in India
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              { step: "01", title: "Select Form Factor", desc: "Pick from Tower PCs, Space-saving Mini PCs, or integrated All-in-One systems." },
              { step: "02", title: "Choose Core Specs", desc: "Verify required processor levels, RAM size (8GB/16GB), and SSD storage volumes." },
              { step: "03", title: "Verify Warranty details", desc: "Confirm the product includes a 1-year replacement warranty for peace of mind." },
              { step: "04", title: "Review Accessories", desc: "Add matching monitors, keyboard sets, and Wi-Fi dongles to complete your setup." },
              { step: "05", title: "Secure Nationwide Shipping", desc: "Place your order for secure pan-India shipping with tracked logistics handlers." },
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
            <span className="text-[#374bf9]">■</span> Why Certified Refurbished Desktops Outperform Second-Hand Computers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600 leading-relaxed">
            <div className="bg-slate-50 p-6 rounded-2xl hover:shadow-sm transition-shadow">
              <p>Buying direct <strong>second hand computers</strong> carries high uncertainty. Local retail listings offer no hardware health history, and hidden flaws in the power supply or motherboard capacitors can quickly lead to complete system failures shortly after purchase.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl hover:shadow-sm transition-shadow">
              <p>Choosing <strong>refurbished PCs with warranty</strong> resolves these safety issues. Professionals replace thermal pastes, clean chassis corridors, and run heavy read-write stress tests on storage chips, making the system run like a brand-new unit.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl hover:shadow-sm transition-shadow">
              <p>When analyzing second hand computers vs refurbished models, the availability of a <strong>1-year replacement warranty</strong> from Comsri provides unmatched transactional security and product support value.</p>
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
              Deciding to <strong>buy refurbished desktops in India</strong> represents a highly economical, logical path to acquiring high-grade, durable computing systems without overspending. Whether selecting mini PCs, business tower models, or integrated setups, refurbished models deliver reliability, speed, and warranty coverage at budget-friendly levels.
            </p>
            <p className="text-sm text-slate-200 leading-relaxed font-semibold">
              If you are researching <em>where to buy refurbished desktops in India</em>, Comsri Corporation offers professional build configurations, robust warranties, and full post-purchase support.
            </p>
          </div>
        </div>

        {/* ── FAQ Accordion ── */}
        <div id="faq-section" className="mb-4" aria-label="Frequently Asked Questions about Refurbished Desktops">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 text-center">
            Frequently Asked Questions
          </h3>
          <p className="text-sm text-slate-500 text-center mb-8">Everything you need to know before buying a refurbished desktop computer online in India.</p>
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
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full" />
                  <Instagram size={16} className="text-white relative z-10" />
                </a>
                <a href={SITE_CONFIG.social.youtube} aria-label="YouTube" className="w-[32px] h-[32px] rounded-full bg-[#ff0000] text-white flex items-center justify-center hover:bg-[#cc0000] transition-colors shadow-sm">
                  <Youtube size={14} className="fill-white" strokeWidth={0} />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-[#3452ef] rounded-[24px] px-8 md:px-12 py-10 flex flex-col lg:flex-row items-center justify-between gap-8 mt-2 w-full">
            <div className="flex flex-col text-white flex-1 text-center lg:text-left">
              <h2 className="text-[28px] md:text-[32px] font-bold mb-1.5 tracking-tight">Sign Up to us Newsletter</h2>
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
                <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/mastercard.svg" className="h-full object-contain" alt="Mastercard" />
              </div>
              <div className="bg-[#1a1f71] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/visa.svg" className="h-[70%] object-contain mt-[0.5px]" alt="Visa" />
              </div>
              <div className="bg-[#003087] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/paypal.svg" className="h-[55%] object-contain" alt="PayPal" />
              </div>
              <div className="bg-[#2d9cdb] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/amex.svg" className="h-[75%] object-contain" alt="Amex" />
              </div>
              <div className="bg-[#6772e5] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/stripe.svg" className="h-[50%] object-contain" alt="Stripe" />
              </div>
              <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/google-pay.svg" className="h-[55%] object-contain" alt="Google Pay" />
              </div>
              <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1 border border-gray-700">
                <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/apple-pay.svg" className="h-[60%] object-contain" alt="Apple Pay" />
              </div>
              <div className="bg-[#004b87] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/unionpay.svg" className="h-[70%] object-contain" alt="UnionPay" />
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
