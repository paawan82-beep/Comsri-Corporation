"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";

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
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeDot, setActiveDot] = useState(0);

  const mainImageStr = product.images?.[0]?.src || "https://picsum.photos/seed/placeholder/400/300";

  const catName = product.categories?.[0]?.name || "Corporate Hardware";

  return (
    <div
      style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
      className="bg-white rounded-[24px] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col group cursor-pointer border border-transparent hover:border-gray-100 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] transition-all duration-300 ease-out hover:-translate-y-2 relative overflow-hidden animate-fade-in"
    >
      {/* Glow Effect Background inside the card on hover */}
      <div className="absolute inset-0 bg-radial-gradient from-blue-50/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Image Area */}
      <div className="bg-[#f6f6f6] rounded-[20px] relative h-[240px] mb-4 overflow-hidden flex items-center justify-center">
        {/* Top Bar inside Image Area */}
        <div className="absolute top-4 inset-x-4 flex justify-between z-20">
          <div className="flex gap-1.5">
            {product.featured ? (
              <span className="bg-[#3452ef] text-white text-[12px] font-semibold px-3 py-1.5 rounded-full shadow-sm tracking-wide">
                Best Seller
              </span>
            ) : (
              <span className="bg-white text-black text-[12px] font-semibold px-3 py-1.5 rounded-full shadow-sm tracking-wide">
                Just In
              </span>
            )}
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className={`w-[36px] h-[36px] rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none z-20 ${
              isFavorite 
                ? "bg-rose-500 text-white" 
                : "bg-white text-gray-700 hover:text-black hover:bg-white"
            }`}
          >
            <Heart size={16} className={isFavorite ? "fill-white text-white" : ""} />
          </button>
        </div>
        
        {/* Image Frame with Zoom Effect */}
        <Link href={`/products/${product.slug}`} className="absolute inset-0 z-10 block">
          <div 
            className="w-full h-full bg-no-repeat bg-cover bg-center pointer-events-none transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
            style={{ backgroundImage: `url('${mainImageStr}')` }}
          />
        </Link>

        {/* Dynamic Interactive Dot Indicators */}
        <div className="absolute bottom-4 flex gap-1.5 z-20">
          {[0, 1, 2, 3, 4].map((dotIndex) => (
            <button
              key={dotIndex}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setActiveDot(dotIndex);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none ${
                activeDot === dotIndex 
                  ? "w-3.5 bg-black" 
                  : "w-1.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 px-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-[17px] font-medium text-[#111] leading-snug mb-1.5 line-clamp-2 min-h-[46px] hover:text-[#3452ef] transition-colors duration-200">
            {product.name}
          </h3>
        </Link>
        <p className="text-[13px] text-gray-500 font-medium mb-3 flex items-center gap-1.5">
          {catName}
        </p>

        <div className="flex items-center gap-2.5 mb-5 mt-1">
          {product.on_sale && product.regular_price ? (
            <>
              <span className="text-[18px] font-bold text-[#111]">₹{product.sale_price}</span>
              <span className="text-[14px] text-gray-400 line-through font-medium">₹{product.regular_price}</span>
              {product.regular_price && product.sale_price && (
                <span className="text-[14.5px] font-semibold text-[#008a00] bg-emerald-50 px-2 py-0.5 rounded-md">
                  {Math.round(((parseFloat(product.regular_price) - parseFloat(product.sale_price)) / parseFloat(product.regular_price)) * 100)}% off
                </span>
              )}
            </>
          ) : (
            <span className="text-[18px] font-bold text-[#111]">
              ₹{product.price || "Check Price"}
            </span>
          )}
        </div>

        {/* Action Buttons with CSS transitions */}
        <div className="grid grid-cols-2 gap-2 mt-auto pt-1">
          <Link 
            href={`/products/${product.slug}`} 
            className="bg-[#f5f5f5] hover:bg-gray-200 text-[#111] text-[13.5px] font-semibold py-3 rounded-full transition-colors duration-200 text-center flex items-center justify-center hover:shadow-sm focus:outline-none"
          >
            View Details
          </Link>
          <button 
            className="bg-[#3452ef] hover:bg-[#203bca] text-white text-[13.5px] font-semibold py-3 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 focus:outline-none"
          >
            <ShoppingCart size={15} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
