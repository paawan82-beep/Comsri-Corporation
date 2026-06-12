"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Apple, Play, Facebook, Instagram, Youtube, MessageCircle, RefreshCw, Target, Briefcase, Clock, HeartPulse, IndianRupee, ClipboardCheck, Rocket, Shield, ChartColumn, Leaf, Phone, MapPin, Mail, Send, ChevronDown, ArrowRight, Trash2 } from "lucide-react";
import Header from "../Header";

const faqs = [
  { q: "Where can I buy bulk laptops in India for my business?", a: "Comsri helps businesses buy bulk laptops in India with competitive pricing, enterprise support, and nationwide delivery. We supply quality-tested refurbished laptops, desktops, and mini PCs for startups, SMEs, educational institutions, and large enterprises." },
  { q: "Is Comsri a trusted bulk computer supplier in India?", a: "Yes. Comsri is a trusted bulk computer supplier in India, providing refurbished laptops, bulk desktops, mini PCs, and enterprise IT equipment. Every device undergoes rigorous testing before deployment and is backed by warranty support." },
  { q: "Do you offer refurbished laptops in India for enterprises?", a: "Yes. We provide enterprise-grade refurbished laptops in India from leading brands such as Dell, HP, and Lenovo. Our refurbishment process ensures reliable performance, quality assurance, and significant cost savings compared to new devices." },
  { q: "Can I order bulk desktops in India for office deployments?", a: "Absolutely. Comsri supplies bulk desktops in India for corporate offices, educational institutions, call centers, government projects, and large-scale workforce deployments. We can fulfill both small and high-volume requirements." },
  { q: "Do you supply mini PCs in India for business use?", a: "Yes. We offer mini PCs in India that are ideal for modern offices, reception areas, remote work setups, educational labs, and space-constrained environments. Mini PCs deliver enterprise performance while reducing space and power consumption." },
  { q: "What kind of warranty and after-sales support do you provide for bulk orders?", a: "We provide comprehensive 1-year warranty on all refurbished systems, along with priority helpdesk support and options for specialized AMC covering your entire inventory." },
];

