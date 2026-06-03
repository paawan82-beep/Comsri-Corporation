"use client";

import { useState, useMemo } from "react";
import { 
  ChevronDown, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  BookOpen, 
  ThumbsUp, 
  MessageSquare, 
  Send, 
  Check, 
  FileText,
  Bookmark,
  Sparkles,
  Zap,
  TrendingUp,
  Mail,
  Home,
  Info,
  Package,
  Layers,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Menu,
  Lock,
  Plus,
  BarChart2,
  Settings,
  ShieldCheck,
  FileCode,
  Users,
  Heart,
  Search
} from "lucide-react";
import Header from "../Header";

// Interactive Enhancement Features Data matching the exact screenshot design
const initialEnhancements = [
  {
    id: 1,
    version: "Version 3.3.0",
    date: "November 2024",
    releaseType: "Major",
    productArea: "Reporting",
    integration: "Salesforce",
    title: "Enhanced Reporting Tools",
    badges: [
      { text: "Reporting", color: "bg-[#4caf50] text-white" },
      { text: "Analytics", color: "bg-[#7c4dff] text-white" }
    ],
    description: "We've added more customizable reporting options, giving you the ability to create in-depth analytics tailored to your specific KPIs.",
    benefits: [
      "Gain deeper insights into performance.",
      "Tailor reports to match your business needs...."
    ],
    detailMarkdown: `
      <h3>In-Depth Custom Analytics Infrastructure</h3>
      <p>Our completely overhauled analytics suite represents a massive upgrade in rendering speeds and chart flexibility. With the new customized queries engine, complex KPI reports load up to 10x faster. We've introduced pre-aggregated temporal databases that run background analytics without adding load to your primary storage clusters.</p>
      
      <h3>Key Architectural Features</h3>
      <ul>
        <li><strong>Dynamic Aggregation:</strong> Run real-time aggregate functions (sum, mean, variance) across multiple dimensions on-the-fly.</li>
        <li><strong>Custom API Export:</strong> Directly generate webhooks and PDF/JSON schedules for executives and third-party partners.</li>
        <li><strong>Pre-built Templates:</strong> Over 40 standard enterprise layouts for rapid startup metric audits.</li>
      </ul>
    `,
    previewType: "chart"
  },
  {
    id: 2,
    version: "Version 3.2.5",
    date: "October 2024",
    releaseType: "Minor",
    productArea: "Collaboration",
    integration: "Google Drive",
    title: "Secure Document Sharing and Collaboration",
    badges: [
      { text: "AI", color: "bg-[#f44336] text-white" },
      { text: "Automation", color: "bg-[#ff9800] text-white" }
    ],
    description: "Easily share and collaborate on documents securely within your team or with clients. Control access levels, track changes, and ensure smooth document workflows.",
    benefits: [
      "Securely manage document sharing and permissions.",
      "Collaborate in real-time without confusion...."
    ],
    detailMarkdown: `
      <h3>Collaborate at Scale with Zero Compromise</h3>
      <p>Security is the foundation of high-velocity teams. This update introduces bank-grade key management and end-to-end encrypted folders to guarantee intellectual property remains within organizational channels.</p>
      
      <h3>Feature Breakdown</h3>
      <ul>
        <li><strong>Role-Based Access:</strong> Revoke or escalate user and guest permissions instantaneously from any mobile device.</li>
        <li><strong>Real-time Synchronized Sessions:</strong> Multiple engineers can comment, review, and adjust schematics with ultra-low latency.</li>
        <li><strong>Audit Logging trails:</strong> Fully GDPR and SOC2 compliant telemetry tracking who, when, and where a document was read.</li>
      </ul>
    `,
    previewType: "collab"
  },
  {
    id: 3,
    version: "Version 3.1.2",
    date: "September 2024",
    releaseType: "Minor",
    productArea: "Security",
    integration: "Slack",
    title: "Advanced SSO and Multi-Factor Authenticator Paths",
    badges: [
      { text: "Security", color: "bg-[#00bcd4] text-white" },
      { text: "DevOps", color: "bg-[#607d8b] text-white" }
    ],
    description: "Integrate enterprise identity providers seamlessly. Configure granular session timeouts, hardware security keys, and absolute audit transparency logs in seconds.",
    benefits: [
      "Secure administrative controls with modern authentication protocols.",
      "Track and terminate stale login keys instantly across your organization."
    ],
    detailMarkdown: `
      <h3>Locking Down Enterprise Entrypoints</h3>
      <p>As remote development expands, checking security postures has become critically important. Enterprise configurations are now protected with streamlined SAML and OIDC SSO support.</p>
      
      <h3>Key Features</h3>
      <ul>
        <li><strong>Hardware Keys Support:</strong> Yubikey and Apple Touch ID validation are fully active.</li>
        <li><strong>Contextual Threat Risking:</strong> Automatically challenge credentials if logins occur from unusual locations or mismatched IPs.</li>
        <li><strong>Easy Workspace Integrations:</strong> Active Directory synchronizes active users instantly.</li>
      </ul>
    `,
    previewType: "security"
  }
];

