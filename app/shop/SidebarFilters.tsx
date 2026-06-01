"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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
  onFilterChange: (overrides: Record<string, string | null>) => void;
  counts?: any;
}

export default function SidebarFilters({
  categories,
  currentCategory,
  currentMinPrice,
  currentMaxPrice,
  currentOnSaleOnly,
  currentQuery,
  currentSorting,
  onFilterChange,
  counts,
}: SidebarFiltersProps) {
  const router = useRouter();

  const handleLinkClick = (overrides: Record<string, string | null>) => (e: React.MouseEvent) => {
    e.preventDefault();
    onFilterChange(overrides);
  };

  // Unified lists of known tag values for combinatorial search queries
  const knownBrands = ["apple", "dell", "hp", "lenovo", "microsoft"];
  const knownProcessors = ["i3", "i5", "i7"];
  const knownGens = ["4th gen", "6th gen", "7th gen", "8th gen", "9th gen", "10th gen"];
  const knownRams = ["16gb", "32gb", "64gb", "8gb", "4gb"]; // Longest to shortest to avoid partial replacements
  const knownHdds = ["500 hdd", "256 ssd", "512 ssd"];

  const getUpdatedSearchQuery = (
    group: "brand" | "processor" | "generation" | "ram" | "storage",
    value: string,
    isActive: boolean
  ) => {
    const text = currentQuery.trim().toLowerCase();
    
    // Parse current tags in search
    let activeBrand = knownBrands.find(b => text.includes(b)) || "";
    let activeProc = knownProcessors.find(p => text.includes(p)) || "";
    let activeGen = knownGens.find(g => text.includes(g)) || "";
    let activeRam = knownRams.find(r => text.includes(r)) || "";
    let activeHdd = knownHdds.find(h => text.includes(h)) || "";

    // Extract any search term that is NOT in our tags list
    let customText = text;
    [activeBrand, activeProc, activeGen, activeRam, activeHdd].forEach((t) => {
      if (t) {
        customText = customText.replace(t, "").trim();
      }
    });

    // Update the targeted tag slot
    if (group === "brand") {
      activeBrand = isActive ? "" : value.toLowerCase();
    } else if (group === "processor") {
      activeProc = isActive ? "" : value.toLowerCase();
    } else if (group === "generation") {
      activeGen = isActive ? "" : value.toLowerCase();
    } else if (group === "ram") {
      activeRam = isActive ? "" : value.toLowerCase();
    } else if (group === "storage") {
      activeHdd = isActive ? "" : value.toLowerCase();
    }

    // Reconstruct query with custom words + active tags
    const words: string[] = [];
    if (customText) words.push(customText);
    
    if (activeBrand) words.push(activeBrand);
    if (activeProc) words.push(activeProc);
    if (activeGen) words.push(activeGen);
    if (activeRam) words.push(activeRam);
    if (activeHdd) words.push(activeHdd);

    const result = words.join(" ").trim();
    return result || null;
  };

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

  // Build target URL for clean state preservation
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

  // Trigger filter change when clicking "Filter" button
  const applyPriceFilter = () => {
    onFilterChange({
      min_price: minPrice.toString(),
      max_price: maxPrice.toString(),
    });
  };

  // Pre-configured brand items with high resolution official branding logo images
  const brands = [
    {
      name: "Apple",
      slug: "apple",
      tag: "Apple",
      count: counts?.brandCounts?.["apple"] ?? 2,
      imgUrl: "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/apple.webp",
    },
    {
      name: "Dell",
      slug: "dell",
      tag: "Dell",
      count: counts?.brandCounts?.["dell"] ?? 11,
      imgUrl: "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/dell.webp",
    },
    {
      name: "HP",
      slug: "hp",
      tag: "HP",
      count: counts?.brandCounts?.["hp"] ?? 8,
      imgUrl: "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/hp.webp",
    },
    {
      name: "Lenovo",
      slug: "lenovo",
      tag: "Lenovo",
      count: counts?.brandCounts?.["lenovo"] ?? 5,
      imgUrl: "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/lenovo.webp",
    },
    {
      name: "Microsoft",
      slug: "microsoft",
      tag: "Microsoft",
      count: counts?.brandCounts?.["microsoft"] ?? 1,
      imgUrl: "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/microsoft.webp",
    },
  ];

  // Pre-configured processors
  const processors = [
    { label: "Intel® Core™ i3", value: "i3", count: counts?.processorCounts?.["i3"] ?? 4 },
    { label: "Intel® Core™ i5", value: "i5", count: counts?.processorCounts?.["i5"] ?? 19 },
    { label: "Intel® Core™ i7", value: "i7", count: counts?.processorCounts?.["i7"] ?? 2 },
  ];

  // Pre-configured generations
  const generations = [
    { label: "4th Gen", value: "4th gen", count: counts?.genCounts?.["4th gen"] ?? 1 },
    { label: "6th Gen", value: "6th gen", count: counts?.genCounts?.["6th gen"] ?? 9 },
    { label: "7th Gen", value: "7th gen", count: counts?.genCounts?.["7th gen"] ?? 1 },
    { label: "8th Gen", value: "8th gen", count: counts?.genCounts?.["8th gen"] ?? 11 },
    { label: "9th Gen", value: "9th gen", count: counts?.genCounts?.["9th gen"] ?? 1 },
    { label: "10th Gen", value: "10th gen", count: counts?.genCounts?.["10th gen"] ?? 1 },
  ];

  // Pre-configured RAM options
  const ramOptions = [
    { label: "4 GB", value: "4gb", count: counts?.ramCounts?.["4gb"] ?? 3 },
    { label: "8 GB", value: "8gb", count: counts?.ramCounts?.["8gb"] ?? 26 },
    { label: "16 GB", value: "16gb", count: counts?.ramCounts?.["16gb"] ?? 24 },
    { label: "32 GB", value: "32gb", count: counts?.ramCounts?.["32gb"] ?? 3 },
    { label: "64 GB", value: "64gb", count: counts?.ramCounts?.["64gb"] ?? 1 },
  ];

  // Pre-configured Hard Disk Drive / Storage options
  const hddOptions = [
    { label: "500 HDD", value: "500 hdd", count: counts?.storageCounts?.["500 hdd"] ?? 3 },
    { label: "256 SSD", value: "256 ssd", count: counts?.storageCounts?.["256 ssd"] ?? 26 },
    { label: "512 SSD", value: "512 ssd", count: counts?.storageCounts?.["512 ssd"] ?? 24 },
  ];

  // Animation Variant definitions
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
  } as const;

  const springTransition = { type: "spring", stiffness: 400, damping: 25 } as const;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Dynamic Unified Side Filter Card */}
      <div className="bg-white rounded-[24px] p-6 lg:p-7 border border-[#eeeeee] shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_35px_rgb(0,0,0,0.05)] transition-all relative overflow-hidden">
        
        {/* ==================================== PRICE SLIDER Section ==================================== */}
        <motion.div variants={itemVariants}>
          <h3 className="text-[17px] font-semibold text-[#111] mb-5 tracking-tight flex items-center justify-between">
            <span>Filter By Price</span>
            <span className="w-1.5 h-1.5 bg-[#3452ef] rounded-full"></span>
          </h3>

          {/* Double Range Slider UI with Custom Slider Styling */}
          <div className="relative w-full h-8 flex items-center mb-4">
            {/* Background Gray Line */}
            <div className="absolute inset-x-0 h-[4px] bg-slate-100 rounded-full"></div>
            
            {/* Active Blue Line */}
            <div 
              className="absolute h-[4px] bg-gradient-to-r from-[#3452ef] to-blue-500 rounded-full"
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`
              }}
            ></div>

            {/* Range Slides overlapping */}
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

            {/* Custom Knobs with Framer Motion spring updates */}
            <motion.div 
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute w-4 h-4 bg-white border-2 border-[#3452ef] rounded-full -mt-[1px] pointer-events-none shadow-md z-30 flex items-center justify-center after:content-[''] after:w-1 after:h-1 after:bg-[#3452ef] after:rounded-full"
              style={{ left: `calc(${minPercent}% - 8px)` }}
            />
            <motion.div 
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute w-4 h-4 bg-white border-2 border-[#3452ef] rounded-full -mt-[1px] pointer-events-none shadow-md z-30 flex items-center justify-center after:content-[''] after:w-1 after:h-1 after:bg-[#3452ef] after:rounded-full"
              style={{ left: `calc(${maxPercent}% - 8px)` }}
            />
          </div>

          {/* Pricing Text and Modern Hover Filter Trigger Button */}
          <div className="flex items-center justify-between mt-2 pt-0.5">
            <span className="text-[13.5px] text-gray-500 font-medium tracking-tight">
              Price: <span className="text-[#111] font-bold">₹{minPrice.toLocaleString()} — ₹{maxPrice.toLocaleString()}</span>
            </span>
            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={springTransition}
              onClick={applyPriceFilter}
              className="bg-[#f5f5f5] hover:bg-[#3452ef] hover:text-white text-black text-[13px] font-bold px-4.5 py-1.5 rounded-full transition-colors duration-200 focus:outline-none shadow-sm"
            >
              Filter
            </motion.button>
          </div>
        </motion.div>

        {/* Divider 1 */}
        <hr className="border-[#eeeeee] my-6" />

        {/* ==================================== BRANDS SECTION ==================================== */}
        <motion.div variants={itemVariants}>
          <h3 className="text-[17px] font-semibold text-[#111] mb-4.5 tracking-tight flex items-center justify-between">
            <span>Shop By Brand</span>
            <span className="w-1.5 h-1.5 bg-[#3452ef] rounded-full"></span>
          </h3>
          <div className="flex flex-col gap-1.5">
            {brands.map((brand) => {
              const isActive = currentQuery.toLowerCase().includes(brand.slug);
              return (
                <Link
                  key={brand.slug}
                  href={getFilterUrl({ search: getUpdatedSearchQuery("brand", brand.slug, isActive) })}
                  onClick={handleLinkClick({ search: getUpdatedSearchQuery("brand", brand.slug, isActive) })}
                  className="block focus:outline-none"
                >
                  <motion.div
                    whileHover="hover"
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-between p-2.5 rounded-2xl relative overflow-hidden group transition-all duration-300 ${
                      isActive 
                        ? "text-[#3452ef]" 
                        : "text-gray-750 hover:text-gray-900"
                    }`}
                  >
                    {/* Animated Solid Slider Background for active state */}
                    {isActive && (
                      <motion.div 
                        layoutId="brandActiveBg"
                        className="absolute inset-0 bg-blue-50/45 border border-blue-100/50 rounded-2xl -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      />
                    )}
                    {/* Subtle Hover background highlight (only when not active) */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-slate-50/0 group-hover:bg-slate-50/75 rounded-2xl transition-all duration-300 -z-10 border border-transparent group-hover:border-slate-100/50" />
                    )}

                    <div className="flex items-center gap-4">
                      {/* Logo Frame */}
                      <div className={`w-[68px] h-[44px] flex items-center justify-center rounded-xl shrink-0 transition-all duration-500 shadow-[0_2px_6px_rgba(0,0,0,0.01)] group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] relative overflow-hidden p-1.5 bg-white ${
                        isActive 
                          ? "border-[1.5px] border-[#3452ef] ring-4 ring-[#3452ef]/5" 
                          : "border border-slate-200/80"
                      }`}>
                        <motion.div
                          variants={{
                            hover: { scale: 1.06, rotate: 1 }
                          }}
                          transition={{ type: "spring", stiffness: 450, damping: 20 }}
                          className="w-full h-full relative"
                        >
                          <Image
                            src={brand.imgUrl}
                            alt={`${brand.name} Logo`}
                            fill
                            className="object-contain mix-blend-multiply"
                            referrerPolicy="no-referrer"
                          />
                        </motion.div>
                      </div>

                      <div className="flex flex-col">
                        <span className={`text-[15px] font-semibold tracking-tight transition-colors duration-200 ${
                          isActive ? "text-[#3452ef] font-bold" : "text-gray-800"
                        }`}>
                          {brand.name}
                        </span>
                        <span className="text-[11px] text-gray-400 font-medium leading-none mt-0.5">Explore items</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 z-10 shrink-0">
                      <AnimatePresence mode="popLayout" initial={false}>
                        {isActive ? (
                          <motion.div
                            key="active"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            className="w-5 h-5 rounded-full bg-[#3452ef] flex items-center justify-center text-white shadow-md shadow-blue-500/20"
                          >
                            <Check size={11} strokeWidth={3} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="inactive"
                            initial={{ opacity: 0.6 }}
                            animate={{ opacity: 1 }}
                            className="text-[12px] font-bold px-2.5 py-0.5 rounded-full border bg-slate-50 border-slate-100 text-gray-400 group-hover:bg-white group-hover:border-slate-200/80 group-hover:text-gray-600 transition-all duration-300"
                          >
                            {brand.count}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Divider 2 */}
        <hr className="border-[#eeeeee] my-6" />

        {/* ==================================== PROCESSORS SECTION ==================================== */}
        <motion.div variants={itemVariants}>
          <h3 className="text-[17px] font-semibold text-[#111] mb-4.5 tracking-tight flex items-center justify-between">
            <span>Shop By Processor</span>
            <span className="w-1.5 h-1.5 bg-[#3452ef] rounded-full"></span>
          </h3>
          <div className="flex flex-col gap-0.5">
            {processors.map((proc) => {
              const isActive = currentQuery.toLowerCase().includes(proc.value);
              return (
                <Link
                  key={proc.value}
                  href={getFilterUrl({ search: getUpdatedSearchQuery("processor", proc.value, isActive) })}
                  onClick={handleLinkClick({ search: getUpdatedSearchQuery("processor", proc.value, isActive) })}
                  className="block focus:outline-none"
                >
                  <motion.div
                    whileHover={{ x: 4, backgroundColor: "rgba(241, 245, 249, 0.6)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className={`flex items-center justify-between py-2.5 px-3 rounded-xl relative ${
                      isActive 
                        ? "bg-blue-50/50 text-[#3452ef]" 
                        : "text-gray-700"
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="procActiveIndicator"
                        className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-[#3452ef] rounded-r"
                      />
                    )}
                    <span className="text-[14.5px] font-semibold">{proc.label}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      isActive 
                        ? "bg-[#3452ef] text-white border-transparent" 
                        : "bg-slate-50 text-gray-400 border-slate-100"
                    }`}>
                      {proc.count}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Divider 3 */}
        <hr className="border-[#eeeeee] my-6" />

        {/* ==================================== GENERATION SECTION ==================================== */}
        <motion.div variants={itemVariants}>
          <h3 className="text-[17px] font-semibold text-[#111] mb-4.5 tracking-tight flex items-center justify-between">
            <span>Shop By Generation</span>
            <span className="w-1.5 h-1.5 bg-[#3452ef] rounded-full"></span>
          </h3>
          <div className="flex flex-col gap-0.5">
            {generations.map((gen) => {
              const isActive = currentQuery.toLowerCase().includes(gen.value);
              return (
                <Link
                  key={gen.value}
                  href={getFilterUrl({ search: getUpdatedSearchQuery("generation", gen.value, isActive) })}
                  onClick={handleLinkClick({ search: getUpdatedSearchQuery("generation", gen.value, isActive) })}
                  className="block focus:outline-none"
                >
                  <motion.div
                    whileHover={{ x: 4, backgroundColor: "rgba(241, 245, 249, 0.6)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className={`flex items-center justify-between py-2.5 px-3 rounded-xl relative ${
                      isActive 
                        ? "bg-blue-50/50 text-[#3452ef]" 
                        : "text-gray-700"
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="genActiveIndicator"
                        className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-[#3452ef] rounded-r"
                      />
                    )}
                    <span className="text-[14.5px] font-semibold">{gen.label}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      isActive 
                        ? "bg-[#3452ef] text-white border-transparent" 
                        : "bg-slate-50 text-gray-400 border-slate-100"
                    }`}>
                      {gen.count}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Divider 4 */}
        <hr className="border-[#eeeeee] my-6" />

        {/* ==================================== RAM SECTION ==================================== */}
        <motion.div variants={itemVariants}>
          <h3 className="text-[17px] font-semibold text-[#111] mb-4.5 tracking-tight flex items-center justify-between">
            <span>Shop By Ram</span>
            <span className="w-1.5 h-1.5 bg-[#3452ef] rounded-full"></span>
          </h3>
          <div className="flex flex-col gap-0.5">
            {ramOptions.map((ram) => {
              const isActive = currentQuery.toLowerCase().split(/\s+/).includes(ram.value);
              return (
                <Link
                  key={ram.value}
                  href={getFilterUrl({ search: getUpdatedSearchQuery("ram", ram.value, isActive) })}
                  onClick={handleLinkClick({ search: getUpdatedSearchQuery("ram", ram.value, isActive) })}
                  className="block focus:outline-none"
                >
                  <motion.div
                    whileHover={{ x: 4, backgroundColor: "rgba(241, 245, 249, 0.6)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className={`flex items-center justify-between py-2.5 px-3 rounded-xl relative ${
                      isActive 
                        ? "bg-blue-50/50 text-[#3452ef]" 
                        : "text-gray-700"
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="ramActiveIndicator"
                        className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-[#3452ef] rounded-r"
                      />
                    )}
                    <span className="text-[14.5px] font-semibold">{ram.label}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      isActive 
                        ? "bg-[#3452ef] text-white border-transparent" 
                        : "bg-slate-50 text-gray-400 border-slate-100"
                    }`}>
                      {ram.count}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Divider 5 */}
        <hr className="border-[#eeeeee] my-6" />

        {/* ==================================== STORAGE SECTION ==================================== */}
        <motion.div variants={itemVariants}>
          <h3 className="text-[17px] font-semibold text-[#111] mb-4.5 tracking-tight flex items-center justify-between">
            <span>Shop By Hard Disk Drive</span>
            <span className="w-1.5 h-1.5 bg-[#3452ef] rounded-full"></span>
          </h3>
          <div className="flex flex-col gap-0.5">
            {hddOptions.map((storage) => {
              const isActive = currentQuery.toLowerCase().includes(storage.value);
              return (
                <Link
                  key={storage.value}
                  href={getFilterUrl({ search: getUpdatedSearchQuery("storage", storage.value, isActive) })}
                  onClick={handleLinkClick({ search: getUpdatedSearchQuery("storage", storage.value, isActive) })}
                  className="block focus:outline-none"
                >
                  <motion.div
                    whileHover={{ x: 4, backgroundColor: "rgba(241, 245, 249, 0.6)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className={`flex items-center justify-between py-2.5 px-3 rounded-xl relative ${
                      isActive 
                        ? "bg-blue-50/50 text-[#3452ef]" 
                        : "text-gray-700"
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="storageActiveIndicator"
                        className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-[#3452ef] rounded-r"
                      />
                    )}
                    <span className="text-[14.5px] font-semibold">{storage.label}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      isActive 
                        ? "bg-[#3452ef] text-white border-transparent" 
                        : "bg-slate-50 text-gray-400 border-slate-100"
                    }`}>
                      {storage.count}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>



        {/* Clear All Active Filters Button with AnimatePresence support */}
        <AnimatePresence>
          { (currentCategory || currentQuery || currentMinPrice || currentMaxPrice || currentOnSaleOnly) && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 pt-4 border-t border-dashed border-[#eeeeee] overflow-hidden"
            >
              <Link
                href="/shop"
                onClick={handleLinkClick({
                  category: null,
                  search: null,
                  min_price: null,
                  max_price: null,
                  on_sale: null
                })}
                className="block focus:outline-none"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 rounded-xl border border-rose-100 hover:border-rose-200 text-rose-600 hover:bg-rose-50/50 text-[13px] font-bold transition-colors text-center flex items-center justify-center gap-1.5"
                >
                  Reset All Filters
                </motion.div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>



      {/* Trust Assurances badge list item */}
      <motion.div 
        variants={itemVariants}
        className="bg-[#111111] text-white p-6 rounded-[24px] relative overflow-hidden shadow-md group hover:shadow-xl transition-shadow duration-300"
      >
        <div className="absolute right-[-20px] bottom-[-20px] w-24 h-24 bg-white/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#fcb643] mb-4 stroke-current fill-none group-hover:rotate-12 transition-transform duration-300" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
        <h4 className="text-[15px] font-bold text-white tracking-wide uppercase">COMSRI CERTIFIED</h4>
        <p className="text-[12px] text-gray-400 mt-2 leading-relaxed">
          Every desktop and laptop undergoes a strict 40-point hardware diagnostic test and includes a 1-year product warranty coverage support.
        </p>
      </motion.div>
    </motion.div>
  );
}
