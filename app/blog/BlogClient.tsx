"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ChevronDown, 
  Calendar, 
  Clock, 
  Share2, 
  BookOpen, 
  Heart, 
  Bookmark, 
  Search,
  ArrowRight,
  TrendingUp,
  X,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from "lucide-react";

interface WPPost {
  id: number;
  title: { rendered: string };
  date: string;
  excerpt: { rendered: string };
  content: { rendered: string };
  slug: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
    "wp:term"?: Array<Array<{ name: string; id: number }>>;
  };
}

interface WPCategory {
  id: number;
  name: string;
  count: number;
}

interface BlogClientProps {
  initialPosts: WPPost[];
  categories: WPCategory[];
}

export default function BlogClient({ initialPosts, categories }: BlogClientProps) {
  const [posts, setPosts] = useState<WPPost[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  // Expanded post IDs for inline read
  const [expandedPostIds, setExpandedPostIds] = useState<number[]>([]);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<number[]>([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const toggleExpand = (id: number) => {
    if (expandedPostIds.includes(id)) {
      setExpandedPostIds(expandedPostIds.filter(x => x !== id));
    } else {
      setExpandedPostIds([...expandedPostIds, id]);
    }
  };

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

  const handleShare = (title: string, slug: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/blog?post=${slug}`);
      alert(`Copied link to clipboard for: "${title}"`);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  // Client-side search and category filtering
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const titleMatches = post.title.rendered.toLowerCase().includes(searchQuery.toLowerCase());
      const excerptMatches = post.excerpt.rendered.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSearch = titleMatches || excerptMatches;

      const postCats = post._embedded?.["wp:term"]?.[0]?.map(t => t.id) || [];
      const matchesCategory = selectedCategory === null || postCats.includes(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  // Helper to remove HTML tags for excerpts
  const cleanExcerpt = (html: string) => {
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();
  };

  return (
    <main className="flex-1 pb-24 relative overflow-hidden bg-[#f5f6f8]">
      {/* Sky-blue ambient gradient splash */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#eef2ff]/60 via-[#f8fafc]/30 to-transparent pointer-events-none" />
      
      <div className="max-w-[1240px] mx-auto px-6 lg:px-8 relative z-10 pt-20">
        
        {/* Header Layout */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Latest News, Insights & CRM Enhancements
          </h1>
          
          <p className="text-slate-500 text-[15px] md:text-base leading-relaxed max-w-3xl mx-auto mt-6">
            Browse corporate news, hardware guides, e-waste explanations, and smart IT solutions from Comsri Corporation. Updated dynamically.
          </p>
          
          {/* Search and Newsletter subscription box */}
          <div className="mt-10 max-w-xl mx-auto">
            <form onSubmit={handleSubscribe} className="flex gap-x-2.5 bg-white p-1.5 rounded-full border border-slate-200 shadow-sm focus-within:shadow focus-within:border-indigo-200 transition-all">
              <input
                type="email"
                required
                placeholder="Subscribe to our updates..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 h-[48px] text-sm text-slate-800 placeholder-slate-400 bg-transparent rounded-full focus:outline-none"
              />
              <button 
                type="submit"
                className="bg-[#3452ef] hover:bg-[#203bca] text-white text-[13px] font-bold tracking-wide px-7 h-[48px] rounded-full hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center shrink-0"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="text-emerald-600 text-xs font-semibold mt-3 text-center animate-fade-in">
                Thank you! You are now subscribed to our newsletter list.
              </p>
            )}
          </div>
        </div>

        {/* Categories Filtering and Search Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 max-w-[1140px] mx-auto border-b border-slate-200/60 pb-6">
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === null 
                  ? "bg-slate-900 text-white shadow-sm" 
                  : "bg-white text-slate-650 hover:bg-slate-100 border border-slate-100"
              }`}
            >
              All Articles
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id 
                    ? "bg-indigo-600 text-white shadow-sm" 
                    : "bg-white text-slate-650 hover:bg-slate-100 border border-slate-100"
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>

          {/* Live Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-indigo-500 font-medium text-slate-800"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* List of Blog Cards */}
        <div className="space-y-10 max-w-[1140px] mx-auto">
          {filteredPosts.map((post) => {
            const isExpanded = expandedPostIds.includes(post.id);
            const isLiked = likedPosts.includes(post.id);
            const isBookmarked = bookmarkedPosts.includes(post.id);
            
            const categoryName = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Uncategorized";
            const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "https://picsum.photos/seed/placeholder/800/500";

            return (
              <article
                key={post.id}
                className="bg-white rounded-[32px] border border-slate-100 p-6 md:p-8 flex flex-col lg:flex-row gap-6 md:gap-8 shadow-[0_2px_12px_rgba(30,41,59,0.01)] hover:shadow-[0_20px_50px_rgba(30,41,59,0.06)] hover:border-indigo-150 transition-all duration-300 relative overflow-hidden"
              >
                {/* Featured Image */}
                <div className="w-full lg:w-[380px] aspect-[16/10] lg:aspect-auto relative rounded-2xl overflow-hidden shrink-0 bg-slate-50 border border-slate-100">
                  <img src={featuredImage} alt={post.title.rendered} className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-[#3452ef] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wide">
                    {categoryName}
                  </span>
                </div>

                {/* Content Panel */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta Row */}
                    <div className="flex items-center gap-3 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                      <Calendar size={12} className="text-slate-400" />
                      <span>{formatDate(post.date)}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>4 min read</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 
                      className="text-xl md:text-2xl font-black text-slate-900 mt-3 leading-snug hover:text-[#3452ef] cursor-pointer transition-colors"
                      onClick={() => toggleExpand(post.id)}
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />

                    {/* Excerpt */}
                    <p className="text-slate-500 text-sm leading-relaxed mt-4">
                      {cleanExcerpt(post.excerpt.rendered)}
                    </p>

                    {/* Inline Content Read */}
                    <div 
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                        isExpanded ? "grid-rows-[1fr] opacity-100 mt-6 pt-6 border-t border-slate-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div 
                          className="prose prose-sm max-w-none text-slate-650 prose-headings:text-slate-800 prose-a:text-[#3452ef] prose-img:rounded-xl"
                          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <button 
                      onClick={() => toggleExpand(post.id)}
                      className="bg-slate-100 hover:bg-indigo-50 hover:text-indigo-650 text-slate-700 font-extrabold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <span>{isExpanded ? "Collapse Article" : "Read Full Article"}</span>
                      <ChevronDown size={14} className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180 text-indigo-600" : ""}`} />
                    </button>

                    {/* Reactions */}
                    <div className="flex items-center gap-2">
                      {/* Like */}
                      <button 
                        onClick={() => handleLikeToggle(post.id)}
                        className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full border transition-all ${
                          isLiked 
                            ? "bg-red-50 border-red-100 text-red-500 scale-105" 
                            : "bg-white border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50/20"
                        }`}
                      >
                        <Heart size={13} fill={isLiked ? "currentColor" : "none"} />
                        <span>{isLiked ? 25 : 24}</span>
                      </button>

                      {/* Bookmark */}
                      <button 
                        onClick={() => handleBookmarkToggle(post.id)}
                        className={`w-8.5 h-8.5 rounded-full border flex items-center justify-center transition-all ${
                          isBookmarked 
                            ? "bg-amber-50 border-amber-100 text-amber-500 scale-105" 
                            : "bg-white border-slate-100 text-slate-400 hover:text-amber-500 hover:bg-amber-50/20"
                        }`}
                      >
                        <Bookmark size={13} fill={isBookmarked ? "currentColor" : "none"} />
                      </button>

                      {/* Share */}
                      <button 
                        onClick={() => handleShare(post.title.rendered, post.slug)}
                        className="w-8.5 h-8.5 rounded-full border border-slate-100 bg-white text-slate-400 hover:text-indigo-650 hover:bg-slate-50 flex items-center justify-center transition-all"
                      >
                        <Share2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {filteredPosts.length === 0 && (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-4xl mb-4 block">🔍</span>
              <h3 className="text-base font-bold text-slate-800">No blog posts match your criteria</h3>
              <p className="text-xs text-slate-400 mt-1">Try refining your search keyword or selection.</p>
              <button 
                onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}
                className="mt-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