export default function BlogPage() {
  const [enhancements] = useState(initialEnhancements);

  // States for search and newsletter
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Dynamic Filters
  const [selectedReleaseType, setSelectedReleaseType] = useState("All");
  const [selectedProductArea, setSelectedProductArea] = useState("All");
  const [selectedIntegration, setSelectedIntegration] = useState("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState("All");

  // Filter dropdown toggle states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Expanded post IDs
  const [expandedPostIds, setExpandedPostIds] = useState<number[]>([]);

  // Premium Interactivity States
  const [activeChartMonth, setActiveChartMonth] = useState<number>(5); // default July
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<number[]>([]);
  const [collabUsers, setCollabUsers] = useState([
    { initials: "RD", name: "Robbi Darwis", role: "Read and write", comment: "Reviewing specs" },
    { initials: "MA", name: "Mohamed Amien", role: "Read and write", comment: "Designing mockup" }
  ]);
  const [securityStatus, setSecurityStatus] = useState<"idle" | "scanning" | "secure">("secure");
  const [shieldScore, setShieldScore] = useState(98);
  const [activeTabCollab, setActiveTabCollab] = useState<"users" | "files">("users");

  // Unique elements for filter options
  const filterOptions = useMemo(() => {
    return {
      releaseTypes: ["All", "Major", "Minor"],
      productAreas: ["All", "Reporting", "Collaboration", "Security"],
      integrations: ["All", "Salesforce", "Google Drive", "Slack"],
      dates: ["All", "November 2024", "October 2024", "September 2024"]
    };
  }, []);

  const toggleExpand = (id: number) => {
    if (expandedPostIds.includes(id)) {
      setExpandedPostIds(expandedPostIds.filter(item => item !== id));
    } else {
      setExpandedPostIds([...expandedPostIds, id]);
    }
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setNewsletterSubscribed(true);
      setEmail("");
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  // Filter logic
  const filteredEnhancements = useMemo(() => {
    return enhancements.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRelease = selectedReleaseType === "All" || item.releaseType === selectedReleaseType;
      const matchesArea = selectedProductArea === "All" || item.productArea === selectedProductArea;
      const matchesIntegration = selectedIntegration === "All" || item.integration === selectedIntegration;
      const matchesDate = selectedDateFilter === "All" || item.date === selectedDateFilter;
      
      return matchesSearch && matchesRelease && matchesArea && matchesIntegration && matchesDate;
    });
  }, [enhancements, searchQuery, selectedReleaseType, selectedProductArea, selectedIntegration, selectedDateFilter]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Header />

      {/* Main Blog Body Section of Enhancements */}
      <main className="flex-1 pb-24 relative overflow-hidden bg-[#f5f6f8]">
        
        {/* Sky-blue ambient gradient splash behind the header section */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#eef2ff]/60 via-[#f8fafc]/30 to-transparent pointer-events-none" />
        
        <div className="max-w-[1240px] mx-auto px-6 lg:px-8 relative z-10 pt-20">
          
          {/* Header Layout */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6.5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Stay Up-to-Date with the Latest Enhancements
            </h1>
            
            <p className="text-slate-500 text-[15px] md:text-base leading-relaxed max-w-3xl mx-auto mt-6">
              At TrackForce, we&apos;re constantly improving and updating our CRM platform to give you the best possible experience. From new features and performance enhancements to bug fixes and optimizations.
            </p>
            
            {/* Email Input / Newsletter Subscription Box */}
            <div className="mt-10 max-w-xl mx-auto">
              <form onSubmit={handleSubscribe} className="flex gap-x-2.5 bg-white p-1 rounded-full border border-slate-100 shadow-sm focus-within:shadow focus-within:border-indigo-200 transition-all">
                <input
                  id="email-input"
                  type="email"
                  required
                  placeholder="Enter your email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-5 h-[48px] text-sm text-slate-800 placeholder-slate-400 bg-transparent rounded-full focus:outline-none"
                />
                <button 
                  id="subscribe-button"
                  type="submit"
                  className="bg-gradient-to-r from-[#4d3df2] to-[#2563eb] text-white text-[13px] font-semibold tracking-wide px-7 h-[48px] rounded-full hover:shadow-lg hover:from-[#3e2ef0] hover:to-[#1d4ed8] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center"
                >
                  Subscribe to Updates
                </button>
              </form>
              
              {newsletterSubscribed && (
                <p className="text-emerald-500 text-xs font-semibold mt-3 text-center animate-fade-in">
                  Thanks! Checking your updates details. You are now registered on our priority update distribution list.
                </p>
              )}
            </div>
          </div>

          {/* Filtering Dropdown Blocks Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16 relative z-50">
            
            {/* Filter 1: Release Type */}
            <div className="relative">
              <button 
                id="filter-release-type"
                onClick={() => toggleDropdown("release")}
                className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-white border border-slate-100 hover:border-slate-200 transition text-[13px] text-slate-500 font-medium whitespace-nowrap shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:shadow-sm"
              >
                <span>{selectedReleaseType === "All" ? "Release Type" : `Type: ${selectedReleaseType}`}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${activeDropdown === "release" ? "rotate-180" : ""}`} />
              </button>
              
              {activeDropdown === "release" && (
                <div 
                  className="absolute z-50 mt-1.5 w-full bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 focus:outline-none animate-fade-in"
                >
                  {filterOptions.releaseTypes.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setSelectedReleaseType(item);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-5 py-2 text-xs transition-colors ${
                        selectedReleaseType === item ? "text-[#374bf9] font-bold bg-[#374bf9]/5" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {item === "All" ? "Clear Filter" : item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter 2: Product Area */}
            <div className="relative">
              <button 
                id="filter-product-area"
                onClick={() => toggleDropdown("area")}
                className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-white border border-slate-100 hover:border-slate-200 transition text-[13px] text-slate-500 font-medium whitespace-nowrap shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:shadow-sm"
              >
                <span>{selectedProductArea === "All" ? "Product Area" : `Area: ${selectedProductArea}`}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${activeDropdown === "area" ? "rotate-180" : ""}`} />
              </button>
              
              {activeDropdown === "area" && (
                <div 
                  className="absolute z-50 mt-1.5 w-full bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 focus:outline-none animate-fade-in"
                >
                  {filterOptions.productAreas.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setSelectedProductArea(item);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-5 py-2 text-xs transition-colors ${
                        selectedProductArea === item ? "text-[#374bf9] font-bold bg-[#374bf9]/5" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {item === "All" ? "Clear Filter" : item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter 3: Integration */}
            <div className="relative">
              <button 
                id="filter-integration"
                onClick={() => toggleDropdown("integration")}
                className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-white border border-slate-100 hover:border-slate-200 transition text-[13px] text-slate-500 font-medium whitespace-nowrap shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:shadow-sm"
              >
                <span>{selectedIntegration === "All" ? "Integration" : `Int: ${selectedIntegration}`}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${activeDropdown === "integration" ? "rotate-180" : ""}`} />
              </button>
              
              {activeDropdown === "integration" && (
                <div 
                  className="absolute z-50 mt-1.5 w-full bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 focus:outline-none animate-fade-in"
                >
                  {filterOptions.integrations.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setSelectedIntegration(item);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-5 py-2 text-xs transition-colors ${
                        selectedIntegration === item ? "text-[#374bf9] font-bold bg-[#374bf9]/5" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {item === "All" ? "Clear Filter" : item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter 4: Date */}
            <div className="relative">
              <button 
                id="filter-date"
                onClick={() => toggleDropdown("date")}
                className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-white border border-slate-100 hover:border-slate-200 transition text-[13px] text-slate-500 font-medium whitespace-nowrap shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:shadow-sm"
              >
                <span>{selectedDateFilter === "All" ? "Date" : `${selectedDateFilter}`}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${activeDropdown === "date" ? "rotate-180" : ""}`} />
              </button>
              
              {activeDropdown === "date" && (
                <div 
                  className="absolute z-50 mt-1.5 w-full bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 focus:outline-none animate-fade-in"
                >
                  {filterOptions.dates.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setSelectedDateFilter(item);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-5 py-2 text-xs transition-colors ${
                        selectedDateFilter === item ? "text-[#374bf9] font-bold bg-[#374bf9]/5" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {item === "All" ? "Clear Filter" : item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>          {/* List of Custom High-Fidelity Cards */}
          <div className="space-y-12 max-w-[1140px] mx-auto">
            {filteredEnhancements.map((post) => {
                const isExpanded = expandedPostIds.includes(post.id);
                const isLiked = likedPosts.includes(post.id);
                const isBookmarked = bookmarkedPosts.includes(post.id);

                // Simulated monthly metrics for interactive reporting tool
                const monthlyData = [
                  { label: "Jan", val: 35, count: "1,240", growth: "+6.2%", status: "Consistent" },
                  { label: "Feb", val: 42, count: "1,530", growth: "+7.8%", status: "Optimal" },
                  { label: "Mar", val: 38, count: "1,420", growth: "-1.5%", status: "Consistent" },
                  { label: "Apr", val: 55, count: "1,895", growth: "+12.4%", status: "Growing" },
                  { label: "May", val: 78, count: "2,350", growth: "+18.1%", status: "Optimal" },
                  { label: "Jun", val: 110, count: "3,110", growth: "+28.4%", status: "Peak Load" },
                  { label: "Jul", val: 100, count: "2,840", growth: "-4.2%", status: "High Priority" },
                  { label: "Aug", val: 65, count: "1,920", growth: "-11.8%", status: "Optimal" },
                  { label: "Sep", val: 58, count: "1,750", growth: "+5.1%", status: "Consistent" },
                  { label: "Oct", val: 75, count: "2,150", growth: "+14.6%", status: "Growing" },
                  { label: "Nov", val: 88, count: "2,580", growth: "+11.9%", status: "Robust" },
                  { label: "Dec", val: 95, count: "2,940", growth: "+21.3%", status: "Peak Load" }
                ];

                const currentChartData = monthlyData[activeChartMonth];

                // Dynamic social click handlers
                const handleLikeToggle = (id: number) => {
                  if (likedPosts.includes(id)) {
                    setLikedPosts(likedPosts.filter(x => x !== id));
                  } else {
                    setLikedPosts([...likedPosts, id]);
                  }
                };

                const handleBookmarkToggle = (id: number) => {
                  if (bookmarkedPosts.includes(id)) {
                    setBookmarkedPosts(bookmarkedPosts.filter(x => x !== id));
                  } else {
                    setBookmarkedPosts([...bookmarkedPosts, id]);
                  }
                };

                const handleShare = (title: string) => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(`${window.location.origin}/blog?update=${encodeURIComponent(title)}`);
                    alert(`Copied link to check: "${title}" update share trajectory live!`);
                  }
                };

                // Add Guest to Collaboration live list
                const handleAddNewUser = () => {
                  if (collabUsers.length < 5) {
                    const pool = [
                      { initials: "EW", name: "Emma Watson", role: "Contributor", comment: "Validating API payloads" },
                      { initials: "TL", name: "Tom Lin", role: "Reviewer", comment: "Auditing UI performance" },
                      { initials: "SC", name: "Sarah Connor", role: "Administrator", comment: "Syncing DB clusters" }
                    ];
                    const nextOne = pool[collabUsers.length - 2] || pool[0];
                    setCollabUsers([...collabUsers, nextOne]);
                  } else {
                    // Reset to default
                    setCollabUsers([
                      { initials: "RD", name: "Robbi Darwis", role: "Read and write", comment: "Reviewing specs" },
                      { initials: "MA", name: "Mohamed Amien", role: "Read and write", comment: "Designing mockup" }
                    ]);
                  }
                };

                // Trigger interactive security threat scan
                const runSecurityScan = () => {
                  setSecurityStatus("scanning");
                  setShieldScore(84);
                  setTimeout(() => {
                    setSecurityStatus("secure");
                    setShieldScore(99.6);
                  }, 1800);
                };

                return (
                  <div
                    key={post.id}
                    className="group bg-white rounded-[32px] border border-slate-100 p-8 lg:p-10 flex flex-col xl:flex-row gap-8 xl:gap-12 items-stretch justify-between shadow-[0_2px_12px_rgba(30,41,59,0.01)] hover:shadow-[0_20px_50px_rgba(30,41,59,0.06)] hover:border-indigo-100/70 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
                  >
                    {/* Artistic gradient background accent glow */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-50/10 via-purple-50/5 to-transparent rounded-full filter blur-[80px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {/* Left Column: Data descriptions */}
                    <div className="flex-1 flex flex-col justify-between pr-0 lg:pr-2 z-10">
                      <div>
                        
                        {/* Upper meta badges row */}
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-slate-400 font-semibold text-[11px] tracking-wider uppercase flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md">
                            <Calendar size={12} className="text-indigo-400" />
                            {post.date}
                          </span>
                          <span className="text-indigo-600 bg-indigo-50/80 font-bold text-[11px] px-2.5 py-1 rounded-md">
                            {post.version}
                          </span>
                          <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1 ml-auto">
                            <Clock size={12} className="text-slate-400/80" />
                            <span>5 min read</span>
                          </span>
                        </div>
                        
                        {/* Title & Custom Indicator Header */}
                        <h2 className="text-2xl md:text-3xl lg:text-[34px] font-extrabold tracking-tight text-slate-800 mt-[18px] group-hover:text-indigo-600 transition-colors duration-300 leading-tight">
                          {post.title}
                        </h2>

                        {/* Interactive Categories badging */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {post.badges.map((badge, idx) => (
                            <span 
                              key={idx} 
                              className={`text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wide uppercase leading-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:scale-105 transition-all duration-200 cursor-default ${badge.color}`}
                            >
                              {badge.text}
                            </span>
                          ))}
                        </div>

                        <p className="text-slate-500 text-[15px] leading-relaxed mt-6 font-normal">
                          {post.description}
                        </p>

                        {/* High-quality Benefits Layout */}
                        <div className="mt-8 bg-slate-50/70 rounded-2xl p-5 border border-slate-100/50">
                          <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-3.5 flex items-center gap-1.5">
                            <Sparkles size={12} className="text-amber-500" />
                            Key Architectural Benefits:
                          </p>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0">
                            {post.benefits.map((benefit, bIdx) => (
                              <li key={bIdx} className="text-slate-600 text-[13px] flex items-start gap-2.5">
                                <div className="mt-0.5 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                </div>
                                <span className="font-medium leading-normal">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Rich Content Expanded View Toggle */}
                        <div 
                          className={`grid transition-[grid-template-rows,opacity] duration-350 ease-in-out ${
                            isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="mt-6 pt-6 border-t border-slate-100 prose prose-slate prose-sm max-w-none prose-h3:text-slate-800 prose-p:text-slate-500 prose-ul:text-slate-500">
                              <div dangerouslySetInnerHTML={{ __html: post.detailMarkdown }} />
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Footer Actions (Expanded states, Social reactions) */}
                      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                        
                        {/* Interactive toggle button */}
                        <button 
                          id={`see-more-${post.id}`}
                          onClick={() => toggleExpand(post.id)}
                          className="bg-slate-100/80 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-bold text-[13px] tracking-wide px-5 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300 shadow-sm"
                        >
                          <span>{isExpanded ? "Collapse Specs" : "Explore Technical Specs"}</span>
                          <ChevronDown size={14} className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180 text-indigo-500" : "text-slate-500"}`} />
                        </button>

                        {/* Group Reactions Panel */}
                        <div className="flex items-center gap-x-3.5">
                          {/* Heart Icon Button */}
                          <button 
                            onClick={() => handleLikeToggle(post.id)}
                            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full border transition-all duration-300 ${
                              isLiked 
                                ? "bg-red-50 border-red-100 text-red-500 shadow-sm scale-105" 
                                : "bg-white border-slate-100 text-slate-400 hover:text-red-500 hover:bg-slate-50 hover:border-slate-200"
                            }`}
                          >
                            <span className={`inline-block transition-transform duration-300 ${isLiked ? "scale-125 text-red-500" : ""}`}>
                              <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                            </span>
                            <span>{isLiked ? 142 : 141}</span>
                          </button>

                          {/* Bookmark Toggle */}
                          <button
                            onClick={() => handleBookmarkToggle(post.id)}
                            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                              isBookmarked 
                                ? "bg-amber-50 border-amber-100 text-amber-500 scale-105 shadow-sm" 
                                : "bg-white border-slate-100 text-slate-400 hover:text-amber-500 hover:bg-slate-50 hover:border-slate-200"
                            }`}
                            title="Save for documentation"
                          >
                            <Bookmark size={14} fill={isBookmarked ? "currentColor" : "none"} />
                          </button>

                          {/* Share Trigger */}
                          <button
                            onClick={() => handleShare(post.title)}
                            className="w-8 h-8 rounded-full border border-slate-100 bg-white text-slate-400 hover:text-indigo-600 hover:bg-slate-50 hover:border-indigo-100 flex items-center justify-center transition-all duration-300"
                            title="Copy link to clipboard"
                          >
                            <Share2 size={13} />
                          </button>
                        </div>

                      </div>

                    </div>

                    {/* Right Column: Custom High-Fidelity Mock Visual Elements */}
                    <div className="w-full xl:w-[440px] min-h-[296px] xl:min-h-auto relative flex-shrink-0 bg-gradient-to-b from-slate-50 to-[#f1f5f9] border border-slate-100/50 rounded-3xl overflow-hidden p-6 flex flex-col justify-center transition-all duration-300 group-hover:border-indigo-100 group-hover:from-slate-50 group-hover:to-indigo-50/20 shadow-inner">
                      
                      {/* Grid Background overlay for tech feel */}
                      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />

                      {/* Dynamic Render Type: Chart Dashboard */}
                      {post.previewType === "chart" && (
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 flex flex-col justify-between relative z-10 flex-1 hover:shadow-2xl transition-shadow duration-300">
                          
                          {/* Inner Header Block */}
                          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                            <div>
                              <span className="text-[10px] text-indigo-500 font-extrabold uppercase tracking-widest block">Core Dashboard telemetry</span>
                              <span className="text-[13px] text-slate-700 font-extrabold flex items-center gap-1.5 mt-0.5">
                                <span>Dynamic Metrics: database triggers</span>
                                <ChevronDown size={12} className="text-slate-400" />
                              </span>
                            </div>
                            <button className="text-slate-300 hover:text-slate-500 transition-colors p-1 bg-slate-50 rounded-full"><Settings size={13} /></button>
                          </div>

                          {/* Interactive month display dynamic readout card */}
                          <div className="mt-3 bg-gradient-to-r from-indigo-50/50 via-slate-50/50 to-indigo-50/20 rounded-xl p-3 border border-indigo-100/50 flex items-center justify-between">
                            <div>
                              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Selected reporting period</span>
                              <div className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5 mt-0.5">
                                <span className="bg-indigo-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded leading-none">{currentChartData.label}</span>
                                <span>{currentChartData.count} Records processed</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold block">Performance variance</span>
                              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-0.5 mt-0.5 justify-end">
                                <TrendingUp size={10} />
                                {currentChartData.growth}
                              </span>
                            </div>
                          </div>
                          
                          {/* Simulated SVG Bar Chart exact matching the image with click events */}
                          <div className="h-28 flex items-end justify-between px-1 gap-1.5 relative border-b border-dashed border-slate-100 pb-1 mt-4">
                            {/* Dotted threshold limit lines */}
                            <div className="absolute inset-x-0 bottom-1/4 border-t border-slate-150/40 pointer-events-none" />
                            <div className="absolute inset-x-0 bottom-2/4 border-t border-slate-150/40 pointer-events-none" />
                            <div className="absolute inset-x-0 bottom-3/4 border-t border-slate-150/40 pointer-events-none" />

                            {monthlyData.map((data, bIdx) => {
                              const isHighlighted = bIdx >= 5 && bIdx <= 7;
                              const isCurrentlyActive = activeChartMonth === bIdx;
                              
                              return (
                                <button 
                                  key={bIdx}
                                  onClick={() => setActiveChartMonth(bIdx)}
                                  className="flex-1 flex flex-col items-center h-full justify-end relative z-10 focus:outline-none focus:ring-0 group/bar pt-4"
                                  title={`Click to analyze ${data.label}`}
                                >
                                  {/* Tooltip on bar hover */}
                                  <span className="absolute -top-1 bg-slate-800 text-white text-[8px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-30 whitespace-nowrap">
                                    {data.count}
                                  </span>

                                  <div 
                                    style={{ height: `${data.val}%` }} 
                                    className={`w-full rounded-t-[3px] transition-all duration-500 cursor-pointer ${
                                      isCurrentlyActive 
                                        ? "bg-gradient-to-t from-indigo-600 to-indigo-500 ring-2 ring-indigo-400 ring-offset-1 scale-x-110 shadow-[0_4px_16px_rgba(99,102,241,0.3)]"
                                        : isHighlighted 
                                          ? "bg-gradient-to-t from-purple-500/80 to-indigo-500/80 hover:from-indigo-500 hover:to-indigo-400" 
                                          : "bg-slate-200/90 hover:bg-slate-300"
                                    }`}
                                  />
                                </button>
                              );
                            })}
                          </div>

                          {/* Dynamic axis legends */}
                          <div className="flex justify-between text-[9px] text-slate-400/90 font-black px-1 mt-1.5 tracking-tighter">
                            {monthlyData.map((data, mIdx) => (
                              <button 
                                key={mIdx} 
                                onClick={() => setActiveChartMonth(mIdx)}
                                className={`transition-colors whitespace-nowrap uppercase ${activeChartMonth === mIdx ? "text-indigo-600 font-extrabold" : "hover:text-slate-600"}`}
                              >
                                {data.label}
                              </button>
                            ))}
                          </div>

                          <div className="flex justify-between items-center mt-3 pt-2 px-1 border-t border-slate-50 text-[10px] text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              <span className="font-bold text-slate-500 text-[10px]">Indexed system category: <strong className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{currentChartData.status}</strong></span>
                            </div>
                            <span className="text-[10px] font-extrabold text-[#374bf9] animate-pulse">● Live Audit</span>
                          </div>
                        </div>
                      )}

                      {/* Dynamic Render Type: Document Access List */}
                      {post.previewType === "collab" && (
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 flex flex-col justify-between overflow-hidden relative z-10 flex-1">
                          
                          {/* Inner Header with Switch Tabs */}
                          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                            <span className="text-[13px] text-slate-800 font-extrabold flex items-center gap-1.5">
                              <ArrowLeft size={12} className="text-slate-400" />
                              <span>Active Project Stream</span>
                            </span>
                            
                            {/* Micro tab controller */}
                            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/50">
                              <button 
                                onClick={() => setActiveTabCollab("users")}
                                className={`text-[9px] font-extrabold px-2 py-1 rounded-md transition-all ${activeTabCollab === "users" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
                              >
                                Users
                              </button>
                              <button 
                                onClick={() => setActiveTabCollab("files")}
                                className={`text-[9px] font-extrabold px-2 py-1 rounded-md transition-all ${activeTabCollab === "files" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
                              >
                                Assets
                              </button>
                            </div>
                          </div>

                          {/* Tab Content 1: Active Users Directory */}
                          {activeTabCollab === "users" && (
                            <div className="space-y-3 mt-3 flex-1 flex flex-col justify-between">
                              <div className="flex items-center justify-between bg-indigo-50/40 p-2.5 rounded-xl border border-indigo-100/50">
                                <div className="flex items-center gap-2.5">
                                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-extrabold text-[10px] shadow-sm">
                                    +
                                  </span>
                                  <div>
                                    <span className="text-[11px] text-slate-800 font-extrabold block leading-none">Access Control Hub</span>
                                    <span className="text-[8px] text-slate-400 block mt-0.5 font-semibold">Integrate guest team member logs</span>
                                  </div>
                                </div>
                                <button 
                                  onClick={handleAddNewUser}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-black px-3 py-1.5 rounded-lg shadow-sm hover:shadow active:scale-95 transition-all"
                                >
                                  {collabUsers.length >= 5 ? "Reset Users" : "Provision User"}
                                </button>
                              </div>

                              <div className="text-[9px] text-slate-400 font-bold tracking-wider uppercase">Active Session Engineers:</div>
                              
                              <div className="space-y-2 max-h-[110px] overflow-y-auto pr-1">
                                {collabUsers.map((u, ui) => (
                                  <div key={ui} className="flex items-center justify-between text-[11px] bg-slate-50/50 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center ${
                                        ui === 0 ? "bg-emerald-100 text-emerald-800" :
                                        ui === 1 ? "bg-indigo-100 text-indigo-800" :
                                        "bg-purple-100 text-purple-800"
                                      }`}>
                                        {u.initials}
                                      </div>
                                      <div>
                                        <span className="text-slate-800 font-extrabold block leading-none">{u.name}</span>
                                        <span className="text-[8px] text-slate-400 block mt-0.5 italic">{u.comment}</span>
                                      </div>
                                    </div>
                                    <span className="text-slate-400 font-extrabold text-[9px] bg-white px-2 py-0.5 rounded border border-slate-150">
                                      {u.role}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Tab Content 2: Shared assets repository folder logs */}
                          {activeTabCollab === "files" && (
                            <div className="space-y-2 mt-3 flex-1 flex flex-col justify-between">
                              <div className="text-[9px] text-slate-400 font-bold tracking-wider uppercase">Project Storage Pool:</div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px]">
                                  <span className="text-slate-700 font-bold flex items-center gap-1.5">
                                    <FileText size={12} className="text-rose-500" />
                                    Briefing_Specs_V3.doc
                                  </span>
                                  <span className="text-[8px] font-bold text-slate-400">142 KB</span>
                                </div>
                                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px]">
                                  <span className="text-slate-700 font-bold flex items-center gap-1.5">
                                    <BarChart2 size={12} className="text-emerald-500" />
                                    October_Marketing_Aggregations.pdf
                                  </span>
                                  <span className="text-[8px] font-bold text-slate-400 font-semibold">2,481 KB</span>
                                </div>
                                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px]">
                                  <span className="text-slate-700 font-bold flex items-center gap-1.5">
                                    <FileCode size={12} className="text-indigo-500" />
                                    Tailwind_Production_Manifest.json
                                  </span>
                                  <span className="text-[8px] font-bold text-slate-400">12 KB</span>
                                </div>
                              </div>
                              <div className="text-[9px] text-center bg-indigo-50/50 text-indigo-700 p-1 rounded font-bold border border-indigo-100/30">
                                Storage tier utilization: 8% of 100GB secure volume
                              </div>
                            </div>
                          )}

                          {/* Visual asset absolute anchor representing system integrity */}
                          <div className="absolute right-4 bottom-3 bg-indigo-600 text-white rounded-xl shadow-lg px-3 py-2 w-[150px] transform hover:translate-y-[-2px] transition-transform pointer-events-none border border-indigo-500">
                            <div className="text-[8px] text-indigo-200 font-black tracking-widest uppercase mb-1">
                              System Status
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block shrink-0" />
                              <span>SSO Sync Active</span>
                            </div>
                          </div>

                        </div>
                      )}

                      {/* Dynamic Render Type - Threat Risk / Identity Shield */}
                      {post.previewType === "security" && (
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 flex flex-col justify-between relative z-10 flex-1 hover:shadow-2xl transition-shadow duration-300">
                          
                          {/* Card top row */}
                          <div className="flex items-center justify-between border-b border-indigo-50 pb-2">
                            <span className="text-[12px] text-slate-800 font-extrabold flex items-center gap-1.5">
                              <ShieldCheck size={16} className="text-indigo-600" />
                              <span>E2EE Access Guard</span>
                            </span>
                            
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all uppercase ${
                              securityStatus === "secure" ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50 animate-pulse"
                            }`}>
                              {securityStatus === "secure" ? "Protected" : "Auditing..."}
                            </span>
                          </div>

                          {/* Visual progress bar scanning feedback */}
                          <div className="my-3 py-2.5 px-3 bg-slate-50/90 rounded-xl border border-slate-100 flex items-center justify-between relative overflow-hidden">
                            
                            {/* Scanning green line animation overlay */}
                            {securityStatus === "scanning" && (
                              <div 
                                className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-[#4caf50]/20 to-transparent pointer-events-none animate-scan"
                              />
                            )}

                            <div>
                              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black block">Threat vulnerability rating</span>
                              <span className="text-[13px] text-slate-800 font-extrabold block mt-0.5">
                                Current Score: <strong className="text-indigo-600 font-black">{shieldScore}%</strong>
                              </span>
                            </div>
                            
                            <div>
                              <button 
                                onClick={runSecurityScan}
                                disabled={securityStatus === "scanning"}
                                className={`text-[10px] font-black px-3 py-1.5 rounded-lg border transition-all ${
                                  securityStatus === "scanning" 
                                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" 
                                    : "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600 shadow-sm active:scale-95 cursor-pointer"
                                }`}
                              >
                                {securityStatus === "scanning" ? "Scanning..." : "Audit"}
                              </button>
                            </div>
                          </div>

                          {/* Security details logs */}
                          <div className="space-y-2 mt-1">
                            <div className="flex items-start gap-2 bg-slate-100/40 p-2 rounded-lg border border-slate-150/50">
                              <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 ${securityStatus === "secure" ? "bg-emerald-500" : "bg-amber-400 animate-ping"}`} />
                              <div className="flex-1">
                                <span className="text-[10.5px] font-bold text-slate-700 block leading-tight">Yubikey Authentication Validation</span>
                                <span className="text-[8px] text-slate-450 block mt-0.5">Hardware security keys parsed & synced completely</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2 bg-slate-100/40 p-2 rounded-lg border border-slate-150/50">
                              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <span className="text-[10.5px] font-bold text-slate-700 block leading-tight">Contextual Risk Monitor</span>
                                <span className="text-[8px] text-slate-450 block mt-0.5">Mismatched administrative patterns: none flagged</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-50 pt-2 text-[9px] text-slate-400 tracking-tight mt-3">
                            <span className="font-bold text-slate-500 block">System Keys: <strong>14 verified credentials</strong></span>
                            <span className="text-indigo-600 font-extrabold">SOC-2 Fully Verified</span>
                          </div>
                        </div>
                      )}

                    </div>

                  </div>
                );
              })}

            {/* Empty view block if filters yield no elements */}
            {filteredEnhancements.length === 0 && (
              <div 
                className="py-16 text-center animate-fade-in"
              >
                <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No matching updates found</h3>
                <p className="text-slate-500 text-sm mt-1">Please try modifying your selected filters or search phrasing.</p>
                <button
                  onClick={() => {
                    setSelectedReleaseType("All");
                    setSelectedProductArea("All");
                    setSelectedIntegration("All");
                    setSelectedDateFilter("All");
                    setSearchQuery("");
                  }}
                  className="mt-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-5 py-2 rounded-full transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}

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

            {/* Customer Care */}
            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Customer Care</h3>
              <p className="text-[14px] font-semibold text-[#2d2d2d] mb-4">
                Support Available 24/7/365
              </p>
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Follow Us On</h3>
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2d2d2d] hover:bg-[#3452ef] hover:text-white transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2d2d2d] hover:bg-[#3452ef] hover:text-white transition-colors">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2d2d2d] hover:bg-[#3452ef] hover:text-white transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2d2d2d] hover:bg-[#3452ef] hover:text-white transition-colors">
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[14px] font-bold text-[#2d2d2d]">
              © {new Date().getFullYear()} Comsri Corporation. All Rights Reserved.
            </p>
            <div className="flex gap-4">
              <span className="text-[11px] font-bold tracking-wide text-[#2d2d2d] bg-white px-3 py-1 rounded-full shadow-sm">PAN-INDIA DELIVERY</span>
              <span className="text-[11px] font-bold tracking-wide text-white bg-[#0f912a] px-3 py-1 rounded-full shadow-sm">VERIFIED SITE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
