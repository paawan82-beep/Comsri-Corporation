import { woocommerce } from "./woocommerce";
import { WooCommerceProduct } from "../types/woocommerce";

export const matchBrand = (p: WooCommerceProduct, brand: string) => {
  return p.name.toLowerCase().includes(brand.toLowerCase());
};

export const matchProcessor = (p: WooCommerceProduct, proc: string) => {
  const attr = p.attributes?.find(a => a.name.toLowerCase() === "processor");
  if (attr && attr.options.some(opt => opt.toLowerCase().includes(proc.toLowerCase()))) return true;
  return p.name.toLowerCase().includes(proc.toLowerCase());
};

export const matchGen = (p: WooCommerceProduct, gen: string) => {
  const attr = p.attributes?.find(a => a.name.toLowerCase() === "generation");
  if (attr && attr.options.some(opt => opt.toLowerCase().replace(/\s+/g, "").includes(gen.toLowerCase().replace(/\s+/g, "")))) return true;
  return p.name.toLowerCase().replace(/\s+/g, "").includes(gen.toLowerCase().replace(/\s+/g, ""));
};

export const matchRam = (p: WooCommerceProduct, ram: string) => {
  const size = parseInt(ram, 10);
  if (isNaN(size)) return false;
  const attr = p.attributes?.find(a => a.name.toLowerCase() === "ram");
  if (attr) {
    return attr.options.some(opt => parseInt(opt, 10) === size);
  }
  return p.name.toLowerCase().includes(`${size}gb`) || p.name.toLowerCase().includes(`${size} gb`);
};

export const matchStorage = (p: WooCommerceProduct, storage: string) => {
  const term = storage.toLowerCase().replace(/\s+/g, "");
  const attr = p.attributes?.find(a => a.name.toLowerCase() === "hard disk size");
  if (attr) {
    return attr.options.some(opt => opt.toLowerCase().replace(/\s+/g, "").includes(term));
  }
  return p.name.toLowerCase().replace(/\s+/g, "").includes(term);
};

export const matchQuery = (p: WooCommerceProduct, query: string) => {
  if (!query) return true;
  const tokens = query.trim().toLowerCase().split(/\s+/);
  
  return tokens.every(token => {
    // Brands
    if (["apple", "dell", "hp", "lenovo", "microsoft"].includes(token)) {
      return matchBrand(p, token);
    }
    // Processors
    if (["i3", "i5", "i7"].includes(token)) {
      return matchProcessor(p, token);
    }
    // RAM
    if (/^\d+gb$/.test(token)) {
      return matchRam(p, token);
    }
    // Generation
    if (/^\d+th$/.test(token) || token === "gen") {
      if (token === "gen") return true;
      return matchGen(p, token + " gen");
    }
    if (/^\d+thgen$/.test(token)) {
      const match = token.match(/^(\d+)thgen$/);
      if (match) return matchGen(p, match[1] + " gen");
    }
    // Storage
    if (token === "ssd" || token === "hdd") {
      return true;
    }
    if (/^\d+$/.test(token)) {
      if (["256", "512", "500"].includes(token)) {
        return matchStorage(p, token);
      }
    }
    
    // Free text match
    return p.name.toLowerCase().includes(token) || p.description.toLowerCase().includes(token);
  });
};

interface CatalogFilters {
  category?: string;
  search?: string;
  min_price?: string;
  max_price?: string;
  on_sale?: boolean;
  orderby?: string;
  page?: number;
  per_page?: number;
}

export async function getFilteredCatalog(filters: CatalogFilters = {}) {
  // 1. Fetch all products (uses 1-hour revalidation cache server-side)
  const allProducts = await woocommerce.getAllProducts();

  // 2. Filter by Category first
  let filtered = allProducts;
  if (filters.category) {
    filtered = filtered.filter(p => p.categories.some(c => c.id.toString() === filters.category));
  }

  // 3. Calculate Option Counts in the active category context
  // This satisfies: "the filter sidebar has number that means how many products have this config"
  const brands = ["apple", "dell", "hp", "lenovo", "microsoft"];
  const brandCounts = brands.reduce((acc, b) => {
    acc[b] = filtered.filter(p => matchBrand(p, b)).length;
    return acc;
  }, {} as Record<string, number>);

  const processors = ["i3", "i5", "i7"];
  const processorCounts = processors.reduce((acc, pr) => {
    acc[pr] = filtered.filter(p => matchProcessor(p, pr)).length;
    return acc;
  }, {} as Record<string, number>);

  const generations = ["4th gen", "6th gen", "7th gen", "8th gen", "9th gen", "10th gen"];
  const genCounts = generations.reduce((acc, g) => {
    acc[g] = filtered.filter(p => matchGen(p, g)).length;
    return acc;
  }, {} as Record<string, number>);

  const rams = ["4gb", "8gb", "16gb", "32gb", "64gb"];
  const ramCounts = rams.reduce((acc, r) => {
    acc[r] = filtered.filter(p => matchRam(p, r)).length;
    return acc;
  }, {} as Record<string, number>);

  const storages = ["500 hdd", "256 ssd", "512 ssd"];
  const storageCounts = storages.reduce((acc, s) => {
    acc[s] = filtered.filter(p => matchStorage(p, s)).length;
    return acc;
  }, {} as Record<string, number>);

  // 4. Filter by Search Query (combinatorial tokens)
  if (filters.search) {
    filtered = filtered.filter(p => matchQuery(p, filters.search!));
  }

  // 5. Filter by Price Range
  if (filters.min_price) {
    const min = parseFloat(filters.min_price);
    filtered = filtered.filter(p => parseFloat(p.price || "0") >= min);
  }
  if (filters.max_price) {
    const max = parseFloat(filters.max_price);
    filtered = filtered.filter(p => parseFloat(p.price || "0") <= max);
  }

  // 6. Filter by On Sale
  if (filters.on_sale) {
    filtered = filtered.filter(p => p.on_sale);
  }

  // 7. Sort products
  const sorting = filters.orderby || "date";
  if (sorting === "price") {
    filtered.sort((a, b) => parseFloat(a.price || "0") - parseFloat(b.price || "0"));
  } else if (sorting === "price-desc") {
    filtered.sort((a, b) => parseFloat(b.price || "0") - parseFloat(a.price || "0"));
  } else if (sorting === "title") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // Default: date (newest first)
    filtered.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
  }

  // 8. Paginate
  const page = filters.page || 1;
  const per_page = filters.per_page || 12;
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / per_page) || 1;
  const paginatedData = filtered.slice((page - 1) * per_page, page * per_page);

  return {
    data: paginatedData,
    totalItems,
    totalPages,
    counts: {
      brandCounts,
      processorCounts,
      genCounts,
      ramCounts,
      storageCounts
    }
  };
}
