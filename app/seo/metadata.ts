import { Metadata } from "next";
import { SITE_CONFIG } from "./constants";
import { getAbsoluteUrl, cleanText, generateKeywords } from "./seo-utils";

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogType?: "website" | "article" | "profile";
  ogImage?: string;
  category?: string;
  noIndex?: boolean;
  canonical?: string;
  productDetails?: {
    price?: string;
    currency?: string;
    availability?: string;
    brand?: string;
    sku?: string;
  };
}

export function constructMetadata({
  title,
  description,
  path,
  keywords = [],
  ogType = "website",
  ogImage = SITE_CONFIG.ogImage,
  category = SITE_CONFIG.defaultCategory,
  noIndex = false,
  canonical,
  productDetails,
}: PageMetaInput): Metadata {
  const safeTitle = title || "Refurbished Laptops & Desktops | Comsri Corporation";
  const safeDescription = description || "High-performance certified refurbished laptops, desktops, and workstations in India with 1-year warranty.";
  const safeOgImage = ogImage || SITE_CONFIG.ogImage;

  const canonicalUrl = canonical
    ? (canonical.startsWith("http") ? canonical : getAbsoluteUrl(canonical))
    : getAbsoluteUrl(path);
  const formattedDescription = cleanText(safeDescription, 155);

  const extraMeta: Record<string, string> = {};
  if (productDetails) {
    if (productDetails.price) extraMeta["product:price:amount"] = productDetails.price;
    if (productDetails.currency) extraMeta["product:price:currency"] = productDetails.currency;
    if (productDetails.availability) extraMeta["product:availability"] = productDetails.availability;
    if (productDetails.brand) extraMeta["product:brand"] = productDetails.brand;
    if (productDetails.sku) extraMeta["product:retailer_item_id"] = productDetails.sku;
  }

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: `${safeTitle} | ${SITE_CONFIG.shortName}`,
      template: `%s | ${SITE_CONFIG.shortName}`,
    },
    description: formattedDescription,
    keywords: keywords.length > 0 ? keywords : [SITE_CONFIG.name, "refurbished laptops", "refurbished desktops", "India"],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-IN": canonicalUrl,
        "x-default": canonicalUrl,
      },
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: `${safeTitle} | ${SITE_CONFIG.shortName}`,
      description: formattedDescription,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: safeOgImage.startsWith("http") ? safeOgImage : getAbsoluteUrl(safeOgImage),
          width: 1200,
          height: 630,
          alt: safeTitle,
        },
      ],
      type: ogType,
    },
    twitter: {
      card: "summary_large_image",
      title: `${safeTitle} | ${SITE_CONFIG.shortName}`,
      description: formattedDescription,
      images: [safeOgImage.startsWith("http") ? safeOgImage : getAbsoluteUrl(safeOgImage)],
      creator: "@comsri_corp",
    },
    category: category,
    authors: [{ name: SITE_CONFIG.name }],
    other: extraMeta,
  };
}

export function getProductMetadata(product: {
  id?: string | number;
  name: string;
  description?: string;
  short_description?: string;
  slug: string;
  price?: string;
  categories?: { name: string }[];
  images?: { src: string }[];
  sku?: string;
  stock_status?: string;
}): Metadata {
  const categoryName = product.categories?.[0]?.name || SITE_CONFIG.defaultCategory;
  const descriptionText = product.short_description || product.description || "";
  const cleanDesc = `Buy ${product.name} Refurbished in India starting from ₹${product.price || "Contact Us"}. ${cleanText(descriptionText, 80)}`;
  const keywords = generateKeywords(product.name, categoryName, "Comsri");
  const imageUrl = product.images?.[0]?.src || SITE_CONFIG.ogImage;

  return constructMetadata({
    title: `Buy ${product.name} Refurbished with Warranty`,
    description: cleanDesc,
    path: `/products/${product.slug}`,
    keywords,
    ogImage: imageUrl,
    category: categoryName,
    productDetails: {
      price: product.price,
      currency: SITE_CONFIG.defaultCurrency,
      availability: product.stock_status === "instock" ? "instock" : "outofstock",
      brand: "Comsri Certified",
      sku: product.sku || `SKU-${product.id}`,
    },
  });
}

export function getCategoryMetadata(category: {
  name: string;
  description?: string;
  slug: string;
}): Metadata {
  const cleanDesc = category.description 
    ? cleanText(category.description, 150)
    : `Explore high-performance refurbished ${category.name} online in India. Fully tested hardware with 1-year warranty.`;

  return constructMetadata({
    title: `Refurbished ${category.name} Online at Best Prices`,
    description: cleanDesc,
    path: `/categories/${category.slug}`,
    keywords: [category.name, `refurbished ${category.name}`, `cheap ${category.name} india`, SITE_CONFIG.name],
  });
}