export default function BulkOrdersClient() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Bulk IT Hardware Procurement",
    "alternateName": "Bulk Laptops & Desktops Supply India",
    "description": "Comsri Corporation provides bulk procurement of quality-tested refurbished and new laptops, desktops, workstations, and mini PCs for enterprises, educational institutions, and government organizations across India. Includes 72+ point QC checks, 1-year warranty, flexible payment, and pan-India delivery.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Comsri Corporation",
      "url": "https://comsri.com",
      "telephone": "+91-8601-899-899",
      "email": "info@comsri.com",
      "foundingDate": "2020",
      "priceRange": "₹₹",
      "currenciesAccepted": "INR",
      "paymentAccepted": "Cash, Credit Card, Net Banking, UPI",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Office No.-T-15 Pinnacle Business Park, MC Rd, Shanti Nagar, Andheri East",
        "addressLocality": "Mumbai",
        "addressRegion": "Maharashtra",
        "postalCode": "400093",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "19.1196",
        "longitude": "72.8638"
      },
      "areaServed": {
        "@type": "Country",
        "name": "India"
      },
      "sameAs": [
        "https://facebook.com/comsricorporation",
        "https://instagram.com/comsricorporation",
        "https://youtube.com/comsricorporation",
        "https://x.com/comsri_corp"
      ]
    },
    "serviceType": "Bulk IT Hardware Supply",
    "areaServed": "India",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Bulk IT Hardware Catalog",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Bulk Refurbished Laptops India" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Bulk Refurbished Desktops India" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Bulk Mini PCs India" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Refurbished Workstations India" } }
      ]
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://comsri.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Bulk Orders",
        "item": "https://comsri.com/bulk-orders"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f6f5f8] flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />

      <main className="flex-1 w-full bg-[#f6f5f8]">
        {/* Breadcrumb Header */}
        <div className="bg-[#f2ece4] w-full py-2.5 border-b border-gray-200/50">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-start gap-4">
            <span className="text-[28px] font-medium text-[#111] tracking-tight">Bulk Orders</span>
            <p className="text-[15px] text-[#777] font-medium mt-1">Home <span className="mx-1.5 text-gray-400">/</span> <span className="text-[#111] font-bold">Bulk Orders</span></p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="w-full relative overflow-hidden py-10 lg:py-16 bg-[#146ba1]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#175d8d] to-[#128dc9] opacity-100"></div>

          <div className="w-full mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-10">
            <div className="w-full lg:w-[60%] xl:w-[60%] flex flex-col items-start gap-5 text-white pr-4">
              <div className="flex flex-nowrap overflow-x-auto scrollbar-none gap-2 mb-2 w-full pb-1.5 -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
                <span className="shrink-0 bg-white/10 border border-white/20 text-white text-[12.5px] font-normal py-1.5 px-3.5 rounded-full flex items-center gap-2 hover:bg-white/20 transition-colors cursor-default backdrop-blur-sm shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.6)]"></span> NSE Listed
                </span>
                <span className="shrink-0 bg-white/10 border border-white/20 text-white text-[12.5px] font-normal py-1.5 px-3.5 rounded-full flex items-center gap-2 hover:bg-white/20 transition-colors cursor-default backdrop-blur-sm shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.6)]"></span> 1000+ Enterprise Clients
                </span>
                <span className="shrink-0 bg-white/10 border border-white/20 text-white text-[12.5px] font-normal py-1.5 px-3.5 rounded-full flex items-center gap-2 hover:bg-white/20 transition-colors cursor-default backdrop-blur-sm shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.6)]"></span> IIT/IIM Alumni
                </span>
              </div>

              <h1 className="text-[28px] xs:text-[32px] sm:text-[36px] md:text-[42px] font-medium leading-[1.15] sm:leading-[1.1] tracking-tight mb-2 text-white">
                Cut Enterprise IT Costs by <span className="text-[#faba5b]">70%</span> <br />with Bulk Laptops, Desktops & Mini PCs
              </h1>

              <p className="text-[15px] sm:text-[16px] md:text-[18px] text-white/95 leading-relaxed font-normal mb-5 mt-2 max-w-xl shadow-none">
                Buy enterprise-grade <Link href="/shop?category=112" className="underline hover:text-[#faba5b] transition-colors">refurbished laptops</Link>, bulk laptops, <Link href="/shop?category=129" className="underline hover:text-[#faba5b] transition-colors">desktops</Link>, <Link href="/shop?category=137" className="underline hover:text-[#faba5b] transition-colors">mini PCs</Link>, and IT equipment in India for businesses and enterprises. Starting from ₹15,000 with bulk pricing, flexible payment options, and fast nationwide delivery.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full sm:w-auto">
                <button className="bg-[#00c2e0] hover:bg-[#00a8c2] text-white font-normal py-3 sm:py-3.5 px-5 sm:px-7 rounded-[8px] flex items-center justify-center gap-2 transition-colors text-[15px] sm:text-[16px] shadow-lg shadow-cyan-500/20 w-full sm:w-auto">
                  Request Custom Quote
                </button>
                <button className="bg-transparent hover:bg-white/10 border border-white/30 text-white font-normal py-3 sm:py-3.5 px-5 sm:px-7 rounded-[8px] flex items-center justify-center gap-2 transition-colors text-[15px] sm:text-[16px] w-full sm:w-auto">
                  Calculate Your Savings
                </button>
              </div>

              <div className="flex flex-wrap justify-start gap-x-4 gap-y-3 text-[13.5px] sm:text-[14.5px] font-normal text-white/90 w-full">
                <span className="flex items-center gap-1.5"><span className="text-[#4ade80]">✓</span> ISO Certified/R2 Certified</span>
                <span className="flex items-center gap-1.5"><span className="text-[#4ade80]">✓</span> 1-year warranty</span>
                <span className="flex items-center gap-1.5"><span className="text-[#4ade80]">✓</span> Pan-India delivery</span>
                <span className="flex items-center gap-1.5"><span className="text-[#4ade80]">✓</span> Priority Support</span>
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

            <div className="w-full lg:w-[65%] xl:w-[70%] grid grid-cols-3 sm:flex sm:flex-wrap justify-items-center sm:justify-center lg:justify-end gap-x-6 sm:gap-x-12 md:gap-x-16 gap-y-6">
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
              <div className="col-start-2 sm:col-auto flex flex-col items-center">
                <h3 className="text-[32px] md:text-[38px] text-[#2563eb] font-bold leading-none mb-1.5 flex items-center gap-0.5">4.8<span className="text-[26px]">★</span></h3>
                <span className="text-[10px] md:text-[11px] text-gray-500 font-bold tracking-widest uppercase">GOOGLE RATING</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-8 max-w-full">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#3452ef] hover:border-[#3452ef] transition-colors shrink-0 bg-white">
              <span className="text-xl leading-none">&larr;</span>
            </button>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none flex-1 snap-x max-w-full">
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
              <h2 className="text-[32px] md:text-[40px] font-medium text-[#111] mb-4 tracking-tight">
                What <span className="text-[#0d7fba] font-bold">Comsri</span> Does : <span className="text-[#0d7fba]">Bulk Laptops, Desktops & Mini PCs Solutions for Businesses in India</span>
              </h2>
              <p className="text-[17px] text-[#555] leading-relaxed max-w-3xl font-medium">
                Comsri delivers a closed-loop IT asset lifecycle programme from bulk laptop procurement and <Link href="/shop?category=129" className="text-[#0d7fba] hover:underline">refurbished desktops</Link> to deployment and certified disposal designed for compliance intensive businesses across India.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Card 1 */}
              <div className="bg-white border border-gray-100 rounded-[24px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group">
                <div className="w-14 h-14 bg-[#eef8fe] rounded-2xl flex items-center justify-center mb-6 text-[#0d7fba] group-hover:bg-[#0d7fba] group-hover:text-white transition-colors">
                  <RefreshCw size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3">Buyback of Old Assets</h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  Structured buyback solutions for your existing devices that help recover residual value quickly while minimizing write-off risks  backed by certified documentation for every collected asset.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-gray-100 rounded-[24px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group">
                <div className="w-14 h-14 bg-[#eef8fe] rounded-2xl flex items-center justify-center mb-6 text-[#0d7fba] group-hover:bg-[#0d7fba] group-hover:text-white transition-colors">
                  <Target size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3">Refurbish & Redeploy</h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  Our certified refurbishment and redeployment process extends asset usability before end-of-life consideration, with every device undergoing a rigorous 72+ point QC assessment.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-gray-100 rounded-[24px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group">
                <div className="w-14 h-14 bg-[#eef8fe] rounded-2xl flex items-center justify-center mb-6 text-[#0d7fba] group-hover:bg-[#0d7fba] group-hover:text-white transition-colors">
                  <Briefcase size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3">Refurbished Device Supply</h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  Supply of A+ Grade refurbished devices backed by comprehensive QC documentation, warranty coverage, and full traceability ensuring immediate deployment upon delivery.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-white border border-gray-100 rounded-[24px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group">
                <div className="w-14 h-14 bg-[#eef8fe] rounded-2xl flex items-center justify-center mb-6 text-[#0d7fba] group-hover:bg-[#0d7fba] group-hover:text-white transition-colors">
                  <Clock size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3">AMC & Uptime Management</h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  Annual Maintenance Contracts with defined SLAs and fast-swap protocols to minimise operational disruption — including advance replacement for mission-critical terminals.
                </p>
              </div>

              {/* Card 5 */}
              <div className="bg-white border border-gray-100 rounded-[24px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group">
                <div className="w-14 h-14 bg-[#eef8fe] rounded-2xl flex items-center justify-center mb-6 text-[#0d7fba] group-hover:bg-[#0d7fba] group-hover:text-white transition-colors">
                  <HeartPulse size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3">CSR Redeployment</h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  Ensure responsible end-of-life asset management through verified CSR channels, supported by full visibility reporting for ESG compliance and CPCB/EPR-certified disposal.
                </p>
              </div>

              {/* Card 6 */}
              <div className="bg-white border border-gray-100 rounded-[24px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group">
                <div className="w-14 h-14 bg-[#eef8fe] rounded-2xl flex items-center justify-center mb-6 text-[#0d7fba] group-hover:bg-[#0d7fba] group-hover:text-white transition-colors">
                  <Trash2 size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3">E-Waste Recycling</h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  Ensure secure and responsible e-waste recycling through certified processes, complete traceability reporting, and CPCB/EPR-compliant disposal for sustainable end-of-life asset management.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="w-full bg-[#f6f5f8] py-20 lg:py-24 border-t border-gray-100">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="mb-14 max-w-4xl">
              <h2 className="text-[32px] md:text-[38px] font-medium text-[#0d7fba] mb-4 tracking-tight">
                Why Businesses Across India Choose Comsri for Bulk Laptops and Desktops
              </h2>
              <p className="text-[17px] text-[#666] leading-relaxed max-w-3xl font-medium">
                As a leading corporate laptop supplier in India, Comsri provides bulk laptops, bulk desktops, mini PCs, and refurbished laptops for enterprises nationwide. Our quality tested systems, flexible procurement options, and dedicated support help businesses reduce IT costs without compromising performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Card 1 */}
              <div className="bg-white border border-gray-100 relative overflow-hidden rounded-[20px] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(13,127,186,0.1)] hover:border-[#0d7fba]/30 hover:-translate-y-2 transition-all duration-300 group z-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-500 group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-300 shadow-sm">
                  <IndianRupee size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3 group-hover:text-[#0d7fba] transition-colors relative inline-block">
                  Save Up to 70%
                </h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  Buy bulk laptops from leading business series including ThinkPad, Latitude, and EliteBook ideal for enterprises seeking reliable, cost-effective IT solutions.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-gray-100 relative overflow-hidden rounded-[20px] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(13,127,186,0.1)] hover:border-[#0d7fba]/30 hover:-translate-y-2 transition-all duration-300 group z-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-green-500/10 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-500 group-hover:scale-110 group-hover:bg-green-100 transition-all duration-300 shadow-sm">
                  <ClipboardCheck size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3 group-hover:text-[#0d7fba] transition-colors">
                  72+ Quality Checks
                </h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  Every refurbished laptop, desktop, and mini PC undergoes rigorous multi-point testing to ensure reliable performance, quality, and enterprise ready deployment.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-gray-100 relative overflow-hidden rounded-[20px] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(13,127,186,0.1)] hover:border-[#0d7fba]/30 hover:-translate-y-2 transition-all duration-300 group z-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-rose-500/10 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 text-rose-500 group-hover:scale-110 group-hover:bg-rose-100 transition-all duration-300 shadow-sm">
                  <Rocket size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3 group-hover:text-[#0d7fba] transition-colors">
                  Fast Deployment
                </h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  Get bulk laptops, desktops, and mini PCs delivered across India in 6–7 days, backed by reliable inventory and enterprise scale fulfillment.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-white border border-gray-100 relative overflow-hidden rounded-[20px] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(13,127,186,0.1)] hover:border-[#0d7fba]/30 hover:-translate-y-2 transition-all duration-300 group z-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#0d7fba]/10 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-14 h-14 bg-[#eef8fe] rounded-2xl flex items-center justify-center mb-6 text-[#0d7fba] group-hover:scale-110 group-hover:bg-[#e0f2fe] transition-all duration-300 shadow-sm">
                  <Shield size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3 group-hover:text-[#0d7fba] transition-colors">
                  1-3 Year Warranty
                </h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  Comprehensive warranty coverage backed by a pan-India service network, with extended protection plans available for enterprise deployments.
                </p>
              </div>

              {/* Card 5 */}
              <div className="bg-white border border-gray-100 relative overflow-hidden rounded-[20px] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(13,127,186,0.1)] hover:border-[#0d7fba]/30 hover:-translate-y-2 transition-all duration-300 group z-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 group-hover:bg-purple-100 transition-all duration-300 shadow-sm">
                  <ChartColumn size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3 group-hover:text-[#0d7fba] transition-colors">
                  Flexible Payments
                </h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  Flexible payment options and bulk pricing designed to help businesses optimize IT budgets without compromising on quality.
                </p>
              </div>

              {/* Card 6 */}
              <div className="bg-white border border-gray-100 relative overflow-hidden rounded-[20px] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(13,127,186,0.1)] hover:border-[#0d7fba]/30 hover:-translate-y-2 transition-all duration-300 group z-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300 shadow-sm">
                  <Leaf size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-[#111] mb-3 group-hover:text-[#0d7fba] transition-colors">
                  ESG Compliant
                </h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  Reduce IT waste with refurbished laptops, desktops, and mini PCs that deliver enterprise performance while supporting sustainable business practices.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div
          className="bg-[#0B1120] pt-12 lg:pt-16 pb-12 lg:pb-16 relative overflow-hidden mx-5 lg:mx-auto rounded-[30px]"
          style={{
            maxWidth: '1520px',
            width: 'calc(100% - 40px)'
          }}
        >
          {/* Background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#ffc300]/10 rounded-full blur-[100px]"></div>
          </div>

          <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row relative z-10 px-6 lg:px-12 gap-8 lg:gap-12">
            {/* Left Column */}
            <div className="w-full lg:w-[55%] py-8 lg:py-12 lg:pr-8 xl:pr-16 flex flex-col justify-between gap-10 relative z-10 text-white">
              <div>
                <div className="inline-flex items-center gap-2 border border-[#ffc300]/30 rounded-full py-1.5 px-3 mb-8">
                  <span className="text-[#ffc300] font-medium text-[14px]">Get Your Custom Bulk IT Quote Today</span>
                </div>
                <h2 className="text-[40px] md:text-[56px] lg:text-[64px] font-bold leading-[1.05] tracking-tight mb-6">
                  Request a Bulk Laptop & IT Equipment Quote
                </h2>
                <p className="text-[16px] md:text-[18px] text-white/50 leading-relaxed max-w-2xl font-medium">
                  Partner with one of India's trusted corporate laptop suppliers for bulk IT procurement. From bulk laptops in India and bulk desktops in India to refurbished laptops in India and mini PCs for enterprise deployments, Comsri delivers quality-tested devices backed by warranty support, flexible payment options, and nationwide logistics. Whether you're looking to buy bulk laptops, source wholesale laptops in India, wholesale computers in India, or purchase used laptops in bulk, our team is ready to provide a customized quote for your business.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-8 lg:gap-x-12 gap-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-white font-semibold text-[15px]">+91 8601-899-899</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white font-semibold text-[15px]">Mumbai, MH</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white font-semibold text-[15px]">info@comsri.com</span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-[45%] py-8 lg:py-12 flex items-stretch">
              <div className="w-full h-full bg-[#ffc300] rounded-[24px] lg:rounded-[32px] p-8 lg:p-12 shadow-[0_20px_50px_rgba(255,195,0,0.15)] flex flex-col justify-center">
                <div className="space-y-6 w-full">
                  <div className="flex flex-col md:flex-row gap-6 w-full">
                    <div className="w-full md:w-1/2">
                      <label className="block text-[13px] font-bold text-[#b38800] mb-2 uppercase tracking-wide">Your Name</label>
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full bg-white/30 border-none rounded-[16px] py-4 px-6 text-[#131212] placeholder-[#131212]/40 text-[16px] outline-none focus:bg-white/50 transition-all font-medium"
                      />
                    </div>
                    <div className="w-full md:w-1/2">
                      <label className="block text-[13px] font-bold text-[#b38800] mb-2 uppercase tracking-wide">Organization Name</label>
                      <input
                        type="text"
                        placeholder="Organization"
                        className="w-full bg-white/30 border-none rounded-[16px] py-4 px-6 text-[#131212] placeholder-[#131212]/40 text-[16px] outline-none focus:bg-white/50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 w-full">
                    <div className="w-full md:w-1/2">
                      <label className="block text-[13px] font-bold text-[#b38800] mb-2 uppercase tracking-wide">Organization Mail</label>
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full bg-white/30 border-none rounded-[16px] py-4 px-6 text-[#131212] placeholder-[#131212]/40 text-[16px] outline-none focus:bg-white/50 transition-all font-medium"
                      />
                    </div>
                    <div className="w-full md:w-1/2">
                      <label className="block text-[13px] font-bold text-[#b38800] mb-2 uppercase tracking-wide">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full bg-white/30 border-none rounded-[16px] py-4 px-6 text-[#131212] placeholder-[#131212]/40 text-[16px] outline-none focus:bg-white/50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 w-full">
                    <div className="w-full md:w-1/2">
                      <label className="block text-[13px] font-bold text-[#b38800] mb-2 uppercase tracking-wide">Device Category</label>
                      <div className="relative w-full">
                        <select defaultValue="" className="w-full bg-white/30 border-none rounded-[16px] py-4 pl-6 pr-12 text-[#131212] text-[16px] outline-none focus:bg-white/50 transition-all font-medium appearance-none cursor-pointer">
                          <option value="" disabled className="text-[#131212]/50 bg-white">Select Category</option>
                          <option value="desktop" className="text-[#131212] bg-white">Laptops & Desktops</option>
                          <option value="workstation" className="text-[#131212] bg-white">Workstations</option>
                          <option value="other" className="text-[#131212] bg-white">Other Devices</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#131212]/60">
                          <ChevronDown size={18} />
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-1/2">
                      <label className="block text-[13px] font-bold text-[#b38800] mb-2 uppercase tracking-wide">Quantity</label>
                      <input
                        type="number"
                        placeholder="Quantity"
                        min="1"
                        className="w-full bg-white/30 border-none rounded-[16px] py-4 px-6 text-[#131212] placeholder-[#131212]/40 text-[16px] outline-none focus:bg-white/50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-[#b38800] mb-2 uppercase tracking-wide">Additional Information</label>
                    <textarea
                      placeholder="Write your message or requirements here..."
                      rows={4}
                      className="w-full bg-white/30 border-none rounded-[16px] py-4 px-6 text-[#131212] placeholder-[#131212]/40 text-[16px] outline-none focus:bg-white/50 transition-all font-medium resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-4">
                    <button className="bg-[#0B1120] hover:bg-[#1e293b] text-white rounded-full py-4 px-8 inline-flex items-center gap-3 transition-colors group shadow-lg hover:shadow-xl">
                      <span className="font-bold text-[16px] pr-2">Submit Request</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="w-full bg-[#f6f5f8] py-20 lg:py-24 border-t border-gray-100">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16">
            {/* Left Content */}
            <div className="w-full lg:w-[40%] flex flex-col items-start pt-4">
              <div className="inline-flex items-center gap-2 border border-[#0d7fba]/20 bg-[#eef8fe] rounded-full py-1.5 px-3 mb-6">
                <MessageCircle size={14} className="text-[#0d7fba]" />
                <span className="text-[#0d7fba] font-medium text-[13px] tracking-wide uppercase">Common Questions</span>
              </div>
              <h2 className="text-[36px] md:text-[45px] lg:text-[50px] font-bold text-[#111] leading-[1.1] tracking-tight mb-6">
                Questions About Buying Bulk Laptops in India?
              </h2>
              <p className="text-[17px] text-[#666] leading-relaxed mb-10 max-w-md">
                Get answers to common questions about buying bulk laptops, desktops, mini PCs, pricing, delivery, warranties, and enterprise IT procurement across India.
              </p>

              <div className="p-6 bg-white rounded-[24px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md">
                <div className="w-12 h-12 bg-[#fff5eb] rounded-full flex items-center justify-center mb-4">
                  <Phone size={20} className="text-orange-500" />
                </div>
                <h4 className="text-[18px] font-bold text-[#111] mb-2">Still have questions?</h4>
                <p className="text-[15px] text-[#666] mb-4">Can&apos;t find the answer you&apos;re looking for? Please chat to our friendly team.</p>
                <button className="text-[#0d7fba] font-bold text-[15px] flex items-center gap-2 hover:gap-3 transition-all">
                  Get in touch <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Right Accordion */}
            <div className="w-full lg:w-[60%] flex flex-col gap-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
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

                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-8 pb-8 pt-0 text-[16px] text-[#666] leading-relaxed">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  </div>
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
                {[
                  { label: "Refurbished Desktops", path: "/shop?category=129" },
                  { label: "Refurbished Laptops", path: "/shop?category=112" },
                  { label: "Refurbished Workstations", path: "/shop?category=139" },
                  { label: "Refurbished Macbooks", path: "/shop?category=112&search=Apple" },
                  { label: "Refurbished Mini PCs", path: "/shop?category=137" }
                ].map((item, i) => (
                  <Link key={i} href={item.path} className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item.label}</Link>
                ))}
              </div>
            </div>

            {/* New Products */}
            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">New Products</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "New Laptops", path: "/shop?category=112&search=New" },
                  { label: "New Desktops", path: "/shop?category=129&search=New" },
                  { label: "New Macbooks", path: "/shop?category=112&search=Apple" },
                  { label: "New All in One", path: "/shop?category=129&search=All%20in%20One" },
                  { label: "New Mini PCs", path: "/shop?category=137&search=New" }
                ].map((item, i) => (
                  <Link key={i} href={item.path} className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item.label}</Link>
                ))}
              </div>
            </div>

            {/* Useful Links */}
            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Useful Links</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Contact Us", path: "/contact" },
                  { label: "Terms & Conditions", path: "/terms-conditions?tab=terms" },
                  { label: "Privacy Policy", path: "/privacy-policy?tab=privacy" },
                  { label: "Return & Refund Policy", path: "/return-refund?tab=refund" },
                  { label: "Warranty Policy", path: "/privacy-policy?tab=warranty" },
                  { label: "Shipping Policy", path: "/privacy-policy?tab=shipping" }
                ].map((item, i) => (
                  <Link key={i} href={item.path} className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item.label}</Link>
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
                <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/mastercard.svg" className="h-full object-contain" alt="Mastercard" />
              </div>
              <div className="bg-[#1a1f71] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/visa.svg" className="h-[70%] object-contain mt-[0.5px]" alt="Visa" />
              </div>
              <div className="bg-[#003087] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/paypal.svg" className="h-[55%] object-contain" alt="PayPal" />
              </div>
              <div className="bg-[#2d9cdb] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/amex.svg" className="h-[75%] object-contain" alt="Amex" />
              </div>
              <div className="bg-[#6772e5] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/stripe.svg" className="h-[50%] object-contain" alt="Stripe" />
              </div>
              <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/google-pay.svg" className="h-[55%] object-contain" alt="Google Pay" />
              </div>
              <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1 border border-gray-700">
                <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/apple-pay.svg" className="h-[60%] object-contain" alt="Apple Pay" />
              </div>
              <div className="bg-[#004b87] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/unionpay.svg" className="h-[70%] object-contain" alt="UnionPay" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
