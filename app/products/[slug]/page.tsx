import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { woocommerce } from "@/lib/services/woocommerce";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * 1. DYNAMIC METADATA GENERATION FOR NEXT.JS SEO ENGINE
 */
export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const product = await woocommerce.getProductBySlug(slug);

    if (!product) {
      return {
        title: "Product Not Found | Store",
        description: "The requested product could not be located.",
      };
    }

    const parentMeta = await parent;
    const metaTitle = `${product.name} | Premium Headless Store`;
    const metaDescription = product.short_description
      ? product.short_description.replace(/<[^>]*>/g, "").slice(0, 160)
      : `High-quality ${product.name} available at affordable pricing directly on our store.`;

    const productImageUrl = product.images[0]?.src || "https://picsum.photos/seed/shop/800/600";

    return {
      title: metaTitle,
      description: metaDescription,
      alternates: {
        canonical: `/products/${product.slug}`,
      },
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        url: `/products/${product.slug}`,
        type: "music.song", // general fallback or product mappings
        images: [
          {
            url: productImageUrl,
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: metaTitle,
        description: metaDescription,
        images: [productImageUrl],
      },
    };
  } catch (error) {
    return {
      title: "Store Products",
    };
  }
}

export async function generateStaticParams() {
  // Return empty list to generate products on-demand via Incremental Static Regeneration (ISR).
  // This prevents build-time rate-limiting and 500 errors from WooCommerce API.
  return [];
}

/**
 * 3. PRODUCT DETAIL INTERACTION ENGINE
 */
export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await woocommerce.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Retrieve related items dynamically on the server
  const relatedProducts = await woocommerce.getRelatedProducts(product.related_ids);

  // Generate structured Google Rich Results Product JSON-LD Schema
  const productImageUrl = product.images[0]?.src || "https://picsum.photos/seed/shop/800/600";
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images.map((img) => img.src),
    "description": product.short_description ? product.short_description.replace(/<[^>]*>/g, "") : product.name,
    "sku": product.sku || `SKU-${product.id}`,
    "mpn": product.sku || `MPN-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "Headless Shop",
    },
    "offers": {
      "@type": "Offer",
      "url": `${process.env.APP_URL || ""}/products/${product.slug}`,
      "priceCurrency": "INR", // standard for Razorpay checkout routing
      "price": product.price || "0.00",
      "priceValidUntil": "2030-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock_status === "instock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Headless WooCommerce Store",
      },
    },
  };

  const cleanDescription = product.description
    ? product.description.replace(/<p>/g, '<p class="mb-4">')
    : "No full product description is available.";

  const stripHtml = (htmlString: string) => {
    return htmlString ? htmlString.replace(/<[^>]*>/g, "") : "";
  };

  return (
    <main className="min-h-screen bg-[#F8F9FB] py-12 px-4 md:px-8 max-w-[1600px] mx-auto font-sans">
      {/* Dynamic Google Structured Search Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* Back to Shop Nav */}
      <div className="mb-8" id="product-nav-breadcrumb">
        <Link 
          href="/products" 
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1.5"
        >
          ← Back to store catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-6 md:p-10 shadow-[0_12px_45px_rgba(47,48,74,0.03)] border border-slate-100" id="product-detail-card">
        
        {/* Left Side: Optimized Headless Media Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 group">
            <Image
              src={productImageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              sizes="(max-width: 1024px) 100vw, 800px"
              priority
              referrerPolicy="no-referrer"
            />
            {product.on_sale && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Sale active
              </span>
            )}
          </div>

          {/* Thumbnails list */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((img, i) => (
                <div key={img.id || i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                  <Image
                    src={img.src}
                    alt={img.alt || product.name}
                    fill
                    className="object-cover"
                    sizes="150px"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Bio, Sku Details, and Core Action Block */}
        <div className="flex flex-col justify-between" id="product-info-panel">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                {product.categories?.[0]?.name || "Uncategorized"}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-mono text-slate-400">
                SKU: {product.sku || "N/A-SAMPLE"}
              </span>
            </div>

            <h1 className="text-[38px] font-black text-slate-900 tracking-tight leading-none mb-4" id="main-product-title">
              {product.name}
            </h1>

            {/* Price Tags */}
            <div className="flex items-baseline gap-4 mb-6">
              {product.on_sale && product.regular_price ? (
                <>
                  <span className="text-4xl font-extrabold text-slate-950">
                    ₹{product.sale_price}
                  </span>
                  <span className="text-xl text-slate-400 line-through">
                    ₹{product.regular_price}
                  </span>
                </>
              ) : (
                <span className="text-4xl font-extrabold text-slate-950">
                  ₹{product.price || "Contact for pricing"}
                </span>
              )}
            </div>

            {/* Short Description snippet */}
            {product.short_description && (
              <div 
                className="text-slate-600 border-l-4 border-indigo-500 pl-4 py-1.5 mb-8 text-sm italic leading-relaxed"
                dangerouslySetInnerHTML={{ __html: stripHtml(product.short_description) }}
              />
            )}

            {/* Stock and Status indicator */}
            <div className="mb-8 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-between">
              <div>
                <span className="block text-xs uppercase font-bold tracking-wider text-slate-400 mb-0.5">Availability</span>
                <span className={`text-sm font-bold ${product.stock_status === "instock" ? "text-emerald-600" : "text-rose-500"}`}>
                  {product.stock_status === "instock" ? "✓ In Stock - Dispatch Ready" : "✗ Temporarily Out of Stock"}
                </span>
              </div>
              
              {product.stock_quantity !== null && (
                <div className="text-right">
                  <span className="block text-xs uppercase font-bold tracking-wider text-slate-400 mb-0.5">Left In Warehouse</span>
                  <span className="text-sm font-extrabold text-slate-700">{product.stock_quantity} units</span>
                </div>
              )}
            </div>
          </div>

          {/* Checkout checkout buttons */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              disabled={product.stock_status !== "instock"}
              className="w-full bg-slate-950 text-white font-bold py-4 rounded-2xl hover:bg-slate-900 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none text-center block shadow-[0_12px_30px_rgba(15,23,42,0.15)]"
              id="product-action-checkout"
            >
              Express Checkout with Razorpay
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-1">
              Secure Payments encrypted by Razorpay 256-bit SSL. Supabase Auth Account Synced.
            </p>
          </div>
        </div>
      </div>

      {/* Expanded Description Tab */}
      <div className="mt-12 bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-[0_12px_45px_rgba(47,48,74,0.02)]" id="product-detailed-content">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Product Specifications & Details</h2>
        <div 
          className="text-slate-600 text-sm leading-relaxed prose prose-indigo max-w-none"
          dangerouslySetInnerHTML={{ __html: cleanDescription }}
        />
      </div>

      {/* Recommended Related products listing */}
      {relatedProducts.length > 0 && (
        <div className="mt-12" id="related-products-section">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Frequently Viewed Together</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => {
              const relImage = rel.images[0]?.src || "https://picsum.photos/seed/shop/400/300";
              return (
                <Link
                  key={rel.id}
                  href={`/products/${rel.slug}`}
                  className="bg-white rounded-2xl p-4 border border-slate-100 hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] hover:border-slate-200 transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 mb-3">
                    <Image
                      src={relImage}
                      alt={rel.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="300px"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition">
                      {rel.name}
                    </h3>
                    <span className="text-sm font-black text-slate-950 mt-1 block">
                      ₹{rel.price}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
