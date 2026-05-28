"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown, Shuffle, Heart, ShoppingCart, ChevronLeft, ChevronRight, ShieldCheck, Truck, FileText, Headphones, Star, CheckCircle, ArrowRight, Share2, MessageSquare, ArrowUpRight, Package, DollarSign, ArrowDown, MessageCircle, Instagram, Facebook, Twitter, Youtube, Play, Apple } from "lucide-react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn") === "true";
    if (logged) {
      const email = localStorage.getItem("userEmail") || "User";
      setTimeout(() => {
        setIsLoggedIn(true);
        setUserEmail(email);
      }, 0);
    }
  }, []);

  // ADD YOUR SLIDER IMAGES HERE:
  // Replace these placeholder URLs with the actual URLs of your images.
  // You can also add more URLs to the array to increase the number of slides.
  const slides = [
    "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/Apple-Macbook-sale-Banner.jpg",
    "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/comsri_banner%20(1).png",
    "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/Happy-Custommer-Banner-scaled.png"
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-[#f6f5f8] flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white py-4 border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between w-full">
          <div className="flex-shrink-0 flex items-center gap-1 cursor-pointer">
          {/* Logo Placeholder */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="relative w-8 h-8 mr-1 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-[#4caf50]">
                  <path d="M 50 10 C 70 10 90 20 90 40 C 90 60 70 80 50 80 C 30 80 10 60 10 40 C 10 20 30 10 50 10 Z" opacity="0.3"></path>
                  <path d="M 50 20 C 65 20 80 30 80 40 C 80 50 65 60 50 60" stroke="#1f44a3" strokeWidth="8" fill="none"></path>
                </svg>
              </div>
              <span className="text-3xl font-bold tracking-tight text-[#1b4332]">COMSRI</span>
            </div>
            <span className="text-[10px] uppercase font-semibold text-gray-700 tracking-wider text-center pr-2">Corporation</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products"
              className="w-full h-[46px] pl-6 pr-14 text-sm text-gray-700 border border-gray-200 rounded-full focus:outline-none focus:border-gray-300"
            />
            <button className="absolute right-1 top-1 bottom-1 w-[38px] bg-[#374bf9] rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-x-6 text-sm font-medium text-gray-800">
          <div className="flex items-center gap-2 cursor-pointer border-r border-gray-300 pr-6">
            <div className="w-6 h-4 overflow-hidden rounded relative flex-shrink-0">
               {/* India Flag CSS */}
               <div className="h-1/3 bg-[#FF9933] w-full"></div>
               <div className="h-1/3 bg-white w-full flex justify-center items-center">
                  <div className="w-2 h-2 rounded-full border border-[0.5px] border-[#000080]"></div>
               </div>
               <div className="h-1/3 bg-[#138808] w-full"></div>
            </div>
            <span>IND</span>
          </div>
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
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
            <Link href="/login" className="hover:text-[#6366f1] font-bold transition-colors">
              Login / Register
            </Link>
          )}
        </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-[#faba5b] py-3 text-[14px] font-medium text-black">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between w-full">
        <ul className="flex flex-wrap items-center gap-y-2 gap-x-6">
          <li><a href="/" className="text-[#374bf9]">Home</a></li>
          <li><a href="/about" className="hover:text-gray-700">About Us</a></li>
          <li className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
            Refurbished Products <ChevronDown size={14} className="text-gray-500" />
          </li>
          <li className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
            New Products <ChevronDown size={14} className="text-gray-500" />
          </li>
          <li><a href="/bulk-orders" className="hover:text-gray-700">Bulk Orders</a></li>
          <li><a href="/blog" className="hover:text-gray-700">Blog</a></li>
          <li><a href="#" className="hover:text-gray-700">Contact Us</a></li>
          <li className="relative group flex items-center gap-1 cursor-pointer hover:text-[#374bf9] transition-all py-2">
            <span>Policies</span>
            <ChevronDown size={14} className="text-gray-500 transition-transform duration-200 group-hover:rotate-180 group-hover:text-[#374bf9]" />
            
            {/* Elegant Dropdown */}
            <div className="absolute top-[85%] left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 py-3 hidden group-hover:flex flex-col text-sm text-gray-800 z-50">
              <a href="/terms-conditions?tab=terms" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-bold transition-colors flex items-center justify-between">
                <span>Terms & Conditions</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full">v3.5</span>
              </a>
              <a href="/privacy-policy?tab=privacy" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-bold transition-colors flex items-center justify-between">
                <span>Privacy Policy</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full">Secure</span>
              </a>
              <a href="/return-refund?tab=refund" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-bold transition-colors flex items-center justify-between">
                <span>Return & Refund Policy</span>
                <span className="text-[10px] bg-rose-50 text-rose-700 font-extrabold px-2 py-0.5 rounded-full">100%</span>
              </a>
              <a href="/privacy-policy?tab=warranty" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-bold transition-colors flex items-center justify-between">
                <span>Warranty Policy</span>
                <span className="text-[10px] bg-amber-50 text-amber-700 font-extrabold px-2 py-0.5 rounded-full">1 Year</span>
              </a>
              <a href="/privacy-policy?tab=shipping" className="px-5 py-2.5 hover:bg-slate-50 hover:text-[#374bf9] font-bold transition-colors flex items-center justify-between">
                <span>Shipping Policy</span>
                <span className="text-[10px] bg-cyan-50 text-cyan-700 font-extrabold px-2 py-0.5 rounded-full">Insured</span>
              </a>
            </div>
          </li>
          <li><a href="#" className="hover:text-gray-700">FAQs</a></li>
        </ul>

        <div className="flex items-center gap-x-5 pl-5 border-l border-black/10">
          <button className="flex items-center gap-1.5 hover:text-gray-700">
            <Shuffle size={18} />
            <span className="font-semibold">0</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-gray-700">
            <Heart size={18} />
            <span className="font-semibold">0</span>
          </button>
          
          <button className="bg-[#374bf9] text-white rounded-full flex items-center px-4 py-2 gap-x-2 relative hover:bg-blue-700 transition-colors ml-2 shadow-sm">
            <ShoppingCart size={18} />
            <span className="font-semibold tracking-wide">₹0.00</span>
            <span className="absolute -top-1.5 -right-1.5 bg-white text-[#374bf9] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-gray-200">
              0
            </span>
          </button>
        </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 relative bg-gray-200 overflow-hidden min-h-[500px] lg:min-h-[650px]">
        {/* Slider Images */}
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <Image 
              src={slide}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Left and Right Nav Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white z-30 transition-colors"
        >
            <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white z-30 transition-colors"
        >
            <ChevronRight size={24} className="text-gray-800" />
        </button>
        
        {/* Banner with a gear icon on the right edge */}
        <div className="absolute right-0 top-1/3 bg-gray-800 text-yellow-400 p-2 rounded-l-md z-30 cursor-pointer shadow-lg blur-[0.5px]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </div>



      </main>

      {/* Shop By Categories Section */}
      <section className="bg-[#f6f5f8] py-16 px-6 lg:px-12 w-full">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[28px] font-extrabold text-[#2d2d2d] tracking-tight">Shop By Categories</h2>
            {/* Nav Circle Placeholder */}
            <div className="w-10 h-10 rounded-full bg-[#f0f0f0] flex items-center justify-center cursor-pointer hover:bg-[#e0e0e0] transition-colors"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: "Refurbished Laptops", 
                bgImage: "https://comsri.com/wp-content/uploads/al_opt_content/IMAGE/comsri.com/wp-content/uploads/2025/10/510uTHyDqGL-removebg-preview-1.png.bv_resized_desktop.png.bv.webp?bv_host=comsri.com"
              },
              { 
                title: "Refurbished Desktops", 
                bgImage: "https://comsri.com/wp-content/uploads/al_opt_content/IMAGE/comsri.com/wp-content/uploads/2025/10/32-removebg-preview-1.png.bv.webp?bv_host=comsri.com"
              },
              { 
                title: "Refurbished Workstations", 
                bgImage: "https://comsri.com/wp-content/uploads/al_opt_content/IMAGE/comsri.com/wp-content/uploads/2025/10/z6_g5_v3_2x-removebg-preview-1.png.bv.webp?bv_host=comsri.com"
              },
              { 
                title: "Refurbished Mini PCs", 
                bgImage: "https://comsri.com/wp-content/uploads/al_opt_content/IMAGE/comsri.com/wp-content/uploads/2025/10/7040-micro-1-removebg-preview-1.png.bv.webp?bv_host=comsri.com" 
              }
            ].map((cat, idx) => (
              <div 
                key={idx}
                className="relative rounded-[20px] overflow-hidden cursor-pointer group pt-8 px-6 h-[340px] flex flex-col items-center bg-[#fac656] shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <div 
                  className="absolute inset-0 opacity-100 z-0 bg-no-repeat pointer-events-none transform transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('${cat.bgImage}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                
                <h3 className="relative z-10 text-[20px] font-bold text-[#1f2937] mb-auto text-center tracking-tight">
                  {cat.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products & Promo Banners */}
      <section className="bg-[#f6f5f8] pb-16 px-6 lg:px-12 w-full">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
          
          {/* Top Row: 2 items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[250px] md:h-[350px]">
            {/* New Mini PCs */}
            <div className="relative rounded-[24px] overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
               <Image src="https://comsri.com/wp-content/uploads/2025/10/mini-pc-showcase-1.jpg" alt="New Mini PCs" fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>
               <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-center items-start text-white">
                  <h3 className="text-4xl lg:text-5xl font-bold mb-4 drop-shadow-md tracking-tight transform transition-transform duration-500 group-hover:-translate-y-2">New Mini PCs</h3>
                  <div className="flex items-center gap-2 text-base lg:text-lg font-bold transform transition-transform duration-500 group-hover:-translate-y-2">
                     <span className="border-b-2 border-transparent group-hover:border-white pb-0.5 transition-colors duration-300">Shop Now</span>
                     <ArrowRight size={20} className="transform -translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                  </div>
               </div>
            </div>

            {/* New All-In-One PCs */}
            <div className="relative rounded-[24px] overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
               <Image src="https://comsri.com/wp-content/uploads/2025/10/dark-desk-setup-img.jpg-1.webp" alt="New All-In-One PCs" fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>
               <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-center items-start text-white">
                  <h3 className="text-4xl lg:text-5xl font-bold mb-4 max-w-[70%] leading-tight drop-shadow-md tracking-tight transform transition-transform duration-500 group-hover:-translate-y-2">New All-In-One PCs</h3>
                  <div className="flex items-center gap-2 text-base lg:text-lg font-bold transform transition-transform duration-500 group-hover:-translate-y-2">
                     <span className="border-b-2 border-transparent group-hover:border-white pb-0.5 transition-colors duration-300">Shop Now</span>
                     <ArrowRight size={20} className="transform -translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                  </div>
               </div>
            </div>
          </div>

          {/* Bottom Row: 3 items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[450px]">
             {/* New Desktops */}
             <div className="bg-[#529b71] rounded-[24px] overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col">
                <div className="h-[65%] relative overflow-hidden">
                   <Image src="https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/Desktop-Showcase.png" alt="New Desktops" fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                </div>
                <div className="flex-1 p-8 flex flex-col justify-end items-start text-white relative">
                   <div className="absolute inset-0 bg-white/0 transition-colors duration-500 group-hover:bg-white/10 pointer-events-none"></div>
                   <h3 className="text-3xl font-bold mb-3 tracking-tight transform transition-transform duration-500 group-hover:-translate-y-1 relative z-10">New Desktops</h3>
                   <div className="flex items-center gap-2 text-base font-bold transform transition-transform duration-500 group-hover:-translate-y-1 relative z-10">
                     <span className="border-b-2 border-transparent group-hover:border-white pb-0.5 transition-colors duration-300">Shop Now</span>
                     <ArrowRight size={18} className="transform -translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                   </div>
                </div>
             </div>

             {/* New Laptops */}
             <div className="relative rounded-[24px] overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 min-h-[300px] md:min-h-0 md:h-full">
                <Image src="https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/Laptop-Showcase.webp" alt="New Laptops" fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end items-start text-white">
                   <h3 className="text-4xl font-bold mb-3 drop-shadow-md tracking-tight transform transition-transform duration-500 group-hover:-translate-y-1">New Laptops</h3>
                   <div className="flex items-center gap-2 text-base font-bold transform transition-transform duration-500 group-hover:-translate-y-1">
                     <span className="border-b-2 border-transparent group-hover:border-white pb-0.5 transition-colors duration-300">Shop Now</span>
                     <ArrowRight size={18} className="transform -translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                   </div>
                </div>
             </div>

             {/* Get Upto 70% off */}
             <div className="bg-[#5a80d8] rounded-[24px] overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col relative">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-500 pointer-events-none z-10"></div>
                <div className="h-[50%] relative overflow-hidden">
                   <Image src="https://picsum.photos/seed/promo/600/400" alt="Promo" fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                </div>
                <div className="flex-1 p-8 flex flex-col justify-center items-start text-white relative z-20">
                   <span className="bg-[#ff5b4f] text-white px-5 py-2 rounded-full text-2xl font-bold mb-4 tracking-tight shadow-sm inline-block transform transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2">
                     Get Upto 70% off
                   </span>
                   <h3 className="text-[26px] font-bold mb-6 leading-snug tracking-tight">On All New / Refurbished Products</h3>
                   <div className="flex items-center gap-2 text-base font-bold">
                     <span className="border-b-2 border-transparent group-hover:border-white pb-0.5 transition-colors duration-300">Shop Now</span>
                     <ArrowRight size={18} className="transform -translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                   </div>
                </div>
             </div>
          </div>
          
        </div>
      </section>

      {/* Marquee Banner */}
      <section className="bg-[#4169e1] border-y border-[#4169e1] text-white py-3 md:py-4 overflow-hidden whitespace-nowrap relative flex">
        <div className="animate-marquee flex items-center shrink-0">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="mx-6 text-[15px] font-bold">Upto 70% on New & Refurbished Laptops & Desktops</span>
              <span className="text-black text-lg">✦</span>
              <span className="mx-6 text-[15px] font-bold">Best Deals in India</span>
              <span className="text-black text-lg">✦</span>
              <span className="mx-6 text-[15px] font-bold">Fast & Secure PAN-India Delivery</span>
              <span className="text-black text-lg">✦</span>
              <span className="mx-6 text-[15px] font-bold">Bulk Orders Available for Corporates</span>
              <span className="text-black text-lg">✦</span>
              <span className="mx-6 text-[15px] font-bold">24/7 Customer Support</span>
              <span className="text-black text-lg">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Brands */}
      <section className="bg-[#f6f5f8] py-12 md:py-16 px-6 lg:px-12 w-full">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <h2 className="text-[28px] md:text-3xl font-bold text-gray-900 tracking-tight">Shop by Brands</h2>
            <button className="bg-[#4169e1] hover:bg-[#345bc5] text-white px-6 md:px-8 py-2 md:py-2.5 rounded-full font-bold text-sm md:text-base transition-colors shadow-sm">
              All Brands
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {[
              { name: 'Acer', src: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Acer_Logo.svg' },
              { name: 'Apple', src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
              { name: 'Dell', src: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg' },
              { name: 'HP', src: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg' },
              { name: 'Lenovo', src: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg' },
              { name: 'Microsoft', src: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
            ].map((brand, idx) => (
              <div key={idx} className="bg-white rounded-[20px] p-6 flex flex-col items-center justify-center h-[100px] md:h-[120px] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100">
                <img   src={brand.src} alt={brand.name} className="w-auto h-auto max-h-[35px] max-w-[90px] object-contain opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Carousel Section */}
      <section className="bg-[#f6f5f8] pb-16 px-6 lg:px-12 w-full">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[24px] md:text-[28px] font-bold text-gray-900 tracking-tight">Buy Refurbished Laptops Online in India</h2>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full bg-[#4169e1] text-white flex items-center justify-center hover:bg-[#345bc5] transition-colors shadow-sm focus:outline-none">
                <ChevronLeft size={20} />
              </button>
              <button className="w-10 h-10 rounded-full bg-[#4169e1] text-white flex items-center justify-center hover:bg-[#345bc5] transition-colors shadow-sm focus:outline-none">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8">
            {[
              { title: 'Dell Latitude Laptop | 5480 | Intel i5-6th Gen | 14″ FHD | Win 10 Pro | Refurbished', fullTitle: 'Dell Latitude Laptop | 5400 | Intel i5-8th Gen', discount: '50%', originalPrice: '₹45,000', price: '₹22,499', image: 'https://comsri.com/wp-content/uploads/2025/12/61d5EQ8j7oS._UF1000_1000_QL80_-removebg-preview.png', isBestSeller: true },
              { title: 'Dell Latitude 5480', fullTitle: 'Dell Latitude Laptop | 5480 | Intel i5-6th Gen', discount: '54%', originalPrice: '₹32,000', price: '₹14,599', image: 'https://comsri.com/wp-content/uploads/al_opt_content/IMAGE/comsri.com/wp-content/uploads/2025/10/32-removebg-preview-1.png.bv.webp?bv_host=comsri.com', isBestSeller: false },
              { title: 'Dell Latitude 5500', fullTitle: 'Dell Latitude Laptop | 5500 | Intel i5-8th Gen', discount: '63%', originalPrice: '₹55,000', price: '₹20,499', image: 'https://comsri.com/wp-content/uploads/al_opt_content/IMAGE/comsri.com/wp-content/uploads/2025/10/z6_g5_v3_2x-removebg-preview-1.png.bv.webp?bv_host=comsri.com', isBestSeller: true },
              { title: 'Dell Latitude 7490', fullTitle: 'Dell Latitude Laptop | 7490 | Intel i5-8th Gen', discount: '47%', originalPrice: '₹35,000', price: '₹18,499', image: 'https://comsri.com/wp-content/uploads/al_opt_content/IMAGE/comsri.com/wp-content/uploads/2025/10/7040-micro-1-removebg-preview-1.png.bv.webp?bv_host=comsri.com', isBestSeller: false },
            ].map((prod, idx) => (
              <div key={idx} className="bg-white rounded-[24px] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col group cursor-pointer border border-transparent hover:border-gray-100 hover:shadow-[0_8px_35px_rgb(0,0,0,0.1)] transition-all duration-300">
                {/* Image Area */}
                <div className="bg-[#f6f6f6] rounded-[20px] relative h-[240px] mb-4 overflow-hidden flex items-center justify-center">
                  {/* Top Bar */}
                  <div className="absolute top-4 inset-x-4 flex justify-between z-20">
                    {prod.isBestSeller ? (
                      <span className="bg-white text-black text-[13px] font-semibold px-3 py-1.5 rounded-full shadow-sm">
                        Best Seller
                      </span>
                    ) : (
                      <span className="bg-white text-black text-[13px] font-semibold px-3 py-1.5 rounded-full shadow-sm">
                        Just In
                      </span>
                    )}
                    <button className="w-[34px] h-[34px] bg-white rounded-full flex items-center justify-center shadow-sm text-gray-700 hover:text-black hover:scale-105 transition-all focus:outline-none z-20">
                      <Heart size={16} />
                    </button>
                  </div>
                  
                  {/* Image */}
                  <div 
                    className="absolute inset-0 z-10 bg-no-repeat bg-cover bg-center pointer-events-none transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
                    style={{ backgroundImage: `url('${prod.image}')` }}
                  />

                  {/* Dots */}
                  <div className="absolute bottom-4 flex gap-1.5 z-20">
                    <div className="w-3.5 h-1.5 bg-black rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col flex-1 px-1">
                  <h3 className="text-[17px] font-medium text-[#111] leading-snug mb-1 line-clamp-2 min-h-[46px]">{prod.title}</h3>
                  <p className="text-[14px] text-gray-500 mb-3 flex items-center gap-1.5">
                    Refurbished Laptops
                  </p>

                  <div className="flex items-center gap-2.5 mb-5">
                    <span className="text-[17px] font-bold text-[#111]">{prod.price}</span>
                    <span className="text-[15px] text-gray-400 line-through">{prod.originalPrice}</span>
                    <span className="text-[15px] font-semibold text-[#008a00]">{prod.discount} off</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <button className="bg-[#f5f5f5] hover:bg-[#e5e5e5] text-[#111] text-[14px] font-semibold py-3 rounded-full transition-colors">
                      View Details
                    </button>
                    <button className="bg-[#3452ef] hover:bg-[#112bb5] text-white text-[14px] font-semibold py-3 rounded-full transition-colors flex items-center justify-center gap-2">
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-[#e9ecef] rounded-full overflow-hidden flex">
            <div className="h-full bg-[#ffb03a] w-[60%]"></div>
            <div className="h-full bg-[#ffefd8] w-[40%]"></div>
          </div>
        </div>
      </section>

      {/* Desktop Carousel Section */}
      <section className="bg-[#f6f5f8] pb-16 px-6 lg:px-12 w-full">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[24px] md:text-[28px] font-bold text-gray-900 tracking-tight">Buy High Quality Refurbished Desktops</h2>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full bg-[#4169e1] text-white flex items-center justify-center hover:bg-[#345bc5] transition-colors shadow-sm focus:outline-none">
                <ChevronLeft size={20} />
              </button>
              <button className="w-10 h-10 rounded-full bg-[#4169e1] text-white flex items-center justify-center hover:bg-[#345bc5] transition-colors shadow-sm focus:outline-none">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8">
            {[
              { title: 'Dell Optiplex SFF Desktop | 3046 | Intel i5-6th Gen | Win 11', discount: '67%', originalPrice: '₹45,999', price: '₹14,999', image: 'https://comsri.com/wp-content/uploads/al_opt_content/IMAGE/comsri.com/wp-content/uploads/2025/10/7040-micro-1-removebg-preview-1.png.bv.webp?bv_host=comsri.com', isBestSeller: true },
              { title: 'Dell Precision Tower Desktop | 3420 | Intel i5-7th Gen | Win 10', discount: '47%', originalPrice: '₹35,000', price: '₹18,499', image: 'https://comsri.com/wp-content/uploads/al_opt_content/IMAGE/comsri.com/wp-content/uploads/2025/10/32-removebg-preview-1.png.bv.webp?bv_host=comsri.com', isBestSeller: false },
              { title: 'HP ProDesk Micro Tower Desktop | 400 G5 | Intel i5-8th', discount: '61%', originalPrice: '₹45,000', price: '₹17,499', image: 'https://comsri.com/wp-content/uploads/al_opt_content/IMAGE/comsri.com/wp-content/uploads/2025/10/z6_g5_v3_2x-removebg-preview-1.png.bv.webp?bv_host=comsri.com', isBestSeller: true },
              { title: 'Lenovo ThinkCentre SFF Desktop | M920 | Intel i5-8th', discount: '54%', originalPrice: '₹40,000', price: '₹18,499', image: 'https://comsri.com/wp-content/uploads/2025/12/61d5EQ8j7oS._UF1000_1000_QL80_-removebg-preview.png', isBestSeller: false },
            ].map((prod, idx) => (
              <div key={idx} className="bg-white rounded-[24px] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col group cursor-pointer border border-transparent hover:border-gray-100 hover:shadow-[0_8px_35px_rgb(0,0,0,0.1)] transition-all duration-300">
                {/* Image Area */}
                <div className="bg-[#f6f6f6] rounded-[20px] relative h-[240px] mb-4 overflow-hidden flex items-center justify-center">
                  {/* Top Bar */}
                  <div className="absolute top-4 inset-x-4 flex justify-between z-20">
                    {prod.isBestSeller ? (
                      <span className="bg-white text-black text-[13px] font-semibold px-3 py-1.5 rounded-full shadow-sm">
                        Best Seller
                      </span>
                    ) : (
                      <span className="bg-white text-black text-[13px] font-semibold px-3 py-1.5 rounded-full shadow-sm">
                        Just In
                      </span>
                    )}
                    <button className="w-[34px] h-[34px] bg-white rounded-full flex items-center justify-center shadow-sm text-gray-700 hover:text-black hover:scale-105 transition-all focus:outline-none z-20">
                      <Heart size={16} />
                    </button>
                  </div>
                  
                  {/* Image */}
                  <div 
                    className="absolute inset-0 z-10 bg-no-repeat bg-cover bg-center pointer-events-none transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
                    style={{ backgroundImage: `url('${prod.image}')` }}
                  />

                  {/* Dots */}
                  <div className="absolute bottom-4 flex gap-1.5 z-20">
                    <div className="w-3.5 h-1.5 bg-black rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col flex-1 px-1">
                  <h3 className="text-[17px] font-medium text-[#111] leading-snug mb-1 line-clamp-2 min-h-[46px]">{prod.title}</h3>
                  <p className="text-[14px] text-gray-500 mb-3 flex items-center gap-1.5">
                    Refurbished Desktops
                  </p>

                  <div className="flex items-center gap-2.5 mb-5">
                    <span className="text-[17px] font-bold text-[#111]">{prod.price}</span>
                    <span className="text-[15px] text-gray-400 line-through">{prod.originalPrice}</span>
                    <span className="text-[15px] font-semibold text-[#008a00]">{prod.discount} off</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <button className="bg-[#f5f5f5] hover:bg-[#e5e5e5] text-[#111] text-[14px] font-semibold py-3 rounded-full transition-colors">
                      View Details
                    </button>
                    <button className="bg-[#3452ef] hover:bg-[#112bb5] text-white text-[14px] font-semibold py-3 rounded-full transition-colors flex items-center justify-center gap-2">
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-[#e9ecef] rounded-full overflow-hidden flex">
            <div className="h-full bg-[#ffb03a] w-[60%]"></div>
            <div className="h-full bg-[#ffefd8] w-[40%]"></div>
          </div>
        </div>
      </section>

      {/* Promo Banner Section */}
      <section className="bg-[#f6f5f8] pb-16 px-6 lg:px-12 w-full">
        <div className="max-w-[1600px] mx-auto bg-[#3a5bf6] rounded-[32px] p-8 lg:p-12 xl:p-16 flex flex-col lg:flex-row items-center gap-12 shadow-md">
          
          {/* Left Content */}
          <div className="flex-1 text-white">
            <div className="inline-block bg-[#ff4522] text-white text-[14px] font-bold px-4 py-1.5 rounded-full mb-6 shadow-sm">
              Get Upto 70% Off on New & Refurbished Products
            </div>
            
            <h2 className="text-[32px] md:text-5xl font-extrabold leading-[1.15] mb-6">
              Save Big on New / Refurbished<br className="hidden xl:block" /> Laptops & Desktops
            </h2>
            
            <div className="space-y-4 text-white/90 text-[14px] leading-relaxed mb-10">
              <p>
                At <strong className="text-white">Comsri Corporation</strong>, we believe premium computing should be accessible to everyone. As a trusted destination for <strong className="text-white">Refurbished Computers Online in India</strong>, we specialize in delivering high-quality refurbished and brand-new laptops and desktops to students, professionals, startups, enterprises, and gamers across India. Whether you&apos;re upgrading your office infrastructure, purchasing a personal device, or sourcing systems in bulk, our online computer store provides dependable performance at competitive prices.
              </p>
              <p>
                Recognized by customers as one of the <strong className="text-white">Top 10 Refurbished Laptops Online Store</strong> options in India, Comsri Corporation offers a carefully curated range of systems designed for productivity, learning, and business use. From <strong className="text-white">cheap refurbished laptops India</strong> for everyday tasks to powerful workstations for professional workloads, we help you find the right device without overspending.
              </p>
              <p>
                Every refurbished laptop and desktop undergoes a strict multi-point quality inspection, professional hardware testing, and performance validation. Our expert technicians ensure each system delivers smooth, long-lasting operation—giving you complete confidence when you <strong className="text-white">Buy Refurbished Laptops Online in India</strong>. Each unit is cleaned, optimized, and configured to offer like-new reliability, making Comsri Corporation a preferred choice for anyone searching for the <strong className="text-white">Best refurbished laptop India</strong>.
              </p>
              <p>
                If you&apos;re looking to buy refurbished computers online in India with peace of mind, Comsri Corporation is your trusted partner—delivering value, performance, and reliability nationwide.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <button className="bg-[#ffb03a] hover:bg-[#faa129] text-gray-900 font-bold px-8 py-3 rounded-full transition-colors shadow-sm focus:outline-none">
                Shop Now!
              </button>
              <button className="bg-transparent border-2 border-white/60 hover:border-white hover:bg-white/10 text-white font-bold px-8 py-3 rounded-full transition-all focus:outline-none">
                Learn More
              </button>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="lg:w-[450px] xl:w-[500px] flex-shrink-0 w-full relative">
            <div className="aspect-[4/5] w-full rounded-[24px] overflow-hidden shadow-2xl">
              <img   
                src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1000" 
                alt="Desktop setup with monitor" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
        </div>
      </section>

      {/* Blog Section */}
      <section className="bg-[#f6f5f8] pb-16 px-6 lg:px-12 w-full">
        <div className="max-w-[1600px] mx-auto flex flex-col pt-8 border-t-2 border-[#ffb03a]">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h2 className="text-[28px] md:text-3xl font-bold text-[#111] tracking-tight">Latest from The Blog</h2>
            <button className="bg-[#4169e1] hover:bg-[#345bc5] text-white px-6 py-2.5 rounded-full font-bold text-sm transition-colors shadow-sm focus:outline-none">
              More Articles
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-3 flex flex-col group cursor-pointer hover:shadow-[0_8px_35px_rgb(0,0,0,0.1)] transition-all duration-300 border border-transparent hover:border-gray-100">
              {/* Image */}
              <div className="relative aspect-[16/10] w-full bg-[#f4f5f7] rounded-[16px] overflow-hidden mb-4">
                <img   
                  src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600" 
                  alt="Blog cover" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="px-2 pb-2 flex flex-col flex-1">
                {/* Author and Read Time */}
                <div className="text-[13px] text-gray-500 mb-2 font-medium flex items-center gap-2">
                  <span>Comsri Corporation</span>
                  <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                  <span>5 min read</span>
                </div>

                {/* Title and Icon */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-[18px] font-bold text-[#111] leading-snug line-clamp-2">
                    Bulk Refurbished Computers Dealers: Smart IT Solutions for Businesses
                  </h3>
                  <button className="text-gray-400 group-hover:text-black transition-colors focus:outline-none flex-shrink-0 mt-1">
                    <ArrowUpRight size={20} />
                  </button>
                </div>

                {/* Description */}
                <p className="text-[15px] text-gray-500 mb-6 line-clamp-2 leading-relaxed">
                  In an era where technology upgrades are frequent and budgets are closely monitored, businesses acro...
                </p>

                {/* Footer (Tag and Date) */}
                <div className="flex items-center gap-4 mt-auto">
                  <span className="bg-[#f6f6f9] text-[#111] text-[13px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                    Refurbished Products
                  </span>
                  <span className="text-[13px] text-gray-500 font-medium whitespace-nowrap">
                    25 Jan 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-3 flex flex-col group cursor-pointer hover:shadow-[0_8px_35px_rgb(0,0,0,0.1)] transition-all duration-300 border border-transparent hover:border-gray-100">
              {/* Image */}
              <div className="relative aspect-[16/10] w-full bg-[#f4f5f7] rounded-[16px] overflow-hidden mb-4">
                <img   
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600" 
                  alt="Blog cover" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="px-2 pb-2 flex flex-col flex-1">
                {/* Author and Read Time */}
                <div className="text-[13px] text-gray-500 mb-2 font-medium flex items-center gap-2">
                  <span>Comsri Corporation</span>
                  <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                  <span>4 min read</span>
                </div>

                {/* Title and Icon */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-[18px] font-bold text-[#111] leading-snug line-clamp-2">
                    Bulk Refurbished Laptops for Offices: Cost vs Performance
                  </h3>
                  <button className="text-gray-400 group-hover:text-black transition-colors focus:outline-none flex-shrink-0 mt-1">
                    <ArrowUpRight size={20} />
                  </button>
                </div>

                {/* Description */}
                <p className="text-[15px] text-gray-500 mb-6 line-clamp-2 leading-relaxed">
                  In today&apos;s competitive business environment, organizations are under constant pressure to reduce op...
                </p>

                {/* Footer (Tag and Date) */}
                <div className="flex items-center gap-4 mt-auto">
                  <span className="bg-[#f6f6f9] text-[#111] text-[13px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                    Refurbished Products
                  </span>
                  <span className="text-[13px] text-gray-500 font-medium whitespace-nowrap">
                    07 Jan 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-3 flex flex-col group cursor-pointer hover:shadow-[0_8px_35px_rgb(0,0,0,0.1)] transition-all duration-300 border border-transparent hover:border-gray-100">
              {/* Image */}
              <div className="relative aspect-[16/10] w-full bg-[#f4f5f7] rounded-[16px] overflow-hidden mb-4">
                <img   
                  src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=600" 
                  alt="Blog cover" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="px-2 pb-2 flex flex-col flex-1">
                {/* Author and Read Time */}
                <div className="text-[13px] text-gray-500 mb-2 font-medium flex items-center gap-2">
                  <span>Comsri Corporation</span>
                  <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                  <span>7 min read</span>
                </div>

                {/* Title and Icon */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-[18px] font-bold text-[#111] leading-snug line-clamp-2">
                    E-Waste Recycling Explained: The First Step to Affordable Refurbished Technology
                  </h3>
                  <button className="text-gray-400 group-hover:text-black transition-colors focus:outline-none flex-shrink-0 mt-1">
                    <ArrowUpRight size={20} />
                  </button>
                </div>

                {/* Description */}
                <p className="text-[15px] text-gray-500 mb-6 line-clamp-2 leading-relaxed">
                  The rapid growth of technology has transformed how India works, studies, and does business. However...
                </p>

                {/* Footer (Tag and Date) */}
                <div className="flex items-center gap-4 mt-auto">
                  <span className="bg-[#f6f6f9] text-[#111] text-[13px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                    Uncategorized
                  </span>
                  <span className="text-[13px] text-gray-500 font-medium whitespace-nowrap">
                    06 Jan 2026
                  </span>
                </div>
              </div>
            </div>

          </div>
          
          {/* Progress bar */}
          <div className="w-full h-[3px] bg-[#e9ecef] overflow-hidden flex mt-12 rounded-full">
            <div className="h-full bg-[#ffb03a] w-[60%]"></div>
            <div className="h-full bg-transparent w-[40%]"></div>
          </div>
        </div>
      </section>



      {/* Instagram Section */}
      <section className="bg-[#f3eee7] py-12 lg:py-16 w-full flex flex-col items-center overflow-hidden">
        <div className="max-w-[1600px] mx-auto flex flex-col items-center w-full px-4 lg:px-6">
          <div className="mb-8 text-center flex flex-col items-center w-full">
            <div className="mb-[18px] text-[#111] bg-transparent border-[1.5px] border-[#111] rounded-[8px] p-1.5 inline-flex">
              <Instagram size={28} strokeWidth={1.5} />
            </div>
            <h2 className="text-[28px] md:text-[36px] font-bold text-[#111] tracking-tight mb-2">Comsri Corporation</h2>
            <p className="text-[16px] md:text-[18px] text-[#333] font-medium">
              Follow us on social <a href="#" className="text-[#3452ef] hover:underline font-semibold">@comsricorporation</a> for updates & offers
            </p>
          </div>

          {/* Instagram Images Grid */}
          <div className="w-full grid grid-cols-2 lg:grid-cols-8 gap-3 md:gap-4 pb-4 px-4 lg:px-0">
            {[
              "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=400",
              "https://images.unsplash.com/photo-1593642702821-c828b81665d9?auto=format&fit=crop&q=80&w=400",
              "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400",
              "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=400",
              "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=400",
              "https://images.unsplash.com/photo-1542393545-10f5cde2c810?auto=format&fit=crop&q=80&w=400",
              "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400",
              "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400",
            ].map((src, index) => (
              <div key={index} className="w-full aspect-square md:rounded-[20px] rounded-[12px] overflow-hidden bg-white shadow-sm group relative">
                <img   src={src} alt="Instagram post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-[#fcb643] pt-16 pb-12 w-full relative">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col gap-12">
          
          {/* Top Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 justify-between">
            {/* Address */}
            <div className="flex flex-col pr-4">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Address</h3>
              <p className="text-[14px] font-semibold text-[#2d2d2d] leading-relaxed mb-6">
                Office No.-T-15 Pinnacle Business Park MC Rd Shanti Nagar Andheri East Mumbai Maharastra – 400093
              </p>
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Contact Us</h3>
              <p className="text-[14px] font-semibold text-[#2d2d2d] mb-1.5">+91 8601-899-899</p>
              <p className="text-[14px] font-semibold text-[#2d2d2d]">Email: info@comsri.com</p>
            </div>

            {/* Refurbished Products */}
            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Refurbished Products</h3>
              <div className="flex flex-col gap-3">
                {["Refurbished Desktops", "Refurbished Laptops", "Refurbished Workstations", "Refurbished Macbooks", "Refurbished Mini PCs"].map((item, i) => (
                  <a key={i} href="#" className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item}</a>
                ))}
              </div>
            </div>

            {/* New Products */}
            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">New Products</h3>
              <div className="flex flex-col gap-3">
                {["New Laptops", "New Desktops", "New Macbooks", "New All in One", "New Mini PCs"].map((item, i) => (
                  <a key={i} href="#" className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item}</a>
                ))}
              </div>
            </div>

            {/* Useful Links */}
            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Useful Links</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Contact Us", path: "/about" },
                  { label: "Terms & Conditions", path: "/terms-conditions?tab=terms" },
                  { label: "Privacy Policy", path: "/privacy-policy?tab=privacy" },
                  { label: "Return & Refund Policy", path: "/return-refund?tab=refund" },
                  { label: "Warranty Policy", path: "/privacy-policy?tab=warranty" },
                  { label: "Shipping Policy", path: "/privacy-policy?tab=shipping" }
                ].map((item, i) => (
                  <a key={i} href={item.path} className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item.label}</a>
                ))}
              </div>
            </div>

            {/* Available On & Social Links */}
            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Avalible On:</h3>
              <div className="flex flex-wrap xl:flex-nowrap gap-3 mb-8">
                <a href="#" className="bg-black text-white px-3 py-1.5 rounded-[6px] flex items-center gap-2 hover:bg-gray-800 transition-colors border border-black min-w-[130px] justify-center">
                  <Play size={18} className="fill-white" />
                  <div className="flex flex-col items-start justify-center">
                    <span className="text-[8px] font-medium leading-none mb-0.5">GET IT ON</span>
                    <span className="text-[13px] font-semibold leading-none tracking-tight">Google Play</span>
                  </div>
                </a>
                <a href="#" className="bg-white text-black px-3 py-1.5 rounded-[6px] flex items-center gap-2 border border-black hover:bg-gray-50 transition-colors min-w-[130px] justify-center">
                  <Apple size={20} className="fill-black" />
                  <div className="flex flex-col items-start justify-center">
                    <span className="text-[8px] font-medium leading-none mb-0.5 mt-0.5">Download on the</span>
                    <span className="text-[13px] font-semibold leading-none tracking-tight">App Store</span>
                  </div>
                </a>
              </div>

              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Social links:</h3>
              <div className="flex gap-2">
                <a href="#" className="w-[32px] h-[32px] rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:bg-[#2b4170] transition-colors shadow-sm">
                  <Facebook size={16} className="fill-white" strokeWidth={0} />
                </a>
                <a href="#" className="w-[32px] h-[32px] rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors shadow-sm">
                  <span className="text-white font-bold text-[14px] italic pr-0.5 leading-none mt-0.5">X</span>
                </a>
                <a href="#" className="w-[32px] h-[32px] rounded-full bg-[#833ab4] text-[#833ab4] flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full"></div>
                  <Instagram size={16} className="text-white relative z-10" />
                </a>
                <a href="#" className="w-[32px] h-[32px] rounded-full bg-[#ff0000] text-white flex items-center justify-center hover:bg-[#cc0000] transition-colors shadow-sm">
                  <Youtube size={14} className="fill-white" strokeWidth={0} />
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter Banner */}
          <div className="bg-[#3452ef] rounded-[24px] px-8 md:px-12 py-10 flex flex-col lg:flex-row items-center justify-between gap-8 mt-2 w-full">
            <div className="flex flex-col text-white flex-1 text-center lg:text-left">
              <h2 className="text-[28px] md:text-[32px] font-bold mb-1.5 tracking-tight">Sign Up to us Newsletter</h2>
              <p className="text-[14px] text-white/90 font-medium">Be the First to Know. Sign up to newsletter today</p>
            </div>
            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 items-center">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-6 py-3.5 rounded-full text-[14px] focus:outline-none font-medium h-[48px] text-black w-full min-w-[280px] md:w-[340px]"
              />
              <button className="bg-[#fcb643] hover:bg-[#fca61f] text-[#111] px-8 h-[48px] rounded-full font-bold text-[15px] transition-colors whitespace-nowrap shadow-sm">
                Sign Up
              </button>
            </div>
          </div>

          {/* Copyright & Payments */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-1 gap-4 w-full">
            <p className="text-[14px] font-bold text-[#111]">Copyright 2026 by Comsri Corporation All Right Reserved.</p>
            <div className="flex gap-1.5">
              <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img   src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-full object-contain" alt="Mastercard" />
              </div>
              <div className="bg-[#1a1f71] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img   src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-[75%] object-contain mt-[1px]" alt="Visa" />
              </div>
              <div className="bg-[#003087] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img   src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png" className="h-[12px] object-contain" alt="PayPal" />
              </div>
              <div className="bg-[#2d9cdb] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img   src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" className="h-[80%] object-contain" alt="Amex" />
              </div>
              <div className="bg-[#6772e5] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img   src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png" className="h-[14px] object-contain invert hue-rotate-[180deg] brightness-200" alt="Stripe" />
              </div>
              <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center px-1">
                <span className="text-white text-[10px]">G</span><span className="text-white text-[12px] font-bold">Pay</span>
              </div>
              <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center px-1 border border-gray-700">
                <Apple size={14} className="fill-white text-white mr-0.5" /><span className="text-white text-[10px] font-semibold mt-[1px]">Pay</span>
              </div>
              <div className="bg-[#004b87] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img   src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/UnionPay_logo.svg/1280px-UnionPay_logo.svg.png" className="h-[80%] object-contain" alt="UnionPay" />
              </div>
            </div>
          </div>

        </div>

        {/* Floating Chat Icon placeholder */}
        <div className="absolute right-6 bottom-6 w-14 h-14 bg-[#3452ef] rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform z-50">
          <MessageCircle size={28} className="text-white fill-white" />
        </div>
      </footer>
    </div>
  );
}
