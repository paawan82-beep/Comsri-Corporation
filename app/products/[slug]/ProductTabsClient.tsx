"use client";

import { useState, useEffect } from "react";
import { FileText, Info, MessageSquare, Star, User, Calendar, ShieldCheck, CheckCircle, RefreshCcw, Truck } from "lucide-react";
import { WooCommerceProduct } from "@/lib/types/woocommerce";
import { supabase } from "@/lib/supabase";

interface ProductTabsClientProps {
  product: WooCommerceProduct;
}

export default function ProductTabsClient({ product }: ProductTabsClientProps) {
  const [activeTab, setActiveTab] = useState<"description" | "additional" | "reviews">("description");

  // Reviews states
  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [localReviews, setLocalReviews] = useState<Array<{
    name: string;
    rating: number;
    date: string;
    content: string;
  }>>([]);

  const [formSuccess, setFormSuccess] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Sanitizing description fallback
  const cleanDescription = product.description
    ? product.description.replace(/<p>/g, '<p class="mb-5 text-slate-700 leading-relaxed font-medium">')
    : "No full product description is available.";

  // Fetch reviews from Supabase on mount
  useEffect(() => {
    async function loadReviews() {
      setLoadingReviews(true);
      try {
        const { data, error } = await supabase
          .from("product_reviews")
          .select("*")
          .eq("product_id", product.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) {
          const formatted = data.map((r: any) => ({
            name: r.name,
            rating: r.rating,
            date: new Date(r.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric"
            }),
            content: r.content
          }));
          setLocalReviews(formatted);
        }
      } catch (err) {
        console.error("Error loading reviews from Supabase:", err);
      } finally {
        setLoadingReviews(false);
      }
    }
    loadReviews();
  }, [product.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewContent || !reviewEmail) return;

    try {
      const { error } = await supabase
        .from("product_reviews")
        .insert([
          {
            product_id: product.id,
            product_slug: product.slug,
            name: reviewName,
            email: reviewEmail,
            rating: reviewRating,
            content: reviewContent
          }
        ]);

      if (error) throw error;

      const newReview = {
        name: reviewName,
        rating: reviewRating,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric"
        }),
        content: reviewContent
      };

      setLocalReviews([newReview, ...localReviews]);
      setReviewName("");
      setReviewEmail("");
      setReviewContent("");
      setReviewRating(5);
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 4000);
    } catch (err) {
      console.error("Error submitting review to Supabase:", err);
    }
  };

  const tabs = [
    { id: "description", label: "Description", icon: <FileText size={15} /> },
    { id: "additional", label: "Specifications", icon: <Info size={15} /> },
    { id: "reviews", label: `Reviews (${product.rating_count + localReviews.length})`, icon: <MessageSquare size={15} /> }
  ] as const;

  return (
    <div className="w-full">
      {/* Tabs Bar Header - Overhauled with Premium Floating Pill layout */}
      <div className="flex justify-center md:justify-start w-full mb-8">
        <div className="bg-slate-100/80 p-1.5 rounded-full inline-flex flex-wrap md:flex-nowrap gap-1 border border-slate-200/50 shadow-inner">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2.5 px-5 text-[13px] md:text-[14px] font-bold rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap outline-none ${isActive
                  ? "bg-white text-[#3452ef] shadow-[0_4px_12px_rgba(52,82,239,0.08)] border border-slate-100"
                  : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs Content Panel */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-[0_12px_45px_rgba(47,48,74,0.02)] min-h-[300px]">

        {/* DESCRIPTION TAB - OVERHAULED FOR LARGE WOOCOMMERCE DESCRIPTIONS */}
        {activeTab === "description" && (
          <div className="animate-fade-in-up flex flex-col gap-8">
            {/* Top row trust and logistics cards grid to build confidence before reading large description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Premium Guarantee Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-[24px] p-6 border border-slate-800 shadow-[0_12px_30px_rgba(0,0,0,0.03)]">
                <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
                  <ShieldCheck size={16} />
                  Premium Certified Guarantee
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Grade-A Quality Assurance", desc: "Practically scratchless exterior, certified clean keyboard, tested components." },
                    { label: "40+ Point Diagnostic Test", desc: "Rigorous quality check on CPU, RAM, battery health, screens, storage stability." },
                    { label: "1-Year Direct Warranty", desc: "Hassle-free replacement warranty covered directly by Comsri Corporation." },
                    { label: "Eco-Friendly Footprint", desc: "By opting for refurbished hardware, you save an estimated 180kg of carbon emissions." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1 border-t border-slate-800/80 pt-3 first:border-none sm:[&:nth-child(2)]:border-none first:pt-0 sm:[&:nth-child(2)]:pt-0">
                      <span className="font-extrabold text-[13.5px] text-slate-100">{item.label}</span>
                      <span className="text-[11.5px] text-slate-400 font-medium leading-relaxed">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Fast Facts Card */}
              <div className="bg-[#3452ef]/5 rounded-[24px] p-6 border border-[#3452ef]/10 flex flex-col justify-between">
                <div>
                  <h3 className="text-[13px] font-extrabold text-[#3452ef] mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Truck size={16} />
                    Fast Logistics & Support
                  </h3>
                  <p className="text-[13.5px] font-semibold text-slate-600 leading-relaxed mb-6">
                    We process and pack all shipments in dust-free, anti-static custom boxes to guarantee your equipment arrives in absolute pristine factory condition.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-[#3452ef]/10 pt-4">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Shipping Status</span>
                    <span className="text-[13px] font-bold text-gray-850 block mt-0.5">Dispatched in 24h</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Delivery Time</span>
                    <span className="text-[13px] font-bold text-gray-850 block mt-0.5">3-5 Business Days</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Payment Options</span>
                    <span className="text-[13px] font-bold text-gray-850 block mt-0.5">UPI / Cards / COD</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Support Policy</span>
                    <span className="text-[13px] font-bold text-gray-850 block mt-0.5">Lifetime Tech Help</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Separator line */}
            <div className="h-px bg-slate-100 w-full my-2" />

            {/* WooCommerce Big Description full width wrapper */}
            <div className="w-full text-gray-700 text-[14px] leading-relaxed prose prose-slate max-w-none">
              <div 
                id="product-detailed-content" 
                className="description-content"
                dangerouslySetInnerHTML={{ __html: cleanDescription }} 
              />
            </div>
          </div>
        )}

        {/* ADDITIONAL INFORMATION TAB */}
        {activeTab === "additional" && (
          <div className="animate-fade-in-up">
            {product.attributes && product.attributes.length > 0 ? (
              <div className="overflow-hidden rounded-[20px] border border-gray-200/60 shadow-sm bg-white">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {product.attributes.map((attr) => (
                      <tr
                        key={attr.id || attr.name}
                        className="border-b border-gray-100 hover:bg-slate-50/50 transition-colors last:border-0"
                      >
                        <td className="py-4 px-6 text-[13px] md:text-[14px] font-extrabold text-slate-800 bg-slate-50/30 w-[180px] md:w-[260px] border-r border-gray-100 shrink-0 select-none">
                          {attr.name}
                        </td>
                        <td className="py-4 px-6 text-[13px] md:text-[14px] text-slate-600 font-semibold leading-relaxed">
                          {attr.options?.join(", ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Info size={40} className="text-gray-300 mb-3" />
                <p className="text-[14px] text-gray-400 font-semibold">No additional specifications are available for this product.</p>
              </div>
            )}
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* Reviews Summary Column (Span 4) */}
            <div className="lg:col-span-4 bg-slate-50/70 rounded-2xl p-6 border border-slate-100 flex flex-col items-center text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Average Rating</span>
              <span className="text-[48px] font-black text-slate-900 leading-none mb-2">
                {product.average_rating || "5.0"}
              </span>
              <div className="flex gap-1 mb-2 text-yellow-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={18} className="fill-current stroke-current" />
                ))}
              </div>
              <span className="text-[12.5px] text-slate-500 font-bold">
                Based on {product.rating_count + localReviews.length} ratings
              </span>

              {/* Progress bars */}
              <div className="w-full mt-6 flex flex-col gap-2.5">
                {[
                  { stars: 5, pct: "100%" },
                  { stars: 4, pct: "0%" },
                  { stars: 3, pct: "0%" },
                  { stars: 2, pct: "0%" },
                  { stars: 1, pct: "0%" }
                ].map((row) => (
                  <div key={row.stars} className="flex items-center gap-3 text-[12px] w-full">
                    <span className="font-bold text-slate-600 w-3">{row.stars}</span>
                    <Star size={11} className="text-slate-455 fill-slate-400 stroke-none shrink-0" />
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="bg-yellow-400 h-full rounded-full" style={{ width: row.pct }} />
                    </div>
                    <span className="font-semibold text-slate-500 w-8 text-right">{row.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List & Write form (Span 8) */}
            <div className="lg:col-span-8 flex flex-col gap-8">

              {/* Write Review Section */}
              <div className="border border-slate-100 rounded-2xl p-6 md:p-8 bg-white shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
                <h3 className="text-[16px] md:text-[18px] font-extrabold text-slate-900 mb-1">Write a Customer Review</h3>
                <p className="text-[12px] text-slate-400 font-semibold mb-6">Required fields are marked *</p>

                {formSuccess && (
                  <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-[13px] font-semibold flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-600 fill-emerald-50" />
                    <span>Review submitted successfully! Thank you for sharing your thoughts.</span>
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                  {/* Rating Selector */}
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-bold text-slate-900">Your Rating *:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setReviewRating(num)}
                          className="text-yellow-400 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                        >
                          <Star
                            size={20}
                            className={num <= reviewRating ? "fill-current" : "text-gray-300"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide">Name *</label>
                      <input
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="Enter your name"
                        className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#3452ef] focus:outline-none text-[13px] font-bold bg-white text-slate-800"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide">Email *</label>
                      <input
                        type="email"
                        required
                        value={reviewEmail}
                        onChange={(e) => setReviewEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#3452ef] focus:outline-none text-[13px] font-bold bg-white text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide">Review Content *</label>
                    <textarea
                      required
                      rows={4}
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      placeholder="Write your comments here..."
                      className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#3452ef] focus:outline-none text-[13px] font-bold bg-white resize-none text-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 self-start bg-[#3452ef] hover:bg-[#203cc2] text-white font-bold px-6 py-2.5 rounded-full text-[13px] transition-all hover:shadow-[0_4px_15px_rgba(52,82,239,0.2)] active:scale-95 cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              </div>

              {/* Review Feed */}
              <div className="flex flex-col gap-5">
                <h4 className="text-[14px] font-extrabold text-slate-900 border-b border-slate-100 pb-3">Reviews Feed</h4>
                {loadingReviews ? (
                  <div className="py-8 text-center flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3452ef] mb-2" />
                    <span className="text-[13px] text-slate-400 font-semibold">Synchronizing reviews...</span>
                  </div>
                ) : localReviews.length === 0 ? (
                  <div className="py-8 text-center bg-slate-50/40 rounded-xl border border-dashed border-slate-200 flex flex-col items-center">
                    <User className="text-slate-350 mb-2" size={32} />
                    <span className="text-[13px] text-slate-400 font-semibold">No customer reviews yet. Be the first to share your thoughts!</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {localReviews.map((rev, i) => (
                      <div
                        key={i}
                        className="flex gap-4 p-5 rounded-2xl border border-slate-100/90 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.01)] animate-fade-in-up"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#3452ef]/5 flex items-center justify-center shrink-0 text-[#3452ef] font-black text-[13.5px] border border-[#3452ef]/10">
                          {rev.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-extrabold text-[14px] text-slate-900">{rev.name}</span>
                            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                              <Calendar size={12} />
                              {rev.date}
                            </span>
                          </div>
                          <div className="flex gap-0.5 text-yellow-400 mb-2">
                            {Array.from({ length: 5 }).map((_, s) => (
                              <Star
                                key={s}
                                size={12}
                                className={s < rev.rating ? "fill-current" : "text-gray-200"}
                              />
                            ))}
                          </div>
                          <p className="text-[13px] text-slate-600 leading-relaxed font-semibold">
                            {rev.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
