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
import Footer from "../../Footer";
import ShopCatalogClient from "../../shop/ShopCatalogClient";
import { constructMetadata } from "../../seo/metadata";
import { SITE_CONFIG } from "../../seo/constants";

export const dynamic = "force-dynamic";

const CATEGORY_ID = "139"; // Refurbished Workstations Category ID
const PAGE_TITLE = "Buy Refurbished Workstations Online in India";
const PAGE_DESCRIPTION =
  "Buy refurbished workstations online in India at best prices. Shop high-performance certified workstation PCs with warranty ideal for office, design, and business use.";
const PAGE_PATH = "/categories/buy-refurbished-workstations-online-in-india";

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
      "Buy Refurbished Workstations Online in India",
      "Buy Refurbished Workstations Online",
      "best refurbished workstations in India",
      "buy used rendering PCs online",
      "where to buy refurbished workstations in India",
      "refurbished performance workstations in India",
      "certified refurbished workstations",
      "refurbished Dell Precision workstation India",
      "refurbished HP ZBook workstation India",
      "refurbished Lenovo ThinkStation India",
      "refurbished Mac Studio India",
      "cheap server computer systems India",
      "used workstations with warranty",
    ],
    noIndex,
  });
}

export default async function RefurbishedWorkstationsPage({ searchParams }: CategoryPageProps) {
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
    console.error("[Workstations Category Server Loading Error]:", err);
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
      { "@type": "ListItem", "position": 3, "name": "Refurbished Workstations", "item": `${SITE_CONFIG.url}${PAGE_PATH}` },
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
      { "@type": "Thing", "name": "Refurbished Workstations" },
      { "@type": "Thing", "name": "Certified Pre-owned Rendering Computers" },
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
    "headline": "Buy Refurbished Workstations Online in India – Performance Buyer's Guide",
    "description": "A comprehensive guide to buying certified refurbished workstations, Xeon computers, and high-performance rendering systems online in India.",
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
    "about": { "@type": "Thing", "name": "Refurbished Workstations" },
    "mentions": [
      { "@type": "Brand", "name": "Dell" },
      { "@type": "Brand", "name": "HP" },
      { "@type": "Brand", "name": "Lenovo" },
      { "@type": "Brand", "name": "Apple" }
    ],
    "keywords": "refurbished workstations, buy Xeon PC India, certified rendering computers",
    "articleSection": "Buyer's Guide",
  };

  const offerCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${SITE_CONFIG.url}${PAGE_PATH}/#catalog`,
    "name": "Refurbished Workstations Catalog – India",
    "description": "Certified refurbished commercial-grade workstations and Xeon computer systems available online in India with 1-year warranty.",
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
      q: "Where to buy refurbished workstations in India?",
      a: "Comsri Corporation is India's leading online store for certified refurbished workstations, Xeon computers, and heavy-duty desktop towers. Every machine passes a 40+ point certification inspection, is fitted with professional graphics (NVIDIA Quadro/GeForce or AMD Radeon), includes a 1-year replacement warranty, and comes with free pan-India shipping.",
    },
    {
      q: "What makes a refurbished workstation different from a normal PC?",
      a: "Workstations are designed for complex, continuous multi-threaded computing workloads. Equipped with server-grade Intel Xeon or AMD Threadripper processors, ECC (Error-Correcting Code) RAM to prevent system crashes, and specialized professional GPUs, they deliver 24/7 reliability for CAD modeling, video editing, data science, and rendering.",
    },
    {
      q: "Which brands of refurbished workstations do you supply?",
      a: "We offer top commercial-grade workstations from leading enterprise lines: Dell Precision (tower and mobile), HP Z-series (HP Z4, Z6, Z8, ZBook), Lenovo ThinkStation (P-series), and Apple Mac Studio. Sourced from corporate environments, these machines are built to last.",
    },
    {
      q: "Are refurbished Xeon workstations good for rendering and editing?",
      a: "Yes. They are ideal. The multi-core architecture of Intel Xeon processors allows rendering engines (like Blender, V-Ray, Corona, and Keyshot) and video editors (like Premiere Pro, DaVinci Resolve) to run at full capacity. Paired with high-memory bandwidth and professional GPUs, they significantly cut rendering times.",
    },
    {
      q: "Can I upgrade the GPU, CPU, and RAM on a refurbished workstation?",
      a: "Yes, scalability is a core feature of workstations. Unlike standard personal computers, enterprise workstations feature tool-less high-wattage power supplies and spacious chassis layouts, making it easy to upgrade RAM up to 256GB/512GB, swap Xeon processors, or add high-end graphics cards.",
    },
    {
      q: "What warranty coverage is included with Comsri workstations?",
      a: "All certified refurbished workstations purchased from Comsri Corporation are backed by our comprehensive 1-year replacement warranty. In the rare case of hardware component failure, our technical team provides swift troubleshooting and replacement parts.",
    },
    {
      q: "What operating systems are installed on your refurbished workstations?",
      a: "Workstations are preloaded with licensed, fresh installations of Windows 10 Pro or Windows 11 Pro Workstation edition. Apple Mac Studio devices are loaded with the latest compatible macOS version. Linux configurations are available upon request.",
    },
    {
      q: "How does a refurbished workstation compare to a standard second-hand PC?",
      a: "Certified refurbished workstations from Comsri undergo a 40+ point diagnostic stress test (motherboard health, ECC RAM audit, PSU load capacity, GPU stability under peak stress). They are deep cleaned, re-pasted, and carry a 1-year warranty. Ordinary second-hand PCs carry a high risk of hidden motherboard or component failure.",
    },
    {
      q: "Do you supply workstations in bulk to businesses and schools?",
      a: "Yes, we specialize in bulk enterprise supplies. We help visual studios, architecture offices, educational institutions, and software teams configure customized workstation networks at up to 70% savings compared to buying brand-new setups.",
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
    "name": "How to Buy a Refurbished Workstation Online in India",
    "description": "Step-by-step guide to choosing and purchasing a certified refurbished workstation online.",
    "totalTime": "PT15M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Identify Your Workload Requirements",
        "text": "Determine the resource needs of your applications: high-core count CPUs for CPU rendering, professional CUDA-enabled GPUs for 3D modeling and rendering, or massive RAM for virtualization.",
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Choose a Form Factor & Platform",
        "text": "Select tower workstations (like Dell Precision Tower, HP Z4/Z6/Z8) for high expandability, or compact platforms (like Apple Mac Studio) for office spaces.",
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Configure Processor & ECC RAM",
        "text": "Choose standard multi-core Intel Core i7/i9 or dedicated server-grade Intel Xeon processors, paired with ECC memory to prevent computing errors.",
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Select Professional Graphics Card",
        "text": "Ensure your workstation has a dedicated professional GPU (like NVIDIA Quadro, RTX, or AMD Radeon Pro) certified for ISV software like AutoCAD, SolidWorks, and Maya.",
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Place Order Online with Warranty",
        "text": "Securely checkout at comsri.com to benefit from 40+ point certification, 1-year replacement warranty, and free insured pan-India delivery.",
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
          <span className="text-[28px] font-medium text-[#111] tracking-tight">Refurbished Workstations</span>
          <p className="text-[15px] text-[#777] font-medium mt-1">
            <Link href="/" className="hover:text-[#3452ef] transition-colors">Home</Link>
            <span className="mx-1.5 text-gray-400">/</span>
            <Link href="/shop" className="hover:text-[#3452ef] transition-colors">Shop</Link>
            <span className="mx-1.5 text-gray-400">/</span>
            <span className="text-[#111] font-bold">Refurbished Workstations</span>
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
                ECC RAM Stability
              </span>
              <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3.5 py-1.5 rounded-full border border-emerald-400/20 inline-block">
                ISV Certified Hardware
              </span>
              <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-sky-400 bg-sky-400/10 px-3.5 py-1.5 rounded-full border border-sky-400/20 inline-block">
                Xeon Performance
              </span>
            </div>

            <h1 id="page-h1" className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-2">
              Buy Refurbished Workstations<br className="hidden md:block" /> Online in India
            </h1>
            <p className="text-sm text-slate-400 font-medium mb-5 tracking-wide">Heavy Duty Computational Power · Free Pan-India Delivery</p>

            <p id="page-intro" className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl speakable">
              Buy refurbished workstations online in India at unbeatable pricing. Engineered for high-stress business workflows, rendering, CAD, and data science, our second hand workstations undergo a comprehensive 40+ point check, come with 1-year replacement warranty, and feature clean, licensed OS setups.
            </p>

            {/* Trust Bar */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-400">
              {[
                { icon: <ShieldCheck size={13} className="text-emerald-400" />, label: "1-Year Warranty" },
                { icon: <CheckCircle2 size={13} className="text-blue-400" />, label: "40+ Point Inspection" },
                { icon: <Star size={13} className="text-[#faba5b]" />, label: "4.8★ Customer Rating" },
                { icon: <TrendingUp size={13} className="text-purple-400" />, label: "Xeon & ECC RAM" },
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
        aria-label="Refurbished Workstations Product Catalog"
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
        aria-label="Complete Buyer's Guide for Refurbished Workstations in India"
        className="bg-white border border-slate-100 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.015)] max-w-[1600px] mx-auto px-8 md:px-12 py-12 w-[calc(100%-3rem)] mb-12"
      >
        {/* Section Header */}
        <header className="text-center mb-12">
          <span className="text-[#374bf9] font-mono text-xs uppercase tracking-widest font-bold bg-[#374bf9]/5 px-4 py-2 rounded-full inline-block mb-3">
            Comprehensive Buyer's Guide
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Buy Refurbished Workstations Online in India
          </h2>
          <div className="h-1 w-20 bg-[#374bf9] rounded-full mx-auto mt-4" />
        </header>

        {/* ── Intro Paragraphs ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-50 p-6 md:p-8 rounded-[24px] hover:translate-y-[-2px] transition-transform duration-300 border border-slate-100/50">
            <p className="text-sm text-slate-600 leading-relaxed">
              For professional visual creators, developers, civil engineers, and data analysts, standard desktop computers do not provide sufficient computational bandwidth. Complex workloads like 3D scene rendering, multi-threaded compilations, structural analysis, and virtualization require enterprise-grade setups. Choosing to <strong>Buy Refurbished Workstations Online in India</strong> is the most practical way to secure top-tier compute resources. When you <strong>Buy Refurbished Workstations Online</strong>, you acquire server-grade architecture at a fraction of standard retail costs.
            </p>
          </div>
          <div className="bg-slate-50 p-6 md:p-8 rounded-[24px] hover:translate-y-[-2px] transition-transform duration-300 border border-slate-100/50">
            <p className="text-sm text-slate-600 leading-relaxed">
              Our <strong>certified refurbished workstations</strong> and <strong>refurbished performance workstations in India</strong> go through meticulous configuration audits, extensive hardware tests, motherboard capacitor checks, and multithreaded stress diagnostics. We replace worn-out thermal compounds, inspect ECC memory reliability under full loads, and verify professional GPU performance to ensure everything works flawlessly right out of the box.
            </p>
          </div>
        </div>

        {/* ── Large Collection Section ── */}
        <div className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-[#374bf9]">■</span> Large Collection of Refurbished Workstations
          </h3>
          <div className="text-sm text-slate-600 leading-relaxed space-y-4">
            <p>
              We maintain an extensive catalog of the <strong>best refurbished workstations in India</strong>, sourced directly from high-end corporate enterprise leases. If you are researching <strong>where to buy refurbished workstations in India</strong>, you have access to industry-standard options including a <strong>refurbished Dell Precision workstation India</strong>, a <strong>refurbished HP ZBook workstation India</strong> (for portable workstations), a <strong>refurbished Lenovo ThinkStation India</strong>, or a <strong>refurbished Mac Studio India</strong> depending on your developer platform.
            </p>
            <p>
              When you decide to <strong>buy used rendering PCs online</strong>, you receive specialized systems designed to run 24/7. This provides much higher stability compared to standard consumer-grade rigs. Our custom catalog also includes <strong>cheap server computer systems India</strong>, making it easier to scale up high-performance visual labs, rendering hubs, or student training setups safely with a <strong>used workstations with warranty</strong> plan.
            </p>
          </div>
        </div>

        {/* ── Comparison Table ── */}
        <div className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-[#374bf9]">■</span> Refurbished Workstations vs Brand New Workstations vs Second-Hand PCs
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Feature</th>
                  <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider text-[#faba5b]">Certified Refurbished</th>
                  <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Brand New</th>
                  <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Second-Hand PC</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Average Pricing", "₹20,000 – ₹80,000", "₹1,20,000 – ₹3,50,000+", "₹15,000 – ₹45,000"],
                  ["Processor Class", "Intel Xeon / High-Core Core i7/i9", "Latest Intel Xeon / Core / Threadripper", "Standard consumer Core i5/i7"],
                  ["ECC RAM Stability", "✅ Supported (prevents software crashes)", "✅ Supported", "❌ Rarely supported"],
                  ["Diagnostic Check", "✅ 40+ point full hardware check", "✅ Factory checked", "❌ No verification"],
                  ["Warranty Protection", "✅ 1-Year replacement warranty", "✅ 1-3 Year brand warranty", "❌ None"],
                  ["PSU and cooling capacity", "✅ Heavy-duty server components", "✅ Excellent", "⚠️ Consumer grade (risky)"],
                  ["Average Price Savings", "50% – 75% savings", "—", "40% - 60% (unverified quality)"],
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
            Top Reasons to Choose Certified Refurbished Workstations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <ShieldCheck size={20} />, title: "Server-Grade Computing Power", desc: "Equipped with multi-core Intel Xeon or AMD Threadripper processors designed to handle massive parallel computing tasks without slowdowns." },
              { icon: <CheckCircle2 size={20} />, title: "ECC RAM Stability", desc: "ECC (Error-Correcting Code) memory detects and corrects single-bit data corruption in real-time, preventing blue screens and crash events during long rendering hours." },
              { icon: <TrendingUp size={20} />, title: "Incredible Price Reductions", desc: "Saves up to 75% compared to purchasing retail brand new workstations. This allows visual creators and developer teams to scale up processing units easily." },
              { icon: <Leaf size={20} />, title: "Eco-Friendly Computing", desc: "Extending the life cycle of commercial computing infrastructure reduces corporate e-waste and carbon output directly." },
              { icon: <Headphones size={20} />, title: "1-Year Comsri Warranty", desc: "Comes with our standard 1-year replacement warranty, professional technician support, and secure logistics packaging." },
              { icon: <Zap size={20} />, title: "Heavy Duty Cooling & PSUs", desc: "Features high-efficiency power supplies and optimized heat dispersion fan tunnels designed to maintain cool temperatures under 100% workloads." },
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
            <span className="text-[#374bf9]">■</span> How to Buy a Refurbished Workstation Online in India
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              { step: "01", title: "Identify Applications", desc: "Analyze the software you run: CPU-heavy rendering (Keyshot/Blender), CAD (AutoCAD), or GPU processing (CUDA plugins)." },
              { step: "02", title: "Select CPU & Graphics", desc: "Choose Intel Xeon or multi-core Core i7/i9 processors and pair them with ISV-certified NVIDIA Quadro or RTX GPUs." },
              { step: "03", title: "Verify ECC RAM Size", desc: "We recommend at least 16GB or 32GB ECC RAM to ensure error-free multitasking during continuous renders." },
              { step: "04", title: "Review Diagnostic Reports", desc: "Confirm the workstation has passed comprehensive technician checks and features a full replacement warranty." },
              { step: "05", title: "Complete Secure Order", desc: "Place your order securely online at comsri.com. Enjoy free pan-India shipping with transit insurance." },
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
            <span className="text-[#374bf9]">■</span> Why Refurbished Workstations Are Better Than Ordinary Second-Hand Computers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600 leading-relaxed">
            <div className="bg-slate-50 p-6 rounded-2xl hover:shadow-sm transition-shadow">
              <p>Buying direct <strong>second hand workstations</strong> carries notable risks. Workstations are often subjected to heavy, long-term processing stress. Without professional component analysis, a used workstation could have aging VRMs, micro-fractured solder joints, or a degraded PSU that might fail unexpectedly.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl hover:shadow-sm transition-shadow">
              <p>Certified refurbished units from Comsri Corporation undergo strict inspection. Specialists clean all dust, apply high-grade thermal compound (replacing dried thermal materials), test capacitor health under load, and check power supply output stability under maximum stress.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl hover:shadow-sm transition-shadow">
              <p>When comparing second hand workstations vs refurbished rendering PCs, investing in certified <strong>used workstations with warranty</strong> from Comsri provides reliable, production-ready systems backed by professional technical support.</p>
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
              Acquiring a certified <strong>refurbished workstation</strong> is a smart, strategic decision for engineering, rendering, coding, and production. It provides all the necessary reliability, high memory capacity, and multi-core processing speeds required for demanding computational tasks while saving massive budget.
            </p>
            <p className="text-sm text-slate-200 leading-relaxed font-semibold">
              If you are searching <em>where to buy refurbished workstations in India</em>, Comsri Corporation offers production-ready configurations, clean OS setups, and a 1-year replacement warranty.
            </p>
          </div>
        </div>

        {/* ── FAQ Accordion ── */}
        <div id="faq-section" className="mb-4" aria-label="Frequently Asked Questions about Refurbished Workstations">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 text-center">
            Frequently Asked Questions
          </h3>
          <p className="text-sm text-slate-500 text-center mb-8">Everything you need to know before buying a refurbished workstation computer online in India.</p>
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
      <Footer />
    </div>
  );
}
