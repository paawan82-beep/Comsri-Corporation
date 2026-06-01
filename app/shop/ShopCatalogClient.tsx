"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  X,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import SidebarFilters from "./SidebarFilters";
import ProductCard from "./ProductCard";

interface ShopCatalogClientProps {
  initialProducts: any[];
  initialTotalItems: number;
  initialTotalPages: number;
  initialCounts: any;
  categories: any[];
  initialParams: {
    category: string;
    search: string;
    page: number;
    min_price: string;
    max_price: string;
    on_sale: boolean;
    orderby: string;
  };
}

const SkeletonCard = () => (
  <div className="bg-white rounded-[20px] overflow-hidden border border-slate-100 animate-pulse flex flex-col justify-between h-[390px] shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
    <div className="aspect-[4/3] bg-slate-100 w-full" />
    <div className="p-5 flex-1 flex flex-col justify-between">
      <div>
        <div className="h-3 bg-slate-100 rounded w-1/3 mb-3" />
        <div className="h-5 bg-slate-100 rounded w-3/4 mb-4" />
        <div className="h-6 bg-slate-100 rounded w-1/4" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-3 bg-slate-100 rounded w-1/4" />
        <div className="h-8 bg-slate-100 rounded w-1/4" />
      </div>
    </div>
  </div>
);

