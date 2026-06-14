"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Search, ChevronDown, Shuffle, Heart, ShoppingCart, Apple, Menu, X, Home, Info, ShoppingBag, Package, User, Laptop, Monitor, Layers, Cpu, Sparkles, ArrowRight, Tag, Percent } from "lucide-react";
import { useCart } from "@/context/CartContext";

function HeaderSearchForm() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";
  const currentMinPrice = searchParams.get("min_price") || "";
  const currentMaxPrice = searchParams.get("max_price") || "";
  const currentOnSaleOnly = searchParams.get("on_sale") === "true";
  const currentSorting = searchParams.get("orderby") || "date";
  const currentQuery = searchParams.get("search") || "";

  const [query, setQuery] = useState(currentQuery);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Sync query when searchParams change
  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("search", query);
        params.set("per_page", "6");
        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Click outside helper
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".search-container-desktop")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative search-container-desktop w-full">
      <form className="relative" action="/shop" onSubmit={() => setIsOpen(false)} method="GET">
        {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
        {currentMinPrice && <input type="hidden" name="min_price" value={currentMinPrice} />}
        {currentMaxPrice && <input type="hidden" name="max_price" value={currentMaxPrice} />}
        {currentOnSaleOnly && <input type="hidden" name="on_sale" value="true" />}
        {currentSorting !== "date" && <input type="hidden" name="orderby" value={currentSorting} />}

        <input
          type="text"
          name="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for products"
          className="w-full h-[46px] pl-6 pr-14 text-sm text-gray-700 border border-gray-200 rounded-full focus:outline-none focus:border-gray-300"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-1 top-1 bottom-1 w-[38px] h-[38px] bg-[#374bf9] rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
        >
          <Search size={18} />
        </button>
      </form>

      {isOpen && query.trim() !== "" && (
        <div className="absolute top-[52px] left-0 right-0 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden max-h-[380px] overflow-y-auto divide-y divide-gray-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {loading ? (
            <div className="p-4 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-indigo-650 border-t-transparent rounded-full animate-spin" />
              Searching catalog...
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((p) => {
                const img = p.images?.[0]?.src || "https://picsum.photos/seed/placeholder/80/80";
                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="relative w-12 h-12 rounded-lg bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                      <img src={img} alt={p.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{p.name}</h4>
                      <p className="text-[10px] text-slate-600 font-medium mt-0.5">{p.categories?.[0]?.name || "Catalog"}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {p.on_sale && p.sale_price ? (
                        <>
                          <div className="text-xs font-extrabold text-[#374bf9]">₹{p.sale_price}</div>
                          <div className="text-[10px] text-slate-600 line-through">₹{p.regular_price}</div>
                        </>
                      ) : (
                        <div className="text-xs font-extrabold text-slate-800">₹{p.price || "Check Price"}</div>
                      )}
                    </div>
                  </Link>
                );
              })}
              <div className="p-2.5 bg-slate-50 text-center border-t border-gray-100">
                <Link
                  href={`/shop?search=${encodeURIComponent(query)}`}
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-bold text-[#374bf9] hover:underline"
                >
                  View all results for &quot;{query}&quot;
                </Link>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-xs text-gray-400">
              No products found matching &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MobileSearchForm() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";
  const currentMinPrice = searchParams.get("min_price") || "";
  const currentMaxPrice = searchParams.get("max_price") || "";
  const currentOnSaleOnly = searchParams.get("on_sale") === "true";
  const currentSorting = searchParams.get("orderby") || "date";
  const currentQuery = searchParams.get("search") || "";

  const [query, setQuery] = useState(currentQuery);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Sync query when searchParams change
  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("search", query);
        params.set("per_page", "5");
        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Click outside helper
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".search-container-mobile")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative search-container-mobile w-full">
      <form className="relative w-full" action="/shop" onSubmit={() => setIsOpen(false)} method="GET">
        {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
        {currentMinPrice && <input type="hidden" name="min_price" value={currentMinPrice} />}
        {currentMaxPrice && <input type="hidden" name="max_price" value={currentMaxPrice} />}
        {currentOnSaleOnly && <input type="hidden" name="on_sale" value="true" />}
        {currentSorting !== "date" && <input type="hidden" name="orderby" value={currentSorting} />}

        <input
          type="text"
          name="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for products"
          className="w-full h-11 pl-6 pr-14 text-[14.5px] font-medium text-gray-700 bg-white rounded-full focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-1 top-[4px] w-9 h-9 bg-[#374bf9] rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
        >
          <Search size={16} />
        </button>
      </form>

      {isOpen && query.trim() !== "" && (
        <div className="absolute top-[48px] left-0 right-0 bg-white border border-gray-150 rounded-2xl shadow-xl z-50 overflow-hidden max-h-[300px] overflow-y-auto divide-y divide-gray-50 animate-in fade-in slide-in-from-top-1 duration-200">
          {loading ? (
            <div className="p-3.5 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-indigo-650 border-t-transparent rounded-full animate-spin" />
              Searching catalog...
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((p) => {
                const img = p.images?.[0]?.src || "https://picsum.photos/seed/placeholder/80/80";
                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3.5 p-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="relative w-10 h-10 rounded-lg bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                      <img src={img} alt={p.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{p.name}</h4>
                      <p className="text-[9.5px] text-slate-600 font-semibold mt-0.5">{p.categories?.[0]?.name || "Catalog"}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {p.on_sale && p.sale_price ? (
                        <>
                          <div className="text-xs font-black text-[#374bf9]">₹{p.sale_price}</div>
                          <div className="text-[9px] text-slate-600 line-through">₹{p.regular_price}</div>
                        </>
                      ) : (
                        <div className="text-xs font-black text-slate-800">₹{p.price || "Check"}</div>
                      )}
                    </div>
                  </Link>
                );
              })}
              <div className="p-2.5 bg-slate-50 text-center border-t border-gray-100">
                <Link
                  href={`/shop?search=${encodeURIComponent(query)}`}
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-bold text-[#374bf9] hover:underline"
                >
                  View all results
                </Link>
              </div>
            </>
          ) : (
            <div className="p-3 text-center text-xs text-gray-400">
              No products discovered
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* Accordion item for mobile drawer */
function MobileAccordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 px-5 text-[15px] font-semibold text-gray-900"
      >
        <span>{title}</span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[600px] pb-3" : "max-h-0"}`}>
        {children}
      </div>
    </div>
  );
}

export default function Header() {
  const { getCartCount, getCartTotal } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Low-end device optimization state
  const [isLowEnd, setIsLowEnd] = useState(false);

  // Hardware specs and network quality check on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect the OS-level reduced-motion accessibility preference
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Hardware and network checks temporarily bypassed to allow hover animations on standard laptops
    if (prefersReducedMotion) {
      setTimeout(() => {
        setIsLowEnd(true);
      }, 0);
      console.log("[Perf] Reduced-motion detected. Enabled 60 FPS optimizations.");
    }
  }, []);

  // Toggle the global `.low-end-device` class on <html> so the CSS
  // fallbacks in globals.css apply site-wide (not just the mega menu).
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("low-end-device", isLowEnd);
  }, [isLowEnd]);

  // Dynamic frame-time performance tracker during hover transition
  const frameTimesRef = useRef<number[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const isTrackingRef = useRef(false);

  const handleMouseEnter = () => {
    if (isLowEnd || isTrackingRef.current) return;

    isTrackingRef.current = true;
    frameTimesRef.current = [];

    // Pure setup: initialize timing variables to null. They will be populated
    // by the browser's high-res timestamp passed to requestAnimationFrame.
    let lastTime: number | null = null;
    let startTime: number | null = null;

    const trackFrames = (now: number) => {
      if (startTime === null) startTime = now;
      if (lastTime === null) {
        lastTime = now;
        animationFrameIdRef.current = requestAnimationFrame(trackFrames);
        return;
      }

      const delta = now - lastTime;
      lastTime = now;

      frameTimesRef.current.push(delta);

      // Track frames for 400ms (covers the 300ms hover transition plus buffer)
      if (now - startTime < 400) {
        animationFrameIdRef.current = requestAnimationFrame(trackFrames);
      } else {
        analyzePerformance();
      }
    };

    animationFrameIdRef.current = requestAnimationFrame(trackFrames);
  };

  const handleMouseLeave = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    isTrackingRef.current = false;
  };

  const analyzePerformance = () => {
    const times = frameTimesRef.current;
    if (times.length < 5) return;

    // Check if any frames lagged significantly (>24ms budget, i.e. < 40fps)
    // or if the average frame duration is above 18ms (i.e. < 55fps average)
    const laggyFrames = times.filter(t => t > 24).length;
    const avgTime = times.reduce((sum, val) => sum + val, 0) / times.length;

    if (laggyFrames > 1 || avgTime > 18) {
      console.warn(`[MegaMenu] Performance stutter detected (Avg frame: ${avgTime.toFixed(1)}ms, Laggy frames: ${laggyFrames}). Enabling dynamic 60 FPS fallback styling.`);
      setTimeout(() => {
        setIsLowEnd(true);
      }, 0);
    }
    isTrackingRef.current = false;
  };

  useEffect(() => {
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn") === "true";
    if (logged) {
      const email = localStorage.getItem("userEmail") || "User";
      setIsLoggedIn(true);
      setUserEmail(email);
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* -------------------- DESKTOP HEADER -------------------- */}
      <header className="hidden lg:block bg-white py-3 md:py-4 border-b border-gray-100" id="shop-header">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between w-full gap-3">
          {/* Logo element */}
          <Link href="/" className="flex-shrink-0 flex items-center cursor-pointer">
            <Image
              src="https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/Comsri-Logo.png"
              alt="Comsri Corporation Logo"
              width={177}
              height={52}
              priority
              className="h-[52px] w-auto object-contain"
            />
          </Link>

          {/* Search bar inside header */}
          <div className="flex-1 max-w-2xl mx-12">
            <Suspense fallback={
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products"
                  className="w-full h-[46px] pl-6 pr-14 text-sm text-gray-700 border border-gray-200 rounded-full focus:outline-none focus:border-gray-300"
                  disabled
                />
                <div className="absolute right-1 top-1 bottom-1 w-[38px] h-[38px] bg-[#374bf9] rounded-full flex items-center justify-center text-white">
                  <Search size={18} />
                </div>
              </div>
            }>
              <HeaderSearchForm />
            </Suspense>
          </div>

          {/* Right Actions — desktop */}
          <div className="flex items-center gap-x-6 text-sm font-medium text-gray-800">
            <div className="flex items-center gap-2 cursor-pointer border-r border-gray-350 pr-6 h-5">
              <img
                loading="lazy"
                src="https://comsri.com/wp-content/uploads/2025/10/indian-flag-1-1.jpg"
                alt="IND"
                className="w-5 h-[13px] object-cover rounded-[1px]"
              />
              <span>IND</span>
            </div>
            {isLoggedIn ? (
              <div className="flex items-center gap-3 animate-fade-in">
                <Link href="/dashboard" className="text-slate-700 hover:text-[#374bf9] font-bold max-w-[140px] truncate select-none flex items-center gap-1.5 transition-colors">
                  <User size={16} className="text-slate-650" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("userEmail");
                    setIsLoggedIn(false);
                    window.location.href = "/";
                  }}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-full font-bold transition-all active:scale-95 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="hover:text-[#374bf9] font-bold transition-colors">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* -------------------- MOBILE HEADER (Matches Mockup Exactly) -------------------- */}
      <header className="lg:hidden w-full flex flex-col bg-white border-b border-gray-100" id="shop-header-mobile">
        {/* Upper Row: Hamburger, Centered Logo, Profile */}
        <div className="flex items-center justify-between px-4 py-2 w-full">
          {/* Left: Hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-50 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} className="text-gray-800" />
          </button>

          {/* Center: Centered Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center justify-center">
            <Image
              src="https://comsri.com/wp-content/uploads/2025/10/Comsri-Logo-2-1.png"
              alt="Comsri Corporation Logo"
              width={116}
              height={34}
              priority
              className="h-[34px] w-auto object-contain"
            />
          </Link>

          {/* Right: Profile User Icon */}
          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-50 transition-colors"
            aria-label={isLoggedIn ? "My Dashboard" : "Login or Register"}
          >
            <User size={24} className={isLoggedIn ? "text-[#374bf9]" : "text-gray-800"} />
          </Link>
        </div>

        {/* Lower Row: Search Bar (Gold Background #faba5b) */}
        <div className="w-full bg-[#faba5b] px-4 py-2.5 shadow-inner">
          <Suspense fallback={
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products"
                className="w-full h-11 pl-6 pr-14 text-sm text-gray-700 bg-white rounded-full focus:outline-none"
                disabled
              />
              <div className="absolute right-1 top-1 bottom-1 w-9 h-9 bg-[#374bf9] rounded-full flex items-center justify-center text-white">
                <Search size={16} />
              </div>
            </div>
          }>
            <MobileSearchForm />
          </Suspense>
        </div>
      </header>

      {/* -------------------- DESKTOP NAVIGATION BAR -------------------- */}
      <nav className="hidden lg:block bg-[#faba5b] py-3 text-[14px] font-medium text-black relative">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between w-full gap-x-6">

          {/* Left navigation links */}
          <ul className="flex flex-wrap items-center gap-y-2 gap-x-6">
            <li>
              <Link href="/" className={`transition ${pathname === "/" ? "text-[#121e42] font-medium" : "hover:text-[#3452ef]"}`}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className={`transition ${pathname === "/about" ? "text-[#121e42] font-medium" : "hover:text-[#3452ef]"}`}>
                About Us
              </Link>
            </li>
            <li
              className="group flex items-center gap-1 cursor-pointer hover:text-[#121e42] transition-all py-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/shop" className={`flex items-center gap-1 ${pathname === "/shop" ? "text-[#121e42] font-medium" : "hover:text-[#3452ef]"}`}>
                <span>Refurbished Products</span>
                <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
              </Link>

              {/* Mega Menu Dropdown */}
              <div className={`absolute top-full left-0 right-0 w-full mega-menu-dropdown bg-white border-t border-gray-100 py-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50 text-gray-800 font-normal shadow-xl`}>
                <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
                  {/* 4 Column Category Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6 pb-6">

                    {/* Column 1: Refurbished Laptops */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 rounded-lg bg-blue-50 text-[#374bf9]">
                          <Laptop size={16} />
                        </div>
                        <Link href="/categories/buy-refurbished-laptops-online-in-india" prefetch={false} className="text-gray-900 font-medium text-[15px] hover:text-[#374bf9] transition-colors">
                          Refurbished Laptops
                        </Link>
                      </div>
                      <ul className="flex flex-col gap-[12px] text-gray-500 text-[13px] pl-8">
                        <li>
                          <Link href="/shop?category=112&search=Dell" prefetch={false} className="mega-menu-link-hover flex flex-col">
                            <span className="font-semibold text-gray-850">Dell Laptops</span>
                            <span className="text-[11px] text-gray-600 font-medium">Business-grade Latitude series</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/shop?category=112&search=HP" prefetch={false} className="mega-menu-link-hover flex flex-col">
                            <span className="font-semibold text-gray-850">HP Laptops</span>
                            <span className="text-[11px] text-gray-600 font-medium">Premium EliteBooks & ProBooks</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/shop?category=112&search=Lenovo" prefetch={false} className="mega-menu-link-hover flex flex-col">
                            <span className="font-semibold text-gray-850">Lenovo ThinkPad</span>
                            <span className="text-[11px] text-gray-600 font-medium">Legendary durability & keyboards</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/shop?category=112&search=Apple" prefetch={false} className="mega-menu-link-hover flex flex-col">
                            <span className="font-semibold text-gray-850">Apple MacBooks</span>
                            <span className="text-[11px] text-gray-600 font-medium">Sleek, powerful Air & Pro models</span>
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Column 2: Refurbished Desktops */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                          <Monitor size={16} />
                        </div>
                        <Link href="/categories/buy-high-quality-refurbished-desktops" prefetch={false} className="text-gray-900 font-medium text-[15px] hover:text-[#374bf9] transition-colors">
                          Refurbished Desktops
                        </Link>
                      </div>
                      <ul className="flex flex-col gap-[12px] text-gray-500 text-[13px] pl-8">
                        <li>
                          <Link href="/shop?category=129&search=Dell" prefetch={false} className="mega-menu-link-hover flex flex-col">
                            <span className="font-semibold text-gray-850">Dell Desktops</span>
                            <span className="text-[11px] text-gray-600 font-medium">Standard enterprise micro & SFF</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/shop?category=129&search=HP" prefetch={false} className="mega-menu-link-hover flex flex-col">
                            <span className="font-semibold text-gray-850">HP Desktops</span>
                            <span className="text-[11px] text-gray-600 font-medium">Highly reliable office towers</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/shop?category=129&search=Lenovo" prefetch={false} className="mega-menu-link-hover flex flex-col">
                            <span className="font-semibold text-gray-850">Lenovo Desktops</span>
                            <span className="text-[11px] text-gray-600 font-medium">Compact, efficient workstations</span>
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Column 3: Workstations */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 rounded-lg bg-indigo-50 text-[#374bf9]">
                          <Layers size={16} />
                        </div>
                        <Link href="/categories/buy-refurbished-workstations-online-in-india" prefetch={false} className="text-gray-900 font-medium text-[15px] hover:text-[#374bf9] transition-colors">
                          Refurbished Workstations
                        </Link>
                      </div>
                      <ul className="flex flex-col gap-[12px] text-gray-500 text-[13px] pl-8">
                        <li>
                          <Link href="/shop?category=139&search=Dell" prefetch={false} className="mega-menu-link-hover flex flex-col">
                            <span className="font-semibold text-gray-850">Dell Workstations</span>
                            <span className="text-[11px] text-gray-600 font-medium">Precision & Power</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/shop?category=139&search=HP" prefetch={false} className="mega-menu-link-hover flex flex-col">
                            <span className="font-semibold text-gray-850">HP Workstations</span>
                            <span className="text-[11px] text-gray-600 font-medium">ZBook & Z-series towers</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/shop?category=139&search=Lenovo" prefetch={false} className="mega-menu-link-hover flex flex-col">
                            <span className="font-semibold text-gray-850">Lenovo Workstations</span>
                            <span className="text-[11px] text-gray-600 font-medium">ThinkStation series</span>
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Column 4: Mini PCs */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 rounded-lg bg-amber-50 text-[#fca61f]">
                          <Cpu size={16} />
                        </div>
                        <Link href="/categories/buy-refurbished-mini-pcs-online-in-india" prefetch={false} className="text-gray-900 font-medium text-[15px] hover:text-[#374bf9] transition-colors">
                          Refurbished Mini PCs
                        </Link>
                      </div>
                      <ul className="flex flex-col gap-[12px] text-gray-500 text-[13px] pl-8">
                        <li>
                          <Link href="/shop?category=137&search=Dell" prefetch={false} className="mega-menu-link-hover flex flex-col">
                            <span className="font-semibold text-gray-850">Dell Mini PCs</span>
                            <span className="text-[11px] text-gray-600 font-medium">Ultra-compact systems</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/shop?category=137&search=HP" prefetch={false} className="mega-menu-link-hover flex flex-col">
                            <span className="font-semibold text-gray-850">HP Mini PCs</span>
                            <span className="text-[11px] text-gray-600 font-medium">Ultra-compact systems</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/shop?category=137&search=Lenovo" prefetch={false} className="mega-menu-link-hover flex flex-col">
                            <span className="font-semibold text-gray-850">Lenovo Mini PCs</span>
                            <span className="text-[11px] text-gray-600 font-medium">Ultra-compact systems</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/shop?category=137&search=Apple" prefetch={false} className="mega-menu-link-hover flex flex-col">
                            <span className="font-semibold text-gray-850">Apple Mac Mini</span>
                            <span className="text-[11px] text-gray-600 font-medium">Compact M1/Intel computing</span>
                          </Link>
                        </li>
                      </ul>
                    </div>

                  </div>

                  {/* Shop By Brands Section */}
                  <div className="border-t border-gray-100/80 pt-6 mt-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between px-2">
                      <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        Shop By Trusted Brands
                      </h5>
                      <Link href="/shop" prefetch={false} className="text-[12px] text-[#374bf9] font-bold hover:underline flex items-center gap-1 cursor-pointer">
                        All Brands <ArrowRight size={12} />
                      </Link>
                    </div>

                    <div className="grid grid-cols-5 gap-4 w-full">
                      {/* Brand Card: Apple */}
                      <Link href="/shop?search=Apple" prefetch={false} className="brand-card-hover flex items-center justify-center bg-[#fff]/50 border border-gray-200/80 rounded-xl h-[70px] p-3.5 transition-[border-color,background-color,box-shadow] duration-200 hover:bg-white hover:shadow-md hover:border-black group/brand">
                        <Image
                          src="/brands/apple.webp"
                          alt="Apple"
                          width={100}
                          height={50}
                          className="brand-img-hover h-[50px] w-auto object-contain transition-[opacity,transform] duration-200 opacity-80 group-hover/brand:opacity-100 group-hover/brand:scale-105"
                        />
                      </Link>

                      {/* Brand Card: Dell */}
                      <Link href="/shop?search=Dell" prefetch={false} className="brand-card-hover flex items-center justify-center bg-[#fff]/50 border border-gray-200/80 rounded-xl h-[70px] p-3.5 transition-[border-color,background-color,box-shadow] duration-200 hover:bg-white hover:shadow-md hover:border-[#007dbd] group/brand">
                        <Image
                          src="/brands/dell.webp"
                          alt="Dell"
                          width={100}
                          height={50}
                          className="brand-img-hover h-[50px] w-auto object-contain transition-[opacity,transform] duration-200 opacity-80 group-hover/brand:opacity-100 group-hover/brand:scale-105"
                        />
                      </Link>

                      {/* Brand Card: HP */}
                      <Link href="/shop?search=HP" prefetch={false} className="brand-card-hover flex items-center justify-center bg-[#fff]/50 border border-gray-200/80 rounded-xl h-[70px] p-3.5 transition-[border-color,background-color,box-shadow] duration-200 hover:bg-white hover:shadow-md hover:border-[#005B94] group/brand">
                        <Image
                          src="/brands/hp.webp"
                          alt="HP"
                          width={100}
                          height={50}
                          className="brand-img-hover h-[50px] w-auto object-contain transition-[opacity,transform] duration-200 opacity-80 group-hover/brand:opacity-100 group-hover/brand:scale-105"
                        />
                      </Link>

                      {/* Brand Card: Lenovo */}
                      <Link href="/shop?search=Lenovo" prefetch={false} className="brand-card-hover flex items-center justify-center bg-[#fff]/50 border border-gray-200/80 rounded-xl h-[70px] p-3.5 transition-[border-color,background-color,box-shadow] duration-200 hover:bg-white hover:shadow-md hover:border-[#E21B22] group/brand">
                        <Image
                          src="/brands/lenovo.webp"
                          alt="Lenovo"
                          width={100}
                          height={50}
                          className="brand-img-hover h-[50px] w-auto object-contain transition-[opacity,transform] duration-200 opacity-80 group-hover/brand:opacity-100 group-hover/brand:scale-105"
                        />
                      </Link>

                      {/* Brand Card: Microsoft */}
                      <Link href="/shop?search=Microsoft" prefetch={false} className="brand-card-hover flex items-center justify-center bg-[#fff]/50 border border-gray-200/80 rounded-xl h-[70px] p-3.5 transition-[border-color,background-color,box-shadow] duration-200 hover:bg-white hover:shadow-md hover:border-[#00a1f1] group/brand">
                        <Image
                          src="/brands/microsoft.webp"
                          alt="Microsoft"
                          width={100}
                          height={50}
                          className="brand-img-hover h-[50px] w-auto object-contain transition-[opacity,transform] duration-200 opacity-80 group-hover/brand:opacity-100 group-hover/brand:scale-105"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <Link href="/bulk-orders" className={`transition ${pathname === "/bulk-orders" ? "text-[#121e42] font-medium" : "hover:text-[#3452ef]"}`}>
                Bulk Orders
              </Link>
            </li>
            <li>
              <Link href="/blog" className={`transition ${pathname === "/blog" ? "text-[#121e42] font-medium" : "hover:text-[#3452ef]"}`}>
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#3452ef] transition">
                Contact Us
              </Link>
            </li>
          </ul>

          {/* Right navigation links and utility icons */}
          <div className="flex items-center gap-x-6 shrink-0">
            <ul className="flex items-center gap-x-6">
              <li className="relative group flex items-center gap-1 cursor-pointer hover:text-[#3452ef] transition-all py-2">
                <span>Policies</span>
                <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />

                {/* Elegant Dropdown aligned to the right edge */}
                <div className="absolute top-[85%] right-0 mt-2 w-64 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 py-3 hidden group-hover:flex flex-col text-sm text-gray-800 z-50 font-normal">
                  <Link href="/terms-conditions?tab=terms" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-medium transition-colors flex items-center justify-between">
                    <span>Terms & Conditions</span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded-full">v3.5</span>
                  </Link>
                  <Link href="/privacy-policy?tab=privacy" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-medium transition-colors flex items-center justify-between">
                    <span>Privacy Policy</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-full">Secure</span>
                  </Link>
                  <Link href="/return-refund?tab=refund" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-medium transition-colors flex items-center justify-between">
                    <span>Return & Refund Policy</span>
                    <span className="text-[10px] bg-rose-50 text-rose-700 font-medium px-2 py-0.5 rounded-full">100%</span>
                  </Link>
                  <Link href="/privacy-policy?tab=warranty" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-medium transition-colors flex items-center justify-between">
                    <span>Warranty Policy</span>
                    <span className="text-[10px] bg-amber-50 text-amber-700 font-medium px-2 py-0.5 rounded-full">1 Year</span>
                  </Link>
                  <Link href="/privacy-policy?tab=shipping" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-medium transition-colors flex items-center justify-between">
                    <span>Shipping Policy</span>
                    <span className="text-[10px] bg-cyan-50 text-cyan-700 font-medium px-2 py-0.5 rounded-full">Insured</span>
                  </Link>
                </div>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#3452ef] transition">
                  FAQs
                </Link>
              </li>
            </ul>

            <div className="flex items-center gap-x-5 pl-5 border-l border-black/10">
              <button className="flex items-center gap-1.5 hover:text-[#3452ef] transition">
                <Shuffle size={18} />
                <span className="font-semibold">0</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-[#3452ef] transition">
                <Heart size={18} />
                <span className="font-semibold">0</span>
              </button>

              <Link href="/cart" className="bg-[#374bf9] text-white rounded-full flex items-center px-4 py-2 gap-x-2 relative hover:bg-blue-700 transition-colors ml-2 shadow-sm border border-transparent">
                <ShoppingCart size={18} />
                <span className="font-semibold tracking-wide">₹{getCartTotal().toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                <span className="absolute -top-1.5 -right-1.5 bg-white text-[#374bf9] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-gray-200">
                  {getCartCount()}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ================== MOBILE DRAWER ================== */}
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 lg:hidden ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Slide-in drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[360px] bg-white z-[110] shadow-2xl transform transition-transform duration-300 ease-out lg:hidden flex flex-col ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            <Image
              src="https://comsri.com/wp-content/uploads/2025/10/Comsri-Logo-2-1.png"
              alt="Comsri Corporation Logo"
              width={109}
              height={32}
              className="h-[32px] w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            aria-label="Close menu"
          >
            <X size={22} className="text-gray-700" />
          </button>
        </div>

        {/* Search bar in drawer */}
        <div className="px-5 py-3 border-b border-gray-100">
          <Suspense fallback={
            <div className="relative">
              <input type="text" placeholder="Search for products" className="w-full h-[42px] pl-5 pr-12 text-sm text-gray-700 border border-gray-200 rounded-full focus:outline-none" disabled />
              <div className="absolute right-1 top-1 bottom-1 w-[34px] h-[34px] bg-[#374bf9] rounded-full flex items-center justify-center text-white">
                <Search size={16} />
              </div>
            </div>
          }>
            <HeaderSearchForm />
          </Suspense>
        </div>

        {/* Scrollable nav links */}
        <div className="flex-1 overflow-y-auto">
          {/* Simple links */}
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-5 py-3.5 text-[15px] font-semibold text-gray-900 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            Home
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block px-5 py-3.5 text-[15px] font-semibold text-gray-900 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            About Us
          </Link>

          {/* Refurbished Products Accordion */}
          <MobileAccordion title="Refurbished Products">
            <div className="px-5 space-y-1">
              <p className="text-[13px] font-bold text-[#374bf9] mb-1.5 mt-1">Laptops</p>
              {["Dell Laptops", "HP Laptops", "Lenovo Laptops", "Microsoft Laptops", "Apple Macbook"].map((item, i) => (
                <Link key={i} href={`/shop?category=112&search=${item.split(" ")[0]}`} onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-[13.5px] text-gray-600 hover:text-[#374bf9] transition-colors">
                  {item}
                </Link>
              ))}
              <p className="text-[13px] font-bold text-[#374bf9] mb-1.5 mt-3">Desktops</p>
              {["Dell Desktops", "HP Desktops", "Lenovo Desktops"].map((item, i) => (
                <Link key={i} href={`/shop?category=129&search=${item.split(" ")[0]}`} onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-[13.5px] text-gray-600 hover:text-[#374bf9] transition-colors">
                  {item}
                </Link>
              ))}
              <p className="text-[13px] font-bold text-[#374bf9] mb-1.5 mt-3">Workstations</p>
              {["Dell Workstations", "HP Workstations", "Lenovo Workstations"].map((item, i) => (
                <Link key={i} href={`/shop?category=139&search=${item.split(" ")[0]}`} onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-[13.5px] text-gray-600 hover:text-[#374bf9] transition-colors">
                  {item}
                </Link>
              ))}
              <p className="text-[13px] font-bold text-[#374bf9] mb-1.5 mt-3">Mini PCs</p>
              {["Dell Mini PCs", "HP Mini PCs", "Lenovo Mini PCs", "Apple Mini PCs"].map((item, i) => (
                <Link key={i} href={`/shop?category=137&search=${item.split(" ")[0]}`} onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-[13.5px] text-gray-600 hover:text-[#374bf9] transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </MobileAccordion>



          <Link href="/bulk-orders" onClick={() => setMobileMenuOpen(false)} className="block px-5 py-3.5 text-[15px] font-semibold text-gray-900 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            Bulk Orders
          </Link>
          <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block px-5 py-3.5 text-[15px] font-semibold text-gray-900 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            Blog
          </Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-5 py-3.5 text-[15px] font-semibold text-gray-900 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            Contact Us
          </Link>

          {/* Policies Accordion */}
          <MobileAccordion title="Policies">
            <div className="px-5 space-y-1">
              <Link href="/terms-conditions?tab=terms" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[13.5px] text-gray-600 hover:text-[#374bf9] transition-colors font-medium">
                Terms & Conditions
              </Link>
              <Link href="/privacy-policy?tab=privacy" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[13.5px] text-gray-600 hover:text-[#374bf9] transition-colors font-medium">
                Privacy Policy
              </Link>
              <Link href="/return-refund?tab=refund" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[13.5px] text-gray-600 hover:text-[#374bf9] transition-colors font-medium">
                Return & Refund Policy
              </Link>
              <Link href="/privacy-policy?tab=warranty" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[13.5px] text-gray-600 hover:text-[#374bf9] transition-colors font-medium">
                Warranty Policy
              </Link>
              <Link href="/privacy-policy?tab=shipping" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[13.5px] text-gray-600 hover:text-[#374bf9] transition-colors font-medium">
                Shipping Policy
              </Link>
            </div>
          </MobileAccordion>

          <Link href="/faq" onClick={() => setMobileMenuOpen(false)} className="block px-5 py-3.5 text-[15px] font-semibold text-gray-900 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            FAQs
          </Link>
        </div>

        {/* Drawer Footer: Login + Utility Icons */}
        <div className="border-t border-gray-200 px-5 py-4 bg-gray-50">
          {/* Utility Icons */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-gray-700">
                <Shuffle size={18} />
                <span className="text-[13px] font-semibold">0</span>
              </button>
              <button className="flex items-center gap-1.5 text-gray-700">
                <Heart size={18} />
                <span className="text-[13px] font-semibold">0</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <img loading="lazy" src="https://comsri.com/wp-content/uploads/2025/10/indian-flag-1-1.jpg" alt="IND" className="w-5 h-[13px] object-cover rounded-[1px]" />
              <span className="text-[13px] font-medium text-gray-700">IND</span>
            </div>
          </div>
          {/* Login / Logout */}
          {isLoggedIn ? (
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-gray-700 font-semibold truncate max-w-[180px]">
                Hello, {userEmail.split("@")[0]}!
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem("isLoggedIn");
                  localStorage.removeItem("userEmail");
                  setIsLoggedIn(false);
                  setMobileMenuOpen(false);
                }}
                className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3.5 py-1.5 rounded-full font-bold transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center bg-[#374bf9] text-white py-2.5 rounded-full text-[14px] font-semibold hover:bg-blue-700 transition-colors"
            >
              Login / Register
            </Link>
          )}
        </div>
      </div>

      {/* ================== MOBILE BOTTOM NAVIGATION ================== */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[90] lg:hidden bg-[#2b3fe6] border border-[#2539db] shadow-[0_8px_35px_rgba(55,75,249,0.35)] px-3 py-1.5 w-[92%] max-w-[420px] rounded-full">
        <div className="flex items-center justify-around h-11 w-full mx-auto">
          {/* Home Tab */}
          <Link
            href="/"
            aria-label="Home"
            className={`flex items-center gap-2 rounded-full transition-all duration-300 ${pathname === "/"
              ? "bg-[#faba5b] text-black px-4 py-2"
              : "text-white/80 hover:text-white p-2"
              }`}
          >
            <Home size={20} className="stroke-[2.5]" />
            {pathname === "/" && (
              <span className="text-[13px] font-bold tracking-wide">Home</span>
            )}
          </Link>

          {/* About Us Tab */}
          <Link
            href="/about"
            aria-label="About Us"
            className={`flex items-center gap-2 rounded-full transition-all duration-300 ${pathname === "/about"
              ? "bg-[#faba5b] text-black px-4 py-2"
              : "text-white/80 hover:text-white p-2"
              }`}
          >
            <Info size={20} className="stroke-[2.5]" />
            {pathname === "/about" && (
              <span className="text-[13px] font-bold tracking-wide">About</span>
            )}
          </Link>

          {/* Shop Tab */}
          <Link
            href="/shop"
            aria-label="Shop Catalog"
            className={`flex items-center gap-2 rounded-full transition-all duration-300 ${pathname === "/shop"
              ? "bg-[#faba5b] text-black px-4 py-2"
              : "text-white/80 hover:text-white p-2"
              }`}
          >
            <ShoppingBag size={20} className="stroke-[2.5]" />
            {pathname === "/shop" && (
              <span className="text-[13px] font-bold tracking-wide">Shop</span>
            )}
          </Link>

          {/* Bulk Orders Tab */}
          <Link
            href="/bulk-orders"
            aria-label="Bulk Orders"
            className={`flex items-center gap-2 rounded-full transition-all duration-300 ${pathname === "/bulk-orders"
              ? "bg-[#faba5b] text-black px-4 py-2"
              : "text-white/80 hover:text-white p-2"
              }`}
          >
            <Package size={20} className="stroke-[2.5]" />
            {pathname === "/bulk-orders" && (
              <span className="text-[13px] font-bold tracking-wide">Bulk</span>
            )}
          </Link>

          {/* Cart Tab */}
          <Link
            href="/cart"
            aria-label="Shopping Cart"
            className={`flex items-center gap-2 rounded-full transition-all duration-300 ${pathname === "/cart"
              ? "bg-[#faba5b] text-black px-4 py-2"
              : "text-white/80 hover:text-white p-2"
              }`}
          >
            <div className="relative">
              <ShoppingCart size={20} className="stroke-[2.5]" />
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {getCartCount()}
              </span>
            </div>
            {pathname === "/cart" && (
              <span className="text-[13px] font-bold tracking-wide">Cart</span>
            )}
          </Link>
        </div>
      </div>
    </>
  );
}
