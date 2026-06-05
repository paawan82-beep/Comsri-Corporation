import { SITE_CONFIG } from "./constants";

export function getAbsoluteUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_CONFIG.url}${cleanPath}`;
}

export function cleanText(htmlOrText: string, maxLength = 155): string {
  if (!htmlOrText) return "";
  const text = htmlOrText
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/\s+/g, " ") // normalize spacing
    .trim();
  
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

export function formatPrice(price: string | number): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return "0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: SITE_CONFIG.defaultCurrency,
  }).format(num);
}

export function mapStockStatus(status: string): "InStock" | "OutOfStock" | "PreOrder" {
  switch (status?.toLowerCase()) {
    case "instock":
    case "in_stock":
      return "InStock";
    case "outofstock":
    case "out_of_stock":
      return "OutOfStock";
    case "preorder":
    case "pre_order":
      return "PreOrder";
    default:
      return "InStock";
  }
}
export function getAlternateLanguages(path: string) {
  return [
    { hrefLang: "en-IN", href: getAbsoluteUrl(path) },
    { hrefLang: "x-default", href: getAbsoluteUrl(path) }
  ];
}
export function generateKeywords(name: string, category: string, brand?: string): string[] {
  const base = [
    name,
    category,
    `${category} in India`,
    `refurbished ${category}`,
    `cheap refurbished ${category}`,
    "Comsri",
    "Comsri Corporation"
  ];
  if (brand) {
    base.push(brand);
    base.push(`${brand} refurbished`);
    base.push(`refurbished ${brand} ${category}`);
  }
  return base;
}
export function generateTitle(pageName: string, prefix = "", suffix = SITE_CONFIG.name): string {
  const parts = [];
  if (prefix) parts.push(prefix);
  parts.push(pageName);
  parts.push(suffix);
  return parts.join(" | ");
}
