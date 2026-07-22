import { SITE_CONFIG } from "./constants";
import { getAbsoluteUrl } from "./seo-utils";
import { getAvailabilityUrl } from "./availability";
import { getBrandEntity } from "./entities";

export interface FAQItemData {
  q: string;
  a: string;
}

export function getSearchActionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.url}/#website`,
    "url": SITE_CONFIG.url,
    "name": SITE_CONFIG.name,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_CONFIG.url}/shop?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_CONFIG.url}/#organization`,
    "name": SITE_CONFIG.name,
    "url": SITE_CONFIG.url,
    "logo": getAbsoluteUrl(SITE_CONFIG.logo),
    "telephone": SITE_CONFIG.telephone,
    "email": SITE_CONFIG.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": SITE_CONFIG.address.streetAddress,
      "addressLocality": SITE_CONFIG.address.addressLocality,
      "addressRegion": SITE_CONFIG.address.addressRegion,
      "postalCode": SITE_CONFIG.address.postalCode,
      "addressCountry": SITE_CONFIG.address.addressCountry,
    },
    "sameAs": [
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.youtube,
      SITE_CONFIG.social.twitter,
    ],
  };
}

export function getProductSchema(product: {
  id: string | number;
  name: string;
  sku?: string;
  slug: string;
  description?: string;
  price?: string;
  stock_status?: string;
  images?: { src: string }[];
  brand?: string;
  ratingValue?: number;
  ratingCount?: number;
  reviews?: { author: string; date: string; content: string; rating: number }[];
  category?: string;
}) {
  const images = product.images?.map((img) => img.src) || [];
  const description = product.description?.replace(/<[^>]*>/g, "") || product.name;
  const canonicalUrl = getAbsoluteUrl(`/products/${product.slug}`);
  const brandName = product.brand || "Comsri Certified";
  const entityData = getBrandEntity(brandName);

  // Price-integrity guard: only emit an Offer when we have a genuine positive
  // price. A missing/zero/placeholder price must never reach structured data
  // (it can trigger a Google Merchant Center price-mismatch suspension). When
  // there is no valid price we omit `offers` entirely rather than shipping a
  // fabricated "0.00".
  const numericPrice = parseFloat(product.price ?? "");
  const hasValidPrice = Number.isFinite(numericPrice) && numericPrice > 0;

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${canonicalUrl}/#product`,
    "name": product.name,
    "image": images,
    "description": description,
    "sku": product.sku || `SKU-${product.id}`,
    // `mpn` intentionally omitted — we do not have genuine manufacturer part
    // numbers, and a fabricated placeholder violates Google's product-data
    // accuracy guidance.
    "brand": {
      "@type": "Brand",
      "name": brandName,
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "EntityCategory",
          "value": entityData.category,
        },
        {
          "@type": "PropertyValue",
          "name": "AssemblyLocation",
          "value": entityData.location,
        },
        {
          "@type": "PropertyValue",
          "name": "HardwareCondition",
          "value": entityData.condition,
        },
      ],
    },
  };

  if (hasValidPrice) {
    // priceValidUntil ~30 days out, generated at render time (not a hardcoded
    // far-future constant which Google flags as a quality signal).
    const priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    schema.offers = {
      "@type": "Offer",
      "url": canonicalUrl,
      "priceCurrency": SITE_CONFIG.defaultCurrency,
      "price": numericPrice.toString(),
      "priceValidUntil": priceValidUntil,
      // Every product in the catalogue is refurbished.
      "itemCondition": "https://schema.org/RefurbishedCondition",
      "availability": getAvailabilityUrl(product.stock_status || "in_stock"),
      "seller": {
        "@type": "Organization",
        "name": SITE_CONFIG.name,
        "url": SITE_CONFIG.url,
      },
    };
  }

  if (product.category) {
    schema.category = product.category;
  }

  // Add AggregateRating schema
  if (product.ratingValue && product.ratingCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": product.ratingValue.toString(),
      "reviewCount": product.ratingCount,
      "ratingCount": product.ratingCount,
      "bestRating": "5",
      "worstRating": "1",
    };
  }

  // Add Review schema
  if (product.reviews && product.reviews.length > 0) {
    schema.review = product.reviews.map((rev) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": rev.author,
      },
      "datePublished": rev.date,
      "reviewBody": rev.content,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": rev.rating.toString(),
        "bestRating": "5",
        "worstRating": "1",
      },
    }));
  }

  return schema;
}

export function getFAQSchema(faqs: FAQItemData[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };
}

export function getBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((itm, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": itm.name,
      "item": getAbsoluteUrl(itm.item),
    })),
  };
}

export function getCollectionPageSchema(collection: {
  name: string;
  description?: string;
  slug: string;
  products: { name: string; url: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${getAbsoluteUrl(`/collections/${collection.slug}`)}/#collection`,
    "name": collection.name,
    "description": collection.description || `Browse collections of ${collection.name}`,
    "url": getAbsoluteUrl(`/collections/${collection.slug}`),
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": collection.products.map((p, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": getAbsoluteUrl(p.url),
        "name": p.name,
      })),
    },
  };
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_CONFIG.url}/#localbusiness`,
    "name": SITE_CONFIG.name,
    "image": getAbsoluteUrl(SITE_CONFIG.ogImage),
    "telephone": SITE_CONFIG.telephone,
    "email": SITE_CONFIG.email,
    "url": SITE_CONFIG.url,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": SITE_CONFIG.address.streetAddress,
      "addressLocality": SITE_CONFIG.address.addressLocality,
      "addressRegion": SITE_CONFIG.address.addressRegion,
      "postalCode": SITE_CONFIG.address.postalCode,
      "addressCountry": SITE_CONFIG.address.addressCountry,
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "19.1176",
      "longitude": "72.8763"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:30",
        "closes": "18:30"
      }
    ]
  };
}

export function getWebPageSchema(title: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${getAbsoluteUrl(path)}/#webpage`,
    "name": title,
    "description": description,
    "url": getAbsoluteUrl(path),
    "isPartOf": {
      "@id": `${SITE_CONFIG.url}/#website`
    }
  };
}
