"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, ChevronDown, Shuffle, Heart, ShoppingCart, Apple, Play, 
  Facebook, Instagram, Youtube, MessageCircle, ShieldCheck, FileText, 
  Lock, RefreshCw, Truck, Printer, CheckCircle, ArrowRight, Clock, 
  Mail, MapPin, Phone, HelpCircle, Download, Check
} from "lucide-react";

// Types for navigation & data
type PolicyTab = "terms" | "privacy" | "refund" | "warranty" | "shipping";

import {
  termsSections,
  privacySections,
  refundSections,
  warrantySections,
  shippingSections,
  type Section
} from "../policy-data";

function PolicyContentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Selected Policy category tab derived directly from query parameter, managed as React state
  const currentTabParam = searchParams.get("tab") as PolicyTab || "terms";
  
  // To avoid hydration mismatch, we default the initial render of activeTab to the page's standard base tab
  const [activeTab, setActiveTab] = useState<PolicyTab>("terms");

  useEffect(() => {
    const tabParam = searchParams.get("tab") as PolicyTab;
    const targetTab = (tabParam && ["terms", "privacy", "refund", "warranty", "shipping"].includes(tabParam))
      ? tabParam
      : "terms";
    
    const timer = setTimeout(() => {
      setActiveTab(targetTab);
    }, 0);
    return () => clearTimeout(timer);
  }, [searchParams]);
  
  // Search state to filter list content
  const [searchQuery, setSearchQuery] = useState("");
  
  // Agreement Acceptance Box
  const [isAgreed, setIsAgreed] = useState(false);
  const [showAgreementSuccess, setShowAgreementSuccess] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Keep track of scroll progress inside the page
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setScrollProgress((window.scrollY / scrollHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabChange = (tab: PolicyTab) => {
    setSearchQuery("");
    setActiveTab(tab);
    if (tab === "terms") {
      router.push(`/terms-conditions?tab=terms`, { scroll: false });
    } else if (tab === "refund") {
      router.push(`/return-refund?tab=refund`, { scroll: false });
    } else {
      router.push(`/privacy-policy?tab=${tab}`, { scroll: false });
    }
  };

  // Get active sections depending on the selected tab
  const activeSections = useMemo(() => {
    switch (activeTab) {
      case "terms":
        return termsSections;
      case "privacy":
        return privacySections;
      case "refund":
        return refundSections;
      case "warranty":
        return warrantySections;
      case "shipping":
        return shippingSections;
      default:
        return termsSections;
    }
  }, [activeTab]);

  // Filter content in selected sections depending on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return activeSections;
    const query = searchQuery.toLowerCase();
    return activeSections.map(sec => {
      const titleMatches = sec.title.toLowerCase().includes(query);
      const matchingParagraphs = sec.content.filter(p => p.toLowerCase().includes(query));
      if (titleMatches || matchingParagraphs.length > 0) {
        return {
          ...sec,
          // If title matches, show full content. Otherwise show only paragraphs containing query
          content: titleMatches ? sec.content : matchingParagraphs
        };
      }
      return null;
    }).filter(Boolean) as Section[];
  }, [activeSections, searchQuery]);

  // Simulated Document actions
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert(`Generating download package: Comsri_Corporation_${activeTab.toUpperCase()}_Policy_2026.pdf. Secure transmission initiated.`);
  };

  const submitAgreement = () => {
    if (!isAgreed) return;
    localStorage.setItem(`comsri_policy_agreed_${activeTab}`, "true");
    setShowAgreementSuccess(true);
    setTimeout(() => {
      setShowAgreementSuccess(false);
    }, 4000);
  };

  // Scroll to targeted section comfortably
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f5f8] flex flex-col font-sans relative">
      
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 inset-x-0 h-1.5 bg-gray-100 z-50">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 via-[#374bf9] to-emerald-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Header */}
      <header className="bg-white py-4 border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between w-full">
          <div className="flex-shrink-0 flex items-center gap-1 cursor-pointer" onClick={() => router.push("/")}>
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
          <div className="flex-1 max-w-2xl mx-12 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for systems, specifications or products..."
                className="w-full h-[46px] pl-6 pr-14 text-sm text-gray-700 border border-gray-200 rounded-full focus:outline-none focus:border-gray-300 bg-[#fbfbfd]"
                onClick={() => router.push("/")}
              />
              <button 
                onClick={() => router.push("/")}
                className="absolute right-1 top-1 bottom-1 w-[38px] bg-[#374bf9] rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
              >
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
            <button className="hover:text-[#374bf9] transition-colors" onClick={() => router.push("/")}>
              Login / Register
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-[#faba5b] py-3 text-[14px] font-medium text-black">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between w-full">
          <ul className="flex flex-wrap items-center gap-y-2 gap-x-6">
            <li><a href="/" className="hover:text-[#374bf9] transition-colors">Home</a></li>
            <li><a href="/about" className="hover:text-[#374bf9] transition-colors">About Us</a></li>
            <li className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => router.push("/")}>
              Refurbished Products <ChevronDown size={14} className="text-gray-500" />
            </li>
            <li className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => router.push("/")}>
              New Products <ChevronDown size={14} className="text-gray-500" />
            </li>
            <li><a href="/bulk-orders" className="hover:text-[#374bf9] transition-colors">Bulk Orders</a></li>
            <li><a href="/blog" className="hover:text-[#374bf9] transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-gray-700">Contact Us</a></li>
            <li className="relative group flex items-center gap-1 cursor-pointer hover:text-[#374bf9] transition-all py-2 text-[#374bf9] font-bold">
              <span>Policies</span>
              <ChevronDown size={14} className="text-[#374bf9] transition-transform duration-200 group-hover:rotate-180" />
              
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
            <li><a href="/about" className="hover:text-gray-700">FAQs</a></li>
          </ul>

          <div className="flex items-center gap-x-5 pl-5 border-l border-black/10">
            <button className="flex items-center gap-1.5 hover:text-gray-700" onClick={() => router.push("/")}>
              <Shuffle size={18} />
              <span className="font-semibold">0</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-gray-700" onClick={() => router.push("/")}>
              <Heart size={18} />
              <span className="font-semibold">0</span>
            </button>
            
            <button className="bg-[#374bf9] text-white rounded-full flex items-center px-4 py-2 gap-x-2 relative hover:bg-blue-700 transition-colors ml-2 shadow-sm" onClick={() => router.push("/")}>
              <ShoppingCart size={18} />
              <span className="font-semibold tracking-wide">₹0.00</span>
              <span className="absolute -top-1.5 -right-1.5 bg-white text-[#374bf9] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-gray-200">0</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-[#f6f5f8]">
        
        {/* Breadcrumb Header */}
        <div className="bg-[#f2ece4] w-full py-3 border-b border-slate-250/20">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="text-2xl md:text-3.5xl font-extrabold text-[#111] tracking-tight">Legal & Corporate Policies</h1>
              <p className="text-[14px] text-gray-500 font-medium">Home <span className="mx-1.5 text-gray-400">/</span> Policies <span className="mx-1.5 text-gray-450">/</span> <span className="text-[#111] font-bold capitalize">{activeTab !== "terms" ? `${activeTab} policy` : "terms & conditions"}</span></p>
            </div>
            
            {/* Quick action badges */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-[11px] font-bold bg-white text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                <Check size={12} strokeWidth={3} />
                Updated FY2026-27
              </span>
              <span className="text-[11px] font-bold bg-white text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                <Clock size={12} />
                Strict Compliance
              </span>
            </div>
          </div>
        </div>

        {/* Hero Banner Intro */}
        <section className="bg-gradient-to-r from-[#172554] to-[#1e3a8a] text-white py-14 px-6 lg:px-12 w-full relative overflow-hidden">
          {/* Ambient visual overlay particles */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-[100px] pointer-events-none" />

          <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="max-w-3xl">
              <span className="bg-[#374bf9] text-white font-extrabold text-[11px] tracking-wider uppercase px-3 py-1.5 rounded-md mb-4 inline-block shadow-inner">
                Consumer protection framework
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
                Comsri Transparency Guarantee
              </h2>
              <p className="text-indigo-100 text-base md:text-[17px] leading-relaxed max-w-2xl font-normal">
                We are dedicated to building long-term confidence in refurbished hardware. Review our clear rules, service commitments, privacy frameworks, and strict refund guarantees designed for secure Indian e-commerce.
              </p>
            </div>

            {/* Document utility card right */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 w-full lg:w-[320px] flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#faba5b] rounded-lg flex items-center justify-center text-slate-950">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Comsri Corporation Company Profile</h4>
                  <p className="text-[11px] text-indigo-200">PDF standard revision v3.5</p>
                </div>
              </div>
              
              <div className="h-[1px] bg-white/10 w-full" />
              
              <div className="grid grid-cols-2 gap-2.5">
                <button 
                  onClick={handlePrint}
                  className="bg-white text-slate-800 hover:bg-[#faba5b] hover:text-slate-900 transition-all text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 focus:outline-none"
                >
                  <Printer size={13} />
                  Print Page
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  className="bg-white/15 hover:bg-white/25 border border-white/10 text-white transition-all text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 focus:outline-none"
                >
                  <Download size={13} />
                  Save PDF
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Navigation tab strip for policies */}
        <section className="bg-white border-b border-slate-200 shadow-sm w-full sticky top-0 md:top-[1.2px] z-30">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="flex items-center justify-between overflow-x-auto scrollbar-none gap-8 py-3.5">
              
              {/* Horizontal scroll tab trigger list */}
              <div className="flex items-center gap-2 md:gap-3 flex-nowrap shrink-0">
                {[
                  { id: "terms", label: "Terms & Conditions", icon: FileText, color: "text-indigo-600" },
                  { id: "privacy", label: "Privacy Policy", icon: Lock, color: "text-emerald-600" },
                  { id: "refund", label: "Returns & Refund", icon: RefreshCw, color: "text-rose-600" },
                  { id: "warranty", label: "Warranty Terms", icon: ShieldCheck, color: "text-amber-600" },
                  { id: "shipping", label: "Shipping Policy", icon: Truck, color: "text-cyan-600" }
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id as PolicyTab)}
                      className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-full text-xs md:text-sm font-extrabold transition-all outline-none border focus:outline-none relative ${
                        isActive 
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-[0_4px_16px_rgba(99,102,241,0.25)] scale-102"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      }`}
                    >
                      <IconComponent size={14} className={isActive ? "text-white" : tab.color} />
                      <span>{tab.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 bg-[#faba5b] rounded-full inline-block" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sidebar Search Bar in tab header */}
              <div className="relative w-72 shrink-0 md:block hidden">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter sections..."
                    className="w-full text-xs h-[38px] pl-9 pr-8 text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 bg-[#f8fafc]"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search size={13} />
                  </span>
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-slate-200 hover:bg-slate-350 text-slate-700 px-1.5 py-0.5 rounded leading-none"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Base Two-Column Layout Grid */}
        <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 pb-24">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* Left Column: Side Navigation Anchors for Sticky Navigation */}
            <aside className="w-full lg:w-1/4 sticky top-24 hidden lg:block">
              <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm flex flex-col gap-6">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-400 tracking-wider uppercase mb-1">Index Navigation</h3>
                  <p className="text-sm font-bold text-slate-800 capitalize">{activeTab} Policy Sections</p>
                </div>

                <div className="h-[1px] bg-slate-100 w-full" />

                <ul className="space-y-1.5">
                  {activeSections.map((sec) => (
                    <li key={sec.id}>
                      <button
                        onClick={() => scrollToSection(sec.id)}
                        className="w-full text-left text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 p-2.5 rounded-xl transition-all flex items-center justify-between"
                      >
                        <span className="line-clamp-1">{sec.title}</span>
                        <ArrowRight size={12} className="text-slate-400" />
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="h-[1px] bg-slate-100 w-full animate-pulse" />

                {/* FAQ Help block helper widget */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150/50">
                  <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 mb-2">
                    <HelpCircle size={14} className="text-[#374bf9]" />
                    Additional Assistance
                  </h4>
                  <p className="text-[12px] text-slate-500 leading-relaxed font-semibold mb-3">
                    Have precise legal questions or corporate supplier setup parameters? Connect with our compliance team.
                  </p>
                  <a 
                    href="mailto:info@comsri.com"
                    className="text-[11px] font-bold text-[#374bf9] hover:text-[#374bf9]/80 flex items-center gap-1"
                  >
                    info@comsri.com
                    <ArrowRight size={11} />
                  </a>
                </div>
              </div>
            </aside>

            {/* Right Column: Main Terms & Policy list */}
            <div className="flex-1 w-full bg-white rounded-3xl border border-slate-200/60 p-6 md:p-10 shadow-sm relative overflow-hidden">
              
              {/* Dynamic Search queries readout header */}
              {searchQuery && (
                <div className="bg-indigo-50 border border-indigo-100 text-indigo-800 rounded-2xl p-4 mb-8 flex justify-between items-center text-sm font-extrabold">
                  <span>Filtered sections highlighting: &ldquo;<strong className="text-indigo-900">{searchQuery}</strong>&rdquo;</span>
                  <span>Found {filteredSections.length} Sections</span>
                </div>
              )}

              {/* Animated Tab change container wrapper */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="space-y-12"
                >
                  
                  {filteredSections.map((sec, idx) => {
                    // Extract the title without the leading number if it exists
                    const displayTitle = sec.title.replace(/^\d+\.\s*/, "");
                    const numberStr = String(idx + 1).padStart(2, "0");

                    // Set up dynamic sub-notices like the image
                    let subNotice = "";
                    if (activeTab === "privacy" && idx === 1) {
                      subNotice = "This Privacy Policy should be read together with our Terms and Conditions.";
                    } else if (activeTab === "terms" && idx === 0) {
                      subNotice = "These Terms and Conditions should be read in conjunction with our Privacy Policy.";
                    } else if (activeTab === "refund" && idx === 0) {
                      subNotice = "Our returns and warranty policies comply fully with local Consumer Protection guidelines.";
                    } else if (activeTab === "warranty" && idx === 0) {
                      subNotice = "All warranty assertions are validated directly by our internal electronics lab in Mumbai.";
                    } else if (activeTab === "shipping" && idx === 0) {
                      subNotice = "Shipping and insurance documents are automatically transmitted to your registered email upon dispatch.";
                    }

                    return (
                      <div 
                        key={sec.id} 
                        id={sec.id}
                        className="relative pb-10 scroll-mt-28 border-b border-slate-100 last:border-b-0 last:pb-0"
                      >
                        {/* Section Header with Number Badge exactly matching the blue circle style */}
                        <div className="flex items-center gap-4 mb-5">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#374bf9] text-white font-extrabold text-[15px] shadow-[0_4px_12px_rgba(55,75,249,0.3)] shrink-0">
                            {numberStr}
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-[#0f172a] tracking-tight leading-tight">
                            {displayTitle}
                          </h3>
                        </div>

                        {/* Indented Paragraph List */}
                        <div className="pl-0 md:pl-14 space-y-4">
                          {sec.content.map((p, pIdx) => (
                            <p 
                              key={pIdx} 
                              className="text-[#334155] text-[15px] md:text-base leading-relaxed font-normal"
                            >
                              {p}
                            </p>
                          ))}

                          {/* Beautiful Alert notice box exactly matching the image */}
                          {subNotice && (
                            <div className="mt-6 bg-[#eff6ff] border border-blue-100 rounded-2xl py-4 px-6">
                              <p className="text-[#1e3a8a] text-sm md:text-[14px] font-bold tracking-tight">
                                {subNotice}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty Filter State if search yields no records */}
                  {filteredSections.length === 0 && (
                    <div className="py-16 text-center max-w-md mx-auto">
                      <div className="w-14 h-14 bg-slate-50 border border-slate-150 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={22} />
                      </div>
                      <h4 className="text-base font-extrabold text-slate-800 mb-1">No matching policy clauses</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                        We couldn&apos;t find any paragraphs matching &ldquo;{searchQuery}&rdquo;. Try using terms like &rsquo;refurbished&rsquo;, &rsquo;replacement&rsquo;, &rsquo;payment&rsquo;, or &rsquo;disputes&rsquo;.
                      </p>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* High Quality interactive consent box */}
              <div className="mt-16 bg-slate-50/70 border border-slate-205/50 rounded-2xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                  <div className="flex items-start gap-3">
                    <button 
                      onClick={() => setIsAgreed(!isAgreed)}
                      className={`w-6 h-6 rounded-md border flex items-center justify-center mt-0.5 transition-all outline-none shrink-0 ${
                        isAgreed 
                          ? "bg-[#374bf9] border-[#374bf9] text-white" 
                          : "bg-white border-slate-300 hover:border-indigo-400"
                      }`}
                    >
                      {isAgreed && <Check size={14} strokeWidth={3} />}
                    </button>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 leading-none mb-1.5">Acknowledge Policy & Terms</h4>
                      <p className="text-[12px] text-slate-500 leading-relaxed font-semibold">
                        I hereby declare that I am purchasing computer systems for personal, professional, or organizational deployment, and I agree to the respective guidelines detailed in the Comsri {activeTab} framework above.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={submitAgreement}
                    disabled={!isAgreed}
                    className={`px-6 py-3 rounded-xl font-bold text-xs whitespace-nowrap transition-all shadow-xs shrink-0 ${
                      isAgreed 
                        ? "bg-[#374bf9] text-white hover:bg-blue-700 active:scale-98 cursor-pointer" 
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    Confirm Agreement
                  </button>
                </div>

                <AnimatePresence>
                  {showAgreementSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-slate-100 overflow-hidden"
                    >
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl flex items-center justify-center gap-2">
                        <CheckCircle size={14} />
                        Consent logged successfully for active session. Thank you for choosing Comsri Corporation!
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>
        </section>

        {/* Corporate Support Helpline Section */}
        <section className="bg-white border-t border-slate-200 py-16 px-6 lg:px-12 w-full">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/50">
                <MapPin size={22} />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-[#111] mb-1.5">Compliance Hub</h4>
                <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                  Office No.-T-15 Pinnacle Business Park, MC Rd, Shanti Nagar, Andheri East, Mumbai, Maharashtra 400093
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#faba5b]/10 text-amber-700 flex items-center justify-center shrink-0 border border-[#faba5b]/15">
                <Phone size={22} />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-[#111] mb-1.5">Phone Channels</h4>
                <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                  Local representative assistance:<br />
                  <strong className="text-slate-800">+91 8601-899-899</strong>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#138808] flex items-center justify-center shrink-0 border border-emerald-200">
                <Mail size={22} />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-[#111] mb-1.5">Corporate Mailbox</h4>
                <p className="text-sm text-slate-500 font-semibold leading-relaxed font-semibold">
                  Send complaints & compliance verifications to:<br />
                  <strong className="text-slate-850">info@comsri.com</strong>
                </p>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer Section */}
      <footer className="bg-[#fcb643] pt-16 pb-12 w-full relative">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col gap-12">
          
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
                  <a key={i} href="/" className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item}</a>
                ))}
              </div>
            </div>

            {/* New Products */}
            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">New Products</h3>
              <div className="flex flex-col gap-3">
                {["New Laptops", "New Desktops", "New Macbooks", "New All in One", "New Mini PCs"].map((item, i) => (
                  <a key={i} href="/" className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item}</a>
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

export default function TermsConditionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f6f5f8] flex flex-col justify-center items-center py-24 gap-4">
        <div className="animate-spin w-12 h-12 border-t-4 border-indigo-600 rounded-full" />
        <p className="text-slate-600 font-bold font-sans text-sm tracking-wide">Syncing Comsri Policies...</p>
      </div>
    }>
      <PolicyContentPage />
    </Suspense>
  );
}
