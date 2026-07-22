"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, ArrowRight, ShieldCheck, Truck, Headphones, Check, Maximize2, X, Plus, Minus, Grid, ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import { WooCommerceProduct } from "@/lib/types/woocommerce";
import { useCart } from "@/context/CartContext";

interface ProductDetailClientProps {
  product: WooCommerceProduct;
  variations?: any[];
}

export default function ProductDetailClient({ product, variations = [] }: ProductDetailClientProps) {
  const { addToCart } = useCart();
  // Brand resolution
  const getBrand = () => {
    const brandAttr = product.attributes?.find(a => a.name.toLowerCase() === "brand");
    if (brandAttr && brandAttr.options?.[0]) return brandAttr.options[0];
    const nameLower = product.name.toLowerCase();
    if (nameLower.includes("dell")) return "Dell";
    if (nameLower.includes("hp")) return "HP";
    if (nameLower.includes("lenovo")) return "Lenovo";
    if (nameLower.includes("apple") || nameLower.includes("macbook")) return "Apple";
    if (nameLower.includes("acer")) return "Acer";
    if (nameLower.includes("microsoft")) return "Microsoft";
    return "Comsri";
  };

  const brandName = getBrand();

  // Extract attributes or use fallbacks
  const getAttrOptions = (name: string, fallback: string[]) => {
    const attr = product.attributes?.find(a => a.name.toLowerCase() === name.toLowerCase());
    return attr && attr.options.length > 0 ? attr.options : fallback;
  };

  const ramOptions = getAttrOptions("ram", ["8 GB", "16 GB"]);
  const ssdOptions = getAttrOptions("hard disk size", ["256 SSD", "512 SSD"]);
  const warrantyOptions = getAttrOptions("warranty", ["Free 1 Year", "Additional 1 Year", "Additional 2 Year"]);

  // Option States
  const [selectedRam, setSelectedRam] = useState(ramOptions[0]);
  const [selectedSsd, setSelectedSsd] = useState(ssdOptions[0]);
  const [selectedWarranty, setSelectedWarranty] = useState(warrantyOptions[0]);
  const [quantity, setQuantity] = useState(1);

  // Gallery States
  const productImages = product.images.length > 0
    ? product.images
    : [{ id: 0, src: "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/Desktop-Showcase.png", alt: product.name }];

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Price calculations
  const getBasePrice = () => {
    const p = parseFloat(product.price || "0");
    return isNaN(p) || p === 0 ? 22499 : p;
  };

  const getBaseRegularPrice = () => {
    // 1. Check parent product
    const r = parseFloat(product.regular_price || "0");
    if (!isNaN(r) && r > 0) return r;

    // 2. Check variations
    if (variations && variations.length > 0) {
      for (const v of variations) {
        const vr = parseFloat(v.regular_price || "0");
        if (!isNaN(vr) && vr > 0) return vr;
      }
    }

    // 3. Fallback
    const p = getBasePrice();
    return p * 2; // fallback to 50% discount if not set
  };

  const basePrice = getBasePrice();
  const baseRegularPrice = getBaseRegularPrice();

  // Match active variation based on swatches selection
  const getActiveVariation = (checkWarranty: boolean = true) => {
    if (!variations || variations.length === 0) return null;
    return variations.find(v => {
      return v.attributes?.every((attr: any) => {
        const name = attr.name.toLowerCase();
        const option = attr.option.toLowerCase();
        
        if (name === "ram") {
          return selectedRam.toLowerCase().includes(option) || option.includes(selectedRam.toLowerCase());
        }
        if (name === "hard disk size" || name === "storage" || name === "ssd") {
          return selectedSsd.toLowerCase().includes(option) || option.includes(selectedSsd.toLowerCase());
        }
        if (checkWarranty && name === "warranty") {
          return selectedWarranty.toLowerCase().includes(option) || option.includes(selectedWarranty.toLowerCase());
        }
        return true;
      });
    });
  };

  const getDisplayPrices = () => {
    // 1. Try to match variation with warranty
    let activeVar = getActiveVariation(true);
    let basePriceVal = basePrice;
    let hasVariation = false;
    let variationHasWarranty = false;

    if (activeVar) {
      const p = parseFloat(activeVar.price || "0");
      if (!isNaN(p) && p > 0) {
        basePriceVal = p;
        hasVariation = true;
        variationHasWarranty = true;
      }
    } else {
      // 2. Try to match variation without warranty (RAM and SSD only)
      activeVar = getActiveVariation(false);
      if (activeVar) {
        const p = parseFloat(activeVar.price || "0");
        if (!isNaN(p) && p > 0) {
          basePriceVal = p;
          hasVariation = true;
          variationHasWarranty = false;
        }
      }
    }

    let extraCost = 0;
    // If no variation was matched at all, add hardcoded fallback additions
    if (!hasVariation) {
      if (selectedRam.includes("16")) extraCost += 4000;
      if (selectedSsd.includes("512")) extraCost += 3000;
    }

    // Warranty addition adds to sale price only, not the regular price.
    // WooCommerce database variations (e.g. for 8GB) already have the warranty sale price included.
    let warrantyCostForSale = 0;
    if (!variationHasWarranty) {
      if (selectedWarranty.toLowerCase().includes("additional 1")) warrantyCostForSale = 1500;
      if (selectedWarranty.toLowerCase().includes("additional 2")) warrantyCostForSale = 2800;
    }

    return {
      price: basePriceVal + extraCost + warrantyCostForSale,
      regularPrice: baseRegularPrice
    };
  };

  const { price: activePrice, regularPrice: activeRegularPrice } = getDisplayPrices();

  const getVariationPriceForCombo = (ram: string, ssd: string) => {
    if (!variations || variations.length === 0) return null;
    
    // Try matching with warranty first
    let matched = variations.find(v => {
      return v.attributes?.every((attr: any) => {
        const name = attr.name.toLowerCase();
        const option = attr.option.toLowerCase();
        
        if (name === "ram") {
          return ram.toLowerCase().includes(option) || option.includes(ram.toLowerCase());
        }
        if (name === "hard disk size" || name === "storage" || name === "ssd") {
          return ssd.toLowerCase().includes(option) || option.includes(ssd.toLowerCase());
        }
        if (name === "warranty") {
          return selectedWarranty.toLowerCase().includes(option) || option.includes(selectedWarranty.toLowerCase());
        }
        return true;
      });
    });
    
    if (matched) {
      const p = parseFloat(matched.price || "0");
      if (!isNaN(p) && p > 0) return p;
    }
    
    // Try matching without warranty
    matched = variations.find(v => {
      return v.attributes?.every((attr: any) => {
        const name = attr.name.toLowerCase();
        const option = attr.option.toLowerCase();
        
        if (name === "ram") {
          return ram.toLowerCase().includes(option) || option.includes(ram.toLowerCase());
        }
        if (name === "hard disk size" || name === "storage" || name === "ssd") {
          return ssd.toLowerCase().includes(option) || option.includes(ssd.toLowerCase());
        }
        return true;
      });
    });
    
    if (matched) {
      const p = parseFloat(matched.price || "0");
      if (!isNaN(p) && p > 0) {
        let extra = 0;
        if (selectedWarranty.toLowerCase().includes("additional 1")) extra += 1500;
        if (selectedWarranty.toLowerCase().includes("additional 2")) extra += 2800;
        return p + extra;
      }
    }
    return null;
  };

  // Calculate option difference relative to the baseline (first option)
  const getOptionPriceDiff = (optType: "ram" | "ssd" | "warranty", optValue: string) => {
    // 1. If warranty, it's always hardcoded
    if (optType === "warranty") {
      let baseAdded = 0;
      let optAdded = 0;
      
      const wBase = warrantyOptions[0]?.toLowerCase() || "";
      const wOpt = optValue.toLowerCase();
      
      if (wBase.includes("additional 1")) baseAdded = 1500;
      else if (wBase.includes("additional 2")) baseAdded = 2800;
      
      if (wOpt.includes("additional 1")) optAdded = 1500;
      else if (wOpt.includes("additional 2")) optAdded = 2800;
      
      return optAdded - baseAdded;
    }

    // 2. If RAM or SSD, try to get from variations first
    if (variations && variations.length > 0) {
      const ramBase = ramOptions[0];
      const ssdBase = ssdOptions[0];
      
      const targetRam = optType === "ram" ? optValue : selectedRam;
      const targetSsd = optType === "ssd" ? optValue : selectedSsd;
      
      const baseRam = optType === "ram" ? ramBase : selectedRam;
      const baseSsd = optType === "ssd" ? ssdBase : selectedSsd;
      
      const targetPrice = getVariationPriceForCombo(targetRam, targetSsd);
      const basePriceVal = getVariationPriceForCombo(baseRam, baseSsd);
      
      if (targetPrice !== null && basePriceVal !== null) {
        return targetPrice - basePriceVal;
      }
    }

    // 3. Fallback to hardcoded differences
    let baseAdded = 0;
    if (ramOptions[0]?.includes("16")) baseAdded += 4000;
    if (ssdOptions[0]?.includes("512")) baseAdded += 3000;

    let optAdded = 0;
    const r = optType === "ram" ? optValue : ramOptions[0];
    const s = optType === "ssd" ? optValue : ssdOptions[0];

    if (r?.includes("16")) optAdded += 4000;
    if (s?.includes("512")) optAdded += 3000;

    return optAdded - baseAdded;
  };

  const formatPriceDiff = (value: number) => {
    const absValue = Math.abs(value);
    const formatted = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(absValue);
    return `${value >= 0 ? "+" : "-"} ${formatted}`;
  };

  // Format price helper
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const discountPercent = activeRegularPrice > 0
    ? Math.round(((activeRegularPrice - activePrice) / activeRegularPrice) * 100)
    : 50;

  // Strip html for short desc fallback
  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  const cleanShortDesc = product.short_description
    ? stripHtml(product.short_description)
    : `Reliable and business-ready, the ${product.name} delivers strong performance with premium processors, a crisp display, and robust security features. Ideal for professionals on the move, it offers durability, fast connectivity, and long battery life in a sleek, portable design. Perfect for work, study, or everyday tasks.`;

  return (
    <div className="w-full">
      {/* -------------------- BREADCRUMB -------------------- */}
      <div className="w-full border-b border-gray-200 bg-[#F6EDE4] py-3 px-4 md:px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between w-full">
          <div className="text-[12px] md:text-[14px] text-gray-500 font-medium truncate max-w-[80%]">
            <Link href="/" className="hover:text-[#3452ef] transition-colors">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/shop" className="hover:text-[#3452ef] transition-colors">Product</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">{product.name}</span>
          </div>

          {/* Back and Forth navigation placeholders */}
          <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
            <button onClick={() => window.history.back()} className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-black hover:border-gray-300 transition-colors" title="Back">
              <ChevronLeft size={16} />
            </button>
            <Link href="/shop" className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-black hover:border-gray-300 transition-colors" title="All Products">
              <Grid size={15} />
            </Link>
            <button className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-black hover:border-gray-300 transition-colors" title="Next">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12 py-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column: Image Gallery (Span 5 on large screens) */}
          <div className="lg:col-span-5 flex flex-col gap-4">

            {/* Main Showcase Container */}
            <div className="relative aspect-square w-full rounded-[24px] md:rounded-[32px] overflow-hidden bg-[#eaeaea] shadow-sm flex items-center justify-center group select-none">
              <Image
                src={productImages[activeImageIdx]?.src || ""}
                alt={productImages[activeImageIdx]?.alt || product.name}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 600px"
                priority
                referrerPolicy="no-referrer"
              />

              {/* Discount Badge top-right */}
              {discountPercent > 0 && (
                <span className="absolute top-4 right-4 bg-[#fca61f] text-white text-[13px] font-bold px-3 py-1 rounded-full shadow-sm">
                  -{discountPercent}%
                </span>
              )}

              {/* Fullscreen Zoom button bottom-left */}
              <button
                onClick={() => setIsZoomOpen(true)}
                className="absolute bottom-4 left-4 w-10 h-10 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-md text-gray-700 hover:text-black transition-all active:scale-95 z-20"
                title="Zoom Image"
              >
                <Maximize2 size={18} />
              </button>
            </div>

            {/* Thumbnail Selection List */}
            {productImages.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((img, i) => (
                  <button
                    key={img.id || i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`relative aspect-square rounded-[16px] overflow-hidden border-2 bg-[#f6f5f8] transition-all ${i === activeImageIdx
                      ? "border-[#3452ef] shadow-sm scale-95"
                      : "border-transparent hover:border-gray-300"
                      }`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt || `${product.name} — view ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Content and Customization Options (Span 7) */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Title & Brand info */}
            <h1 className="text-[24px] sm:text-[28px] md:text-[34px] font-extrabold text-[#111] leading-tight mb-2 tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-[14px] text-gray-500 font-semibold">Brand:</span>
              <span className="text-[14px] text-gray-900 font-bold">{brandName}</span>
            </div>

            {/* Short Description banner */}
            <div className="bg-[#FABA5A1C] px-6 py-5 rounded-[20px] mb-6 border border-[#f0eae1]/55 shadow-sm text-gray-700 text-[14px] leading-relaxed font-normal">
              {cleanShortDesc}
            </div>

            {/* Modern trust badges grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6 select-none">
              {[
                { icon: <Truck className="text-[#3452ef]" size={20} />, label: "Express Shipping", desc: "PAN-India delivery" },
                { icon: <ShieldCheck className="text-[#3452ef]" size={20} />, label: "1-Year Warranty", desc: "100% certified units" },
                { icon: <Headphones className="text-[#3452ef]" size={20} />, label: "24/7 Support", desc: "Direct phone lines" },
                { icon: <Check className="text-[#3452ef]" size={20} />, label: "49-Point QC Checked", desc: "Diagnostics passed" }
              ].map((badge, idx) => (
                <div key={idx} className="bg-white rounded-xl p-3.5 border border-gray-100 flex flex-col items-center text-center shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300">
                  <div className="mb-2 w-10 h-10 rounded-full bg-[#3452ef]/5 flex items-center justify-center">
                    {badge.icon}
                  </div>
                  <span className="text-[12px] font-bold text-gray-900 leading-snug">{badge.label}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5 font-medium leading-none">{badge.desc}</span>
                </div>
              ))}
            </div>

            {/* Options Card */}
            <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col gap-6 relative overflow-hidden">

              {/* Dynamic Prices (Top) */}
              <div className="flex items-baseline justify-between pb-4 border-b border-gray-100">
                <span className="text-[14px] text-gray-400 font-medium uppercase tracking-wider">Pricing Options</span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-[18px] md:text-[20px] text-gray-400 line-through font-medium price-font">
                    {formatPrice(activeRegularPrice)}
                  </span>
                  <span key={activePrice} className="text-[26px] md:text-[28px] font-semibold text-[#3452ef] tracking-tight price-font animate-price-pulse">
                    {formatPrice(activePrice)}
                  </span>
                </div>
              </div>

              {/* Customizer Option 1: RAM */}
              <div className="flex flex-col gap-2">
                <div className="text-[14px] 500 text-gray-900 flex items-center gap-1.5">
                  <span className="text-gray-400 500 uppercase tracking-wider text-[11px]">Memory (RAM):</span>
                  <span className="text-gray-900 500 text-[13px] bg-gray-100 px-2 py-0.5 rounded-md">{selectedRam}</span>
                </div>
                <div className="flex flex-wrap gap-2.5 w-full">
                  {ramOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedRam(opt)}
                      className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-[10px] text-[13px] font-500 transition-all duration-300 border-2 text-left cursor-pointer hover:-translate-y-0.5 min-w-[130px] ${selectedRam === opt
                        ? "border-black bg-white text-black shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-800"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ${selectedRam === opt ? "border-black bg-black" : "border-gray-300 group-hover:border-gray-400"
                          }`}>
                          {selectedRam === opt && <Check size={8} className="text-white stroke-[3.5]" />}
                        </span>
                        <span className="tracking-tight">{opt}</span>
                      </div>
                      {getOptionPriceDiff('ram', opt) === 0 && (
                        <span className={`text-[10px] font-500 px-1.5 py-0.5 rounded-full transition-colors duration-300 ml-2 ${selectedRam === opt
                          ? "bg-gray-100 text-gray-800"
                          : "bg-gray-50 text-gray-400 group-hover:bg-gray-100/70"
                          }`}>
                          Included
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customizer Option 2: Hard Disk Size */}
              <div className="flex flex-col gap-2">
                <div className="text-[14px] font-500 text-gray-900 flex items-center gap-1.5">
                  <span className="text-gray-400 font-500 uppercase tracking-wider text-[11px]">Storage (SSD):</span>
                  <span className="text-gray-900 font-500 text-[13px] bg-gray-100 px-2 py-0.5 rounded-md">{selectedSsd}</span>
                </div>
                <div className="flex flex-wrap gap-2.5 w-full">
                  {ssdOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedSsd(opt)}
                      className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-[10px] text-[13px] font-500 transition-all duration-300 border-2 text-left cursor-pointer hover:-translate-y-0.5 min-w-[130px] ${selectedSsd === opt
                        ? "border-black bg-white text-black shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-800"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ${selectedSsd === opt ? "border-black bg-black" : "border-gray-300 group-hover:border-gray-450"
                          }`}>
                          {selectedSsd === opt && <Check size={8} className="text-white stroke-[3.5]" />}
                        </span>
                        <span className="tracking-tight">{opt}</span>
                      </div>
                      {getOptionPriceDiff('ssd', opt) === 0 && (
                        <span className={`text-[10px] font-500 px-1.5 py-0.5 rounded-full transition-colors duration-300 ml-2 ${selectedSsd === opt
                          ? "bg-gray-100 text-gray-800"
                          : "bg-gray-50 text-gray-400 group-hover:bg-gray-100/70"
                          }`}>
                          Included
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customizer Option 3: Warranty */}
              <div className="flex flex-col gap-2">
                <div className="text-[14px] font-500 text-gray-900 flex items-center gap-1.5">
                  <span className="text-gray-400 font-500 uppercase tracking-wider text-[11px]">Warranty Cover:</span>
                  <span className="text-gray-900 font-500 text-[13px] bg-gray-100 px-2 py-0.5 rounded-md">{selectedWarranty}</span>
                </div>
                <div className="flex flex-wrap gap-2.5 w-full">
                  {warrantyOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedWarranty(opt)}
                      className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-[10px] text-[13px] font-500 transition-all duration-300 border-2 text-left cursor-pointer hover:-translate-y-0.5 min-w-[140px] ${selectedWarranty === opt
                        ? "border-black bg-white text-black shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-800"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ${selectedWarranty === opt ? "border-black bg-black" : "border-gray-300 group-hover:border-gray-400"
                          }`}>
                          {selectedWarranty === opt && <Check size={8} className="text-white stroke-[3.5]" />}
                        </span>
                        <span className="tracking-tight truncate max-w-[90px] sm:max-w-none">{opt}</span>
                      </div>
                      {getOptionPriceDiff('warranty', opt) === 0 && (
                        <span className={`text-[10px] font-500 px-1.5 py-0.5 rounded-full transition-colors duration-300 ml-2 ${selectedWarranty === opt
                          ? "bg-gray-100 text-gray-800"
                          : "bg-gray-50 text-gray-400 group-hover:bg-gray-100/70"
                          }`}>
                          Included
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Box and Add to Cart Row */}
              <div className="flex items-center gap-4">
                {/* Quantity Box */}
                <div className="flex items-center border border-gray-200 rounded-full px-2 py-1 bg-white shrink-0 h-[48px] shadow-sm hover:border-gray-300 transition-colors">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-black transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-9 text-center text-[15px] font-bold text-gray-900 select-none">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-black transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Add To Cart button */}
                <Link
                  href="/cart"
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 bg-gradient-to-r from-[#2f55f6] to-[#1131c4] text-white font-bold h-[48px] rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-[0_6px_20px_rgba(47,85,246,0.35)] active:scale-[0.97] text-[15px] shadow-[0_4px_15px_rgba(47,85,246,0.2)] shimmer-btn group gap-2"
                >
                  <ShoppingCart size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />
                  <span>Add To Cart</span>
                </Link>
              </div>

              {/* Compare & Wishlist Links */}
              <div className="flex items-center gap-6 pt-4 border-t border-gray-100 text-[14px] font-bold">
                <button className="flex items-center gap-2 text-gray-600 hover-rotate cursor-pointer">
                  <Shuffle size={16} className="text-gray-500" />
                  <span>Add to compare</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover-pulse cursor-pointer">
                  <Heart size={16} className="text-gray-500" />
                  <span>Add to wishlist</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* -------------------- IMAGE ZOOM PREVIEW MODAL -------------------- */}
      {isZoomOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-fade-in">
          <div className="relative max-w-4xl w-full aspect-square bg-[#eaeaea] rounded-[24px] overflow-hidden shadow-2xl flex items-center justify-center border border-gray-800">
            {/* Close button */}
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white hover:bg-gray-200 text-black rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 z-30"
            >
              <X size={20} />
            </button>
            <Image
              src={productImages[activeImageIdx]?.src || ""}
              alt={productImages[activeImageIdx]?.alt || product.name}
              fill
              className="object-contain"
              sizes="100vw"
              priority
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
