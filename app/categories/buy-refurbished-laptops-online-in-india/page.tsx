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

const CATEGORY_ID = "112"; // Refurbished Laptops Category ID
const PAGE_TITLE = "Buy Refurbished Laptops Online in India";
const PAGE_DESCRIPTION =
  "Buy refurbished laptops online in India at best prices. Certified used laptops with warranty, fast delivery & bulk deals for business and personal use. Starting from ₹8,999.";
const PAGE_PATH = "/categories/buy-refurbished-laptops-online-in-india";

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
      "Buy Refurbished Laptops Online in India",
      "refurbished laptops",
      "second hand laptops",
      "best refurbished laptops in India",
      "buy used laptops online",
      "where to buy refurbished laptops in India",
      "refurbished computers in India",
      "certified refurbished laptops",
      "refurbished Dell laptops India",
      "refurbished HP laptops India",
      "refurbished Lenovo laptops India",
      "cheap laptops India",
      "used laptops with warranty",
    ],
    noIndex,
  });
}

export default async function RefurbishedLaptopsPage({ searchParams }: CategoryPageProps) {
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
    console.error("[Laptops Category Server Loading Error]:", err);
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
      { "@type": "ListItem", "position": 3, "name": "Refurbished Laptops", "item": `${SITE_CONFIG.url}${PAGE_PATH}` },
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
      { "@type": "Thing", "name": "Refurbished Laptops" },
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

  const offerCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${SITE_CONFIG.url}${PAGE_PATH}/#catalog`,
    "name": "Refurbished Laptops Catalog – India",
    "description": "Certified refurbished commercial-grade laptops available for purchase online in India with warranty.",
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
      q: "Where to buy refurbished laptops in India?",
      a: "Comsri Corporation is one of India's trusted certified refurbished laptop sellers in India, offering devices that undergo 40+ point quality checks, come with 1-year replacement warranty, and ship nationwide. You can browse and buy refurbished laptops online directly at comsri.com.",
    },
    {
      q: "Are refurbished laptops reliable?",
      a: "Yes. Professionally certified refurbished laptops from trusted sellers like Comsri undergo extensive testing, diagnostics, component replacement, cleaning, and fresh OS installation. This makes them highly reliable for everyday use, business applications, or student needs.",
    },
    {
      q: "Are refurbished laptops better than second-hand laptops?",
      a: "In most cases, yes. Refurbished laptops are professionally inspected, repaired, tested, and certified before sale. Second-hand laptops are typically sold as-is with no quality guarantee. Refurbished devices offer better reliability, warranty coverage, and overall value.",
    },
    {
      q: "What are the best refurbished laptops in India?",
      a: "Popular certified refurbished options include Dell Latitude series, HP EliteBook series, Lenovo ThinkPad series, and Apple MacBook Pro/Air. These business-grade models are known for build quality, repairability, and longevity — ideal for both personal and professional use.",
    },
    {
      q: "What is the warranty on refurbished laptops at Comsri?",
      a: "Comsri offers a 1-year replacement warranty on all certified refurbished laptops. This covers hardware defects, component failures, and performance issues identified post-purchase — giving you peace of mind similar to buying new.",
    },
    {
      q: "How much can I save by buying a refurbished laptop?",
      a: "Buyers can typically save 40% to 70% compared to the retail price of an equivalent new laptop. For example, a Dell Latitude that costs ₹80,000 new may be available as a certified refurbished unit for ₹28,000–₹40,000 with similar specifications.",
    },
    {
      q: "What brands of refurbished laptops are available?",
      a: "At Comsri, you can find certified refurbished laptops from top brands including Dell, HP, Lenovo, Apple, ASUS, Acer, Microsoft Surface, and Toshiba. All units are sourced from authentic commercial and enterprise batches.",
    },
    {
      q: "Do refurbished laptops come with an operating system?",
      a: "Yes. All certified refurbished laptops from Comsri come with a fresh installation of Windows 10 Pro or Windows 11 Pro (depending on the model), along with necessary drivers pre-installed. Apple MacBooks come with the latest compatible macOS version.",
    },
    {
      q: "Is buying refurbished laptops online in India safe?",
      a: "Yes, when buying from certified sellers like Comsri that offer transparent grading, verified hardware specifications, warranty coverage, and return policies. Avoid unverified local sellers or marketplaces without quality guarantees.",
    },
    {
      q: "What is the refurbishing process at Comsri?",
      a: "Every laptop goes through a 40+ point diagnostic check including CPU stress testing, RAM verification, SSD/HDD health analysis, battery calibration, display inspection, port testing, and cosmetic assessment. Faulty parts are replaced, the unit is deep-cleaned, and a fresh OS is installed before shipping.",
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

  return (
    <div className="min-h-screen bg-[#F6F5F8] flex flex-col font-sans">
      {/* ─── ALL JSON-LD SCHEMAS ─────────────────────────────────────── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Header />

      {/* ─── VISIBLE BREADCRUMB ──────────────────────────────────────── */}
      <div className="bg-[#f2ece4] w-full py-2.5">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-start gap-4">
          <span className="text-[28px] font-medium text-[#111] tracking-tight">Refurbished Laptops</span>
          <p className="text-[15px] text-[#777] font-medium mt-1">
            <Link href="/" className="hover:text-[#3452ef] transition-colors">Home</Link>
            <span className="mx-1.5 text-gray-400">/</span>
            <Link href="/shop" className="hover:text-[#3452ef] transition-colors">Shop</Link>
            <span className="mx-1.5 text-gray-400">/</span>
            <span className="text-[#111] font-bold">Refurbished Laptops</span>
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

            {/* H1 – hardcoded to target keyword for SEO certainty */}
            <h1 id="page-h1" className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-2">
              Buy Refurbished Laptops<br className="hidden md:block" /> Online in India
            </h1>
            <p className="text-sm text-slate-400 font-medium mb-5 tracking-wide">Starting from <strong className="text-[#faba5b] text-base">₹8,999</strong> · Stocks updated daily</p>

            <p id="page-intro" className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl speakable">
              Buy refurbished laptops online in India from certified brands at affordable prices. Explore second hand laptops, certified used laptops, and refurbished computers in India with 1-year warranty, quality assurance, and fast pan-India delivery at Comsri Corporation.
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
        aria-label="Refurbished Laptops Product Catalog"
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
            embedded
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
        aria-label="Complete Buyer's Guide for Refurbished Laptops in India"
        className="bg-white border border-slate-100 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.015)] max-w-[1600px] mx-auto px-8 md:px-12 py-12 w-[calc(100%-3rem)] mb-12"
      >
        {/* Section Header */}
        <header className="text-center mb-12">
          <span className="text-[#374bf9] font-mono text-xs uppercase tracking-widest font-bold bg-[#374bf9]/5 px-4 py-2 rounded-full inline-block mb-3">
            Comprehensive Buyer's Guide
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Buy Refurbished Laptops Online in India
          </h2>
          <div className="h-1 w-20 bg-[#374bf9] rounded-full mx-auto mt-4" />
        </header>

        {/* ── Intro Paragraphs ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-50 p-6 md:p-8 rounded-[24px] hover:translate-y-[-2px] transition-transform duration-300 border border-slate-100/50">
            <p className="text-sm text-slate-600 leading-relaxed">
              In today&apos;s digital-first world, owning a reliable computer is no longer a luxury—it&apos;s a necessity. Whether you&apos;re attending online classes, working remotely, running a business, or managing everyday tasks, having access to dependable technology is essential. However, the increasing cost of brand-new devices has led many buyers to explore smarter alternatives. That&apos;s why more people are choosing to <strong>Buy Refurbished Laptops Online in India</strong> and enjoy premium performance at a fraction of the cost.
            </p>
          </div>
          <div className="bg-slate-50 p-6 md:p-8 rounded-[24px] hover:translate-y-[-2px] transition-transform duration-300 border border-slate-100/50">
            <p className="text-sm text-slate-600 leading-relaxed">
              Certified refurbished laptops undergo extensive testing, repairs, cleaning, and quality inspections before they are made available for sale. Hardware components are carefully checked, faulty parts are replaced when necessary, internal systems are cleaned, and a fresh operating system is installed. This process ensures that refurbished devices deliver reliable performance and a user experience similar to that of a new laptop. For budget-conscious buyers, refurbished technology offers the perfect balance between affordability, quality, and long-term reliability.
            </p>
          </div>
        </div>

        {/* ── Large Collection Section ── */}
        <div className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-[#374bf9]">■</span> Large Collection of Refurbished Laptops
          </h3>
          <div className="text-sm text-slate-600 leading-relaxed space-y-4">
            <p>
              If you&apos;re looking for the <strong>best refurbished laptops in India</strong>, you&apos;ll find a wide range of options from trusted brands such as <strong>Dell, HP, Lenovo, Apple, ASUS, and Acer</strong>. From lightweight ultrabooks and student laptops to powerful business workstations and professional-grade machines, there&apos;s a device to suit every requirement and budget.
            </p>
            <p>
              For customers looking to <strong>buy used laptops online</strong>, professionally refurbished devices provide a safer and more dependable alternative than standard second-hand products. Every laptop is thoroughly tested, quality-checked, and certified before being listed for sale. With nationwide delivery and easy browsing, finding high-quality <strong>refurbished computers in India</strong> has never been easier.
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
                  ["Price Range", "₹8,999 – ₹55,000", "₹35,000 – ₹1,50,000+", "₹5,000 – ₹30,000"],
                  ["Quality Guarantee", "✅ 40+ point certified", "✅ Factory new", "❌ No guarantee"],
                  ["Warranty", "✅ 1-Year free warranty", "✅ 1–3 Year manufacturer", "❌ Typically none"],
                  ["OS Installed", "✅ Fresh Windows/macOS", "✅ Factory OS", "⚠️ May vary"],
                  ["Savings vs New", "40% – 70% savings", "—", "50% – 80% (risky)"],
                  ["Eco-Friendly", "✅ Reduces e-waste", "❌ New resources used", "⚠️ Partially"],
                  ["Trust Level", "✅ High – certified seller", "✅ High – brand new", "⚠️ Low – unknown history"],
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
            Top Reasons to Choose Certified Refurbished Laptops
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <ShieldCheck size={20} />, title: "Certified Quality", desc: "Every refurbished laptop undergoes rigorous 40+ point testing and inspection to ensure optimal functionality, performance, and reliability." },
              { icon: <CheckCircle2 size={20} />, title: "Transparent Information", desc: "Detailed specifications, device condition grading, and hardware diagnostics help customers make informed purchasing decisions with complete confidence." },
              { icon: <TrendingUp size={20} />, title: "Exceptional Value", desc: "Refurbished laptops offer savings of 40%–70% compared to new devices, making them an excellent investment for students, professionals, and businesses." },
              { icon: <Leaf size={20} />, title: "Sustainable Choice", desc: "Choosing refurbished devices helps reduce electronic waste and promotes environmentally responsible technology consumption — good for you and the planet." },
              { icon: <Headphones size={20} />, title: "Warranty & Support", desc: "Comsri certified refurbished laptops come with a 1-year replacement warranty, dedicated customer support, and easy return options for complete peace of mind." },
              { icon: <Zap size={20} />, title: "Business Ready", desc: "Commercial-grade Dell, HP, and Lenovo units are enterprise-tested for durability and performance — ideal for bulk orders, offices, and institutions." },
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
            <span className="text-[#374bf9]">■</span> How to Buy a Refurbished Laptop Online in India
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              { step: "01", title: "Define Requirements", desc: "Identify RAM, storage, display size, and use case — student, office, or professional." },
              { step: "02", title: "Choose Certified Seller", desc: "Pick a verified seller like Comsri with 40+ point checks, warranty, and clear policies." },
              { step: "03", title: "Check Specs & Grade", desc: "Review processor gen, battery health, SSD type, and cosmetic grade (A/B/C)." },
              { step: "04", title: "Review Warranty", desc: "Confirm 1-year replacement warranty and return window before adding to cart." },
              { step: "05", title: "Order & Get Delivered", desc: "Pay securely and receive your laptop with tracking — shipped pan-India." },
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
            <span className="text-[#374bf9]">■</span> Why Refurbished Laptops Are Better Than Ordinary Second-Hand Devices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600 leading-relaxed">
            <div className="bg-slate-50 p-6 rounded-2xl hover:shadow-sm transition-shadow">
              <p>Many buyers begin their search by considering <strong>second hand laptops</strong> because of their lower upfront cost. While used laptops may seem attractive, they often lack professional testing, quality assurance, and warranty coverage. Hidden issues such as battery degradation, overheating, storage failures, or hardware defects can result in additional costs later.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl hover:shadow-sm transition-shadow">
              <p>This is why many consumers researching <strong>where to buy refurbished laptops in India</strong> ultimately choose certified refurbished devices. Unlike ordinary second-hand laptops, refurbished systems are professionally restored, tested, and verified to meet quality standards before reaching customers.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl hover:shadow-sm transition-shadow">
              <p>When comparing second hand laptops and refurbished laptops, buyers looking for long-term reliability, better performance, and warranty protection typically find <strong>certified refurbished devices from Comsri</strong> to be the smarter choice with greater peace of mind.</p>
            </div>
          </div>
        </div>

        {/* ── E-E-A-T / Trust Section ── */}
        <div className="mb-12 bg-gradient-to-br from-[#374bf9]/5 to-indigo-50 border border-blue-100 rounded-[24px] p-8 md:p-10">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
            Why Trust Comsri Corporation?
          </h3>
          <p className="text-sm text-slate-500 mb-8">Backed by years of experience in certified refurbished IT hardware across India.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { stat: "10,000+", label: "Laptops Sold", sub: "Across India" },
              { stat: "4.8★", label: "Customer Rating", sub: "From 1,200+ reviews" },
              { stat: "1 Year", label: "Replacement Warranty", sub: "On every device" },
              { stat: "40+", label: "Quality Checkpoints", sub: "Per unit before sale" },
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
              Choosing to <strong className="text-white">Buy Refurbished Laptops Online in India</strong> is a smart and cost-effective way to access premium technology without overspending. Whether you&apos;re searching for refurbished laptops, looking to buy used laptops online, comparing second hand laptops, or exploring refurbished computers in India, certified refurbished devices provide outstanding value, dependable performance, and environmental benefits.
            </p>
            <p className="text-sm text-slate-200 leading-relaxed font-semibold">
              If you&apos;re wondering <em>where to buy refurbished laptops in India</em>, Comsri Corporation provides rigorous quality standards, 1-year warranty coverage, and dedicated customer support — helping you find the best refurbished laptops in India with complete peace of mind.
            </p>
          </div>
        </div>

        {/* ── FAQ Accordion ── */}
        <div id="faq-section" className="mb-4" aria-label="Frequently Asked Questions about Refurbished Laptops">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 text-center">
            Frequently Asked Questions
          </h3>
          <p className="text-sm text-slate-500 text-center mb-8">Everything you need to know before buying a refurbished laptop online in India.</p>
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
