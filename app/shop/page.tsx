import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ChevronDown,
  Shuffle,
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Filter,
  Tag,
  Percent,
  Check,
  Sparkles,
  ArrowRight,
  Monitor,
  Laptop,
  Cpu,
  PackageCheck,
  Instagram,
  Facebook,
  Youtube,
  Play,
  Apple,
  MessageCircle
} from "lucide-react";
import { Metadata } from "next";
import { woocommerce } from "@/lib/services/woocommerce";
import { getFilteredCatalog } from "@/lib/services/catalog";
import Header from "../Header";
import Footer from "../Footer";
import ShopCatalogClient from "./ShopCatalogClient";
import { constructMetadata, getCategoryMetadata } from "../seo/metadata";

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
    min_price?: string;
    max_price?: string;
    on_sale?: string;
    orderby?: string;
  }>;
}

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || "";
  const hasSortingOrFilters = resolvedParams.orderby || resolvedParams.min_price || resolvedParams.max_price || resolvedParams.on_sale || resolvedParams.search || resolvedParams.page;
  const noIndex = !!hasSortingOrFilters;

  if (currentCategory) {
    try {
      const categoriesData = await woocommerce.getCategories();
      const activeCategory = (categoriesData || []).find((c: any) => c.id.toString() === currentCategory);
      if (activeCategory) {
        const baseMeta = getCategoryMetadata({
          name: activeCategory.name,
          description: activeCategory.description,
          slug: activeCategory.slug,
        });
        return {
          ...baseMeta,
          alternates: {
            canonical: `https://comsri.com/shop?category=${currentCategory}`,
            languages: {
              "en-IN": `https://comsri.com/shop?category=${currentCategory}`,
              "x-default": `https://comsri.com/shop?category=${currentCategory}`,
            },
          },
          robots: {
            index: !noIndex,
            follow: true,
          },
        };
      }
    } catch (err) {
      console.error(err);
    }
  }

  return constructMetadata({
    title: "Buy Refurbished Laptops & Desktops Online in India",
    description: "Browse our commercial catalog of premium refurbished and new corporate IT hardware in India. 40+ point quality checklist with 1-year replacement warranty.",
    path: "/shop",
    canonical: "/shop",
    keywords: ["refurbished store", "buy refurbished laptop india", "refurbished desktop catalog", "Comsri shop"],
    noIndex,
  });
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || "";
  const currentQuery = resolvedParams.search || "";
  const currentPage = parseInt(resolvedParams.page || "1", 10);
  const currentMinPrice = resolvedParams.min_price || "";
  const currentMaxPrice = resolvedParams.max_price || "";
  const currentOnSaleOnly = resolvedParams.on_sale === "true";
  const currentSorting = resolvedParams.orderby || "date"; // Default sorted by date latest

  // Build WooCommerce query filter matching current URL search params
  let order: "asc" | "desc" = "desc";
  let orderby: "date" | "id" | "include" | "title" | "slug" | "price" | "popularity" | "rating" = "date";

  if (currentSorting === "price") {
    orderby = "price";
    order = "asc";
  } else if (currentSorting === "price-desc") {
    orderby = "price";
    order = "desc";
  } else if (currentSorting === "title") {
    orderby = "title";
    order = "asc";
  }

  // Retrieve products and categories on the server side concurrently
  let productsResult = { data: [] as any[], totalItems: 0, totalPages: 1, counts: null as any };
  let categories: any[] = [];
  let fetchError = "";

  try {
    const [catalogResult, categoriesData] = await Promise.all([
      getFilteredCatalog({
        category: currentCategory,
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
    console.error("[Shop Server Loading Error]:", err);
    fetchError = err.message || "Could not synchronize with the WordPress catalog database.";
  }

  const activeCategoryObject = categories.find((c) => c.id.toString() === currentCategory);

  // Helper to compile updated searchParams URL for filters & navigation
  const getFilterUrl = (overrides: Record<string, string | null>) => {
    const params = new URLSearchParams();

    // Maintain existing parameters
    if (currentCategory) params.set("category", currentCategory);
    if (currentQuery) params.set("search", currentQuery);
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (currentMinPrice) params.set("min_price", currentMinPrice);
    if (currentMaxPrice) params.set("max_price", currentMaxPrice);
    if (currentOnSaleOnly) params.set("on_sale", "true");
    if (currentSorting && currentSorting !== "date") params.set("orderby", currentSorting);

    // Apply overrides
    Object.entries(overrides).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Always reset page to 1 when filters (except page override) change
    if (!overrides.hasOwnProperty("page")) {
      params.delete("page");
    }

    const queryStr = params.toString();
    return `/shop${queryStr ? `?${queryStr}` : ""}`;
  };

  // Pre-configured price range configurations
  const priceRanges = [
    { label: "Under ₹15,000", min: "", max: "15000" },
    { label: "₹15,000 - ₹25,000", min: "15000", max: "25000" },
    { label: "Above ₹25,000", min: "25000", max: "" },
  ];

  // Check if any filter is actively selected
  const hasActiveFilters =
    !!currentCategory ||
    !!currentQuery ||
    !!currentMinPrice ||
    !!currentMaxPrice ||
    currentOnSaleOnly ||
    currentSorting !== "date";

  return (
    <div className="min-h-screen bg-[#F6F5F8] flex flex-col font-sans">
      <Header />

      {/* -------------------- SHOP HERO BLOCK -------------------- */}
      <section className="bg-slate-900 text-white py-12 px-6 lg:px-12 relative overflow-hidden" id="shop-hero">
        {/* Abstract background vector accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#faba5b]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="max-w-2xl">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#faba5b] bg-[#faba5b]/10 px-3.5 py-1.5 rounded-full border border-[#faba5b]/20 inline-block mb-4">
              Premium IT Sourcing & Slashes
            </span>
            <h1 className="text-3xl md:text-5xl font-medium tracking-tight leading-none mb-3">
              {activeCategoryObject ? activeCategoryObject.name : "Premium Refurbished Computer Store"}
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-xl">
              {activeCategoryObject?.description
                ? activeCategoryObject.description
                : "Explore our commercial catalog of top-tier refurbished and new corporate hardware options in India. Subjected to extensive multithreaded diagnostics with 1-year coverage warranty."
              }
            </p>

            {/* Category Quick Links for SEO Crawlability */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              <span className="text-xs text-slate-400 font-medium self-center mr-1">Popular Categories:</span>
              {[
                { label: "Refurbished Laptops", path: "/categories/buy-refurbished-laptops-online-in-india" },
                { label: "Refurbished Desktops", path: "/categories/buy-high-quality-refurbished-desktops" },
                { label: "Refurbished Workstations", path: "/categories/buy-refurbished-workstations-online-in-india" },
                { label: "Refurbished Mini PCs", path: "/categories/buy-refurbished-mini-pcs-online-in-india" }
              ].map((cat) => (
                <Link
                  key={cat.path}
                  href={cat.path}
                  className="text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-750 hover:border-slate-500 hover:text-white px-3.5 py-1.5 rounded-full transition-all"
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

        {/* Catalog Main Frame */}
        {fetchError ? (
          <div className="bg-rose-50 border border-rose-100 text-rose-800 p-8 rounded-3xl text-center shadow-sm">
            <p className="text-3xl">⚠️</p>
            <h3 className="text-lg font-black text-rose-950 mt-2">Active WordPress Handshake offline</h3>
            <p className="text-xs text-rose-600 max-w-lg mx-auto mt-2 leading-relaxed">
              WooCommerce service is unconfigured or WordPress rejected the credentials: <code className="bg-rose-100/60 px-1 py-0.5 rounded text-rose-900">{fetchError}</code>
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/products/test" className="bg-rose-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-rose-800 transition">
                Run Keys Diagnostic Checker
              </Link>
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
              category: currentCategory,
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
      <Footer />

    </div>
  );
}
