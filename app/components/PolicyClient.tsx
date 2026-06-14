"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  ChevronDown, Apple, Play, 
  Facebook, Instagram, Youtube, MessageCircle, ShieldCheck, FileText, 
  Lock, RefreshCw, Truck, Printer, CheckCircle, ArrowRight, Clock, 
  Mail, MapPin, Phone, HelpCircle, Download, Check, Search
} from "lucide-react";
import Header from "../Header";
import Footer from "../Footer";

import {
  termsSections,
  privacySections,
  refundSections,
  warrantySections,
  shippingSections,
  type Section
} from "../policy-data";

export type PolicyTab = "terms" | "privacy" | "refund" | "warranty" | "shipping";

interface PolicyClientProps {
  defaultTab: PolicyTab;
}

function PolicyContentPage({ defaultTab }: PolicyClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Selected Policy category tab derived directly from query parameter, managed as React state
  const currentTabParam = searchParams.get("tab") as PolicyTab || defaultTab;
  
  // To avoid hydration mismatch, we default the initial render of activeTab to the page's standard base tab
  const [activeTab, setActiveTab] = useState<PolicyTab>(defaultTab);

  useEffect(() => {
    const tabParam = searchParams.get("tab") as PolicyTab;
    const targetTab = (tabParam && ["terms", "privacy", "refund", "warranty", "shipping"].includes(tabParam))
      ? tabParam
      : defaultTab;
    
    const timer = setTimeout(() => {
      setActiveTab(targetTab);
    }, 0);
    return () => clearTimeout(timer);
  }, [searchParams, defaultTab]);
  
  // Search state to filter list content
  const [searchQuery, setSearchQuery] = useState("");
  
  // Agreement Acceptance Box
  const [isAgreed, setIsAgreed] = useState(false);
  const [showAgreementSuccess, setShowAgreementSuccess] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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
        return privacySections;
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

      <Header />

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
                Comsri Privacy & Protection
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
                  <h4 className="text-sm font-bold text-white">Official Document Pool</h4>
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
                          ? "bg-[#374bf9] text-white border-[#374bf9] shadow-[0_4px_16px_rgba(55,75,249,0.25)] scale-102"
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
                <div className="bg-indigo-50 border border-indigo-150 text-indigo-850 rounded-2xl p-4 mb-8 flex justify-between items-center text-sm font-extrabold">
                  <span>Filtered sections highlighting: &ldquo;<strong className="text-indigo-900">{searchQuery}</strong>&rdquo;</span>
                  <span>Found {filteredSections.length} Sections</span>
                </div>
              )}

              {/* Animated Tab change container wrapper */}
              <div className="space-y-12">
                  
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

                    // A: Render special WARNING component for sealed-pack notification
                    if (sec.id === "ref-sealed") {
                      return (
                        <div 
                          key={sec.id} 
                          id={sec.id}
                          className="relative pb-10 scroll-mt-28 border-b border-slate-100 last:border-b-0 last:pb-0 font-sans"
                        >
                          <div className="bg-red-50/70 border-l-4 border-red-500 rounded-r-2xl p-6 md:p-8 shadow-xs">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-2xl">⚠️</span>
                              <h3 className="text-lg md:text-xl font-black text-red-950 tracking-tight leading-tight uppercase">
                                {sec.title}
                              </h3>
                            </div>
                            
                            <div className="space-y-3.5">
                              {sec.content.map((p, pIdx) => {
                                const isBoldAlert = pIdx === 0 || pIdx === 2;
                                return (
                                  <p 
                                    key={pIdx} 
                                    className={`text-[14px] md:text-base leading-relaxed ${
                                      isBoldAlert ? "text-red-900 font-extrabold" : "text-slate-700 font-medium"
                                    }`}
                                  >
                                    {p}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // B: Render special Responsive TABLE for return eligibility matrix
                    if (sec.id === "ref-eligibility") {
                      return (
                        <div 
                          key={sec.id} 
                          id={sec.id}
                          className="relative pb-10 scroll-mt-28 border-b border-slate-100 last:border-b-0 last:pb-0 font-sans"
                        >
                          <div className="flex items-center gap-4 mb-5">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#374bf9] text-white font-extrabold text-[15px] shadow-[0_4px_12px_rgba(55,75,249,0.3)] shrink-0">
                              {numberStr}
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-[#0f172a] tracking-tight leading-tight">
                              {displayTitle}
                            </h3>
                          </div>
                          
                          <div className="pl-0 md:pl-14 space-y-6">
                            {sec.content.map((p, pIdx) => (
                              <p key={pIdx} className="text-[#334155] text-[15px] md:text-base leading-relaxed font-normal">
                                {p}
                              </p>
                            ))}
                            
                            {/* Return Eligibility Matrix responsive table */}
                            <div className="overflow-hidden border border-slate-200 rounded-2xl shadow-xs bg-white">
                              <div className="bg-[#1e3a8a] text-white px-5 py-4 font-black text-sm tracking-wide">
                                Return Eligibility Matrix
                              </div>
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200 text-left text-xs md:text-sm">
                                  <thead className="bg-[#f8fafc]">
                                    <tr className="divide-x divide-slate-200">
                                      <th className="px-5 py-3.5 font-extrabold text-slate-800">Asset Condition</th>
                                      <th className="px-5 py-3.5 font-extrabold text-slate-800">≤ 14 Days from Delivery</th>
                                      <th className="px-5 py-3.5 font-extrabold text-slate-800">&gt; 14 Days from Delivery</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-200 font-sans">
                                    <tr className="divide-x divide-slate-200 bg-white hover:bg-slate-50/50 transition-colors">
                                      <td className="px-5 py-4 font-extrabold text-slate-900">
                                        Defective <span className="text-xs text-slate-500 font-normal block md:inline md:ml-1">(as per QC criteria)</span>
                                      </td>
                                      <td className="px-5 py-4 text-emerald-700 font-extrabold bg-emerald-50/20">
                                        14-Day Return Policy
                                      </td>
                                      <td className="px-5 py-4 text-slate-600 font-semibold">
                                        Warranty Policy Applies
                                      </td>
                                    </tr>
                                    <tr className="divide-x divide-slate-200 bg-[#fbfbfd] hover:bg-slate-50/50 transition-colors">
                                      <td className="px-5 py-4 font-extrabold text-slate-900">
                                        Not Defective <span className="text-xs text-slate-500 font-normal block md:inline md:ml-1">(Customer decision)</span>
                                      </td>
                                      <td className="px-5 py-4 text-[#374bf9] font-extrabold bg-indigo-50/20">
                                        Buyback Program Applies
                                      </td>
                                      <td className="px-5 py-4 text-[#374bf9] font-extrabold bg-indigo-50/20">
                                        Buyback Program Applies
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    const isContactSection = sec.id.toLowerCase().endsWith("contact") || sec.id.toLowerCase().endsWith("contact-us") || sec.id.toLowerCase().endsWith("contactus");
                    if (isContactSection) {
                      return (
                        <div 
                          key={sec.id} 
                          id={sec.id}
                          className="relative pb-10 scroll-mt-28 border-b border-slate-100 last:border-b-0 last:pb-0 font-sans"
                        >
                          <div className="flex items-center gap-4 mb-5">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#374bf9] text-white font-extrabold text-[15px] shadow-[0_4px_12px_rgba(55,75,249,0.3)] shrink-0">
                              {numberStr}
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-[#0f172a] tracking-tight leading-tight">
                              {displayTitle}
                            </h3>
                          </div>
                          
                          <div className="pl-0 md:pl-14 space-y-5">
                            <p className="text-[#334155] text-[15px] md:text-base leading-relaxed font-normal">
                              If You have any questions, You may contact Us:
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                              <a 
                                href="mailto:support@comsri.com" 
                                className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white hover:border-[#374bf9] hover:shadow-sm transition-all group"
                              >
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold flex items-center justify-center text-sm group-hover:bg-[#374bf9] group-hover:text-white transition-colors duration-250">
                                  @
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Email</p>
                                  <p className="text-[13px] font-bold text-slate-800 tracking-tight truncate">support@comsri.com</p>
                                </div>
                              </a>
                              
                              <a 
                                href="tel:+918601899899" 
                                className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white hover:border-[#374bf9] hover:shadow-sm transition-all group"
                              >
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-extrabold flex items-center justify-center text-sm group-hover:bg-[#374bf9] group-hover:text-white transition-colors duration-250">
                                  📞
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Phone</p>
                                  <p className="text-[13px] font-bold text-slate-800 tracking-tight truncate">+91-8601-899-899</p>
                                </div>
                              </a>
                              
                              <a 
                                href="https://comsri.com/contact-us" 
                                className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white hover:border-[#374bf9] hover:shadow-sm transition-all group"
                              >
                                <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#374bf9] font-extrabold flex items-center justify-center text-sm group-hover:bg-[#374bf9] group-hover:text-white transition-colors duration-250">
                                  🌐
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Website</p>
                                  <p className="text-[13px] font-bold text-slate-800 tracking-tight truncate">comsri.com/contact-us</p>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Default Section Renderer with high precision typographic parsing
                    return (
                      <div 
                        key={sec.id} 
                        id={sec.id}
                        className="relative pb-10 scroll-mt-28 border-b border-slate-100 last:border-b-0 last:pb-0 font-sans"
                      >
                        {/* Section Header with Number Badge */}
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
                          {sec.content.map((p, pIdx) => {
                            const isBullet = p.startsWith("- ") || p.startsWith("• ");
                            const isSubLetter = p.match(/^[a-z]\)/) || p.startsWith("Step ");
                            const isSubHeader = (p.endsWith(":") || p.startsWith("Covered:") || p.startsWith("Not Covered:") || p.includes("Standard Warranty") || p.includes("Extended Warranty") || p.startsWith("Defects in Materials") || p.startsWith("Hardware Components Covered") || p.startsWith("Third-Party Accessories") || p.startsWith("Software") || p.startsWith("Data Backup") || p.startsWith("Proof of Purchase") || p.startsWith("IMPORTANT WARRANTY DISCLAIMER") || p.includes("RTO (Return to Origin") || p.includes("Delivered Orders") || p.includes("Refund Deductions") || p.includes("Warranty Coverage") || p.includes("Warranty Resolution Timeline")) && p.length < 100 && !p.toLowerCase().includes("http");
                            const isWarning = p.startsWith("⚠️") || p.startsWith("Disclaimer:") || p.startsWith("Warning:");

                            if (isWarning) {
                              return (
                                <div key={pIdx} className="mt-4 bg-[#fffbeb] border border-amber-200 rounded-2xl py-4 px-6 flex items-start gap-3">
                                  <span className="text-amber-800 text-lg select-none">⚠️</span>
                                  <p className="text-amber-800 text-sm md:text-[14px] font-bold tracking-tight leading-relaxed">
                                    {p.replace(/^[⚠️\s]+/, "")}
                                  </p>
                                </div>
                              );
                            }

                            if (p === "IMPORTANT WARRANTY DISCLAIMER (PLEASE READ CAREFULLY)") {
                              return (
                                <div key={pIdx} className="mt-6 bg-[#fef2f2] border border-rose-200 rounded-2xl py-4 px-6">
                                  <p className="text-rose-700 text-sm md:text-[14.5px] font-extrabold tracking-tight uppercase">
                                    {p}
                                  </p>
                                </div>
                              );
                            }

                            return (
                              <p 
                                key={pIdx} 
                                className={`${
                                  isBullet 
                                    ? "text-[#334155] text-[15px] md:text-base leading-relaxed font-normal pl-6 flex items-start" 
                                    : isSubLetter
                                    ? "text-[#374bf9] text-[15px] md:text-base leading-relaxed font-extrabold pl-4 pt-1.5"
                                    : isSubHeader
                                    ? "text-[#0f172a] text-base md:text-[17px] font-extrabold tracking-tight pt-3.5 first:pt-0"
                                    : "text-[#334155] text-[15px] md:text-base leading-relaxed font-normal"
                                }`}
                              >
                                {isBullet && <span className="text-[#374bf9] mr-2 shrink-0 select-none">•</span>}
                                {isBullet ? p.substring(2) : p}
                              </p>
                            );
                          })}

                          {/* Beautiful Alert notice box for the intro section */}
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

              </div>

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

                {showAgreementSuccess && (
                  <div className="mt-4 pt-4 border-t border-slate-100 overflow-hidden transition-all duration-300 ease-in-out opacity-100">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl flex items-center justify-center gap-2">
                      <CheckCircle size={14} />
                      Consent logged successfully for active session. Thank you for choosing Comsri Corporation!
                    </span>
                  </div>
                )}
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
      <Footer />
    </div>
  );
}

export default function PolicyClient({ defaultTab }: PolicyClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f6f5f8] flex flex-col justify-center items-center py-24 gap-4">
        <div className="animate-spin w-12 h-12 border-t-4 border-indigo-600 rounded-full" />
        <p className="text-slate-600 font-bold font-sans text-sm tracking-wide">Syncing Comsri Policies...</p>
      </div>
    }>
      <PolicyContentPage defaultTab={defaultTab} />
    </Suspense>
  );
}
