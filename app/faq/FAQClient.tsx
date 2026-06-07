"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  Search, ChevronDown, Shuffle, Heart, Apple, Play, 
  Facebook, Instagram, Youtube, MessageCircle, ShieldCheck, 
  HelpCircle, CheckCircle, ArrowRight, Mail, MapPin, Phone, Check
} from "lucide-react";
import Header from "../Header";

const faqCategories = [
  { id: "all", name: "All FAQs" },
  { id: "general", name: "Orders & Payments" },
  { id: "shipping", name: "Shipping & Delivery" },
  { id: "refurbished", name: "Refurbishing Process" },
  { id: "warranty", name: "Warranty & Returns" },
  { id: "bulk", name: "Bulk & Corporate" },
];

const faqData = [
  {
    q: "How do I place an order on Comsri?",
    a: "Browse our premium hardware categories, choose your configuration (RAM, storage options), click 'Add to Cart', and proceed to checkout. You can securely pay online using credit/debit cards, net banking, UPI, or popular digital wallets.",
    category: "general"
  },
  {
    q: "Can I modify or cancel my order after it has been placed?",
    a: "Since we begin quality testing and preparing systems quickly, orders can only be modified or cancelled within 2 hours of placement. Please contact our support hotline at +91 8601-899-899 or email info@comsri.com immediately for assistance.",
    category: "general"
  },
  {
    q: "Do product prices include GST? Can I get a corporate tax invoice?",
    a: "Yes, all prices displayed on Comsri Corporation are fully inclusive of GST. A proper tax invoice will be generated. If you are ordering for a business or enterprise and require Input Tax Credit (ITC), please provide your company name and GSTIN during the checkout process.",
    category: "general"
  },
  {
    q: "What payment options do you support?",
    a: "We support a wide array of secure payment gateways including Visa, Mastercard, RuPay, American Express, Net Banking, UPI (Google Pay, PhonePe, Paytm, etc.), and major mobile wallets.",
    category: "general"
  },
  {
    q: "How long does shipping take?",
    a: "We perform full hardware diagnostics and ship orders within 1-2 business days. Delivery typically takes 3-5 business days to metro cities, and 5-7 business days for other regional destinations across India.",
    category: "shipping"
  },
  {
    q: "Is shipping free, and are the packages insured?",
    a: "Yes, Comsri Corporation offers free shipping on all orders across India. To guarantee complete peace of mind, all transit shipments are 100% insured against any damage or loss.",
    category: "shipping"
  },
  {
    q: "How can I track my shipment after dispatch?",
    a: "Once your package is dispatched, we automatically transmit an email and SMS containing your live tracking number and courier carrier link (such as Bluedart, Delhivery, etc.) to monitor its progress in real-time.",
    category: "shipping"
  },
  {
    q: "What should I do if the package arrives damaged?",
    a: "Please inspect the box at the time of delivery. If the package is visibly damaged, note it on the courier delivery slip and capture a detailed unboxing video. Contact our support desk within 24 hours of delivery at info@comsri.com with the video, and we will immediately coordinate a free replacement.",
    category: "shipping"
  },
  {
    q: "What is a refurbished computer?",
    a: "Refurbished computers are high-quality, lease-returned or pre-owned corporate laptops and desktops that have been returned, thoroughly audited, repaired if necessary, cleaned, and upgraded. They deliver equivalent performance to brand-new units at up to 70% lower costs.",
    category: "refurbished"
  },
  {
    q: "What is Comsri's refurbishing process?",
    a: "Each unit undergoes a strict 40+ point quality inspection by our internal laboratory technicians. This includes testing motherboard stability, battery backup health, screen pixels, keyboard responsiveness, ports, and internal thermal performance. Every device is cleaned and loaded with a genuine OS.",
    category: "refurbished"
  },
  {
    q: "What physical condition grades do you sell?",
    a: "We specialize in Grade-A refurbished devices. These have minimal cosmetic wear, no deep scratches or screen damage, and are in excellent functional condition—looking and performing like new.",
    category: "refurbished"
  },
  {
    q: "Do refurbished devices come with an operating system and charger?",
    a: "Yes, all laptops and PCs come with a pre-installed Windows operating system (unless specified otherwise) and a compatible high-quality power adapter or charging cable.",
    category: "refurbished"
  },
  {
    q: "What warranty do you offer on refurbished products?",
    a: "All refurbished laptops and desktops from Comsri Corporation come with a comprehensive 1-year hardware warranty. This covers major components like the motherboard, RAM, and storage.",
    category: "warranty"
  },
  {
    q: "How do I claim a warranty service?",
    a: "To file a claim, call us at +91 8601-899-899 or email service@comsri.com. Our support team will guide you through diagnostic checks. If required, we will arrange a reverse pickup for repair or replacement.",
    category: "warranty"
  },
  {
    q: "What is covered and excluded in the warranty?",
    a: "The warranty covers hardware manufacturing defects. Exclusions include physical accidental damage, liquid spills, battery backup decay over time, and custom software configuration modifications not authorized by Comsri.",
    category: "warranty"
  },
  {
    q: "What is your return and refund policy?",
    a: "We offer a 7-day replacement window for products that are defective on arrival or do not match their description. If the issue cannot be resolved by our technical team, a full refund will be processed. Please check our Returns page for detailed terms.",
    category: "warranty"
  },
  {
    q: "Do you offer corporate or bulk discounts?",
    a: "Yes, we offer substantial volume discounts for startups, corporations, call centers, schools, and offices purchasing 5 or more units. We can also customize specifications (RAM, SSD) to suit your business requirements.",
    category: "bulk"
  },
  {
    q: "Can we customize the computer hardware in bulk orders?",
    a: "Absolutely! We can configure custom RAM capacities, SSD types/sizes, pre-configured software images, and graphic capabilities based on your company's workload needs.",
    category: "bulk"
  },
  {
    q: "Do you offer rental or leasing schemes for businesses?",
    a: "Yes, we provide flexible monthly or yearly rental and leasing options for corporate users requiring 10 or more systems. Get in touch with our corporate desk at bulk@comsri.com for quotes.",
    category: "bulk"
  },
  {
    q: "Are Annual Maintenance Contracts (AMC) available?",
    a: "Yes. For bulk business buyers, we offer optional AMC and on-site SLA support packages to ensure maximum runtime and minimize IT downtime at your workplace.",
    category: "bulk"
  }
];

