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
  X, 
  SlidersHorizontal, 
  Percent, 
  Check, 
  ArrowUpDown, 
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
import { woocommerce } from "@/lib/services/woocommerce";
import HeaderActions from "./HeaderActions";
import SidebarFilters from "./SidebarFilters";
import ProductCard from "./ProductCard";

export const dynamic = "force-dynamic"; // Ensure runtime dynamic evaluation for URL search/filter updates

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
  let productsResult = { data: [] as any[], totalItems: 0, totalPages: 1 };
  let categories: any[] = [];
  let fetchError = "";

  try {
    const [productsData, categoriesData] = await Promise.all([
      woocommerce.getProducts({
        category: currentCategory,
        search: currentQuery,
        page: currentPage,
        per_page: 9, // Optimal 3-col grid layout size
        orderby,
        order,
        min_price: currentMinPrice || undefined,
        max_price: currentMaxPrice || undefined,
        on_sale: currentOnSaleOnly ? true : undefined,
        status: "publish",
      }),
      woocommerce.getCategories(),
    ]);

    productsResult = productsData;
    categories = categoriesData || [];
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
      
      {/* -------------------- BRAND HEADER -------------------- */}
      <header className="bg-white py-4 border-b border-gray-100" id="shop-header">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between w-full">
          
          {/* Logo element */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-1 cursor-pointer">
            <div className="flex flex-col">
              <div className="flex items-center">
                <div className="relative w-8 h-8 mr-1 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-[#4caf50]">
                    <path d="M 50 10 C 70 10 90 20 90 40 C 90 60 70 80 50 80 C 30 80 10 60 10 40 C 10 20 30 10 50 10 Z" opacity="0.3"></path>
                    <path d="M 50 20 C 65 20 80 30 80 40 C 80 50 65 60 50 60" stroke="#1f44a3" strokeWidth="8" fill="none"></path>
                  </svg>
                </div>
                <span className="text-3xl font-bold tracking-tight text-[#1b4332]">COMSRI</span>
              </div>
              <span className="text-[10px] uppercase font-semibold text-gray-700 tracking-wider text-center pr-2">Corporation</span>
            </div>
          </Link>

          {/* Search bar inside header */}
          <div className="flex-1 max-w-2xl mx-12">
            <form className="relative" action="/shop" method="GET">
              {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
              {currentMinPrice && <input type="hidden" name="min_price" value={currentMinPrice} />}
              {currentMaxPrice && <input type="hidden" name="max_price" value={currentMaxPrice} />}
              {currentOnSaleOnly && <input type="hidden" name="on_sale" value="true" />}
              {currentSorting !== "date" && <input type="hidden" name="orderby" value={currentSorting} />}
              
              <input
                type="text"
                name="search"
                defaultValue={currentQuery}
                placeholder="Search for products"
                className="w-full h-[46px] pl-6 pr-14 text-sm text-gray-700 border border-gray-200 rounded-full focus:outline-none focus:border-gray-300"
              />
              <button 
                type="submit" 
                className="absolute right-1 top-1 bottom-1 w-[38px] bg-[#374bf9] rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
              >
                <Search size={18} />
              </button>
            </form>
          </div>

          <HeaderActions />
        </div>
      </header>

      {/* -------------------- NAVIGATION BAR -------------------- */}
      <nav className="bg-[#faba5b] py-3 text-[14px] font-medium text-black">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between w-full">
          <ul className="flex flex-wrap items-center gap-y-2 gap-x-6">
            <li><Link href="/" className="hover:text-gray-705 text-gray-800 hover:text-gray-700 transition">Home</Link></li>
            <li><Link href="/about" className="hover:text-gray-705 text-gray-800 hover:text-gray-700 transition">About Us</Link></li>
            <li className="relative group flex items-center gap-1 cursor-pointer hover:text-[#374bf9] transition-all py-2 text-[#374bf9]">
              <Link href="/shop" className="flex items-center gap-1 font-bold">
                <span>Refurbished Products</span>
                <ChevronDown size={14} className="text-[#374bf9] transition-transform duration-200 group-hover:rotate-180" />
              </Link>
              <div className="absolute top-[85%] left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 py-3 hidden group-hover:flex flex-col text-sm text-gray-800 z-50 font-normal">
                <Link href="/shop" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-bold transition-colors">
                  Explore Refurbished Shop
                </Link>
                <Link href="/shop?orderby=date" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-medium transition-colors">
                  Latest Arrivals
                </Link>
                <Link href="/shop?on_sale=true" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-medium text-amber-600 transition-colors flex items-center justify-between">
                  <span>Special Hot Deals</span>
                  <span className="text-[10px] bg-amber-50 text-amber-800 font-extrabold px-2 py-0.5 rounded-full">Sale</span>
                </Link>
              </div>
            </li>
            <li className="relative group flex items-center gap-1 cursor-pointer hover:text-[#374bf9] transition-all py-2">
              <Link href="/shop" className="flex items-center gap-1">
                <span>New Products</span>
                <ChevronDown size={14} className="text-gray-500 transition-transform duration-200 group-hover:rotate-180 group-hover:text-[#374bf9]" />
              </Link>
              <div className="absolute top-[85%] left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 py-3 hidden group-hover:flex flex-col text-sm text-gray-800 z-50 font-normal">
                <Link href="/shop" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-bold transition-colors">
                  Explore New Shop
                </Link>
                <Link href="/shop" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-medium transition-colors">
                  Brand New Hardware
                </Link>
              </div>
            </li>
            <li><Link href="/bulk-orders" className="hover:text-gray-705 text-gray-800 hover:text-gray-700 transition">Bulk Orders</Link></li>
            <li><Link href="/blog" className="hover:text-gray-705 text-gray-800 hover:text-gray-700 transition">Blog</Link></li>
            <li><Link href="#" className="hover:text-gray-705 text-gray-800 hover:text-gray-700 transition">Contact Us</Link></li>
            <li className="relative group flex items-center gap-1 cursor-pointer hover:text-[#374bf9] transition-all py-2">
              <span>Policies</span>
              <ChevronDown size={14} className="text-gray-500 transition-transform duration-200 group-hover:rotate-180 group-hover:text-[#374bf9]" />
              
              {/* Elegant Dropdown */}
              <div className="absolute top-[85%] left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 py-3 hidden group-hover:flex flex-col text-sm text-gray-800 z-50 font-normal">
                <Link href="/terms-conditions?tab=terms" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-bold transition-colors flex items-center justify-between">
                  <span>Terms & Conditions</span>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full font-normal">v3.5</span>
                </Link>
                <Link href="/privacy-policy?tab=privacy" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-bold transition-colors flex items-center justify-between">
                  <span>Privacy Policy</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full font-normal">Secure</span>
                </Link>
                <Link href="/return-refund?tab=refund" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-bold transition-colors flex items-center justify-between">
                  <span>Return & Refund Policy</span>
                  <span className="text-[10px] bg-rose-50 text-rose-700 font-extrabold px-2 py-0.5 rounded-full font-normal">100%</span>
                </Link>
                <Link href="/privacy-policy?tab=warranty" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-bold transition-colors flex items-center justify-between">
                  <span>Warranty Policy</span>
                  <span className="text-[10px] bg-amber-50 text-amber-700 font-extrabold px-2 py-0.5 rounded-full font-normal">1 Year</span>
                </Link>
                <Link href="/privacy-policy?tab=shipping" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-bold transition-colors flex items-center justify-between">
                  <span>Shipping Policy</span>
                  <span className="text-[10px] bg-cyan-50 text-cyan-700 font-extrabold px-2 py-0.5 rounded-full font-normal">Insured</span>
                </Link>
              </div>
            </li>
            <li><Link href="#" className="hover:text-gray-705 text-gray-800 hover:text-gray-700 transition">FAQs</Link></li>
          </ul>

          <div className="flex items-center gap-x-5 pl-5 border-l border-black/10">
            <button className="flex items-center gap-1.5 hover:text-gray-707 text-gray-800 hover:text-gray-700">
              <Shuffle size={18} />
              <span className="font-semibold">0</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-gray-707 text-gray-800 hover:text-gray-700">
              <Heart size={18} />
              <span className="font-semibold">0</span>
            </button>
            
            <button className="bg-[#374bf9] text-white rounded-full flex items-center px-4 py-2 gap-x-2 relative hover:bg-blue-700 transition-[#374bf9] transition-colors ml-2 shadow-sm font-bold">
              <ShoppingCart size={18} />
              <span className="tracking-wide">₹0.00</span>
              <span className="absolute -top-1.5 -right-1.5 bg-white text-[#374bf9] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-gray-200">
                0
              </span>
            </button>
          </div>
        </div>
      </nav>

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
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none mb-3">
              {activeCategoryObject ? activeCategoryObject.name : "Secure Headless Store"}
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-xl">
              {activeCategoryObject?.description 
                ? activeCategoryObject.description 
                : "Explore our commercial catalog of top-tier refurbished and new corporate hardware options in India. Subjected to extensive multithreaded diagnostics with 1-year coverage warranty."
              }
            </p>
          </div>
        </div>
      </section>

      {/* -------------------- DYNAMIC SEARCH HELPER / DIAGNOSTICS LINK -------------------- */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mt-8 w-full">
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-3">
            <span className="text-xl">🛠️</span>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-none">Diagnostic API Testing Panel</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Want to verify if the server-side WooCommerce handshake works? Inspect keys configuration in one run.</p>
            </div>
          </div>
          <Link 
            href="/products/test" 
            className="text-xs font-bold text-indigo-700 bg-white border border-indigo-200/60 px-4 py-2 rounded-xl hover:bg-indigo-100/50 transition cursor-pointer self-stretch text-center sm:self-auto shrink-0"
          >
            Run Integrity Handshake
          </Link>
        </div>
      </div>

      {/* -------------------- CORE SHOP SECTION -------------------- */}
      <main className="flex-1 max-w-[1600px] mx-auto px-6 lg:px-12 py-10 w-full">
        
        {/* Controls Bar for Mobile & Desktops */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Active Filter Chips bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 self-start md:self-auto">
            <span className="text-slate-400 flex items-center gap-1">
              <SlidersHorizontal size={13} />
              Active Filters:
            </span>
            
            {hasActiveFilters ? (
              <>
                {/* Reset Buttons */}
                <Link 
                  href="/shop" 
                  className="bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1 rounded-lg hover:bg-rose-100 transition flex items-center gap-1 font-bold text-[11px]"
                >
                  Clear All Filters <X size={12} />
                </Link>

                {currentCategory && (
                  <Link 
                    href={getFilterUrl({ category: null })}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                  >
                    Category: {activeCategoryObject?.name || currentCategory} <X size={12} />
                  </Link>
                )}

                {currentQuery && (
                  <Link 
                    href={getFilterUrl({ search: null })}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                  >
                    Query: &quot;{currentQuery}&quot; <X size={12} />
                  </Link>
                )}

                {(currentMinPrice || currentMaxPrice) && (
                  <Link 
                    href={getFilterUrl({ min_price: null, max_price: null })}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                  >
                    Price Range <X size={12} />
                  </Link>
                )}

                {currentOnSaleOnly && (
                  <Link 
                    href={getFilterUrl({ on_sale: null })}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                  >
                    On Sale Only <X size={12} />
                  </Link>
                )}

                {currentSorting !== "date" && (
                  <Link 
                    href={getFilterUrl({ orderby: null })}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                  >
                    Sorting override <X size={12} />
                  </Link>
                )}
              </>
            ) : (
              <span className="text-slate-400 font-mono text-[11px]">None (Showing complete catalog)</span>
            )}
          </div>

          {/* Quick Sort Options */}
          <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0 font-medium">
            <span className="text-xs text-slate-400 font-bold tracking-tight uppercase flex items-center gap-1 shrink-0">
              <ArrowUpDown size={13} />
              Sort By:
            </span>
            <div className="flex bg-slate-50 border border-slate-150 p-1 rounded-xl text-xs flex-1 md:flex-initial">
              {[
                { label: "Newest", value: "date" },
                { label: "Price: Low to High", value: "price" },
                { label: "Price: High to Low", value: "price-desc" },
              ].map((sortItem) => {
                const isActive = currentSorting === sortItem.value;
                return (
                  <Link
                    key={sortItem.value}
                    href={getFilterUrl({ orderby: sortItem.value })}
                    className={`px-3 py-1.5 rounded-lg font-bold transition text-center flex-1 md:flex-initial ${
                      isActive 
                        ? "bg-indigo-600 text-white shadow-sm" 
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {sortItem.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Catalog Main Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* ==================== LEFT FILTER SIDEBAR ==================== */}
          <aside className="w-full lg:col-span-1 space-y-6 flex flex-col h-fit" id="shop-sidebar">
            <SidebarFilters
              categories={categories}
              currentCategory={currentCategory}
              currentMinPrice={currentMinPrice}
              currentMaxPrice={currentMaxPrice}
              currentOnSaleOnly={currentOnSaleOnly}
              currentQuery={currentQuery}
              currentSorting={currentSorting}
            />
          </aside>

          {/* ==================== RIGHT PRODUCT VIEWPORT ==================== */}
          <div className="lg:col-span-3">
            
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
            ) : productsResult.data.length === 0 ? (
              
              /* Zero search elements */
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.01)]">
                <span className="text-4xl">📦</span>
                <h3 className="text-lg font-black text-slate-900 mt-3">No matching products discovered</h3>
                <p className="text-slate-400 text-xs mt-1.5 max-w-sm mx-auto leading-relaxed">
                  We couldn&apos;t locate any products matching your specific combinations. Try reducing search keywords or easing pricing limits.
                </p>
                <div className="mt-5 flex justify-center gap-2">
                  <Link 
                    href="/shop" 
                    className="bg-slate-950 hover:bg-indigo-650 inline-block font-bold text-xs text-white px-5 py-3 rounded-xl transition shadow"
                  >
                    Reset All Filters
                  </Link>
                  {currentCategory && (
                    <Link 
                      href={getFilterUrl({ category: null })}
                      className="bg-slate-50 border border-slate-200 inline-block font-bold text-xs text-slate-700 px-5 py-3 rounded-xl hover:bg-slate-100 transition"
                    >
                      Browse Other Categories
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Information Header count */}
                <div className="flex items-center justify-between mb-6 text-slate-500 text-xs font-semibold">
                  <span>
                    Showing <strong className="text-slate-900">{productsResult.data.length}</strong> items of <strong className="text-slate-900">{productsResult.totalItems}</strong> discovered products
                  </span>
                  <span className="hidden sm:inline-block font-mono tracking-wider">
                    Catalog: Page {currentPage} / {productsResult.totalPages}
                  </span>
                </div>

                {/* Main 3x3 Products Matrix Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="shop-catalog-grid">
                  {productsResult.data.map((product, index) => (
                    <ProductCard
                      product={product}
                      index={index}
                      key={product.id}
                    />
                  ))}
                </div>

                {/* ==================== CORE PAGINATION CONTROLS ==================== */}
                {productsResult.totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-1.5" id="shop-pagination-panel">
                    
                    {/* Previous step control */}
                    {currentPage > 1 ? (
                      <Link
                        href={getFilterUrl({ page: (currentPage - 1).toString() })}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition flex items-center gap-1"
                      >
                        <ChevronLeft size={16} />
                      </Link>
                    ) : (
                      <span className="p-2.5 rounded-xl bg-slate-100 border border-slate-100 text-slate-350 select-none pointer-events-none">
                        <ChevronLeft size={16} />
                      </span>
                    )}

                    {/* Numerical direct steps */}
                    {Array.from({ length: productsResult.totalPages }, (_, i) => i + 1).map((pageIdx) => {
                      const isCurrent = currentPage === pageIdx;
                      return (
                        <Link
                          key={pageIdx}
                          href={getFilterUrl({ page: pageIdx.toString() })}
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-xs transition ${
                            isCurrent 
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          {pageIdx}
                        </Link>
                      );
                    })}

                    {/* Next step control */}
                    {currentPage < productsResult.totalPages ? (
                      <Link
                        href={getFilterUrl({ page: (currentPage + 1).toString() })}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition flex items-center gap-1"
                      >
                        <ChevronRight size={16} />
                      </Link>
                    ) : (
                      <span className="p-2.5 rounded-xl bg-slate-100 border border-slate-100 text-slate-350 select-none pointer-events-none">
                        <ChevronRight size={16} />
                      </span>
                    )}

                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-[#fcb643] pt-16 pb-12 w-full relative">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col gap-12">
          
          {/* Top Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 justify-between">
            {/* Address */}
            <div className="flex flex-col pr-4">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Address</h3>
              <p className="text-[14px] font-semibold text-[#2d2d2d] leading-relaxed mb-6">
                Office No.-T-15 Pinnacle Business Park MC Rd Shanti Nagar Andheri East Mumbai Maharastra – 400093
              </p>
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Contact Us</h3>
              <p className="text-[14px] font-semibold text-[#2d2d2d] mb-1.5">+91 8601-899-899</p>
              <p className="text-[14px] font-semibold text-[#2d2d2d]">Email: info@comsri.com</p>
            </div>

            {/* Refurbished Products */}
            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Refurbished Products</h3>
              <div className="flex flex-col gap-3">
                {["Refurbished Desktops", "Refurbished Laptops", "Refurbished Workstations", "Refurbished Macbooks", "Refurbished Mini PCs"].map((item, i) => (
                  <a key={i} href="#" className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item}</a>
                ))}
              </div>
            </div>

            {/* New Products */}
            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">New Products</h3>
              <div className="flex flex-col gap-3">
                {["New Laptops", "New Desktops", "New Macbooks", "New All in One", "New Mini PCs"].map((item, i) => (
                  <a key={i} href="#" className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item}</a>
                ))}
              </div>
            </div>

            {/* Useful Links */}
            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Useful Links</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Contact Us", path: "/about" },
                  { label: "Terms & Conditions", path: "/terms-conditions?tab=terms" },
                  { label: "Privacy Policy", path: "/privacy-policy?tab=privacy" },
                  { label: "Return & Refund Policy", path: "/return-refund?tab=refund" },
                  { label: "Warranty Policy", path: "/privacy-policy?tab=warranty" },
                  { label: "Shipping Policy", path: "/privacy-policy?tab=shipping" }
                ].map((item, i) => (
                  <a key={i} href={item.path} className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item.label}</a>
                ))}
              </div>
            </div>

            {/* Available On & Social Links */}
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

          {/* Newsletter Banner */}
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

          {/* Copyright & Payments */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-1 gap-4 w-full">
            <p className="text-[14px] font-bold text-[#111]">Copyright 2026 by Comsri Corporation All Right Reserved.</p>
            <div className="flex gap-1.5">
              <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img   src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-full object-contain" alt="Mastercard" />
              </div>
              <div className="bg-[#1a1f71] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img   src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-[75%] object-contain mt-[1px]" alt="Visa" />
              </div>
              <div className="bg-[#003087] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img   src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png" className="h-[12px] object-contain" alt="PayPal" />
              </div>
              <div className="bg-[#2d9cdb] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img   src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" className="h-[80%] object-contain" alt="Amex" />
              </div>
              <div className="bg-[#6772e5] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img   src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png" className="h-[14px] object-contain invert hue-rotate-[180deg] brightness-200" alt="Stripe" />
              </div>
              <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center px-1">
                <span className="text-white text-[10px]">G</span><span className="text-white text-[12px] font-bold">Pay</span>
              </div>
              <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center px-1 border border-gray-700">
                <Apple size={14} className="fill-white text-white mr-0.5" /><span className="text-white text-[10px] font-semibold mt-[1px]">Pay</span>
              </div>
              <div className="bg-[#004b87] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img   src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/UnionPay_logo.svg/1280px-UnionPay_logo.svg.png" className="h-[80%] object-contain" alt="UnionPay" />
              </div>
            </div>
          </div>

        </div>

        {/* Floating Chat Icon placeholder */}
        <div className="absolute right-6 bottom-6 w-14 h-14 bg-[#3452ef] rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform z-50">
          <MessageCircle size={28} className="text-white fill-white" />
        </div>
      </footer>

    </div>
  );
}