export default function ShopCatalogClient({
  initialProducts,
  initialTotalItems,
  initialTotalPages,
  initialCounts,
  categories,
  initialParams
}: ShopCatalogClientProps) {
  // Client States
  const [products, setProducts] = useState(initialProducts);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [counts, setCounts] = useState(initialCounts);
  const [loading, setLoading] = useState(false);

  // Filter States
  const [category, setCategory] = useState(initialParams.category);
  const [search, setSearch] = useState(initialParams.search);
  const [page, setPage] = useState(initialParams.page);
  const [minPrice, setMinPrice] = useState(initialParams.min_price);
  const [maxPrice, setMaxPrice] = useState(initialParams.max_price);
  const [onSale, setOnSale] = useState(initialParams.on_sale);
  const [orderby, setOrderby] = useState(initialParams.orderby);

  // Synchronize initial prop changes (e.g. when search in header reload happens)
  useEffect(() => {
    setProducts(initialProducts);
    setTotalItems(initialTotalItems);
    setTotalPages(initialTotalPages);
    setCounts(initialCounts);
    setCategory(initialParams.category);
    setSearch(initialParams.search);
    setPage(initialParams.page);
    setMinPrice(initialParams.min_price);
    setMaxPrice(initialParams.max_price);
    setOnSale(initialParams.on_sale);
    setOrderby(initialParams.orderby);
  }, [initialProducts, initialTotalItems, initialTotalPages, initialCounts, initialParams]);

  // Fetch updated catalog client-side via API endpoint
  const fetchUpdatedCatalog = async (updates: Record<string, any>) => {
    setLoading(true);

    // Compute target params merging current state with updates
    const nextCategory = updates.hasOwnProperty("category") ? updates.category : category;
    const nextSearch = updates.hasOwnProperty("search") ? updates.search : search;
    const nextMinPrice = updates.hasOwnProperty("min_price") ? updates.min_price : minPrice;
    const nextMaxPrice = updates.hasOwnProperty("max_price") ? updates.max_price : maxPrice;
    const nextOnSale = updates.hasOwnProperty("on_sale") ? updates.on_sale : onSale;
    const nextOrderby = updates.hasOwnProperty("orderby") ? updates.orderby : orderby;

    // Always default to page 1 on filter changes unless page is explicitly overridden
    const nextPage = updates.hasOwnProperty("page") ? updates.page : 1;

    // Update state variables
    setCategory(nextCategory || "");
    setSearch(nextSearch || "");
    setMinPrice(nextMinPrice || "");
    setMaxPrice(nextMaxPrice || "");
    setOnSale(!!nextOnSale);
    setOrderby(nextOrderby || "date");
    setPage(nextPage);

    try {
      const params = new URLSearchParams();
      if (nextCategory) params.set("category", nextCategory);
      if (nextSearch) params.set("search", nextSearch);
      if (nextMinPrice) params.set("min_price", nextMinPrice);
      if (nextMaxPrice) params.set("max_price", nextMaxPrice);
      if (nextOnSale) params.set("on_sale", "true");
      if (nextOrderby && nextOrderby !== "date") params.set("orderby", nextOrderby);
      params.set("page", nextPage.toString());
      params.set("per_page", "12"); // 12 items per page as requested

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();

      setProducts(data.data || []);
      setTotalItems(data.totalItems || 0);
      setTotalPages(data.totalPages || 1);
      setCounts(data.counts || null);

      // Update browser URL query string without reloading page
      const urlParams = new URLSearchParams(params);
      urlParams.delete("per_page");
      const queryStr = urlParams.toString();
      const nextUrl = `/shop${queryStr ? `?${queryStr}` : ""}`;
      window.history.pushState(null, "", nextUrl);
    } catch (err) {
      console.error("[AJAX Catalog Fetch Error]:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (overrides: Record<string, string | null>) => {
    const updates: Record<string, any> = {};
    Object.entries(overrides).forEach(([key, val]) => {
      if (key === "on_sale") {
        updates.on_sale = val === "true";
      } else {
        updates[key] = val;
      }
    });
    fetchUpdatedCatalog(updates);
  };

  const handlePageChange = (targetPage: number) => {
    fetchUpdatedCatalog({ page: targetPage });
  };

  const activeCategoryObject = categories.find((c) => c.id.toString() === category);
  const hasActiveFilters = !!category || !!search || !!minPrice || !!maxPrice || onSale || orderby !== "date";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

      {/* ==================== LEFT FILTER SIDEBAR ==================== */}
      <aside className="w-full lg:col-span-1 space-y-6 flex flex-col h-fit" id="shop-sidebar">
        <SidebarFilters
          categories={categories}
          currentCategory={category}
          currentMinPrice={minPrice}
          currentMaxPrice={maxPrice}
          currentOnSaleOnly={onSale}
          currentQuery={search}
          currentSorting={orderby}
          onFilterChange={handleFilterChange}
          counts={counts}
        />
      </aside>

      {/* ==================== RIGHT PRODUCT VIEWPORT ==================== */}
      <div className="lg:col-span-3 flex flex-col h-full">

        {/* Controls Bar for Active Filters & Quick Sort */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Active Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 self-start md:self-auto">
            <span className="text-slate-400 flex items-center gap-1">
              <SlidersHorizontal size={13} />
              Active Filters:
            </span>

            {hasActiveFilters ? (
              <>
                <button
                  onClick={() => handleFilterChange({ category: null, search: null, min_price: null, max_price: null, on_sale: null, orderby: null })}
                  className="bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1 rounded-lg hover:bg-rose-100 transition flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                >
                  Clear All Filters <X size={12} />
                </button>

                {category && (
                  <button
                    onClick={() => handleFilterChange({ category: null })}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer"
                  >
                    Category: {activeCategoryObject?.name || category} <X size={12} />
                  </button>
                )}

                {search && (
                  <button
                    onClick={() => handleFilterChange({ search: null })}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer"
                  >
                    Query: &quot;{search}&quot; <X size={12} />
                  </button>
                )}

                {(minPrice || maxPrice) && (
                  <button
                    onClick={() => handleFilterChange({ min_price: null, max_price: null })}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer"
                  >
                    Price Range <X size={12} />
                  </button>
                )}

                {onSale && (
                  <button
                    onClick={() => handleFilterChange({ on_sale: null })}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer"
                  >
                    On Sale Only <X size={12} />
                  </button>
                )}

                {orderby !== "date" && (
                  <button
                    onClick={() => handleFilterChange({ orderby: null })}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer"
                  >
                    Sorting override <X size={12} />
                  </button>
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
                const isActive = orderby === sortItem.value;
                return (
                  <button
                    key={sortItem.value}
                    onClick={() => handleFilterChange({ orderby: sortItem.value })}
                    className={`px-3 py-1.5 rounded-lg font-bold transition text-center flex-1 md:flex-initial cursor-pointer ${isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-650 hover:text-slate-900"
                      }`}
                  >
                    {sortItem.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic products results grid or skeleton loaders */}
        <div className="flex-1 flex flex-col justify-between">
          {loading ? (
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6 text-slate-500 text-xs font-semibold">
                <span className="animate-pulse bg-slate-100 h-4 w-40 rounded" />
                <span className="animate-pulse bg-slate-100 h-4 w-28 rounded" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.01)] flex-1 flex flex-col items-center justify-center">
              <span className="text-4xl mb-4">📦</span>
              <h3 className="text-lg font-black text-slate-900">No matching products discovered</h3>
              <p className="text-slate-400 text-xs mt-1.5 max-w-sm mx-auto leading-relaxed px-4">
                We couldn&apos;t locate any products matching your specific combinations. Try reducing search keywords or easing pricing limits.
              </p>
              <button
                onClick={() => handleFilterChange({ category: null, search: null, min_price: null, max_price: null, on_sale: null })}
                className="bg-slate-950 hover:bg-indigo-650 inline-block font-bold text-xs text-white px-5 py-3 rounded-xl transition shadow mt-6 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                {/* Result count details */}
                <div className="flex items-center justify-between mb-6 text-slate-500 text-xs font-semibold">
                  <span>
                    Showing <strong className="text-slate-900">{products.length}</strong> items of <strong className="text-slate-900">{totalItems}</strong> discovered products
                  </span>
                  <span className="hidden sm:inline-block font-mono tracking-wider">
                    Catalog: Page {page} / {totalPages}
                  </span>
                </div>

                {/* Main 4-column Products Matrix Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="shop-catalog-grid">
                  {products.map((product, index) => (
                    <ProductCard
                      product={product}
                      index={index}
                      key={product.id}
                    />
                  ))}
                </div>
              </div>

              {/* AJAX Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-1.5 pb-6" id="shop-pagination-panel">

                  {/* Previous step control */}
                  {page > 1 ? (
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                    </button>
                  ) : (
                    <span className="p-2.5 rounded-xl bg-slate-100 border border-slate-100 text-slate-350 select-none pointer-events-none">
                      <ChevronLeft size={16} />
                    </span>
                  )}

                  {/* Numerical direct steps */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageIdx) => {
                    const isCurrent = page === pageIdx;
                    return (
                      <button
                        key={pageIdx}
                        onClick={() => handlePageChange(pageIdx)}
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-xs transition cursor-pointer ${isCurrent
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                      >
                        {pageIdx}
                      </button>
                    );
                  })}

                  {/* Next step control */}
                  {page < totalPages ? (
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <span className="p-2.5 rounded-xl bg-slate-100 border border-slate-100 text-slate-350 select-none pointer-events-none">
                      <ChevronRight size={16} />
                    </span>
                  )}

                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
