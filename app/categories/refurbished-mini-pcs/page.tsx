import Link from "next/link";
import {
  MessageCircle,
  Play,
  Apple,
  Facebook,
  Instagram,
  Youtube
} from "lucide-react";
import { Metadata } from "next";
import { woocommerce } from "@/lib/services/woocommerce";
import { getFilteredCatalog } from "@/lib/services/catalog";
import Header from "../../Header";
import ShopCatalogClient from "../../shop/ShopCatalogClient";
import { constructMetadata, getCategoryMetadata } from "../../seo/metadata";

export const dynamic = "force-dynamic";

const CATEGORY_ID = "137"; // Refurbished Mini PCs Category ID

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
  const hasSortingOrFilters = resolvedParams.orderby || resolvedParams.min_price || resolvedParams.max_price || resolvedParams.on_sale || resolvedParams.search || resolvedParams.page;
  const noIndex = !!hasSortingOrFilters;

  return constructMetadata({
    title: "Ultra-Compact Refurbished Mini PCs & Tiny Computers",
    description: "Buy space-saving, low-power certified refurbished mini PCs from Dell, HP, Lenovo. Tested commercial hardware with 1-year warranty and free shipping in India.",
    path: "/categories/refurbished-mini-pcs",
    canonical: "/categories/refurbished-mini-pcs",
    keywords: [
      "refurbished mini PC",
      "tiny PC",
      "micro computer",
      "second hand mini PC",
      "Comsri mini PC"
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

  const activeCategoryObject = categories.find((c) => c.id.toString() === CATEGORY_ID);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://comsri.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Categories",
        "item": "https://comsri.com/shop"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Refurbished Mini PCs",
        "item": "https://comsri.com/categories/refurbished-mini-pcs"
      }
    ]
  };

  const productSchemaList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Refurbished Mini PCs Catalog",
    "description": "Certified refurbished commercial mini PCs and tiny factor computers in India.",
    "numberOfItems": productsResult.data?.length || 0,
    "itemListElement": (productsResult.data || []).map((prod: any, idx: number) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "url": `https://comsri.com/products/${prod.slug}`,
      "name": prod.name,
      "image": prod.images?.[0]?.src || "https://comsri.com/og-image.jpg"
    }))
  };

  return (
    <div className="min-h-screen bg-[#F6F5F8] flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchemaList) }}
      />
      <Header />

      {/* -------------------- SHOP HERO BLOCK -------------------- */}
      <section className="bg-slate-900 text-white py-12 px-6 lg:px-12 relative overflow-hidden" id="shop-hero">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#faba5b]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="max-w-2xl">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#faba5b] bg-[#faba5b]/10 px-3.5 py-1.5 rounded-full border border-[#faba5b]/20 inline-block mb-4">
              Ultra-Compact Factor
            </span>
            <h1 className="text-3xl md:text-5xl font-medium tracking-tight leading-none mb-3">
              {activeCategoryObject ? activeCategoryObject.name : "Refurbished Mini PCs"}
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-xl">
              {activeCategoryObject?.description
                ? activeCategoryObject.description
                : "Explore our collection of commercial-grade certified refurbished mini PCs. Subjected to extensive multithreaded diagnostics with 1-year coverage warranty."
              }
            </p>

            {/* Category Quick Links */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              <span className="text-xs text-slate-400 font-medium self-center mr-1">Popular Categories:</span>
              {[
                { label: "Refurbished Laptops", path: "/categories/buy-refurbished-laptops-online-in-india" },
                { label: "Refurbished Desktops", path: "/categories/buy-high-quality-refurbished-desktops" },
                { label: "Workstations", path: "/categories/refurbished-workstations" },
                { label: "Mini PCs", path: "/categories/refurbished-mini-pcs" }
              ].map((cat) => (
                <Link
                  key={cat.path}
                  href={cat.path}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all ${
                    cat.path === "/categories/refurbished-mini-pcs"
                      ? "text-white bg-blue-600 border border-blue-600"
                      : "text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-750 hover:border-slate-500 hover:text-white"
                  }`}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -------------------- CORE SHOP SECTION -------------------- */}
      <main className="flex-1 max-w-[1600px] mx-auto px-6 lg:px-12 py-10 w-full">
        {fetchError ? (
          <div className="bg-rose-50 border border-rose-100 text-rose-800 p-8 rounded-3xl text-center shadow-sm">
            <p className="text-3xl">⚠️</p>
            <h3 className="text-lg font-black text-rose-950 mt-2">Active WordPress Handshake offline</h3>
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

      {/* Footer Section */}
      <footer className="bg-[#fcb643] pt-16 pb-12 w-full relative">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col gap-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 justify-between">
            <div className="flex flex-col pr-4">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Address</h3>
              <p className="text-[14px] font-semibold text-[#2d2d2d] leading-relaxed mb-6">
                Office No.-T-15 Pinnacle Business Park MC Rd Shanti Nagar Andheri East Mumbai Maharastra – 400093
              </p>
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
                  { label: "Refurbished Workstations", path: "/categories/refurbished-workstations" },
                  { label: "Refurbished Macbooks", path: "/categories/buy-refurbished-laptops-online-in-india" },
                  { label: "Refurbished Mini PCs", path: "/categories/refurbished-mini-pcs" }
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
                  { label: "New Mini PCs", path: "/shop" }
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
                  { label: "Shipping Policy", path: "/privacy-policy?tab=shipping" }
                ].map((item, i) => (
                  <Link key={i} href={item.path} className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item.label}</Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Avalible On:</h3>
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
                <a href="#" className="w-[32px] h-[32px] rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:bg-[#2b4170] transition-colors shadow-sm">
                  <Facebook size={16} className="fill-white" strokeWidth={0} />
                </a>
                <a href="#" className="w-[32px] h-[32px] rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors shadow-sm">
                  <span className="text-white font-bold text-[14px] italic pr-0.5 leading-none mt-0.5">X</span>
                </a>
                <a href="#" className="w-[32px] h-[32px] rounded-full bg-[#833ab4] text-[#833ab4] flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full"></div>
                  <Instagram size={16} className="text-white relative z-10" />
                </a>
                <a href="#" className="w-[32px] h-[32px] rounded-full bg-[#ff0000] text-white flex items-center justify-center hover:bg-[#cc0000] transition-colors shadow-sm">
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
