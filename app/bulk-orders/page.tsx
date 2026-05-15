"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Search, ChevronDown, Shuffle, Heart, ShoppingCart, Apple, Play, Facebook, Instagram, Youtube, MessageCircle, HeartHandshake, ShieldCheck, Truck, Users, Package, Check, ArrowRight, ArrowDown } from "lucide-react";

export default function BulkOrdersPage() {
  return (
    <div className="min-h-screen bg-[#f6f5f8] flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white py-4 border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between w-full">
          <div className="flex-shrink-0 flex items-center gap-1 cursor-pointer">
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
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-[#faba5b] py-3 text-[14px] font-medium text-black">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between w-full">
        <ul className="flex flex-wrap items-center gap-y-2 gap-x-6">
          <li><a href="/" className="hover:text-[#374bf9]">Home</a></li>
          <li><a href="/about" className="hover:text-[#374bf9]">About Us</a></li>
          <li className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
            Refurbished Products <ChevronDown size={14} className="text-gray-500" />
          </li>
          <li className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
            New Products <ChevronDown size={14} className="text-gray-500" />
          </li>
          <li><a href="/bulk-orders" className="text-[#374bf9]">Bulk Orders</a></li>
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
            <span className="absolute -top-1.5 -right-1.5 bg-white text-[#374bf9] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-gray-200">0</span>
          </button>
        </div>
        </div>
      </nav>

      <main className="flex-1 w-full bg-[#f6f5f8]">
        {/* Breadcrumb Header */}
        <div className="bg-[#f2ece4] w-full py-2.5 border-b border-gray-200/50">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-start gap-4">
            <h1 className="text-[28px] font-Medium text-[#111] tracking-tight">Bulk Orders</h1>
            <p className="text-[15px] text-[#777] font-medium mt-1">Home <span className="mx-1.5 text-gray-400">/</span> <span className="text-[#111] font-bold">Bulk Orders</span></p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="w-full relative overflow-hidden py-16 lg:py-24 bg-[#146ba1]">
           <div className="absolute inset-0 bg-gradient-to-r from-[#175d8d] to-[#128dc9] opacity-100"></div>
           
           <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-10">
                  <div className="w-full lg:w-[48%] xl:w-[45%] flex flex-col items-start gap-5 text-white pr-4">
                  <div className="flex flex-wrap gap-2.5 mb-2">
                     <span className="bg-white/10 border border-white/20 text-white text-[12.5px] font-normal py-1.5 px-3.5 rounded-full flex items-center gap-2 hover:bg-white/20 transition-colors cursor-default backdrop-blur-sm shadow-sm">
                       <span className="w-2 h-2 rounded-full bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.6)]"></span> NSE Listed
                     </span>
                     <span className="bg-white/10 border border-white/20 text-white text-[12.5px] font-normal py-1.5 px-3.5 rounded-full flex items-center gap-2 hover:bg-white/20 transition-colors cursor-default backdrop-blur-sm shadow-sm">
                       <span className="w-2 h-2 rounded-full bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.6)]"></span> 1000+ Enterprise Clients
                     </span>
                     <span className="bg-white/10 border border-white/20 text-white text-[12.5px] font-normal py-1.5 px-3.5 rounded-full flex items-center gap-2 hover:bg-white/20 transition-colors cursor-default backdrop-blur-sm shadow-sm">
                       <span className="w-2 h-2 rounded-full bg-gray-300"></span> IIT/IIM Alumni
                     </span>
                  </div>
                  
                  <h1 className="text-[42px] font-normal leading-[1.1] tracking-tight mb-2 text-white">
                    Cut Enterprise IT Costs by <span className="text-[#faba5b]">70%</span> Without Compromising Performance
                  </h1>
                  
                  <p className="text-[18px] text-white/95 leading-relaxed font-normal mb-5 mt-2 max-w-xl shadow-none">
                    Enterprise-grade refurbished laptops, desktops & IT equipment for India&apos;s leading companies. From ₹15,000 with flexible payment options.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8 w-full sm:w-auto">
                     <button className="bg-[#00c2e0] hover:bg-[#00a8c2] text-white font-normal py-3.5 px-7 rounded-[8px] flex items-center justify-center gap-2 transition-colors text-[16px] shadow-lg shadow-cyan-500/20">
                       Request Custom Quote <ArrowRight size={18} strokeWidth={2.5} />
                     </button>
                     <button className="bg-transparent hover:bg-white/10 border border-white/30 text-white font-normal py-3.5 px-7 rounded-[8px] flex items-center justify-center gap-2 transition-colors text-[16px]">
                       Calculate Your Savings <ArrowDown size={18} strokeWidth={2.5} />
                     </button>
                  </div>
                  
                  <div className="flex flex-wrap justify-start gap-x-6 gap-y-3 text-[14.5px] font-normal text-white/90 w-full">
                    <span className="flex items-center gap-1.5"><Check size={18} strokeWidth={3} className="text-[#4ade80]"/> ISO Certified/R2 Certified</span>
                    <span className="flex items-center gap-1.5"><Check size={18} strokeWidth={3} className="text-[#4ade80]"/> 1-year warranty</span>
                    <span className="flex items-center gap-1.5"><Check size={18} strokeWidth={3} className="text-[#4ade80]"/> Pan-India delivery</span>
                    <span className="flex items-center gap-1.5"><Check size={18} strokeWidth={3} className="text-[#4ade80]"/> Priority Support</span>
                  </div>
              </div>
              
              <div className="w-full lg:w-[52%] xl:w-[55%] relative mt-12 lg:mt-0">
                 <div className="w-[100%] h-[350px] sm:h-[450px] lg:w-[110%] lg:h-[560px] rounded-[24px] lg:rounded-l-[24px] lg:rounded-r-none overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] lg:translate-x-[5%] border border-white/10 relative">
                     <Image 
                       src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200" 
                       alt="Enterprise IT Team" 
                       fill 
                       className="object-cover object-center" 
                       referrerPolicy="no-referrer" 
                     />
                     <div className="absolute inset-0 bg-[#0d7fba]/10 mix-blend-overlay"></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Stats & Trusted By Section */}
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 lg:py-20 bg-white">
          <div className="flex flex-col lg:flex-row items-center mb-10 gap-8 lg:gap-4 w-full justify-between">
             <div className="w-full lg:w-[35%] xl:w-[30%]">
               <div className="flex items-center justify-center lg:justify-start gap-4 text-[11px] font-bold text-gray-400 tracking-[0.2em] relative whitespace-nowrap">
                  <div className="h-px bg-gray-200 w-12 hidden lg:block"></div>
                  TRUSTED BY INDIA&apos;S LEADING ENTERPRISES
                  <div className="h-px bg-gray-200 flex-1 hidden lg:block"></div>
               </div>
             </div>
             
             <div className="w-full lg:w-[65%] xl:w-[70%] flex flex-wrap justify-center lg:justify-end gap-x-10 sm:gap-x-12 md:gap-x-16 gap-y-6">
                <div className="flex flex-col items-center">
                   <h3 className="text-[32px] md:text-[38px] text-[#2563eb] font-bold leading-none mb-1.5">1000+</h3>
                   <span className="text-[10px] md:text-[11px] text-gray-500 font-bold tracking-widest uppercase">ENTERPRISES</span>
                </div>
                <div className="flex flex-col items-center">
                   <h3 className="text-[32px] md:text-[38px] text-[#2563eb] font-bold leading-none mb-1.5">2.5L+</h3>
                   <span className="text-[10px] md:text-[11px] text-gray-500 font-bold tracking-widest uppercase">DEVICES</span>
                </div>
                <div className="flex flex-col items-center">
                   <h3 className="text-[32px] md:text-[38px] text-[#2563eb] font-bold leading-none mb-1.5">20k+</h3>
                   <span className="text-[10px] md:text-[11px] text-gray-500 font-bold tracking-widest uppercase">PINCODES</span>
                </div>
                <div className="flex flex-col items-center">
                   <h3 className="text-[32px] md:text-[38px] text-[#2563eb] font-bold leading-none mb-1.5 flex items-center gap-0.5">4.4<span className="text-[26px]">★</span></h3>
                   <span className="text-[10px] md:text-[11px] text-gray-500 font-bold tracking-widest uppercase">GOOGLE RATING</span>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-4 mt-8 max-w-full">
             <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#3452ef] hover:border-[#3452ef] transition-colors shrink-0 bg-white">
                <span className="text-xl leading-none">&larr;</span>
             </button>
             <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar flex-1 snap-x max-w-full">
               {/* Firstsource */}
               <div className="min-w-[180px] md:min-w-[200px] h-[90px] bg-white border border-[#2db1ff]/20 rounded-[12px] flex flex-col items-center justify-center p-3 hover:shadow-[0_8px_20px_rgba(45,177,255,0.15)] transition-shadow snap-start">
                   <h3 className="text-[18px] font-bold text-gray-800 flex items-center gap-2"><div className="flex gap-0.5 text-orange-500"><div className="w-1.5 h-4 bg-orange-500"></div><div className="w-1.5 h-5 bg-orange-500"></div><div className="w-1.5 h-3 bg-red-500"></div></div> Firstsource</h3>
                   <p className="text-[10px] font-bold text-[#0ea5e9] mt-2 tracking-wide text-center">BPO • 1,200+ seats</p>
               </div>
               
               {/* ResultsCX */}
               <div className="min-w-[180px] md:min-w-[200px] h-[90px] bg-white border border-[#2db1ff]/20 rounded-[12px] flex flex-col items-center justify-center p-3 hover:shadow-[0_8px_20px_rgba(45,177,255,0.15)] transition-shadow snap-start">
                   <h3 className="text-[18px] font-bold text-gray-800 flex items-center gap-1.5"><div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-serif font-black italic">R</div> ResultsCX</h3>
                   <p className="text-[10px] font-bold text-[#0ea5e9] mt-2 tracking-wide text-center">BPO • Pan-India</p>
               </div>
               
               {/* Muthoot Finance */}
               <div className="min-w-[180px] md:min-w-[200px] h-[90px] bg-white border border-[#2db1ff]/20 rounded-[12px] flex flex-col items-center justify-center p-3 hover:shadow-[0_8px_20px_rgba(45,177,255,0.15)] transition-shadow snap-start">
                   <h3 className="text-[16px] font-bold text-gray-800 flex items-center gap-1.5"><div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-transparent border-b-[#facc15]"></div> Muthoot Finance</h3>
                   <p className="text-[10px] font-bold text-[#0ea5e9] mt-2 tracking-wide text-center">BFSI • 80 Branches</p>
               </div>
               
               {/* Chola MS */}
               <div className="min-w-[180px] md:min-w-[200px] h-[90px] bg-white border border-[#2db1ff]/20 rounded-[12px] flex flex-col items-center justify-center p-3 hover:shadow-[0_8px_20px_rgba(45,177,255,0.15)] transition-shadow snap-start">
                   <h3 className="text-[18px] font-bold text-gray-800 flex items-center gap-1.5"><div className="px-1.5 py-0.5 bg-blue-800 text-white text-[10px] font-bold italic">CMS</div> Chola MS</h3>
                   <p className="text-[10px] font-bold text-[#0ea5e9] mt-2 tracking-wide text-center">Insurance • BFSI</p>
               </div>
               
               {/* FiveS Digital */}
               <div className="min-w-[180px] md:min-w-[200px] h-[90px] bg-white border border-[#2db1ff]/20 rounded-[12px] flex flex-col items-center justify-center p-3 hover:shadow-[0_8px_20px_rgba(45,177,255,0.15)] transition-shadow snap-start">
                   <h3 className="text-[18px] font-bold text-gray-800 flex items-center gap-1.5"><div className="bg-green-700 text-white w-5 h-5 text-[11px] font-bold flex items-center justify-center rounded">5S</div> FiveS Digital</h3>
                   <p className="text-[10px] font-bold text-[#0ea5e9] mt-2 tracking-wide text-center">BPO • Growing</p>
               </div>
               
               {/* Metropolis */}
               <div className="min-w-[180px] md:min-w-[200px] h-[90px] bg-white border border-[#2db1ff]/20 rounded-[12px] flex flex-col items-center justify-center p-3 hover:shadow-[0_8px_20px_rgba(45,177,255,0.15)] transition-shadow snap-start">
                   <h3 className="text-[18px] font-bold text-gray-800 flex items-center gap-1.5"><div className="flex"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div><div className="w-2.5 h-2.5 rounded-full bg-blue-500 -ml-1 mix-blend-multiply"></div></div> Metropolis</h3>
                   <p className="text-[10px] font-bold text-[#0ea5e9] mt-2 tracking-wide text-center">Healthcare • Diagnostics</p>
               </div>

               {/* +90 */}
               <div className="min-w-[180px] md:min-w-[200px] h-[90px] bg-[#eef8fe] border border-[#2db1ff]/30 rounded-[12px] flex flex-col items-center justify-center p-3 shadow-sm hover:shadow-md transition-shadow snap-start cursor-pointer hover:bg-[#e0f2fe]">
                   <h3 className="text-[24px] font-bold text-[#0284c7]">+90</h3>
                   <p className="text-[10px] font-bold text-[#0284c7] mt-1 tracking-wide text-center">More clients</p>
               </div>
             </div>
             <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#3452ef] hover:border-[#3452ef] transition-colors shrink-0 bg-white">
                <span className="text-xl leading-none">&rarr;</span>
             </button>
          </div>
        </div>

      </main>

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
                {["Contact Us", "Terms & Conditions", "Privacy Policy", "Return & Refund Policy", "Warranty Policy", "Shipping Policy"].map((item, i) => (
                  <a key={i} href="#" className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item}</a>
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
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-full object-contain" alt="Mastercard" />
              </div>
              <div className="bg-[#1a1f71] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-[75%] object-contain mt-[1px]" alt="Visa" />
              </div>
              <div className="bg-[#003087] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png" className="h-[12px] object-contain" alt="PayPal" />
              </div>
              <div className="bg-[#2d9cdb] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" className="h-[80%] object-contain" alt="Amex" />
              </div>
              <div className="bg-[#6772e5] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png" className="h-[14px] object-contain invert hue-rotate-[180deg] brightness-200" alt="Stripe" />
              </div>
              <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center px-1">
                <span className="text-white text-[10px]">G</span><span className="text-white text-[12px] font-bold">Pay</span>
              </div>
              <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center px-1 border border-gray-700">
                <Apple size={14} className="fill-white text-white mr-0.5" /><span className="text-white text-[10px] font-semibold mt-[1px]">Pay</span>
              </div>
              <div className="bg-[#004b87] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/UnionPay_logo.svg/1280px-UnionPay_logo.svg.png" className="h-[80%] object-contain" alt="UnionPay" />
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
