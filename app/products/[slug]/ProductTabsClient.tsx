"use client";

import { useState } from "react";
import { FileText, Info, MessageSquare, Star, User, Calendar, Heart } from "lucide-react";
import { WooCommerceProduct } from "@/lib/types/woocommerce";

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

  // Sanitizing description fallback
  const cleanDescription = product.description
    ? product.description.replace(/<p>/g, '<p class="mb-4">')
    : "No full product description is available.";

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewContent || !reviewEmail) return;

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
  };

  const tabs = [
    { id: "description", label: "Description", icon: <FileText size={16} /> },
    { id: "additional", label: "Additional Information", icon: <Info size={16} /> },
    { id: "reviews", label: `Reviews (${product.rating_count + localReviews.length})`, icon: <MessageSquare size={16} /> }
  ] as const;

  return (
    <div className="w-full">
      {/* Tabs Bar Header */}
      <div className="flex border-b border-gray-200 w-full mb-8 overflow-x-auto scrollbar-none gap-2 md:gap-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1.5 md:px-3 text-[14px] md:text-[15px] font-bold border-b-2 transition-all duration-350 cursor-pointer whitespace-nowrap outline-none ${isActive
                ? "border-[#3452ef] text-[#3452ef]"
                : "border-transparent text-gray-400 hover:text-gray-900 hover:border-gray-200"
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tabs Content Panel */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-[0_12px_45px_rgba(47,48,74,0.02)] min-h-[300px]">

        {/* DESCRIPTION TAB */}
        {activeTab === "description" && (
          <div className="animate-fade-in-up text-gray-700 text-[14px] leading-relaxed prose prose-indigo max-w-none">
            <div dangerouslySetInnerHTML={{ __html: cleanDescription }} />
          </div>
        )}

        {/* ADDITIONAL INFORMATION TAB */}
        {activeTab === "additional" && (
          <div className="animate-fade-in-up">
            {product.attributes && product.attributes.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-gray-200/60 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {product.attributes.map((attr) => (
                      <tr
                        key={attr.id || attr.name}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors last:border-0"
                      >
                        <td className="py-4 px-5 text-[13px] md:text-[14px] font-bold text-gray-900 bg-gray-50/50 w-[180px] md:w-[260px] border-r border-gray-100 shrink-0 select-none">
                          {attr.name}
                        </td>
                        <td className="py-4 px-5 text-[13px] md:text-[14px] text-gray-650 font-medium leading-relaxed">
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
            <div className="lg:col-span-4 bg-gray-50/70 rounded-2xl p-6 border border-gray-100/80 flex flex-col items-center text-center">
              <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Average Score</span>
              <span className="text-[48px] font-black text-gray-900 leading-none mb-2">
                {product.average_rating || "5.0"}
              </span>
              <div className="flex gap-1 mb-2 text-yellow-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={18} className="fill-current stroke-current" />
                ))}
              </div>
              <span className="text-[13px] text-gray-500 font-bold">
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
                    <span className="font-bold text-gray-600 w-3">{row.stars}</span>
                    <Star size={11} className="text-gray-400 fill-gray-400 stroke-none shrink-0" />
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-yellow-400 h-full rounded-full" style={{ width: row.pct }} />
                    </div>
                    <span className="font-semibold text-gray-500 w-8 text-right">{row.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List & Write form (Span 8) */}
            <div className="lg:col-span-8 flex flex-col gap-8">

              {/* Write Review Section */}
              <div className="border border-gray-100 rounded-2xl p-6 md:p-8 bg-white shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
                <h3 className="text-[16px] md:text-[18px] font-extrabold text-gray-900 mb-2">Write a Customer Review</h3>
                <p className="text-[13px] text-gray-400 font-medium mb-6">Your email address will not be published. Required fields are marked *</p>

                {formSuccess && (
                  <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-[13px] font-semibold flex items-center gap-2">
                    <Star size={16} className="fill-emerald-800 text-emerald-800" />
                    <span>Review submitted successfully! Thank you for sharing your thoughts.</span>
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                  {/* Rating Selector */}
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-bold text-gray-900">Your Rating *:</span>
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
                      <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">Name *</label>
                      <input
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="Enter your name"
                        className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:outline-none text-[13.5px] font-semibold bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">Email *</label>
                      <input
                        type="email"
                        required
                        value={reviewEmail}
                        onChange={(e) => setReviewEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:outline-none text-[13.5px] font-semibold bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">Review Content *</label>
                    <textarea
                      required
                      rows={4}
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      placeholder="Write your comments here..."
                      className="px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:outline-none text-[13.5px] font-semibold bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 self-start bg-indigo-650 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-full text-[13px] transition-all hover:shadow-[0_4px_15px_rgba(79,70,229,0.2)] active:scale-95 cursor-pointer bg-[#3452ef] hover:bg-[#203cc2]"
                  >
                    Submit Review
                  </button>
                </form>
              </div>

              {/* Review Feed */}
              <div className="flex flex-col gap-5">
                <h4 className="text-[15px] font-extrabold text-gray-900 border-b border-gray-100 pb-3">Reviews Feed</h4>
                {localReviews.length === 0 ? (
                  <div className="py-8 text-center bg-gray-50/40 rounded-xl border border-dashed border-gray-200 flex flex-col items-center">
                    <User className="text-gray-300 mb-2" size={32} />
                    <span className="text-[13px] text-gray-400 font-semibold">No customer reviews yet. Be the first to share your thoughts!</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {localReviews.map((rev, i) => (
                      <div
                        key={i}
                        className="flex gap-4 p-5 rounded-2xl border border-gray-100/90 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.01)] animate-fade-in-up"
                      >
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600 font-black text-[14px]">
                          {rev.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-extrabold text-[14px] text-gray-900">{rev.name}</span>
                            <span className="text-[11px] text-gray-400 font-semibold flex items-center gap-1">
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
                          <p className="text-[13px] text-gray-600 leading-relaxed font-medium">
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
