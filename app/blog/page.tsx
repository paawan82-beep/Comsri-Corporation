import { Metadata } from "next";
import Header from "../Header";
import BlogClient from "./BlogClient";
import BlogFooter from "./BlogFooter";
import { constructMetadata } from "../seo/metadata";
import { WPPost, WPCategory } from "./blog-utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = constructMetadata({
  title: "Refurbished IT Hardware Blog & Industry Insights",
  description: "Stay updated with the latest trends, guides, and insights on refurbished IT hardware, corporate laptop deals, and sustainable tech solutions.",
  path: "/blog",
  keywords: ["refurbished laptop blog", "IT hardware guides", "refurbished desktops advice", "Comsri news", "sustainable computing"],
});

export default async function BlogPage() {
  let posts: WPPost[] = [];
  let categories: WPCategory[] = [];

  try {
    const [postsRes, categoriesRes] = await Promise.all([
      fetch("https://comsri.com/wp-json/wp/v2/posts?_embed=true&per_page=20", {
        next: { revalidate: 3600 },
      }),
      fetch("https://comsri.com/wp-json/wp/v2/categories", {
        next: { revalidate: 3600 },
      }),
    ]);

    if (postsRes.ok) posts = await postsRes.json();
    if (categoriesRes.ok) {
      const allCats = await categoriesRes.json();
      categories = allCats.filter(
        (c: WPCategory) => c.count > 0 && c.name.toLowerCase() !== "uncategorized"
      );
    }
  } catch (err) {
    console.error("[WP Blog Loading Error]:", err);
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex flex-col font-sans">
      <Header />
      
      {/* Breadcrumb Header */}
      <div className="bg-[#f2ece4] w-full py-2.5">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-start gap-4">
          <span className="text-[28px] font-medium text-[#111] tracking-tight">Blog</span>
          <p className="text-[15px] text-[#777] font-medium mt-1">
            <Link href="/" className="hover:text-[#3452ef] transition-colors">Home</Link>
            <span className="mx-1.5 text-gray-400">/</span>
            <span className="text-[#111] font-bold">Blog</span>
          </p>
        </div>
      </div>

      <BlogClient initialPosts={posts} categories={categories} />
      <BlogFooter />
    </div>
  );
}
