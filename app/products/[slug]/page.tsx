import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { woocommerce } from "@/lib/services/woocommerce";
import Header from "../../Header";
import ProductDetailClient from "./ProductDetailClient";
import ProductTabsClient from "./ProductTabsClient";
import { Instagram, Facebook, Youtube, Play, Apple, MessageCircle } from "lucide-react";

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

/**
 * 2. PRODUCTION STATIC GENERATION LOOP WITH INFINITE SCALING (Problem 5 Fix)
 * Completely paginates all WooCommerce entries during static compile (not just the first 50),
 * keeping RAM clean and build robust on large-scale catalogs.
 */
export async function generateStaticParams() {
  const allParams: { slug: string }[] = [];
  let page = 1;
  const perPage = 100; // WooCommerce max optimal slice size
  let hasMore = true;

  try {
    while (hasMore) {
      const response = await woocommerce.getProducts({
        page,
        per_page: perPage,
        status: "publish",
      });

      if (!response.data || response.data.length === 0) {
        hasMore = false;
        break;
      }

      for (const item of response.data) {
        if (item.slug) {
          allParams.push({ slug: item.slug });
        }
      }

      // Safe bounds checking
      if (page >= response.totalPages || response.data.length < perPage) {
        hasMore = false;
      } else {
        page++;
      }
    }
  } catch (error) {
    console.error("[generateStaticParams Builder Error]:", error);
  }

  return allParams;
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
    <div className="min-h-screen bg-[#f6f5f8] flex flex-col font-sans">
      <Header />
      
      {/* Dynamic Google Structured Search Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* Main product detail container */}
      <main className="flex-1 bg-[#f6f5f8] pb-12">
        <ProductDetailClient product={product} />

        {/* Expanded Description & Attributes Tabs */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12 pb-12">
          <ProductTabsClient product={product} />
        </div>

        {/* Recommended Related products listing */}
        {relatedProducts.length > 0 && (
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12 pb-16" id="related-products-section">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Frequently Viewed Together</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => {
                const relImage = rel.images[0]?.src || "https://picsum.photos/seed/shop/400/300";
                return (
                  <Link
                    key={rel.id}
                    href={`/products/${rel.slug}`}
                    className="bg-white rounded-2xl p-4 border border-slate-100 hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] hover:border-slate-200 transition-all flex flex-col justify-between group animate-fade-in"
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
                      <span className="text-sm font-black text-slate-950 mt-1 block price-font">
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

      {/* Instagram Section */}
      <section className="bg-[#f3eee7] py-12 lg:py-16 w-full flex flex-col items-center overflow-hidden">
        <div className="max-w-[1600px] mx-auto flex flex-col items-center w-full px-4 lg:px-6">
          <div className="mb-8 text-center flex flex-col items-center w-full">
            <div className="mb-[18px] text-[#111] bg-transparent border-[1.5px] border-[#111] rounded-[8px] p-1.5 inline-flex">
              <Instagram size={28} strokeWidth={1.5} />
            </div>
            <h2 className="text-[28px] md:text-[36px] font-bold text-[#111] tracking-tight mb-2">Comsri Corporation</h2>
            <p className="text-[16px] md:text-[18px] text-[#333] font-medium">
              Follow us on social <a href="#" className="text-[#3452ef] hover:underline font-semibold">@comsricorporation</a> for updates & offers
            </p>
          </div>

          {/* Instagram Images Grid */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4 pb-4 px-4 lg:px-0">
            {[
              "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-1.jpg",
              "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-2.jpg",
              "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-3.jpg",
              "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-4.jpg",
              "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-5.jpg",
              "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-6.jpg",
              "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-7.jpg",
              "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-8.jpg",
            ].map((src, index) => (
              <div key={index} className="w-full aspect-square md:rounded-[20px] rounded-[12px] overflow-hidden bg-white shadow-sm group relative">
                <img src={src} alt="Instagram post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-[#fcb643] pt-10 md:pt-16 pb-8 md:pb-12 w-full relative">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12 flex flex-col gap-8 md:gap-12">

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
          <div className="bg-[#3452ef] rounded-[16px] md:rounded-[24px] px-5 md:px-8 lg:px-12 py-8 md:py-10 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 mt-2 w-full">
            <div className="flex flex-col text-white flex-1 text-center lg:text-left">
              <h2 className="text-[22px] sm:text-[28px] md:text-[32px] font-bold mb-1.5 tracking-tight">Sign Up to our Newsletter</h2>
              <p className="text-[14px] text-white/90 font-medium">Be the First to Know. Sign up to newsletter today</p>
            </div>
            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 items-center">
              <input
                type="email"
                placeholder="Your email address"
                className="px-5 md:px-6 py-3 md:py-3.5 rounded-full text-[14px] focus:outline-none font-medium h-[44px] md:h-[48px] text-black w-full min-w-0 md:min-w-[280px] md:w-[340px]"
              />
              <button className="bg-[#fcb643] hover:bg-[#fca61f] text-[#111] px-6 md:px-8 h-[44px] md:h-[48px] rounded-full font-bold text-[14px] md:text-[15px] transition-colors whitespace-nowrap shadow-sm w-full sm:w-auto">
                Sign Up
              </button>
            </div>
          </div>

          {/* Copyright & Payments */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-1 gap-4 w-full">
            <p className="text-[14px] font-bold text-[#111]">Copyright 2026 by Comsri Corporation All Right Reserved.</p>
            <div className="flex gap-1.5">
              <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-full object-contain" alt="Mastercard" />
              </div>
              <div className="bg-[#1a1f71] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-[75%] object-contain mt-[1px]" alt="Visa" />
              </div>
              <div className="bg-[#003087] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png" className="h-[12px] object-contain" alt="PayPal" />
              </div>
              <div className="bg-[#2d9cdb] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" className="h-[80%] object-contain" alt="Amex" />
              </div>
              <div className="bg-[#6772e5] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png" className="h-[14px] object-contain invert hue-rotate-[180deg] brightness-200" alt="Stripe" />
              </div>
              <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center px-1">
                <span className="text-white text-[10px]">G</span><span className="text-white text-[12px] font-bold">Pay</span>
              </div>
              <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center px-1 border border-gray-700">
                <Apple size={14} className="fill-white text-white mr-0.5" /><span className="text-white text-[10px] font-semibold mt-[1px]">Pay</span>
              </div>
              <div className="bg-[#004b87] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/UnionPay_logo.svg/1280px-UnionPay_logo.svg.png" className="h-[80%] object-contain" alt="UnionPay" />
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
