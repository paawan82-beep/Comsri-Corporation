"use client";

import Image from "next/image";
import { useState } from "react";
import { Search, ChevronDown, Shuffle, Heart, ShoppingCart, ChevronLeft, ChevronRight, ShieldCheck, Truck, FileText, Headphones, Star, CheckCircle, ArrowRight } from "lucide-react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

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
      <header className="bg-white py-4 px-8 border-b border-gray-100 flex items-center justify-between">
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
          <button className="hover:text-[#374bf9] transition-colors">
            Login / Register
          </button>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-[#faba5b] px-8 py-3 flex items-center justify-between text-[14px] font-medium text-black">
        <ul className="flex items-center gap-x-6">
          <li><a href="#" className="text-[#374bf9]">Home</a></li>
          <li><a href="#" className="hover:text-gray-700">About Us</a></li>
          <li className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
            Refurbished Products <ChevronDown size={14} className="text-gray-500" />
          </li>
          <li className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
            New Products <ChevronDown size={14} className="text-gray-500" />
          </li>
          <li><a href="#" className="hover:text-gray-700">Bulk Orders</a></li>
          <li><a href="#" className="hover:text-gray-700">Blog</a></li>
          <li><a href="#" className="hover:text-gray-700">Contact Us</a></li>
          <li className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
            Policies <ChevronDown size={14} className="text-gray-500" />
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
        <div className="max-w-[1400px] mx-auto">
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
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          
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
        <div className="max-w-[1400px] mx-auto">
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
                <img src={brand.src} alt={brand.name} className="w-auto h-auto max-h-[35px] max-w-[90px] object-contain opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Carousel Section */}
      <section className="bg-[#f6f5f8] pb-16 px-6 lg:px-12 w-full">
        <div className="max-w-[1400px] mx-auto">
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
                    <button className="bg-[#1f1f1f] hover:bg-black text-white text-[14px] font-semibold py-3 rounded-full transition-colors flex items-center justify-center gap-2">
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

    </div>
  );
}
