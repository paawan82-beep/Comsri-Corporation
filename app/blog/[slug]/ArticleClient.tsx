"use client";

import { useEffect, useState, useRef } from "react";
import { Link2, Check, Facebook, Twitter, Linkedin, List, ChevronRight } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";

/** Fixed reading-progress bar pinned under the header. */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const h = document.documentElement;
      const scrollable = h.scrollHeight - h.clientHeight;
      setProgress(scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1.5 z-[150] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#3452ef] to-[#fcb643] origin-left transition-transform duration-100 will-change-transform"
        style={{ transform: `scaleX(${progress / 100})`, width: "100%" }}
      />
    </div>
  );
}

interface ShareBarProps {
  title: string;
  vertical?: boolean;
}

/** Sticky share controls */
export function ShareBar({ title, vertical = false }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const enc = encodeURIComponent;
  const shareUrl = url || "";
  const links = [
    { Icon: Facebook, label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}` },
    { Icon: Twitter, label: "Share on X", href: `https://twitter.com/intent/tweet?url=${enc(shareUrl)}&text=${enc(title)}` },
    { Icon: Linkedin, label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(shareUrl)}` },
  ];

  return (
    <div className={`flex ${vertical ? "flex-col" : "flex-row flex-wrap"} items-center gap-2`}>
      {links.map(({ Icon, label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-[#3452ef] hover:bg-blue-50 hover:border-[#3452ef] flex items-center justify-center transition-all shadow-sm"
        >
          <Icon size={14} />
        </a>
      ))}
      <button
        onClick={copy}
        aria-label="Copy link"
        className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all shadow-sm ${
          copied
            ? "bg-emerald-500 border-emerald-500 text-white"
            : "bg-white border-slate-200 text-slate-500 hover:text-[#3452ef] hover:bg-blue-50 hover:border-[#3452ef]"
        }`}
      >
        {copied ? <Check size={14} /> : <Link2 size={14} />}
      </button>
    </div>
  );
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface ArticleBodyWithTOCProps {
  content: string;
  title: string;
}

/** Parses article content and renders a sticky TOC layout with active observer tracking */
export function ArticleBodyWithTOC({ content, title }: ArticleBodyWithTOCProps) {
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const [showMobileTOC, setShowMobileTOC] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Select all h2 elements inside the blog content to match numbered screenshot index format
    const headings = contentRef.current.querySelectorAll("h2");
    
    // Inject clean slug IDs for anchors + blue circle numbers
    const items: TOCItem[] = [];
    headings.forEach((h, idx) => {
      // Get the clean heading text by excluding any existing badge
      let cleanText = "";
      const existingBadge = h.querySelector(".heading-badge");
      if (existingBadge) {
        cleanText = Array.from(h.childNodes)
          .filter(node => node !== existingBadge)
          .map(node => node.textContent || "")
          .join("")
          .trim();
      } else {
        cleanText = h.textContent || "";
        cleanText = cleanText.trim();
      }

      const slug = cleanText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const id = slug || `heading-${idx}`;
      h.id = id;

      items.push({
        id,
        text: cleanText,
        level: 2
      });

      // Inject visual blue circle badge matching screenshot
      if (!existingBadge) {
        const badgeNum = String(idx + 1).padStart(2, "0");
        const badge = document.createElement("span");
        badge.className = "heading-badge bg-[#2f55f6] text-white w-7 h-7 rounded-full inline-flex items-center justify-center font-bold text-[11px] mr-3.5 shrink-0 shadow-sm shadow-blue-500/10 align-middle";
        badge.textContent = badgeNum;
        h.prepend(badge);
        h.className = (h.className || "") + " flex items-center py-2 text-slate-900 border-none outline-none leading-none";
      }
    });
    setToc(items);

    // Setup Intersection Observer to track active header section on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [content]);

  const scrollToHeading = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const offset = 80; // height of sticky headers
      const bodyRect = document.body.getBoundingClientRect().top;
      const targetRect = target.getBoundingClientRect().top;
      const targetPosition = targetRect - bodyRect;
      const offsetPosition = targetPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setShowMobileTOC(false);
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-start relative mt-8">
      {/* Table of Contents - Left Sticky Column */}
      {toc.length > 0 && (
        <aside className="w-full lg:w-80 lg:sticky lg:top-24 shrink-0 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-200/50 rounded-3xl p-5 md:p-6">
          {/* Mobile TOC Header Button */}
          <button 
            onClick={() => setShowMobileTOC(!showMobileTOC)}
            className="w-full lg:hidden flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider focus:outline-none"
          >
            <span className="flex items-center gap-2">
              <List size={16} className="text-[#2f55f6]" />
              <span>Index Navigation</span>
            </span>
            <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {showMobileTOC ? "Hide" : "Show"}
            </span>
          </button>

          {/* TOC Items List Container */}
          <div className={`${showMobileTOC ? "block mt-4 pt-4 border-t border-slate-100" : "hidden"} lg:block`}>
            <span className="text-[10px] font-bold text-[#2f55f6] uppercase tracking-widest block mb-1">
              Index Navigation
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 mb-6 border-b border-slate-100 pb-3">
              Article Outline
            </h3>
            
            <nav className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-1 scrollbar-none">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToHeading(e, item.id)}
                  className={`flex items-center justify-between py-2.5 border-b border-slate-100/60 last:border-0 text-xs font-semibold tracking-medium transition-all group/link hover:text-[#2f55f6] ${
                    activeId === item.id 
                      ? "text-[#2f55f6] font-bold" 
                      : "text-slate-500"
                  }`}
                >
                  <span className="truncate pr-4">{item.text}</span>
                  <ChevronRight size={13} className={`shrink-0 transition-transform ${activeId === item.id ? "text-[#2f55f6]" : "text-slate-300 group-hover/link:text-[#2f55f6] group-hover/link:translate-x-0.5"}`} />
                </a>
              ))}
            </nav>

            {/* Share Widget inside card on Desktop */}
            <div className="mt-8 pt-5 border-t border-slate-100 hidden lg:block">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">
                Share Article
              </span>
              <ShareBar title={title} />
            </div>
          </div>
        </aside>
      )}

      {/* Main content body card column */}
      <div className="flex-1 w-full min-w-0 bg-white border border-slate-200/50 rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
        <div
          ref={contentRef}
          className="blog-content prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-[#3452ef] prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-blockquote:border-l-4 prose-blockquote:border-[#2f55f6] prose-blockquote:bg-blue-50/20 prose-blockquote:px-5 prose-blockquote:py-2 prose-blockquote:rounded-r-xl"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
        />
      </div>
    </div>
  );
}
