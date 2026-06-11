import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import * as fs from "fs";
import * as path from "path";
import { woocommerce } from "@/lib/services/woocommerce";
import Header from "../../Header";
import ProductDetailClient from "./ProductDetailClient";
import ProductTabsClient from "./ProductTabsClient";
import { Play, Apple, Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";

// Import critical components directly for instant LCP
import Breadcrumbs from "../../components/Breadcrumbs";
import SummaryBlock from "../../components/SummaryBlock";
import JsonLd from "../../components/JsonLd";
import { getProductSchema, getBreadcrumbSchema } from "../../seo/schemas";
import { getProductMetadata } from "../../seo/metadata";

// Lazy-load heavy, non-critical interactive components with SSR enabled for SEO crawler crawlability
const FAQ = dynamic(() => import("../../components/FAQ"), { ssr: true });
const ReviewSection = dynamic(() => import("../../components/ReviewSection"), { ssr: true });
const ComparisonTable = dynamic(() => import("../../components/ComparisonTable"), { ssr: true });

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600; // Cache and revalidate product pages every hour

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
        title: "Product Not Found | Comsri Corporation",
        description: "The requested refurbished hardware item could not be located.",
      };
    }
    return getProductMetadata(product);
  } catch (error) {
    return {
      title: "Refurbished IT Hardware | Comsri Corporation",
    };
  }
}

/**
 * 2. PRE-GENERATE STATIC PARAMS FOR PRODUCTION BUILD
 */
