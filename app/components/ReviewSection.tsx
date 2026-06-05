import React from "react";
import { Star } from "lucide-react";
import JsonLd from "./JsonLd";
import { getProductSchema } from "../seo/schemas";

interface Review {
  author: string;
  date: string;
  content: string;
  rating: number;
}

interface ReviewSectionProps {
  productId: string | number;
  productName: string;
  slug: string;
  sku?: string;
  price?: string;
  stockStatus?: string;
  brand?: string;
  reviews: Review[];
  ratingValue: number;
  ratingCount: number;
}

export default function ReviewSection({
  productId,
  productName,
  slug,
  sku,
  price,
  stockStatus,
  brand,
  reviews,
  ratingValue,
  ratingCount,
}: ReviewSectionProps) {
  // Generate dynamic product details schema (incorporates AggregateRating & Review array)
  const schema = getProductSchema({
    id: productId,
    name: productName,
    slug: slug,
    sku: sku,
    price: price,
    stock_status: stockStatus,
    brand: brand,
    ratingValue,
    ratingCount,
    reviews,
  });

  return (
    <section className="w-full bg-white rounded-3xl border border-slate-150 p-6 md:p-8 shadow-sm" aria-label="Customer Reviews">
      <JsonLd schema={schema} />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100 mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#111] mb-1.5">
            Customer Reviews & Ratings
          </h2>
          <p className="text-sm text-slate-500 font-semibold">
            Verified buyers reviews and hardware testing feedback.
          </p>
        </div>

        {/* Rating Metrics Summary Block */}
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-4">
          <div className="text-center">
            <span className="block text-3xl font-black text-slate-900 leading-none">
              {ratingValue.toFixed(1)}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Out of 5
            </span>
          </div>
          <div className="h-8 w-[1px] bg-slate-200" />
          <div>
            <div className="flex text-amber-500 gap-0.5 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={15} 
                  fill={i < Math.round(ratingValue) ? "currentColor" : "none"} 
                  strokeWidth={2}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-600 block">
              Based on {ratingCount} Verified Reviews
            </span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((rev, idx) => (
            <div 
              key={idx} 
              className="pb-6 border-b border-slate-100 last:border-b-0 last:pb-0"
              itemProp="review"
              itemScope
              itemType="https://schema.org/Review"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span 
                    className="font-bold text-slate-800 text-sm md:text-base"
                    itemProp="author"
                  >
                    {rev.author}
                  </span>
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    Verified Buyer
                  </span>
                </div>
                
                <span 
                  className="text-xs text-slate-400 font-semibold"
                  itemProp="datePublished"
                >
                  {rev.date}
                </span>
              </div>

              {/* Star Rating */}
              <div className="flex text-amber-500 gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={13} 
                    fill={i < rev.rating ? "currentColor" : "none"} 
                    strokeWidth={2}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p 
                className="text-sm md:text-[14.5px] leading-relaxed text-slate-600 font-medium"
                itemProp="reviewBody"
              >
                {rev.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-500 font-semibold text-sm">
            No reviews yet for this product. Be the first to share your experience!
          </p>
        </div>
      )}
    </section>
  );
}
