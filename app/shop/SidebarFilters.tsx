"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Apple, Check } from "lucide-react";

interface Category {
  id: number;
  name: string;
  count: number;
}

interface SidebarFiltersProps {
  categories: Category[];
  currentCategory: string;
  currentMinPrice: string;
  currentMaxPrice: string;
  currentOnSaleOnly: boolean;
  currentQuery: string;
  currentSorting: string;
}

export default function SidebarFilters({
  categories,
  currentCategory,
  currentMinPrice,
  currentMaxPrice,
  currentOnSaleOnly,
  currentQuery,
  currentSorting,
}: SidebarFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Price Range Bounds: min 7000, max 60000 (representing our shop inventory)
  const minLimit = 7000;
  const maxLimit = 60000;

  const [minPrice, setMinPrice] = useState<number>(() => {
    const val = parseInt(currentMinPrice, 10);
    return isNaN(val) ? 7490 : val;
  });

  const [maxPrice, setMaxPrice] = useState<number>(() => {
    const val = parseInt(currentMaxPrice, 10);
    return isNaN(val) ? 57500 : val;
  });

  // Handle price input sliding/dragging
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(parseInt(e.target.value, 10) || minLimit, maxPrice - 2000);
    setMinPrice(val);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(parseInt(e.target.value, 10) || maxLimit, minPrice + 2000);
    setMaxPrice(val);
  };

  // Convert price bounds to percent for slider background layout
  const minPercent = ((minPrice - minLimit) / (maxLimit - minLimit)) * 100;
  const maxPercent = ((maxPrice - minLimit) / (maxLimit - minLimit)) * 100;

  // Build target URL
  const getFilterUrl = (overrides: Record<string, string | null>) => {
    const params = new URLSearchParams();

    if (currentCategory) params.set("category", currentCategory);
    if (currentQuery) params.set("search", currentQuery);
    if (currentMinPrice) params.set("min_price", currentMinPrice);
    if (currentMaxPrice) params.set("max_price", currentMaxPrice);
    if (currentOnSaleOnly) params.set("on_sale", "true");
    if (currentSorting && currentSorting !== "date") params.set("orderby", currentSorting);

    Object.entries(overrides).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset pagination
    params.delete("page");

    const queryStr = params.toString();
    return `/shop${queryStr ? `?${queryStr}` : ""}`;
  };

  // Trigger router push when clicking "Filter" button
  const applyPriceFilter = () => {
    const url = getFilterUrl({
      min_price: minPrice.toString(),
      max_price: maxPrice.toString(),
    });
    router.push(url);
  };

  // Pre-configured brand items with custom SVG icons (Dell, HP, Lenovo, Microsoft) matching their real branding
  const brands = [
    {
      name: "Apple",
      slug: "apple",
      tag: "Apple",
      count: 2,
      logo: (
        <Apple size={16} className="text-black" />
      ),
    },
    {
      name: "Dell",
      slug: "dell",
      tag: "Dell",
      count: 11,
      logo: (
        <svg viewBox="0 0 100 100" className="w-[18px] h-[18px] select-none" fill="none">
          <circle cx="50" cy="50" r="42" stroke="#0076c0" strokeWidth="12" />
          <path d="M28 35 H42 C48 35 52 38 52 42 V45 C52 49 48 52 42 52 H36 V65 H28 V35 Z M36 41 V46 H41 C43 46 44 45 44 44 C44 43 43 41 41 41 Z" fill="#0076c0" />
          <path d="M54 35 H68 V41 H60 V47 H66 V53 H60 V59 H68 V65 H54 Z" fill="#0076c0" />
          <path d="M70 35 H76 V59 H84 V65 H70 Z" fill="#0076c0" />
          <path d="M85 35 H91 V59 H99 V65 H85 Z" fill="#0076c0" stroke="#0076c0" strokeWidth="0.5" />
        </svg>
      ),
    },
    {
      name: "HP",
      slug: "hp",
      tag: "HP",
      count: 8,
      logo: (
        <svg viewBox="0 0 100 100" className="w-[18px] h-[18px] select-none">
          <circle cx="50" cy="50" r="46" fill="#0096d6" />
          {/* Handcraft thin stylized h and p lines */}
          <path d="M36 22 V72 M36 44 C41 40 48 40 48 48 V72 M52 28 V78 M52 48 C52 40 59 40 64 44 V72" stroke="white" strokeWidth="9" strokeLinecap="round" fill="none" />
        </svg>
      ),
    },
    {
      name: "Lenovo",
      slug: "lenovo",
      tag: "Lenovo",
      count: 5,
      logo: (
        <div className="bg-red-600 text-white font-extrabold text-[8px] tracking-tighter px-1.5 py-0.5 rounded uppercase select-none font-sans leading-none">
          lenovo
        </div>
      ),
    },
    {
      name: "Microsoft",
      slug: "microsoft",
      tag: "Microsoft",
      count: 1,
      logo: (
        <div className="grid grid-cols-2 gap-[2px] w-[15px] h-[15px] select-none">
          <div className="bg-[#f25022] w-1.5 h-1.5"></div>
          <div className="bg-[#7fba00] w-1.5 h-1.5"></div>
          <div className="bg-[#00a4ef] w-1.5 h-1.5"></div>
          <div className="bg-[#ffb900] w-1.5 h-1.5"></div>
        </div>
      ),
    },
  ];

  // Pre-configured processors
  const processors = [
    { label: "Intel® Core™ i3", value: "i3", count: 4 },
    { label: "Intel® Core™ i5", value: "i5", count: 19 },
    { label: "Intel® Core™ i7", value: "i7", count: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Dynamic Unified Side Filter Card */}
      <div className="bg-white rounded-[24px] p-6 lg:p-7 border border-[#eeeeee] shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_35px_rgb(0,0,0,0.05)] transition-all">
        {/* ==================================== PRICE SLIDER Section ==================================== */}
        <div>
          <h3 className="text-[17px] font-semibold text-[#111] mb-5">Filter By Price</h3>

          {/* Double Range Slider UI */}
          <div className="relative w-full h-8 flex items-center mb-4">
            {/* Background Gray Line */}
            <div className="absolute inset-x-0 h-[4px] bg-gray-200 rounded-full"></div>
            
            {/* Active Blue Line */}
            <div 
              className="absolute h-[4px] bg-[#3452ef] rounded-full"
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`
              }}
            ></div>

            {/* Hidden over-sized HTML sliders overlapping */}
            <input
              type="range"
              min={minLimit}
              max={maxLimit}
              step={100}
              value={minPrice}
              onChange={handleMinChange}
              className="absolute w-full h-[4px] appearance-none pointer-events-none bg-transparent cursor-pointer z-20 outline-none
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-[4px] [&::-webkit-slider-thumb]:bg-[#3452ef] [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform
                [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-[4px] [&::-moz-range-thumb]:bg-[#3452ef] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none"
            />
            <input
              type="range"
              min={minLimit}
              max={maxLimit}
              step={100}
              value={maxPrice}
              onChange={handleMaxChange}
              className="absolute w-full h-[4px] appearance-none pointer-events-none bg-transparent cursor-pointer z-20 outline-none
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-[4px] [&::-webkit-slider-thumb]:bg-[#3452ef] [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform
                [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-[4px] [&::-moz-range-thumb]:bg-[#3452ef] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none"
            />

            {/* Custom Range Knobs Visual ticks inside track */}
            <div 
              className="absolute w-3 h-3 bg-white border-2 border-[#3452ef] rounded-full -mt-[1px] pointer-events-none shadow-sm z-30"
              style={{ left: `calc(${minPercent}% - 6px)` }}
            ></div>
            <div 
              className="absolute w-3 h-3 bg-white border-2 border-[#3452ef] rounded-full -mt-[1px] pointer-events-none shadow-sm z-30"
              style={{ left: `calc(${maxPercent}% - 6px)` }}
            ></div>
          </div>

          {/* Pricing Text and Filter Trigger Button */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-[14px] text-gray-500 font-medium">
              Price: <span className="text-[#111] font-bold">₹{minPrice.toLocaleString()} — ₹{maxPrice.toLocaleString()}</span>
            </span>
            <button
              onClick={applyPriceFilter}
              className="bg-[#f5f5f5] hover:bg-gray-200 text-black text-[13px] font-semibold px-4 py-1.5 rounded-full transition-colors focus:outline-none"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Divider 1 */}
        <hr className="border-[#eeeeee] my-6" />

        {/* ==================================== BRANDS SECTION ==================================== */}
        <div>
          <h3 className="text-[17px] font-semibold text-[#111] mb-5">Shop By Brand</h3>
          <div className="flex flex-col gap-1">
            {brands.map((brand) => {
              const isActive = currentQuery.toLowerCase() === brand.slug;
              return (
                <Link
                  key={brand.slug}
                  href={getFilterUrl({ search: isActive ? null : brand.name })}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-all group ${
                    isActive 
                      ? "bg-slate-50 text-[#3452ef]" 
                      : "text-gray-700 hover:bg-slate-50/70 hover:text-black"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-lg shrink-0 group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100">
                      {brand.logo}
                    </div>
                    <span className="text-[14px] font-medium">{brand.name}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400 bg-gray-100/55 px-2 py-0.5 rounded-full border border-gray-100">
                    {brand.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Divider 2 */}
        <hr className="border-[#eeeeee] my-6" />

        {/* ==================================== PROCESSORS SECTION ==================================== */}
        <div>
          <h3 className="text-[17px] font-semibold text-[#111] mb-5">Shop By Processor</h3>
          <div className="flex flex-col gap-0.5">
            {processors.map((proc) => {
              const isActive = currentQuery.toLowerCase().includes(proc.value);
              return (
                <Link
                  key={proc.value}
                  href={getFilterUrl({ search: isActive ? null : proc.value })}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-all ${
                    isActive 
                      ? "bg-slate-50 text-[#3452ef]" 
                      : "text-gray-700 hover:bg-slate-50/70 hover:text-black"
                  }`}
                >
                  <span className="text-[14px] font-medium">{proc.label}</span>
                  <span className="text-[11px] font-semibold text-gray-400 bg-gray-100/55 px-2 py-0.5 rounded-full border border-gray-100">
                    {proc.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Divider 3 */}
        <hr className="border-[#eeeeee] my-6" />

        {/* ==================================== CATEGORIES / DEPARTMENTS SECTION ==================================== */}
        <div>
          <h3 className="text-[17px] font-semibold text-[#111] mb-5">Departments</h3>
          <div className="flex flex-col gap-0.5">
            <Link
              href={getFilterUrl({ category: null })}
              className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-all ${
                !currentCategory 
                  ? "bg-slate-50 text-[#3452ef] font-bold" 
                  : "text-gray-700 hover:bg-slate-50/70 hover:text-black"
              }`}
            >
              <span className="text-[14px] font-medium">All Categories</span>
              <span className="text-[11px] font-semibold text-gray-400 bg-gray-100/55 px-2 py-0.5 rounded-full border border-gray-100">
                {categories.reduce((acc, cat) => acc + (cat.count || 0), 0)}
              </span>
            </Link>
            
            {categories.map((cat) => {
              const isActive = currentCategory === cat.id.toString();
              return (
                <Link
                  key={cat.id}
                  href={getFilterUrl({ category: isActive ? null : cat.id.toString() })}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-all ${
                    isActive 
                      ? "bg-slate-50 text-[#3452ef] font-bold" 
                      : "text-gray-700 hover:bg-slate-50/70 hover:text-black"
                  }`}
                >
                  <span className="text-[14px] font-medium truncate pr-2">{cat.name}</span>
                  <span className="text-[11px] font-semibold text-gray-400 bg-gray-100/55 px-2 py-0.5 rounded-full border border-gray-100 shrink-0">
                    {cat.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Clear All Active Filters Button (if any) */}
        { (currentCategory || currentQuery || currentMinPrice || currentMaxPrice || currentOnSaleOnly) && (
          <div className="mt-6 pt-4 border-t border-dashed border-[#eeeeee]">
            <Link
              href="/shop"
              className="w-full py-2.5 rounded-xl border border-rose-100 hover:border-rose-200 text-rose-600 hover:bg-rose-50/50 text-[13px] font-bold transition-all text-center flex items-center justify-center gap-1.5"
            >
              Reset All Filters
            </Link>
          </div>
        )}
      </div>

      {/* Sale/Deals Toggle widget */}
      <div className="bg-white rounded-[24px] p-6 border border-[#eeeeee] shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
        <Link
          href={getFilterUrl({ on_sale: currentOnSaleOnly ? null : "true" })}
          className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer text-xs font-bold leading-normal ${
            currentOnSaleOnly 
              ? "bg-orange-50 border-orange-200 text-orange-700 shadow-sm" 
              : "bg-slate-50 hover:bg-slate-100 border-[#eeeeee] text-slate-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">🔥</span>
            <span className="text-[13px] font-semibold">Special Hot Deals</span>
          </div>
          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
            currentOnSaleOnly ? "bg-orange-500 border-orange-500 text-white" : "border-slate-300 bg-white"
          }`}>
            {currentOnSaleOnly && <Check size={10} />}
          </div>
        </Link>
      </div>

      {/* Trust Assurances badge list item */}
      <div className="bg-[#111111] text-white p-6 rounded-[24px] relative overflow-hidden shadow-md">
        <div className="absolute right-[-20px] bottom-[-20px] w-24 h-24 bg-white/5 rounded-full pointer-events-none"></div>
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#fcb643] mb-4 stroke-current fill-none" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
        <h4 className="text-[15px] font-bold text-white tracking-wide uppercase">COMSRI CERTIFIED</h4>
        <p className="text-[12px] text-gray-400 mt-2 leading-relaxed">
          Every desktop and laptop undergoes a strict 40-point hardware diagnostic test and includes a 1-year product warranty coverage support.
        </p>
      </div>
    </div>
  );
}
