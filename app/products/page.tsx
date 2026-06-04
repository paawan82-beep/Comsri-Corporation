import Link from "next/link";
import Image from "next/image";
import { woocommerce } from "@/lib/services/woocommerce";

interface CatalogPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

export const revalidate = 3600; // Cache index static for up to 1hr (ISR protected by webhook purges)

export default async function ProductsCatalogPage({ searchParams }: CatalogPageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || "";
  const currentQuery = resolvedParams.search || "";
  const currentPage = parseInt(resolvedParams.page || "1", 10);

  // Fetch products and categories concurrently on the server
  let productsData;
  let categories: any[] = [];

  try {
    const [productsResult, categoriesResult] = await Promise.all([
      woocommerce.getProducts({
        category: currentCategory,
        search: currentQuery,
        page: currentPage,
        per_page: 12,
        status: "publish",
      }),
      woocommerce.getCategories(),
    ]);

    productsData = productsResult;
    categories = (categoriesResult || []).filter(
      (cat: any) =>
        cat.name.toLowerCase() !== "new products" &&
        cat.name.toLowerCase() !== "refurbished products"
    );
  } catch (error) {
    console.error("[Catalog Loading Error]:", error);
    // Graceful fallback lists
    productsData = { data: [], totalItems: 0, totalPages: 1 };
  }

  const activeCategoryObject = categories.find((c) => c.id.toString() === currentCategory);

  return (
    <main className="min-h-screen bg-[#F5F6F8] py-12 px-4 md:px-8 max-w-[1600px] mx-auto font-sans">

      {/* Header and Intro banner */}
      <div className="mb-10 text-center md:text-left" id="catalog-header">
        <h1 className="text-4xl font-medium text-slate-900 tracking-tight mb-2">
          {activeCategoryObject ? activeCategoryObject.name : "Explore Our Catalog"}
        </h1>
        <p className="text-slate-500 max-w-xl text-sm leading-relaxed">
          {activeCategoryObject?.description
            ? activeCategoryObject.description
            : "Browse our high-performance headless products synchronized directly with secure payment gateways."
          }
        </p>
      </div>

      {/* Visual Helper Diagnostic Banner */}
      <div className="mb-8 p-5 bg-indigo-50 border border-indigo-100/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4" id="diagnostic-onboarding-banner">
        <div className="flex items-start gap-3.5">
          <span className="text-2xl mt-0.5 shrink-0">🔌</span>
          <div>
            <h4 className="text-sm font-extrabold text-slate-950">Integration Testing Panel</h4>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Verify if secure server-side fetching from your WordPress REST API is established. Authenticate keys, measure response latency, and download sample catalogs.
            </p>
          </div>
        </div>
        <Link
          href="/products/test"
          className="bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs px-5 py-3 rounded-xl transition active:scale-[0.98] text-center shrink-0"
        >
          Check API Connection Status →
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8" id="catalog-layout">

        {/* Left sidebar categories filtering */}
        <aside className="w-full lg:w-64 shrink-0 bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_25px_rgba(47,48,74,0.02)] h-fit" id="catalog-sidebar">
          <h2 className="text-sm font-medium uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100">
            Departments
          </h2>

          <div className="flex flex-col gap-1.5 font-semibold text-sm">
            <Link
              href="/products"
              className={`px-3 py-2 rounded-xl transition ${!currentCategory ? "bg-indigo-600 text-white" : "text-slate-650 hover:bg-slate-50"
                }`}
            >
              All Departments ({categories.reduce((acc, cat) => acc + (cat.count || 0), 0)})
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className={`px-3 py-2 rounded-xl transition flex justify-between items-center ${currentCategory === cat.id.toString() ? "bg-indigo-600 text-white" : "text-slate-650 hover:bg-slate-50"
                  }`}
              >
                <span className="truncate">{cat.name}</span>
                <span className={`text-xs ml-2 font-mono px-1.5 py-0.5 rounded-md ${currentCategory === cat.id.toString() ? "bg-indigo-550 text-indigo-100" : "bg-slate-100 text-slate-500"
                  }`}>
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Right product viewing dynamic grid */}
        <div className="flex-1">

          {/* Dynamic Search block */}
          <form className="mb-6 flex gap-2 w-full max-w-md" action="/products" method="GET">
            {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
            <input
              type="text"
              name="search"
              defaultValue={currentQuery}
              placeholder="Search products..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 font-medium"
            />
            <button
              type="submit"
              className="bg-slate-950 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-900 transition active:scale-[0.98]"
            >
              Search
            </button>
          </form>

          {productsData.data.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(40,40,40,0.01)]">
              <span className="text-3xl">📦</span>
              <h3 className="text-lg font-bold text-slate-805 mt-3">No products discovered</h3>
              <p className="text-slate-400 text-xs mt-1">Try resetting your search query or selecting a different department.</p>
              <Link href="/products" className="inline-block mt-4 text-xs font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-xl hover:bg-indigo-100 transition">
                Reset filters
              </Link>
            </div>
          ) : (
            <>
              {/* Grid of clean product cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" id="product-catalog-grid">
                {productsData.data.map((product) => {
                  const hasImage = product.images && product.images.length > 0;
                  const thumbUrl = hasImage
                    ? product.images[0].src
                    : "https://picsum.photos/seed/placeholder/350/250";

                  return (
                    <article
                      key={product.id}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-150 hover:shadow-[0_12px_32px_rgba(47,48,74,0.04)] hover:border-slate-250 transition-all duration-300 flex flex-col justify-between group"
                    >
                      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/3] bg-slate-50 overflow-hidden">
                        <Image
                          src={thumbUrl}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                          sizes="(max-width: 768px) 100vw, 350px"
                          referrerPolicy="no-referrer"
                        />
                        {product.on_sale && (
                          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
                            Sale
                          </span>
                        )}
                      </Link>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                            {product.categories?.[0]?.name || "Catalog product"}
                          </div>

                          <Link href={`/products/${product.slug}`}>
                            <h3 className="text-base font-extrabold text-slate-500 group-hover:text-indigo-600 transition leading-tight line-clamp-1 mb-2 cursor-pointer">
                              {product.name}
                            </h3>
                          </Link>

                          <div className="flex gap-2.5 items-baseline">
                            {product.on_sale && product.regular_price ? (
                              <>
                                <span className="text-lg font-black text-slate-500 price-font">₹{product.sale_price}</span>
                                <span className="text-xs text-slate-400 line-through price-font">₹{product.regular_price}</span>
                              </>
                            ) : (
                              <span className="text-lg font-black text-slate-500 price-font">
                                ₹{product.price || "Check Price"}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${product.stock_status === "instock" ? "text-emerald-600" : "text-rose-500"
                            }`}>
                            {product.stock_status === "instock" ? "● In Stock" : "● Out of Stock"}
                          </span>

                          <Link
                            href={`/products/${product.slug}`}
                            className="bg-slate-50 border border-slate-100 group-hover:bg-indigo-55 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg transition"
                          >
                            Details →
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination controls */}
              {productsData.totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2" id="catalog-pagination">
                  {currentPage > 1 && (
                    <Link
                      href={`/products?page=${currentPage - 1}${currentCategory ? `&category=${currentCategory}` : ""}${currentQuery ? `&search=${currentQuery}` : ""}`}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-250 text-sm font-bold hover:bg-slate-50 transition"
                    >
                      Previous
                    </Link>
                  )}

                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                    Page {currentPage} of {productsData.totalPages}
                  </span>

                  {currentPage < productsData.totalPages && (
                    <Link
                      href={`/products?page=${currentPage + 1}${currentCategory ? `&category=${currentCategory}` : ""}${currentQuery ? `&search=${currentQuery}` : ""}`}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-250 text-sm font-bold hover:bg-slate-50 transition"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </main>
  );
}
