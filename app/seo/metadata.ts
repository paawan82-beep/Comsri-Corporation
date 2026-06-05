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
}: PageMetaInput): Metadata {
  const canonicalUrl = getAbsoluteUrl(path);
  const formattedDescription = cleanText(description, 155);

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: `${title} | ${SITE_CONFIG.shortName}`,
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
      title: `${title} | ${SITE_CONFIG.shortName}`,
      description: formattedDescription,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : getAbsoluteUrl(ogImage),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: ogType,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_CONFIG.shortName}`,
      description: formattedDescription,
      images: [ogImage.startsWith("http") ? ogImage : getAbsoluteUrl(ogImage)],
      creator: "@comsri_corp",
    },
    category: category,
    authors: [{ name: SITE_CONFIG.name }],
  };
}

export function getProductMetadata(product: {
  name: string;
  description?: string;
  short_description?: string;
  slug: string;
  price?: string;
  categories?: { name: string }[];
  images?: { src: string }[];
  sku?: string;
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
