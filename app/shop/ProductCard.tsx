"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductImage {
  src: string;
}

interface ProductCategory {
  name: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  featured?: boolean;
  on_sale?: boolean;
  price?: string;
  regular_price?: string;
  sale_price?: string;
  images?: ProductImage[];
  categories?: ProductCategory[];
}

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeDot, setActiveDot] = useState(0);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const mainImageStr = product.images?.[0]?.src || "https://picsum.photos/seed/placeholder/400/300";

  const catName = product.categories?.[0]?.name || "Corporate Hardware";

  const getDisplayPrices = () => {
    const salePriceVal = parseFloat(product.sale_price || product.price || "0");
    let regularPriceVal = parseFloat(product.regular_price || "0");
    
    if (isNaN(regularPriceVal) || regularPriceVal <= 0) {
      regularPriceVal = salePriceVal * 2; // fallback to 50% discount if not configured
    }
    
    const discount = regularPriceVal > 0 
      ? Math.round(((regularPriceVal - salePriceVal) / regularPriceVal) * 100)
      : 50;

    return {
      salePrice: salePriceVal,
      regularPrice: regularPriceVal,
      discountPercent: discount
    };
  };

  const { salePrice, regularPrice, discountPercent } = getDisplayPrices();

  return (
    <div
      style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
      className="animate-fade-in h-full"
    >
      <div
        style={{
          transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
        onClick={() => router.push(`/products/${product.slug}`)}
        className="bg-white rounded-[24px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col group cursor-pointer border border-slate-100 hover:border-blue-500/20 hover:shadow-[0_20px_40px_rgba(52,82,239,0.08)] hover:-translate-y-2 hover:scale-[1.02] relative overflow-hidden will-change-transform h-full"
      >
        {/* Glow Effect Background inside the card on hover */}
        <div className="absolute inset-0 bg-radial-gradient from-blue-50/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Premium Shine reflection effect on hover */}
        <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-[150%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-30" />

        {/* Image Area */}
        <div className="bg-[#f6f6f6] rounded-[20px] relative h-[240px] mb-4 overflow-hidden flex items-center justify-center">
          {/* Top Bar inside Image Area */}
          <div className="absolute top-4 inset-x-4 flex justify-between z-20">
            <div className="flex gap-1.5">
              {product.featured && (
                <span className="bg-[#3452ef] text-white text-[12px] font-semibold px-3 py-1.5 rounded-full shadow-sm tracking-wide">
                  Best Seller
                </span>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsFavorite(!isFavorite);
              }}
              aria-label="Add to favorites"
              className={`w-[36px] h-[36px] rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none z-20 ${isFavorite
                ? "bg-rose-500 text-white"
                : "bg-white text-gray-700 hover:text-black hover:bg-white"
                }`}
            >
              <Heart size={16} className={isFavorite ? "fill-white text-white" : ""} />
            </button>
          </div>

          {/* Image Frame with Zoom Effect */}
          <Link href={`/products/${product.slug}`} className="absolute inset-0 z-10 block">
            <div className="relative w-full h-full pointer-events-none transition-transform duration-700 ease-out group-hover:scale-106 group-hover:rotate-1">
              <Image
                src={mainImageStr}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                className="object-cover"
                loading={index < 2 ? "eager" : "lazy"}
                priority={index < 2}
              />
            </div>
          </Link>
        </div>

        {/* Content Area */}
        <div className="flex flex-col flex-1 px-1">
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-[17px] font-medium text-[#111] leading-snug mb-1.5 line-clamp-2 min-h-[46px] hover:text-[#3452ef] transition-colors duration-200">
              {product.name}
            </h3>
          </Link>
          <p className="text-[13px] text-gray-600 font-semibold mb-3 flex items-center gap-1.5">
            {catName}
          </p>

          <div className="flex items-center gap-2.5 mb-5 mt-1">
            <span className="text-[18px] font-bold text-[#111] price-font">₹{salePrice}</span>
            <span className="text-[14px] text-gray-600 line-through font-medium price-font">₹{regularPrice}</span>
            <span className="text-[14.5px] font-bold text-[#005c00] bg-emerald-50 px-2 py-0.5 rounded-md">
              {discountPercent}% off
            </span>
          </div>

          {/* Action Buttons with CSS transitions */}
          <div className="grid grid-cols-2 gap-1.5 mt-auto pt-1">
            <Link
              href={`/products/${product.slug}`}
              className="bg-[#f5f5f5] hover:bg-gray-200 text-[#111] text-[11px] sm:text-[13px] font-semibold py-2.5 sm:py-3 rounded-full transition-colors duration-200 text-center flex items-center justify-center hover:shadow-sm focus:outline-none"
            >
              View Details
            </Link>
            <button
              onClick={handleAddToCart}
              className={`${
                added ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#3452ef] hover:bg-[#203bca]"
              } text-white text-[11px] sm:text-[13px] font-semibold py-2.5 sm:py-3 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] flex items-center justify-center gap-1 sm:gap-2 cursor-pointer shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 focus:outline-none`}
            >
              {added ? (
                <>
                  <svg className="w-3.5 h-3.5 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Added!
                </>
              ) : (
                <>
                  <ShoppingCart size={13} className="hidden sm:inline-block shrink-0" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
