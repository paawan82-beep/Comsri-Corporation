"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight,
  X,
  ArrowUpRight
} from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";

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
    "author"?: Array<{ name: string; avatar_urls?: { [key: string]: string } }>;
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
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

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

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentGridPosts = useMemo(() => {
    return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  }, [filteredPosts, indexOfFirstPost, indexOfLastPost]);

  const featuredPost = useMemo(() => {
    return filteredPosts[0] || null;
  }, [filteredPosts]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const cleanExcerpt = (html: string) => {
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();
  };

  return (
    <main className="flex-1 pb-24 bg-[#f5f6f8] text-slate-800 font-sans antialiased min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 pt-12">
        
        {/* Header Block */}
        <div className="border-b border-slate-200 pb-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-[32px] sm:text-[40px] font-extrabold text-slate-900 tracking-tight">
                Discover Nice Articles Here
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-3 max-w-[650px] leading-relaxed">
                All The Articles And Contents Of The Site Have Been <strong className="text-slate-900 font-bold">Updated Today</strong> And You Can Find Your <strong className="text-slate-900 font-bold">Articles And Contents</strong> Quickly And Without Any Problems.
              </p>
            </div>
          </div>

          {/* Search bar & Categories filter row */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mt-8 pt-4">
            <div className="relative w-full lg:w-80">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-white border border-slate-300 rounded-full pl-11 pr-10 py-2.5 text-xs outline-none focus:border-blue-500 font-medium text-slate-800 transition-colors shadow-sm"
              />
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Categories List */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              <button
                onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
                className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === null 
                    ? "bg-[#2f55f6] text-white shadow-md shadow-blue-500/10" 
                    : "text-slate-550 hover:text-slate-900 hover:bg-slate-100/50"
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                  className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === cat.id 
                      ? "bg-[#2f55f6] text-white shadow-md shadow-blue-500/10" 
                      : "text-slate-550 hover:text-slate-900 hover:bg-slate-100/50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section Title */}
        <h2 className="text-lg font-bold text-center tracking-wider text-slate-400 uppercase mb-8">
          Articles
        </h2>

        {/* HERO / FEATURED SLIDER */}
        {featuredPost && (
          <div className="mb-14 animate-fade-in">
            <article className="relative w-full rounded-[28px] overflow-hidden bg-gradient-to-r from-[#e3e8f8] via-[#ebf0fc] to-[#f3f7fd] border border-slate-200 p-8 sm:p-12 min-h-[340px] flex flex-col justify-center shadow-md">
              <div className="absolute right-0 top-0 bottom-0 w-[45%] opacity-90 pointer-events-none overflow-hidden rounded-r-[28px] hidden md:block">
                <img 
                  src={featuredPost._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800"} 
                  alt="Visual mesh decoration"
                  className="object-cover w-full h-full mix-blend-multiply scale-110"
                />
              </div>

              <div className="max-w-[600px] relative z-10 text-slate-900">
                {/* Author Badge */}
                <div className="flex items-center gap-2 mb-4 bg-white/70 backdrop-blur-md w-fit px-3 py-1 rounded-full shadow-sm border border-slate-100">
                  <span className="text-slate-800 text-[11px] font-bold">
                    Comsri Corporation • 5 min read
                  </span>
                </div>

                {/* Title */}
                <Link href={`/blog/${featuredPost.slug}`}>
                  <h3 
                    className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold text-slate-950 leading-tight hover:text-[#2f55f6] cursor-pointer transition-colors"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(featuredPost.title.rendered) }}
                  />
                </Link>

                {/* Excerpt */}
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mt-4 font-medium">
                  {cleanExcerpt(featuredPost.excerpt.rendered)}{" "}
                  <Link 
                    href={`/blog/${featuredPost.slug}`}
                    className="text-[#2f55f6] hover:underline font-bold inline-flex items-center gap-1 mt-1 cursor-pointer"
                  >
                    Read More
                  </Link>
                </p>
              </div>

              {/* Slider dots indicators centered under card */}
              <div className="flex items-center gap-2 mt-8 justify-start">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              </div>
            </article>
          </div>
        )}

        {/* 3-COLUMN ARTICLES GRID */}
        {currentGridPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentGridPosts.map((post) => {
              const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800";
              const categoryName = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Refurbished Products";

              return (
                <Link href={`/blog/${post.slug}`} key={post.id} className="block h-full">
                  <article
                    className="blog-card bg-white rounded-[24px] p-3 h-full flex flex-col group cursor-pointer border border-transparent hover:border-gray-100 transition-colors duration-300"
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] w-full bg-[#f4f5f7] rounded-[16px] overflow-hidden mb-4">
                      <img 
                        loading="lazy"
                        src={featuredImage} 
                        alt={post.title.rendered} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
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
                        <h3
                          className="text-[18px] font-bold text-[#111] leading-snug line-clamp-2 group-hover:text-[#2f55f6] transition-colors duration-300"
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.title.rendered) }}
                        />
                        <span className="text-gray-400 group-hover:text-[#2f55f6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0 mt-1">
                          <ArrowUpRight size={20} />
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-[15px] text-gray-500 mb-6 line-clamp-2 leading-relaxed">
                        {cleanExcerpt(post.excerpt.rendered)}
                      </p>

                      {/* Footer (Tag and Date) */}
                      <div className="flex items-center gap-4 mt-auto">
                        <span className="bg-[#f6f6f9] group-hover:bg-[#eaeefb] group-hover:text-[#2f55f6] text-[#111] text-[13px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-colors duration-300">
                          {categoryName}
                        </span>
                        <span className="text-[13px] text-gray-500 font-medium whitespace-nowrap">
                          {formatDate(post.date)}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 max-w-md mx-auto my-12 shadow-sm">
            <span className="text-3xl mb-4 block">🔍</span>
            <h4 className="text-sm font-bold text-slate-800">No articles match your query</h4>
            <p className="text-xs text-slate-400 mt-1">Try resetting the category filter pills or search terms.</p>
            <button 
              onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}
              className="mt-5 bg-[#2f55f6] hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-full transition active:scale-95 cursor-pointer shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* PAGINATION LAYOUT */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft size={14} className="text-slate-650" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${
                    currentPage === pageNum 
                      ? "bg-[#2f55f6] text-white shadow-md" 
                      : "bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight size={14} className="text-slate-650" />
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