const FAQAccordionItem = ({ 
  q, 
  a, 
  isOpen, 
  onToggle,
  isLowEnd
}: { 
  q: string; 
  a: string; 
  isOpen: boolean; 
  onToggle: () => void;
  isLowEnd: boolean;
}) => {
  return (
    <div className={`bg-white rounded-2xl border ${isLowEnd ? '' : 'transition-all duration-300'} ${isOpen ? 'border-[#374bf9]/30 shadow-md' : 'border-slate-100 shadow-sm'}`}>
      <button 
        onClick={onToggle}
        className="w-full text-left px-6 lg:px-8 py-5 flex items-center justify-between focus:outline-none group"
      >
        <span className={`text-[16px] md:text-[18px] font-bold pr-8 ${isLowEnd ? '' : 'transition-colors'} ${isOpen ? 'text-[#374bf9]' : 'text-slate-800 group-hover:text-[#374bf9]'}`}>
          {q}
        </span>
        <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isLowEnd ? '' : 'transition-colors duration-300'} ${isOpen ? 'bg-[#374bf9] text-white' : 'bg-slate-50 text-slate-800 group-hover:bg-[#374bf9]/10 group-hover:text-[#374bf9]'}`}>
          <ChevronDown size={18} className={isLowEnd ? (isOpen ? 'rotate-180' : '') : `transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>
      
      {isLowEnd ? (
        isOpen ? (
          <div className="px-6 lg:px-8 pb-6 pt-0 text-[15px] text-slate-600 font-medium leading-relaxed">
            {a}
          </div>
        ) : null
      ) : (
        <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="px-6 lg:px-8 pb-6 pt-0 text-[15px] text-slate-600 font-medium leading-relaxed">
              {a}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function FAQClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ram = (navigator as any).deviceMemory;
    const cores = navigator.hardwareConcurrency;
    const isLowRam = ram !== undefined && ram <= 4;
    const isLowCores = cores !== undefined && cores <= 4;
    const conn = (navigator as any).connection;
    const isSlowConn = conn && (conn.saveData || /2g|3g/.test(conn.effectiveType));
    
    if (isLowRam || isLowCores || isSlowConn) {
      setIsLowEnd(true);
    }
  }, []);

  useEffect(() => {
    const delay = isLowEnd ? 200 : 50;
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, delay);
    return () => clearTimeout(timer);
  }, [inputValue, isLowEnd]);

  useEffect(() => {
    setOpenIndex(null);
  }, [activeCategory, searchQuery]);

  const filteredFAQs = useMemo(() => {
    return faqData.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      if (!matchesCategory) return false;
      
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;

      return (
        item.q.toLowerCase().includes(query) || 
        item.a.toLowerCase().includes(query)
      );
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f6f5f8] flex flex-col font-sans relative">
      <Header />
      <main className="flex-1 w-full bg-[#f6f5f8]">
        {/* Breadcrumb Header */}
        <div className="bg-[#f2ece4] w-full py-3 border-b border-slate-200/20">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-2xl md:text-3.5xl font-extrabold text-[#111] tracking-tight">Help Center</span>
              <p className="text-[14px] text-gray-500 font-medium">
                Home <span className="mx-1.5 text-gray-400">/</span> <span className="text-[#111] font-bold">FAQs</span>
              </p>
            </div>
            
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-[11px] font-bold bg-white text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                <Check size={12} strokeWidth={3} />
                Updated FY2026-27
              </span>
              <span className="text-[11px] font-bold bg-white text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                <HelpCircle size={12} />
                24/7 Service Support
              </span>
            </div>
          </div>
        </div>

        {/* Hero Banner Section */}
        <section className={`bg-gradient-to-r ${isLowEnd ? "from-[#1e3a8a] to-[#1e3a8a]" : "from-[#172554] to-[#1e3a8a]"} text-white py-14 px-6 lg:px-12 w-full relative overflow-hidden`}>
          {!isLowEnd && (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-[100px] pointer-events-none" />
            </>
          )}

          <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="max-w-3xl">
              <span className="bg-[#374bf9] text-white font-extrabold text-[11px] tracking-wider uppercase px-3 py-1.5 rounded-md mb-4 inline-block shadow-inner">
                Support & FAQs
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
                How can we help you today?
              </h1>
              <p className="text-indigo-100 text-base md:text-[17px] leading-relaxed max-w-2xl font-normal">
                Find clear answers regarding order configurations, delivery insurance, our stringent 40+ point refurbishing cycle, warranty claims, and volume ordering packages.
              </p>
            </div>
          </div>
        </section>

        {/* Category Selector Pill Bar */}
        <section className="bg-white border-b border-slate-200 shadow-sm w-full sticky top-0 md:top-[1.2px] z-30">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="flex items-center justify-between overflow-x-auto scrollbar-none gap-8 py-3.5">
              <div className="flex items-center gap-2 md:gap-3 flex-nowrap shrink-0">
                {faqCategories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-full text-xs md:text-sm font-extrabold transition-all border outline-none focus:outline-none ${
                        isActive 
                          ? `bg-[#374bf9] text-white border-[#374bf9] ${isLowEnd ? "" : "shadow-[0_4px_16px_rgba(55,75,249,0.25)] scale-102"}`
                          : `bg-white border-slate-200 text-slate-700 ${isLowEnd ? "" : "hover:bg-slate-50 hover:text-[#374bf9]"}`
                      }`}
                    >
                      <span>{cat.name}</span>
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
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search FAQ..."
                    className="w-full text-xs h-[38px] pl-9 pr-8 text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 bg-[#f8fafc]"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search size={13} />
                  </span>
                  {inputValue && (
                    <button 
                      onClick={() => setInputValue("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 px-1.5 py-0.5 rounded leading-none"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Two-Column Responsive Layout */}
        <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 pb-24">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* Left Column */}
            <aside className="w-full lg:w-1/4 lg:sticky lg:top-24 flex flex-col gap-6">
              <div className="relative w-full block md:hidden">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Search FAQ..."
                  className="w-full text-sm h-[46px] pl-10 pr-10 text-slate-700 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 bg-white shadow-xs"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={16} />
                </span>
                {inputValue && (
                  <button 
                    onClick={() => setInputValue("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* FAQ Help Block */}
              <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm flex flex-col gap-5 w-full">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-400 tracking-wider uppercase mb-1">Direct Help</h3>
                  <p className="text-sm font-bold text-slate-800">Support Desk</p>
                </div>

                <div className="h-[1px] bg-slate-100 w-full" />

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150/50">
                  <h4 className="text-xs font-extrabold text-slate-855 flex items-center gap-2 mb-2">
                    <HelpCircle size={15} className="text-[#374bf9]" />
                    Need direct assistance?
                  </h4>
                  <p className="text-[12px] text-slate-505 leading-relaxed font-semibold mb-3">
                    If you have unique technical specifications or custom institutional order demands, feel free to communicate with us.
                  </p>
                  <a 
                    href="mailto:info@comsri.com"
                    className="text-[12px] font-bold text-[#374bf9] hover:underline flex items-center gap-1.5"
                  >
                    info@comsri.com
                    <ArrowRight size={12} />
                  </a>
                </div>

                <div className="flex flex-col gap-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-[#374bf9] flex items-center justify-center border border-indigo-100/50">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-extrabold uppercase">Call Center</p>
                      <p className="text-xs font-bold text-slate-800">+91 8601-899-899</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100/50">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-extrabold uppercase">Service Email</p>
                      <p className="text-xs font-bold text-slate-800">service@comsri.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Column */}
            <div className="flex-1 w-full bg-white rounded-3xl border border-slate-200/60 p-6 md:p-10 shadow-sm">
              {searchQuery && (
                <div className="bg-indigo-50 border border-indigo-100 text-[#374bf9] rounded-2xl p-4 mb-8 flex justify-between items-center text-sm font-extrabold">
                  <span>Filtered FAQ matches for &ldquo;<strong className="text-indigo-900">{searchQuery}</strong>&rdquo;</span>
                  <span>{filteredFAQs.length} found</span>
                </div>
              )}

              <div className="space-y-4">
                {filteredFAQs.map((faq, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <FAQAccordionItem
                      key={idx}
                      q={faq.q}
                      a={faq.a}
                      isOpen={isOpen}
                      onToggle={() => setOpenIndex(isOpen ? null : idx)}
                      isLowEnd={isLowEnd}
                    />
                  );
                })}

                {filteredFAQs.length === 0 && (
                  <div className="py-16 text-center max-w-md mx-auto">
                    <div className="w-14 h-14 bg-slate-50 border border-slate-150 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search size={22} />
                    </div>
                    <h4 className="text-base font-extrabold text-slate-800 mb-1">No matching FAQ items</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                      We couldn&apos;t find any questions matching &ldquo;{searchQuery}&rdquo;. Try using terms like &rsquo;warranty&rsquo;, &rsquo;shipping&rsquo;, &rsquo;grade-A&rsquo;, or &rsquo;bulk&rsquo;.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* Corporate Support helpline strip */}
        <section className="bg-white border-t border-slate-200 py-16 px-6 lg:px-12 w-full">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#374bf9] flex items-center justify-center shrink-0 border border-indigo-100/50">
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
                  <strong className="text-slate-850">+91 8601-899-899</strong>
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
      <footer className="bg-[#fcb643] pt-10 md:pt-16 pb-8 md:pb-12 w-full relative">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12 flex flex-col gap-8 md:gap-12">
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
                  <Link key={i} href="/shop" className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item}</Link>
                ))}
              </div>
            </div>

            {/* New Products */}
            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">New Products</h3>
              <div className="flex flex-col gap-3">
                {["New Laptops", "New Desktops", "New Macbooks", "New All in One", "New Mini PCs"].map((item, i) => (
                  <Link key={i} href="/shop" className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item}</Link>
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
                  <Link key={i} href={item.path} className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item.label}</Link>
                ))}
              </div>
            </div>

            {/* Available On & Social Links */}
            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Available On:</h3>
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
          <div className="bg-[#3452ef] rounded-[16px] md:rounded-[24px] px-5 md:px-8 lg:px-12 py-8 md:py-10 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 mt-2 w-full">
            <div className="flex flex-col text-white flex-1 text-center lg:text-left">
              <h2 className="text-[22px] sm:text-[28px] md:text-[32px] font-bold mb-1.5 tracking-tight">Sign Up to our Newsletter</h2>
              <p className="text-[14px] text-white/90 font-medium">Be the First to Know. Sign up to our newsletter today</p>
            </div>
            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 items-center">
              <input
                type="email"
                placeholder="Your email address"
                className="px-5 md:px-6 py-3 md:py-3.5 rounded-full text-[14px] focus:outline-none font-medium h-[44px] md:h-[48px] text-black w-full min-w-0 md:min-w-[280px] md:w-[340px]"
              />
              <button className="bg-[#fcb643] hover:bg-[#fca61f] text-[#111] px-6 md:px-8 h-[44px] md:h-[48px] rounded-full font-bold text-[14px] md:text-[15px] transition-colors whitespace-nowrap shadow-sm w-full sm:w-auto">
                Sign Up
              </button>
            </div>
          </div>

          {/* Copyright & Payments */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-1 gap-4 w-full">
            <p className="text-[14px] font-bold text-[#111]">Copyright 2026 by Comsri Corporation All Rights Reserved.</p>
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
