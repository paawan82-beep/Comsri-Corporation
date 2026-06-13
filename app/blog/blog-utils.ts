// Shared helpers for the blog list and blog detail pages.

export interface WPPost {
  id: number;
  title: { rendered: string };
  date: string;
  excerpt: { rendered: string };
  content: { rendered: string };
  slug: string;
  _embedded?: {
    author?: Array<{ name: string }>;
    "wp:featuredmedia"?: Array<{ source_url: string }>;
    "wp:term"?: Array<Array<{ name: string; id: number }>>;
  };
}

export interface WPCategory {
  id: number;
  name: string;
  count: number;
}

/** Strip HTML tags and decode the most common entities for plain-text previews. */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&hellip;/g, "…")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Estimate reading time in minutes from rendered HTML (~200 wpm). */
export function readingTime(html: string): number {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Locale-friendly date, e.g. "25 Jan 2026". */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getCategory(post: WPPost): string {
  return post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Insights";
}

export function getFeaturedImage(post: WPPost): string {
  return (
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "https://picsum.photos/seed/comsri-blog/1200/700"
  );
}

export function getAuthor(post: WPPost): string {
  return post._embedded?.author?.[0]?.name || "Comsri Corporation";
}
