"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Search, ChevronDown, Shuffle, Heart, ShoppingCart, Apple, Menu, X, Home, Info, ShoppingBag, Package, User } from "lucide-react";

function HeaderSearchForm() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";
  const currentMinPrice = searchParams.get("min_price") || "";
  const currentMaxPrice = searchParams.get("max_price") || "";
  const currentOnSaleOnly = searchParams.get("on_sale") === "true";
  const currentSorting = searchParams.get("orderby") || "date";
  const currentQuery = searchParams.get("search") || "";

  return (
    <form className="relative" action="/shop" method="GET">
      {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
      {currentMinPrice && <input type="hidden" name="min_price" value={currentMinPrice} />}
      {currentMaxPrice && <input type="hidden" name="max_price" value={currentMaxPrice} />}
      {currentOnSaleOnly && <input type="hidden" name="on_sale" value="true" />}
      {currentSorting !== "date" && <input type="hidden" name="orderby" value={currentSorting} />}

      <input
        type="text"
        name="search"
        defaultValue={currentQuery}
        placeholder="Search for products"
        className="w-full h-[46px] pl-6 pr-14 text-sm text-gray-700 border border-gray-200 rounded-full focus:outline-none focus:border-gray-300"
      />
      <button
        type="submit"
        className="absolute right-1 top-1 bottom-1 w-[38px] h-[38px] bg-[#374bf9] rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
      >
        <Search size={18} />
      </button>
    </form>
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

  return (
    <form className="relative w-full" action="/shop" method="GET">
      {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
      {currentMinPrice && <input type="hidden" name="min_price" value={currentMinPrice} />}
      {currentMaxPrice && <input type="hidden" name="max_price" value={currentMaxPrice} />}
      {currentOnSaleOnly && <input type="hidden" name="on_sale" value="true" />}
      {currentSorting !== "date" && <input type="hidden" name="orderby" value={currentSorting} />}

      <input
        type="text"
        name="search"
        defaultValue={currentQuery}
        placeholder="Search for products"
        className="w-full h-11 pl-6 pr-14 text-[14.5px] font-medium text-gray-700 bg-white rounded-full focus:outline-none"
      />
      <button
        type="submit"
        className="absolute right-1 top-[4px] w-9 h-9 bg-[#374bf9] rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
      >
        <Search size={16} />
      </button>
    </form>
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
            <img loading="lazy" src="https://comsri.com/wp-content/uploads/2025/10/Comsri-Logo-2-1.png" 
              alt="Comsri Corporation Logo" 
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
                <span className="text-slate-700 font-bold max-w-[140px] truncate select-none">
                  Hello, {userEmail.split("@")[0]}!
                </span>
                <button 
                  onClick={() => {
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("userEmail");
                    setIsLoggedIn(false);
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
            <img 
              loading="lazy" 
              src="https://comsri.com/wp-content/uploads/2025/10/Comsri-Logo-2-1.png" 
              alt="Comsri Corporation Logo" 
              className="h-[34px] w-auto object-contain"
            />
          </Link>

          {/* Right: Profile User Icon */}
          <Link href="/login" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-50 transition-colors">
            <User size={24} className="text-gray-800" />
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
              <Link href="/" className={`transition ${pathname === "/" ? "text-[#374bf9] font-bold" : "hover:text-[#374bf9]"}`}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className={`transition ${pathname === "/about" ? "text-[#374bf9] font-bold" : "hover:text-[#374bf9]"}`}>
                About Us
              </Link>
            </li>
            <li className="group flex items-center gap-1 cursor-pointer hover:text-[#374bf9] transition-all py-2">
              <Link href="/shop" className={`flex items-center gap-1 ${pathname === "/shop" ? "text-[#374bf9] font-bold" : "hover:text-[#374bf9]"}`}>
                <span>Refurbished Products</span>
                <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
              </Link>
              
              {/* Mega Menu Dropdown */}
              <div className="absolute top-full left-0 right-0 w-full bg-white shadow-[0_20px_60px_rgba(0,0,0,0.10)] border-t border-gray-200 py-12 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-50 text-gray-800 font-normal">
                <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
                  {/* 4 Column Category Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-10 pb-10 border-b border-gray-200">
                    
                    {/* Column 1: Refurbished Laptops */}
                    <div className="flex flex-col gap-4">
                      <Link href="/shop?category=112" className="text-[#374bf9] font-bold text-[15px] hover:underline">
                        Refurbished Laptops
                      </Link>
                      <ul className="flex flex-col gap-[10px] text-gray-600 text-[13.5px]">
                        <li><Link href="/shop?category=112&search=Dell" className="hover:text-[#374bf9] transition-colors">Dell Laptops</Link></li>
                        <li><Link href="/shop?category=112&search=HP" className="hover:text-[#374bf9] transition-colors">HP Laptops</Link></li>
                        <li><Link href="/shop?category=112&search=Lenovo" className="hover:text-[#374bf9] transition-colors">Lenovo Laptops</Link></li>
                        <li><Link href="/shop?category=112&search=Microsoft" className="hover:text-[#374bf9] transition-colors">Microsoft Laptops</Link></li>
                        <li><Link href="/shop?category=112&search=Apple" className="hover:text-[#374bf9] transition-colors">Apple Macbook</Link></li>
                      </ul>
                    </div>

                    {/* Column 2: Refurbished Desktops */}
                    <div className="flex flex-col gap-4">
                      <Link href="/shop?category=129" className="text-[#374bf9] font-bold text-[15px] hover:underline">
                        Refurbished Desktops
                      </Link>
                      <ul className="flex flex-col gap-[10px] text-gray-600 text-[13.5px]">
                        <li><Link href="/shop?category=129&search=Dell" className="hover:text-[#374bf9] transition-colors">Dell Desktops</Link></li>
                        <li><Link href="/shop?category=129&search=HP" className="hover:text-[#374bf9] transition-colors">HP Desktops</Link></li>
                        <li><Link href="/shop?category=129&search=Lenovo" className="hover:text-[#374bf9] transition-colors">Lenovo Desktops</Link></li>
                      </ul>
                    </div>

                    {/* Column 3: Refurbished Workstations */}
                    <div className="flex flex-col gap-4">
                      <Link href="/shop?category=139" className="text-[#374bf9] font-bold text-[15px] hover:underline">
                        Refurbished Workstations
                      </Link>
                      <ul className="flex flex-col gap-[10px] text-gray-600 text-[13.5px]">
                        <li><Link href="/shop?category=139&search=Dell" className="hover:text-[#374bf9] transition-colors">Dell Workstations</Link></li>
                        <li><Link href="/shop?category=139&search=HP" className="hover:text-[#374bf9] transition-colors">HP Workstations</Link></li>
                        <li><Link href="/shop?category=139&search=Lenovo" className="hover:text-[#374bf9] transition-colors">Lenovo Workstations</Link></li>
                      </ul>
                    </div>

                    {/* Column 4: Refurbished Mini PCs */}
                    <div className="flex flex-col gap-4">
                      <Link href="/shop?category=137" className="text-[#374bf9] font-bold text-[15px] hover:underline">
                        Refurbished Mini PCs
                      </Link>
                      <ul className="flex flex-col gap-[10px] text-gray-600 text-[13.5px]">
                        <li><Link href="/shop?category=137&search=Dell" className="hover:text-[#374bf9] transition-colors">Dell Mini PCs</Link></li>
                        <li><Link href="/shop?category=137&search=HP" className="hover:text-[#374bf9] transition-colors">HP Mini PCs</Link></li>
                        <li><Link href="/shop?category=137&search=Lenovo" className="hover:text-[#374bf9] transition-colors">Lenovo Mini PCs</Link></li>
                        <li><Link href="/shop?category=137&search=Apple" className="hover:text-[#374bf9] transition-colors">Apple Mini PCs</Link></li>
                      </ul>
                    </div>

                  </div>

                  {/* Shop By Brands Section */}
                  <div className="flex flex-col items-center gap-5">
                    <h3 className="text-[#111] font-bold text-[18px] tracking-tight">Shop By Brands</h3>
                    
                    <div className="flex flex-wrap items-center justify-center gap-5 w-full">
                      {/* Brand Card: Apple */}
                      <Link href="/shop?search=Apple" className="flex items-center justify-center bg-[#f9f9f9] border border-gray-200 rounded-2xl h-[72px] w-40 lg:w-48 px-6 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-gray-300 transition-all group/brand">
                        <Apple className="h-7 w-7 text-black fill-black transition-transform duration-300 group-hover/brand:scale-110" />
                      </Link>

                      {/* Brand Card: Dell */}
                      <Link href="/shop?search=Dell" className="flex items-center justify-center bg-[#f9f9f9] border border-gray-200 rounded-2xl h-[72px] w-40 lg:w-48 px-6 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-gray-300 transition-all group/brand">
                        <span className="text-[#007dbd] font-black text-[24px] tracking-tight transition-transform duration-300 group-hover/brand:scale-110">DELL</span>
                      </Link>

                      {/* Brand Card: HP */}
                      <Link href="/shop?search=HP" className="flex items-center justify-center bg-[#f9f9f9] border border-gray-200 rounded-2xl h-[72px] w-40 lg:w-48 px-6 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-gray-300 transition-all group/brand">
                        <div className="w-10 h-10 rounded-full bg-[#005B94] flex items-center justify-center text-white font-black italic text-xl tracking-tighter shadow-sm transition-transform duration-300 group-hover/brand:scale-110">
                          hp
                        </div>
                      </Link>

                      {/* Brand Card: Lenovo */}
                      <Link href="/shop?search=Lenovo" className="flex items-center justify-center bg-[#f9f9f9] border border-gray-200 rounded-2xl h-[72px] w-40 lg:w-48 px-6 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-gray-300 transition-all group/brand">
                        <span className="text-[#E21B22] font-black text-[22px] tracking-tight transition-transform duration-300 group-hover/brand:scale-110">Lenovo</span>
                      </Link>

                      {/* Brand Card: Microsoft */}
                      <Link href="/shop?search=Microsoft" className="flex items-center justify-center bg-[#f9f9f9] border border-gray-200 rounded-2xl h-[72px] w-40 lg:w-48 px-6 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-gray-300 transition-all group/brand">
                        <div className="flex items-center gap-2 transition-transform duration-300 group-hover/brand:scale-110">
                          <div className="grid grid-cols-2 gap-[2px] shrink-0">
                            <div className="w-3 h-3 bg-[#f25f22]"></div>
                            <div className="w-3 h-3 bg-[#7fba00]"></div>
                            <div className="w-3 h-3 bg-[#00a1f1]"></div>
                            <div className="w-3 h-3 bg-[#ffb900]"></div>
                          </div>
                          <span className="text-[#555] font-semibold text-[14px] tracking-tight">Microsoft</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="relative group flex items-center gap-1 cursor-pointer hover:text-[#374bf9] transition-all py-2">
              <Link href="/shop" className={`flex items-center gap-1 ${pathname === "/shop" ? "text-[#374bf9] font-bold" : "hover:text-[#374bf9]"}`}>
                <span>New Products</span>
                <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
              </Link>
              <div className="absolute top-[85%] left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 py-3 hidden group-hover:flex flex-col text-sm text-gray-800 z-50 font-normal">
                <Link href="/shop" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-bold transition-colors">
                  Explore New Shop
                </Link>
                <Link href="/shop" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-medium transition-colors">
                  Brand New Hardware
                </Link>
              </div>
            </li>
            <li>
              <Link href="/bulk-orders" className={`transition ${pathname === "/bulk-orders" ? "text-[#374bf9] font-bold" : "hover:text-[#374bf9]"}`}>
                Bulk Orders
              </Link>
            </li>
            <li>
              <Link href="/blog" className={`transition ${pathname === "/blog" ? "text-[#374bf9] font-bold" : "hover:text-[#374bf9]"}`}>
                Blog
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#374bf9] transition">
                Contact Us
              </Link>
            </li>
          </ul>

          {/* Right navigation links and utility icons */}
          <div className="flex items-center gap-x-6 shrink-0">
            <ul className="flex items-center gap-x-6">
              <li className="relative group flex items-center gap-1 cursor-pointer hover:text-[#374bf9] transition-all py-2">
                <span>Policies</span>
                <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
                
                {/* Elegant Dropdown aligned to the right edge */}
                <div className="absolute top-[85%] right-0 mt-2 w-64 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 py-3 hidden group-hover:flex flex-col text-sm text-gray-800 z-50 font-normal">
                  <Link href="/terms-conditions?tab=terms" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-bold transition-colors flex items-center justify-between">
                    <span>Terms & Conditions</span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full">v3.5</span>
                  </Link>
                  <Link href="/privacy-policy?tab=privacy" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-bold transition-colors flex items-center justify-between">
                    <span>Privacy Policy</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full">Secure</span>
                  </Link>
                  <Link href="/return-refund?tab=refund" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-bold transition-colors flex items-center justify-between">
                    <span>Return & Refund Policy</span>
                    <span className="text-[10px] bg-rose-50 text-rose-700 font-extrabold px-2 py-0.5 rounded-full">100%</span>
                  </Link>
                  <Link href="/privacy-policy?tab=warranty" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-bold transition-colors flex items-center justify-between">
                    <span>Warranty Policy</span>
                    <span className="text-[10px] bg-amber-50 text-amber-700 font-extrabold px-2 py-0.5 rounded-full">1 Year</span>
                  </Link>
                  <Link href="/privacy-policy?tab=shipping" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-bold transition-colors flex items-center justify-between">
                    <span>Shipping Policy</span>
                    <span className="text-[10px] bg-cyan-50 text-cyan-700 font-extrabold px-2 py-0.5 rounded-full">Insured</span>
                  </Link>
                </div>
              </li>
              <li>
                <Link href="#" className="hover:text-[#374bf9] transition">
                  FAQs
                </Link>
              </li>
            </ul>

            <div className="flex items-center gap-x-5 pl-5 border-l border-black/10">
              <button className="flex items-center gap-1.5 hover:text-[#374bf9] transition">
                <Shuffle size={18} />
                <span className="font-semibold">0</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-[#374bf9] transition">
                <Heart size={18} />
                <span className="font-semibold">0</span>
              </button>
              
              <button className="bg-[#374bf9] text-white rounded-full flex items-center px-4 py-2 gap-x-2 relative hover:bg-blue-700 transition-colors ml-2 shadow-sm border border-transparent">
                <ShoppingCart size={18} />
                <span className="font-semibold tracking-wide">₹0.00</span>
                <span className="absolute -top-1.5 -right-1.5 bg-white text-[#374bf9] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-gray-200">
                  0
                </span>
              </button>
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
            <img loading="lazy" src="https://comsri.com/wp-content/uploads/2025/10/Comsri-Logo-2-1.png" 
              alt="Comsri Corporation Logo" 
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

          {/* New Products Accordion */}
          <MobileAccordion title="New Products">
            <div className="px-5 space-y-1">
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-[13.5px] text-gray-600 hover:text-[#374bf9] transition-colors font-medium">
                Explore New Shop
              </Link>
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-[13.5px] text-gray-600 hover:text-[#374bf9] transition-colors font-medium">
                Brand New Hardware
              </Link>
            </div>
          </MobileAccordion>

          <Link href="/bulk-orders" onClick={() => setMobileMenuOpen(false)} className="block px-5 py-3.5 text-[15px] font-semibold text-gray-900 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            Bulk Orders
          </Link>
          <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block px-5 py-3.5 text-[15px] font-semibold text-gray-900 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            Blog
          </Link>
          <Link href="#" onClick={() => setMobileMenuOpen(false)} className="block px-5 py-3.5 text-[15px] font-semibold text-gray-900 border-b border-gray-100 hover:bg-gray-50 transition-colors">
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

          <Link href="#" onClick={() => setMobileMenuOpen(false)} className="block px-5 py-3.5 text-[15px] font-semibold text-gray-900 border-b border-gray-100 hover:bg-gray-50 transition-colors">
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
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[90] lg:hidden bg-[#374bf9]/95 backdrop-blur-md border border-[#2539db] shadow-[0_8px_35px_rgba(55,75,249,0.35)] px-3 py-1.5 w-[92%] max-w-[420px] rounded-full">
        <div className="flex items-center justify-around h-11 w-full mx-auto">
          {/* Home Tab */}
          <Link
            href="/"
            className={`flex items-center gap-2 rounded-full transition-all duration-300 ${
              pathname === "/" 
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
            className={`flex items-center gap-2 rounded-full transition-all duration-300 ${
              pathname === "/about" 
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
            className={`flex items-center gap-2 rounded-full transition-all duration-300 ${
              pathname === "/shop" 
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
            className={`flex items-center gap-2 rounded-full transition-all duration-300 ${
              pathname === "/bulk-orders" 
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
            href="#"
            className={`flex items-center gap-2 rounded-full transition-all duration-300 ${
              pathname === "/cart" || pathname === "#cart"
                ? "bg-[#faba5b] text-black px-4 py-2" 
                : "text-white/80 hover:text-white p-2"
            }`}
          >
            <div className="relative">
              <ShoppingCart size={20} className="stroke-[2.5]" />
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </div>
            {(pathname === "/cart" || pathname === "#cart") && (
              <span className="text-[13px] font-bold tracking-wide">Cart</span>
            )}
          </Link>
        </div>
      </div>
    </>
  );
}
