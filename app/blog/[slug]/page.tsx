import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, CalendarDays, ArrowLeft, ArrowUpRight, ShoppingBag } from "lucide-react";
import Header from "../../Header";
import BlogFooter from "../BlogFooter";
import { constructMetadata } from "../../seo/metadata";
import {
  WPPost,
  stripHtml,
  readingTime,
  formatDate,
  getCategory,
  getFeaturedImage,
  getAuthor,
} from "../blog-utils";
import { ReadingProgress, ShareBar, ArticleBodyWithTOC } from "./ArticleClient";
import { sanitizeHtml } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<WPPost | null> {
  try {
    const res = await fetch(
      `https://cms.comsri.com/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=true`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data: WPPost[] = await res.json();
    return data[0] || null;
  } catch {
    return null;
  }
}

async function getRelated(excludeId: number): Promise<WPPost[]> {
  try {
    const res = await fetch(
      `https://cms.comsri.com/wp-json/wp/v2/posts?_embed=true&per_page=4&exclude=${excludeId}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data: WPPost[] = await res.json();
    return data.slice(0, 3);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return constructMetadata({
      title: "Article Not Found",
      description: "The blog article you are looking for could not be found.",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }
  return constructMetadata({
    title: stripHtml(post.title.rendered),
    description: stripHtml(post.excerpt.rendered),
    path: `/blog/${post.slug}`,
    ogType: "article",
    ogImage: getFeaturedImage(post),
    keywords: [getCategory(post), "refurbished tech blog", "Comsri Corporation"],
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = await getRelated(post.id);

  const category = getCategory(post);
  const author = getAuthor(post);
  const minutes = readingTime(post.content.rendered);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `https://comsri.com/blog/${post.slug}/#article`,
    "headline": stripHtml(post.title.rendered),
    "description": stripHtml(post.excerpt.rendered),
    "image": getFeaturedImage(post),
    "datePublished": post.date,
    "dateModified": (post as any).modified || post.date,
    "author": {
      "@type": "Organization",
      "name": author,
      "url": "https://comsri.com",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Comsri Corporation",
      "logo": {
        "@type": "ImageObject",
        "url": "https://comsri.com/images/logo.png",
        "width": 512,
        "height": 512,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://comsri.com/blog/${post.slug}`,
    },
    "articleSection": category,
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <ReadingProgress />
      <Header />

      {/* Breadcrumb Header */}
      <div className="bg-[#f2ece4] w-full py-2.5">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-start gap-4">
          <span className="text-[28px] font-medium text-[#111] tracking-tight">Blog</span>
          <p className="text-[15px] text-[#777] font-medium mt-1">
            <Link href="/" className="hover:text-[#3452ef] transition-colors">Home</Link>
            <span className="mx-1.5 text-gray-400">/</span>
            <Link href="/blog" className="hover:text-[#3452ef] transition-colors">Blog</Link>
            <span className="mx-1.5 text-gray-400">/</span>
            <span className="text-[#111] font-bold">{category}</span>
          </p>
        </div>
      </div>

      <main className="flex-1 pb-16">
        {/* ===================== ARTICLE HEADER ===================== */}
        <header className="relative overflow-hidden bg-[#f5f6f8]">
          <div className="absolute -top-20 -right-20 w-[380px] h-[380px] bg-[#3452ef]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-10 md:pt-14 pb-8 relative z-10">
            <span className="inline-block bg-[#3452ef] text-white text-[11px] font-extrabold uppercase tracking-wide px-3.5 py-1.5 rounded-full">
              {category}
            </span>

            <h1
              className="mt-5 text-[28px] md:text-[40px] lg:text-[46px] font-extrabold text-[#111] leading-[1.12] tracking-tight max-w-[1000px]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.title.rendered) }}
            />

            {/* Meta row */}
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-full bg-[#3452ef] text-white font-extrabold text-[15px] flex items-center justify-center shrink-0">
                  {author.charAt(0)}
                </span>
                <div className="leading-tight">
                  <p className="text-[14px] font-bold text-[#111]">{author}</p>
                  <p className="text-[12px] text-slate-400 font-medium flex items-center gap-2.5">
                    <span className="flex items-center gap-1"><CalendarDays size={12} /> {formatDate(post.date)}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="flex items-center gap-1"><Clock size={12} /> {minutes} min read</span>
                  </p>
                </div>
              </div>
              <div className="sm:ml-auto lg:hidden">
                <ShareBar title={stripHtml(post.title.rendered)} />
              </div>
            </div>
          </div>
        </header>

        {/* ===================== FEATURED IMAGE ===================== */}
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 -mt-2">
          <div className="aspect-[16/7] rounded-[28px] overflow-hidden bg-slate-100 shadow-[0_20px_60px_rgba(30,41,59,0.08)] border border-white">
            <img
              src={getFeaturedImage(post)}
              alt={stripHtml(post.title.rendered)}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* ===================== ARTICLE WRAPPER (TOC + CONTENT) ===================== */}
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 md:py-16">
          <ArticleBodyWithTOC content={post.content.rendered} title={stripHtml(post.title.rendered)} />

          {/* Footer of article: category + share */}
          <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 max-w-[1240px] ml-auto">
            <div className="flex items-center gap-2.5">
              <span className="text-[13px] font-bold text-slate-500">Filed under</span>
              <span className="bg-slate-100 text-[#3452ef] text-[12px] font-bold px-3.5 py-1.5 rounded-full">{category}</span>
            </div>
            <div className="flex items-center gap-3 lg:hidden">
              <span className="text-[13px] font-bold text-slate-500">Share</span>
              <ShareBar title={stripHtml(post.title.rendered)} />
            </div>
          </div>

          {/* Author card */}
          <div className="mt-10 bg-white rounded-[24px] border border-slate-100 p-6 md:p-8 flex items-center gap-5 shadow-[0_4px_20px_rgba(30,41,59,0.04)] max-w-[1240px] ml-auto">
            <span className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#3452ef] text-white font-extrabold text-2xl flex items-center justify-center shrink-0">
              {author.charAt(0)}
            </span>
            <div>
              <p className="text-[12px] font-bold text-[#3452ef] uppercase tracking-wide">Written by</p>
              <p className="text-[18px] font-extrabold text-[#111] mt-0.5">{author}</p>
              <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">
                Helping businesses and individuals across India buy reliable certified refurbished
                computers at the best value.
              </p>
            </div>
          </div>

          <div className="mt-10 max-w-[1240px] ml-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[14px] font-bold text-[#3452ef] hover:gap-3 transition-all"
            >
              <ArrowLeft size={16} /> Back to all articles
            </Link>
          </div>
        </div>

        {/* ===================== CTA BAND ===================== */}
        <section className="max-w-[1600px] mx-auto px-6 lg:px-12 mb-16">
          <div className="bg-[#121e42] rounded-[28px] md:rounded-[36px] px-6 md:px-12 py-10 md:py-14 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left shadow-lg">
            <div className="absolute -top-16 -right-10 w-72 h-72 bg-[#3452ef]/30 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-lg">
              <h2 className="text-[24px] md:text-[32px] font-extrabold text-white tracking-tight">Ready to upgrade for less?</h2>
              <p className="mt-2.5 text-[15px] text-white/70 leading-relaxed">
                Explore certified refurbished laptops &amp; desktops with up to 70% off and a 1-year warranty.
              </p>
            </div>
            <Link
              href="/shop"
              className="relative z-10 inline-flex items-center gap-2 bg-[#fcb643] hover:bg-[#fca61f] text-[#111] font-extrabold text-[15px] px-8 py-4 rounded-full transition-colors whitespace-nowrap active:scale-[0.98] shrink-0 shadow-md"
            >
              <ShoppingBag size={18} /> Shop Now
            </Link>
          </div>
        </section>

        {/* ===================== RELATED (HOMEPAGE CARDS STYLE) ===================== */}
        {related.length > 0 && (
          <section className="max-w-[1600px] mx-auto px-6 lg:px-12 pb-20">
            <div className="flex items-end justify-between mb-8 border-b border-slate-200 pb-4">
              <h2 className="text-[24px] md:text-[30px] font-extrabold text-[#111] tracking-tight">Keep reading</h2>
              <Link href="/blog" className="text-[14px] font-bold text-[#3452ef] hover:underline flex items-center gap-1">
                All articles <ArrowUpRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/blog/${rp.slug}`}
                  className="block h-full"
                >
                  <article 
                    className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-3 h-full flex flex-col group cursor-pointer hover:shadow-[0_8px_35px_rgb(0,0,0,0.1)] transition-all duration-300 border border-transparent hover:border-gray-100"
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] w-full bg-[#f4f5f7] rounded-[16px] overflow-hidden mb-4">
                      <img 
                        loading="lazy"
                        src={getFeaturedImage(rp)} 
                        alt={stripHtml(rp.title.rendered)} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550"
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
                          className="text-[18px] font-bold text-[#111] leading-snug line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(rp.title.rendered) }}
                        />
                        <span className="text-gray-400 group-hover:text-black transition-colors flex-shrink-0 mt-1">
                          <ArrowUpRight size={20} />
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-[15px] text-gray-500 mb-6 line-clamp-2 leading-relaxed">
                        {stripHtml(rp.excerpt.rendered)}
                      </p>

                      {/* Footer (Tag and Date) */}
                      <div className="flex items-center gap-4 mt-auto">
                        <span className="bg-[#f6f6f9] text-[#111] text-[13px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                          {getCategory(rp)}
                        </span>
                        <span className="text-[13px] text-gray-500 font-medium whitespace-nowrap">
                          {formatDate(rp.date)}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <BlogFooter />
    </div>
  );
}
