"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Search, ChevronDown, Shuffle, Heart, ShoppingCart, Apple, Play, Facebook, Instagram, Youtube, MessageCircle, HeartHandshake, ShieldCheck, Truck, Users, Package, Check, ArrowRight, ArrowDown, RefreshCw, Target, Briefcase, Clock, HeartPulse, IndianRupee, ClipboardCheck, Rocket, Shield, ChartColumn, Leaf, Phone, MapPin, Mail, Send, MessageSquare } from "lucide-react";

const faqs = [
  { q: "What is the minimum quantity required to qualify as a bulk order?", a: "To qualify for bulk pricing and specialized organizational support, a minimum order quantity of 10 devices is required." },
  { q: "Do you offer custom configurations matching our IT policies?", a: "Yes, we can pre-configure laptops and desktops with custom OS images, required software, and hardware configurations per your IT specifications before shipping." },
  { q: "How long does the delivery take for Pan-India bulk orders?", a: "Our typical delivery timeframe is 3-7 business days across India. For large custom orders, a delivery schedule will be shared during the quote process." },
  { q: "What kind of warranty and post-sales support do you provide?", a: "We provide comprehensive 1-year hardware warranty on all refurbished and new systems, along with priority helpdesk support and options for specialized AMC covering your entire inventory." },
  { q: "Are your refurbished systems certified and secure?", a: "Absolutely. We follow stringent 6-stage quality checks. Data from previous usage is wiped securely to DoD standards, and every component undergoes rigorous stress-testing." }
];