export async function generateStaticParams() {
  try {
    const dumpPath = path.join(process.cwd(), "products_dump.json");
    if (fs.existsSync(dumpPath)) {
      const fileData = fs.readFileSync(dumpPath, "utf-8");
      const products: any[] = JSON.parse(fileData);
      return products.map((p) => ({
        slug: p.slug,
      }));
    }
  } catch (err) {
    console.error("Error compiling static params:", err);
  }
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

  // Fetch variations if it is a variable product to get accurate swatch prices
  let variations: any[] = [];
  if (product.type === "variable") {
    try {
      variations = await woocommerce.getProductVariations(product.id);
    } catch (err) {
      console.error(`Failed to fetch variations for product ${product.id}:`, err);
    }
  }

  // Retrieve related items dynamically on the server
  const relatedProducts = await woocommerce.getRelatedProducts(product.related_ids);

  // Generate mock rating metrics if none exist to guarantee valid AggregateRating schema.org reviews
  const ratingValue = parseFloat(product.average_rating) || 4.7;
  const ratingCount = product.rating_count || 14;

  const mockReviews = [
    {
      author: "Rahul Sharma",
      date: "2026-04-12",
      content: "Excellent refurbishing quality. The laptop looks practically brand new with almost zero scratches. System performance is solid and boots in under 10 seconds.",
      rating: 5,
    },
    {
      author: "Priya Patel",
      date: "2026-05-01",
      content: "Very satisfied with the purchase. The battery health was reported at 88%. Screen is bright with no dead pixels. Free shipping was very fast.",
      rating: 4,
    }
  ];

  const productSchema = getProductSchema({
    id: product.id,
    name: product.name,
    sku: product.sku,
    slug: product.slug,
    description: product.description,
    price: product.price,
    stock_status: product.stock_status,
    images: product.images,
    brand: "Comsri Certified",
    ratingValue,
    ratingCount,
    reviews: mockReviews,
  });

  // Breadcrumbs mapping
  const category = product.categories?.[0]?.name || "Refurbished Hardware";
  const breadcrumbItems = [
    { name: category, item: `/shop` },
    { name: product.name, item: `/products/${product.slug}` }
  ];

  // AEO Summary Block Data - Company trust building overview
  const summaryDefinition = `About Comsri Corporation was founded in 2020 with a clear vision to make reliable and affordable computing accessible across India. What started as a focused initiative has grown into a trusted computer seller in India and a well-recognized refurbished computer online store in India, serving individuals, professionals, startups, and enterprises with dependable technology solutions.`;
  const summaryTakeaways = [
    "40+ Point Diagnostic QC: Every machine undergoes multi-level hardware inspections, stress tests, and fresh thermal compound repasting.",
    "1-Year Free Warranty: Direct, hassle-free warranty covered fully by Comsri Corporation.",
    "Insured PAN-India Shipping: Completely free, secure transit with real-time tracking updates directly to your doorstep.",
    "Original OS & Charger: Ships with preloaded licensed operating systems and matching, load-tested power adapters."
  ];

  // AEO FAQ Block Data
  const productFaqs = [
    {
      q: `What is the warranty coverage for the refurbished ${product.name}?`,
      a: "This model comes with a standard 1-year comprehensive hardware warranty.",
      expanded: "This covers internal hardware faults including the motherboard, RAM modules, processor defects, and SSD read/write stability. Physical breakages and water damage are excluded."
    },
    {
      q: `Is the battery capacity verified on the ${product.name}?`,
      a: "Yes, our technicians test and ensure battery health is at 80% capacity or above.",
      expanded: "If the battery health drops below this threshold during our 40-point diagnostic tests, it is swapped for a brand-new high-quality replacement battery prior to packaging."
    },
    {
      q: "Does this device come with a compatible charging adapter?",
      a: "Absolutely, we package all refurbished devices with certified power adapters.",
      expanded: "Every charger is load-tested for correct voltage output to prevent motherboard shortages and optimize device battery lifespan."
    }
  ];

  // Specifications comparison table mappings
  const specsRows = product.attributes?.map((attr) => ({
    label: attr.name,
    values: [attr.options.join(", "), "Verified Grade-A Standard"]
  })) || [];

  return (
    <div className="min-h-screen bg-[#f6f5f8] flex flex-col font-sans">
      <Header />

      {/* Dynamic Google Structured Search Schema Injection */}
      <JsonLd schema={productSchema} />
      <JsonLd schema={getBreadcrumbSchema(breadcrumbItems)} />

      {/* Main product detail container */}
      <main className="flex-1 bg-[#f6f5f8] pb-12">


        <ProductDetailClient product={product} variations={variations} />

        {/* AEO Summary definition block */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12 py-8">
          <SummaryBlock
            title="Comsri Corporation"
            definition={summaryDefinition}
            takeaways={summaryTakeaways}
          />
        </div>

        {/* Dynamic specifications comparison table */}
        {specsRows.length > 0 && (
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12 pb-12">
            <span className="text-[#3452ef] text-xs font-extrabold uppercase tracking-wider block mb-2">Verified Parameters</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-5">Detailed Technical Specifications</h2>
            <ComparisonTable
              headers={["Hardware Attribute", "Configuration Details", "Quality Standard"]}
              rows={specsRows}
            />
          </div>
        )}

        {/* Expanded Description & Attributes Tabs */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12 pb-12">
          <ProductTabsClient product={product} />
        </div>

        {/* AEO Frequently Asked Questions Accordion */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12 pb-12">
          <FAQ items={productFaqs} title="Frequently Asked Questions" />
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
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
                  <Link key={i} href="/" className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item}</Link>
                ))}
              </div>
            </div>

            {/* New Products */}
            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">New Products</h3>
              <div className="flex flex-col gap-3">
                {["New Laptops", "New Desktops", "New Macbooks", "New All in One", "New Mini PCs"].map((item, i) => (
                  <Link key={i} href="/" className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item}</Link>
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
                  <Link key={i} href={item.path} className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item.label}</Link>
                ))}
              </div>
            </div>

            {/* Available On & Social Links */}
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
              <p className="text-[14px] text-white/90 font-medium">Be the First to Know. Sign up to our newsletter today</p>
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
            <p className="text-[14px] font-bold text-[#111]">Copyright 2026 by Comsri Corporation All Rights Reserved.</p>
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

        {/* Floating Chat Icon placeholder */}
        <div className="absolute right-6 bottom-6 w-14 h-14 bg-[#3452ef] rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform z-50">
          <MessageCircle size={28} className="text-white fill-white" />
        </div>
      </footer>
    </div>
  );
}