export default function BulkOrdersPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
          <li><a href="/blog" className="hover:text-gray-700">Blog</a></li>
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
        <div className="w-full relative overflow-hidden py-10 lg:py-16 bg-[#146ba1]">
           <div className="absolute inset-0 bg-gradient-to-r from-[#175d8d] to-[#128dc9] opacity-100"></div>
           
           <div className="w-full mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-10">
                  <div className="w-full lg:w-[60%] xl:w-[60%] flex flex-col items-start gap-5 text-white pr-4">
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
                    Optimize Your Enterprise IT Infrastructure <br />and Save Up to <span className="text-[#faba5b]">70%</span> on Costs
                  </h1>
                  
                  <p className="text-[18px] text-white/95 leading-relaxed font-normal mb-5 mt-2 max-w-xl shadow-none">
                    High-performance refurbished laptops, desktops & enterprise IT equipment for businesses across India. Starting from ₹15,000 with easy and flexible payment plans.
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
              
              <div className="w-full lg:w-[40%] xl:w-[40%] relative mt-12 lg:mt-0">
                 <div className="w-[100%] h-[350px] sm:h-[400px] lg:w-[100%] lg:h-[460px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/10 relative rounded-[30px]">
                     <Image 
                       src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200" 
                       alt="Enterprise IT Team" 
                       fill 
                       className="object-cover object-center rounded-[30px]" 
                       referrerPolicy="no-referrer" 
                     />
                     <div className="absolute inset-0 bg-[#0d7fba]/10 mix-blend-overlay rounded-[30px]"></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Stats & Trusted By Section */}
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 lg:py-20 bg-[#f6f5f8]">
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

        {/* Full Asset Lifecycle Management Section */}
        <div className="w-full bg-[#f6f5f8] py-20 lg:py-24">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="mb-14 max-w-4xl">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[32px] md:text-[40px] font-medium text-[#111] mb-4 tracking-tight"
              >
                What <span className="text-[#0d7fba] font-bold">Comsri</span> Does : <span className="text-[#0d7fba]">Full Asset Lifecycle Management</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-[17px] text-[#555] leading-relaxed max-w-3xl font-medium"
              >
                Comsri delivers a closed-loop IT asset lifecycle programme — from procurement through to certified disposal — designed specifically for compliance-intensive environments.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Card 1 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-gray-100 rounded-[24px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-[#eef8fe] rounded-2xl flex items-center justify-center mb-6 text-[#0d7fba] group-hover:bg-[#0d7fba] group-hover:text-white transition-colors">
                  <RefreshCw size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3">Buyback of Old Assets</h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  Structured buyback of your existing devices to immediately recover residual value and reduce write-off exposure — with certified documentation for every asset collected.
                </p>
              </motion.div>

              {/* Card 2 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-gray-100 rounded-[24px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-[#eef8fe] rounded-2xl flex items-center justify-center mb-6 text-[#0d7fba] group-hover:bg-[#0d7fba] group-hover:text-white transition-colors">
                  <Target size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3">Refurbish & Redeploy</h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  Certified refurbishment and internal redeployment ensures assets reach full potential before end-of-life consideration — with a 72+ point QC checklist on every device.
                </p>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white border border-gray-100 rounded-[24px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-[#eef8fe] rounded-2xl flex items-center justify-center mb-6 text-[#0d7fba] group-hover:bg-[#0d7fba] group-hover:text-white transition-colors">
                  <Briefcase size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3">Refurbished Device Supply</h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  Grade-A refurbished devices supplied with full QC documentation, warranty coverage, and traceability records — ready for deployment the moment they arrive.
                </p>
              </motion.div>

              {/* Card 4 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-white border border-gray-100 rounded-[24px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-[#eef8fe] rounded-2xl flex items-center justify-center mb-6 text-[#0d7fba] group-hover:bg-[#0d7fba] group-hover:text-white transition-colors">
                  <Clock size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3">AMC & Uptime Management</h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  Annual Maintenance Contracts with defined SLAs and fast-swap protocols to minimise operational disruption — including advance replacement for mission-critical terminals.
                </p>
              </motion.div>

              {/* Card 5 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="bg-white border border-gray-100 rounded-[24px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-[#eef8fe] rounded-2xl flex items-center justify-center mb-6 text-[#0d7fba] group-hover:bg-[#0d7fba] group-hover:text-white transition-colors">
                  <HeartPulse size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3">CSR Redeployment</h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  End-of-life assets redirected through verified CSR channels with full visibility reporting for ESG disclosures — CPCB/EPR certified disposal included.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="w-full bg-[#f6f5f8] py-20 lg:py-24 border-t border-gray-100">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="mb-14 max-w-4xl">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[32px] md:text-[38px] font-medium text-[#0d7fba] mb-4 tracking-tight"
              >
                Why India&apos;s Leading Enterprises Choose Comsri
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-[17px] text-[#666] leading-relaxed max-w-3xl font-medium"
              >
                The most trusted name in enterprise refurbished IT — quality you can count on, savings you can prove.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Card 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white border border-gray-100 relative overflow-hidden rounded-[20px] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(13,127,186,0.1)] hover:border-[#0d7fba]/30 transition-all duration-300 group z-10"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-500 group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-300 shadow-sm">
                  <IndianRupee size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3 group-hover:text-[#0d7fba] transition-colors relative inline-block">
                  Save Up to 70%
                </h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  Get enterprise-grade ThinkPad, Latitude & EliteBook devices at a fraction of the new price.
                </p>
              </motion.div>

              {/* Card 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
                whileHover={{ y: -8 }}
                className="bg-white border border-gray-100 relative overflow-hidden rounded-[20px] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(13,127,186,0.1)] hover:border-[#0d7fba]/30 transition-all duration-300 group z-10"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-green-500/10 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-500 group-hover:scale-110 group-hover:bg-green-100 transition-all duration-300 shadow-sm">
                  <ClipboardCheck size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3 group-hover:text-[#0d7fba] transition-colors">
                  72+ Quality Checks
                </h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  Every device goes through rigorous multi-point inspection before it reaches your team.
                </p>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
                whileHover={{ y: -8 }}
                className="bg-white border border-gray-100 relative overflow-hidden rounded-[20px] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(13,127,186,0.1)] hover:border-[#0d7fba]/30 transition-all duration-300 group z-10"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-rose-500/10 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 text-rose-500 group-hover:scale-110 group-hover:bg-rose-100 transition-all duration-300 shadow-sm">
                  <Rocket size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3 group-hover:text-[#0d7fba] transition-colors">
                  Fast Deployment
                </h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  From order to your desk in 3-7 days anywhere in India. 500 devices, no problem.
                </p>
              </motion.div>

              {/* Card 4 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
                whileHover={{ y: -8 }}
                className="bg-white border border-gray-100 relative overflow-hidden rounded-[20px] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(13,127,186,0.1)] hover:border-[#0d7fba]/30 transition-all duration-300 group z-10"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#0d7fba]/10 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-14 h-14 bg-[#eef8fe] rounded-2xl flex items-center justify-center mb-6 text-[#0d7fba] group-hover:scale-110 group-hover:bg-[#e0f2fe] transition-all duration-300 shadow-sm">
                  <Shield size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3 group-hover:text-[#0d7fba] transition-colors">
                  1-3 Year Warranty
                </h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  Comprehensive warranty with pan-India service network. Extended plans available.
                </p>
              </motion.div>

              {/* Card 5 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
                whileHover={{ y: -8 }}
                className="bg-white border border-gray-100 relative overflow-hidden rounded-[20px] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(13,127,186,0.1)] hover:border-[#0d7fba]/30 transition-all duration-300 group z-10"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 group-hover:bg-purple-100 transition-all duration-300 shadow-sm">
                  <ChartColumn size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3 group-hover:text-[#0d7fba] transition-colors">
                  Flexible Payments
                </h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  Lease, rent, or buy. OpEx-friendly models to protect your cash flow and balance sheet.
                </p>
              </motion.div>

              {/* Card 6 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.6 }}
                whileHover={{ y: -8 }}
                className="bg-white border border-gray-100 relative overflow-hidden rounded-[20px] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(13,127,186,0.1)] hover:border-[#0d7fba]/30 transition-all duration-300 group z-10"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300 shadow-sm">
                  <Leaf size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3 group-hover:text-[#0d7fba] transition-colors">
                  ESG Compliant
                </h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  Reduce e-waste by 65%. Meet sustainability targets and CSR commitments effortlessly.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
        {/* Contact Form Section */}
        <div 
          className="bg-[#0B1120] pt-12 lg:pt-16 pb-12 lg:pb-16 relative overflow-hidden"
          style={{
            borderRadius: '30px',
            marginLeft: '20px',
            marginRight: '20px',
            width: '100%',
            maxWidth: 'calc(100% - 40px)'
          }}
        >
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[100px]"></div>
              <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#ffc300]/10 rounded-full blur-[100px]"></div>
            </div>

          <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row relative z-10 px-6 lg:px-12">
            
            {/* Left Column (Text & Contact Info) */}
            <div className="w-full lg:w-[55%] py-8 lg:py-8 lg:pr-16 xl:pr-24 flex flex-col justify-center gap-10 lg:gap-12 relative z-10">
               <div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 border border-[#ffc300]/30 rounded-full py-1.5 px-3 mb-8"
                  >
                     <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-black shadow-sm">
                       <MessageSquare size={14} />
                     </div>
                     <span className="text-[#ffc300] font-medium text-[14px] pr-2">Start A Project</span>
                  </motion.div>

                  <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-[40px] md:text-[56px] lg:text-[64px] font-bold text-white leading-[1.05] tracking-tight mb-6"
                  >
                    Let&apos;s Build Your<br/>Digital Future
                  </motion.h2>

                  <motion.p 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-[16px] md:text-[18px] text-white/50 leading-relaxed max-w-lg mb-8 font-medium"
                  >
                    Ready to launch your next project? Fill out the form below or reach out directly to start a conversation about your business needs and how we can help you grow.
                  </motion.p>
               </div>

               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.3 }}
                 className="flex flex-col sm:flex-row flex-wrap gap-8 lg:gap-x-12 gap-y-6"
               >
                  <div className="flex items-center gap-4 group">
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                        <Phone size={20} strokeWidth={2.5} />
                     </div>
                     <span className="text-white font-semibold text-[15px] group-hover:text-[#ffc300] transition-colors">+1(555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-4 group">
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                        <MapPin size={20} strokeWidth={2.5} />
                     </div>
                     <span className="text-white font-semibold text-[15px] group-hover:text-[#ffc300] transition-colors">San Francisco, CA</span>
                  </div>
                  <div className="flex items-center gap-4 group mt-2 sm:mt-0 xl:mt-2">
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                        <Mail size={20} strokeWidth={2.5} />
                     </div>
                     <span className="text-white font-semibold text-[15px] group-hover:text-[#ffc300] transition-colors">hello@digitalagency.com</span>
                  </div>
               </motion.div>
            </div>

                        {/* Right Column (Form) */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 80, damping: 20 }}
              className="w-full lg:w-[45%] py-8 lg:py-12 flex items-center"
            >
               <div className="w-full h-full bg-[#ffc300] rounded-[24px] lg:rounded-[32px] p-8 lg:p-12 shadow-[0_20px_50px_rgba(255,195,0,0.15)] flex flex-col justify-center">
                  <div className="space-y-6 w-full">
                     {/* Row 1 */}
                     <motion.div
                       className="flex flex-col md:flex-row gap-6 w-full"
                       initial={{ opacity: 0, y: 15 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: 0.3 }}
                     >
                       <div className="w-full md:w-1/2">
                         <label className="block text-[13px] font-bold text-[#b38800] mb-2 uppercase tracking-wide">Your Name</label>
                         <input 
                           type="text" 
                           placeholder="Full Name" 
                           className="w-full bg-white/30 border-none rounded-[16px] py-4 px-6 text-[#131212] placeholder-[#131212]/40 text-[16px] outline-none focus:bg-white/50 transition-all font-medium shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transform-gpu hover:-translate-y-1 duration-300"
                         />
                       </div>
                       <div className="w-full md:w-1/2">
                         <label className="block text-[13px] font-bold text-[#b38800] mb-2 uppercase tracking-wide">Organization Name</label>
                         <input 
                           type="text" 
                           placeholder="Organization" 
                           className="w-full bg-white/30 border-none rounded-[16px] py-4 px-6 text-[#131212] placeholder-[#131212]/40 text-[16px] outline-none focus:bg-white/50 transition-all font-medium shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transform-gpu hover:-translate-y-1 duration-300"
                         />
                       </div>
                     </motion.div>

                     {/* Row 2 */}
                     <motion.div
                       className="flex flex-col md:flex-row gap-6 w-full"
                       initial={{ opacity: 0, y: 15 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: 0.4 }}
                     >
                       <div className="w-full md:w-1/2">
                         <label className="block text-[13px] font-bold text-[#b38800] mb-2 uppercase tracking-wide">Organization Mail</label>
                         <input 
                           type="email" 
                           placeholder="Email Address" 
                           className="w-full bg-white/30 border-none rounded-[16px] py-4 px-6 text-[#131212] placeholder-[#131212]/40 text-[16px] outline-none focus:bg-white/50 transition-all font-medium shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transform-gpu hover:-translate-y-1 duration-300"
                         />
                       </div>
                       <div className="w-full md:w-1/2">
                         <label className="block text-[13px] font-bold text-[#b38800] mb-2 uppercase tracking-wide">Phone Number</label>
                         <input 
                           type="tel" 
                           placeholder="Phone Number" 
                           className="w-full bg-white/30 border-none rounded-[16px] py-4 px-6 text-[#131212] placeholder-[#131212]/40 text-[16px] outline-none focus:bg-white/50 transition-all font-medium shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transform-gpu hover:-translate-y-1 duration-300"
                         />
                       </div>
                     </motion.div>

                     {/* Row 3 */}
                     <motion.div
                       className="flex flex-col md:flex-row gap-6 w-full"
                       initial={{ opacity: 0, y: 15 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: 0.5 }}
                     >
                       <div className="w-full md:w-1/2">
                         <label className="block text-[13px] font-bold text-[#b38800] mb-2 uppercase tracking-wide">Device Category</label>
                         <div className="relative">
                           <select defaultValue="" className="w-full bg-white/30 border-none rounded-[16px] py-4 px-6 text-[#131212] text-[16px] outline-none focus:bg-white/50 transition-all font-medium appearance-none cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transform-gpu hover:-translate-y-1 duration-300">
                             <option value="" disabled className="text-[#131212]/50 bg-white">Select Category</option>
                             <option value="desktop" className="text-[#131212] bg-white">Laptops & Desktops</option>
                             <option value="mobile" className="text-[#131212] bg-white">Mobiles & Tablets</option>
                             <option value="workstation" className="text-[#131212] bg-white">Workstations</option>
                             <option value="other" className="text-[#131212] bg-white">Other Devices</option>
                           </select>
                           <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#131212]/50">
                             <ChevronDown size={20} />
                           </div>
                         </div>
                       </div>
                       <div className="w-full md:w-1/2">
                         <label className="block text-[13px] font-bold text-[#b38800] mb-2 uppercase tracking-wide">Quantity</label>
                         <input 
                           type="number" 
                           placeholder="Quantity" 
                           min="1"
                           className="w-full bg-white/30 border-none rounded-[16px] py-4 px-6 text-[#131212] placeholder-[#131212]/40 text-[16px] outline-none focus:bg-white/50 transition-all font-medium shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transform-gpu hover:-translate-y-1 duration-300"
                         />
                       </div>
                     </motion.div>

                     {/* Row 4 */}
                     <motion.div
                       initial={{ opacity: 0, y: 15 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: 0.6 }}
                     >
                       <label className="block text-[13px] font-bold text-[#b38800] mb-2 uppercase tracking-wide">Additional Information</label>
                       <textarea 
                           placeholder="Write your message or requirements here..." 
                           rows={4}
                           className="w-full bg-white/30 border-none rounded-[16px] py-4 px-6 text-[#131212] placeholder-[#131212]/40 text-[16px] outline-none focus:bg-white/50 transition-all font-medium shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transform-gpu hover:-translate-y-1 duration-300 resize-none"
                        ></textarea>
                     </motion.div>

                     <motion.div 
                       className="pt-4"
                       initial={{ opacity: 0, y: 15 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: 0.7 }}
                     >
                       <button className="bg-[#0B1120] hover:bg-[#1e293b] text-white rounded-full py-4 px-8 inline-flex items-center gap-3 transition-colors group shadow-lg hover:shadow-xl">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                             <Send size={14} className="ml-[-2px] mt-[1px]" />
                          </div>
                          <span className="font-bold text-[16px] pr-2 group-hover:translate-x-1 transition-transform">Submit Request</span>
                       </button>
                     </motion.div>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>

        
        {/* FAQs Section */}
        <div className="w-full bg-[#f6f5f8] py-20 lg:py-24 border-t border-gray-100">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16">
            {/* Left Content */}
            <div className="w-full lg:w-[40%] flex flex-col items-start pt-4">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="inline-flex items-center gap-2 border border-[#0d7fba]/20 bg-[#eef8fe] rounded-full py-1.5 px-3 mb-6"
               >
                 <MessageCircle size={14} className="text-[#0d7fba]" />
                 <span className="text-[#0d7fba] font-medium text-[13px] tracking-wide uppercase">Common Questions</span>
               </motion.div>
               <motion.h2 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.1 }}
                 className="text-[36px] md:text-[45px] lg:text-[50px] font-bold text-[#111] leading-[1.1] tracking-tight mb-6"
               >
                 Everything you need to know about bulk orders.
               </motion.h2>
               <motion.p 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.2 }}
                 className="text-[17px] text-[#666] leading-relaxed mb-10 max-w-md"
               >
                 Find answers to common questions about our bulk ordering process, organizational discounts, and post-sales support.
               </motion.p>
               
               <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.3 }}
                 className="p-6 bg-white rounded-[24px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md"
               >
                 <div className="w-12 h-12 bg-[#fff5eb] rounded-full flex items-center justify-center mb-4">
                   <Phone size={20} className="text-orange-500" />
                 </div>
                 <h4 className="text-[18px] font-bold text-[#111] mb-2">Still have questions?</h4>
                 <p className="text-[15px] text-[#666] mb-4">Can&apos;t find the answer you&apos;re looking for? Please chat to our friendly team.</p>
                 <button className="text-[#0d7fba] font-bold text-[15px] flex items-center gap-2 hover:gap-3 transition-all">
                   Get in touch <ArrowRight size={16} />
                 </button>
               </motion.div>
            </div>
            
            {/* Right Accordion */}
            <div className="w-full lg:w-[60%] flex flex-col gap-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                    key={index}
                    className={`bg-white rounded-[24px] border ${isOpen ? 'border-[#0d7fba]/30 shadow-[0_10px_40px_rgba(13,127,186,0.1)]' : 'border-gray-100 shadow-sm hover:border-[#0d7fba]/20'} overflow-hidden transition-all duration-500`}
                  >
                    <button 
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full text-left px-8 py-6 flex items-center justify-between focus:outline-none group"
                    >
                       <span className={`text-[17px] md:text-[19px] font-bold pr-8 ${isOpen ? 'text-[#0d7fba]' : 'text-[#111] group-hover:text-[#0d7fba]'} transition-colors`}>{faq.q}</span>
                       <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${isOpen ? 'bg-[#0d7fba] text-white rotate-180' : 'bg-[#f6f5f8] text-[#111] group-hover:bg-[#eef8fe] group-hover:text-[#0d7fba]'}`}>
                         <ChevronDown size={20} />
                       </span>
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        >
                           <div className="px-8 pb-8 pt-0 text-[16px] text-[#666] leading-relaxed">
                             {faq.a}
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
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
