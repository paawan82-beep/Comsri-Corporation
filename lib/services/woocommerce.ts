import { 
  WooCommerceProduct, 
  WooCommerceCategory, 
  WooCommerceOrder, 
  ProductQueryFilters, 
  WooCommercePaginatedResponse 
} from "../types/woocommerce";

/**
 * Production-ready server-side service for modern headless WooCommerce integration.
 * All operations take place strictly server-side to prevent credential exposure.
 */
class WooCommerceServiceClient {
  private baseUrl: string;
  private authHeader: string;
  private proxySecret: string;
  private maxRetries = 5;
  private initialBackoffMs = 500;

  constructor() {
    const url = process.env.WOOCOMMERCE_URL || "";
    const key = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
    const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

    // Optional shared secret so the origin's Cloudflare WAF can allow-list
    // requests coming from this app (the deployed Worker has no browser
    // fingerprint and would otherwise be blocked as a bot).
    this.proxySecret = process.env.WOOCOMMERCE_PROXY_SECRET || "";

    // Normalize base URL
    this.baseUrl = url.endsWith("/") ? url.slice(0, -1) : url;

    if (!url || !key || !secret) {
      // Graceful fallback during compile/boot, fails fast on live usage
      this.authHeader = "";
    } else {
      this.authHeader = `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`;
    }
  }

  /**
   * Helper to execute low-level fetch calls with server-side Basic Auth,
   * rate limit retrieval, and exponential backoff.
   */
  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    if (!this.authHeader) {
      throw new Error(
        "WooCommerce API Client is unconfigured. Set WOOCOMMERCE_URL, WOOCOMMERCE_CONSUMER_KEY, and WOOCOMMERCE_CONSUMER_SECRET."
      );
    }

    const separator = endpoint.includes("?") ? "&" : "?";
    // Construct the endpoint WITHOUT appending consumer credentials in query values
    const url = `${this.baseUrl}/wp-json/wc/v3/${endpoint}`;

    const headers = new Headers(options.headers);
    headers.set("Authorization", this.authHeader);
    headers.set("Content-Type", "application/json");
    headers.set("User-Agent", "Headless-NextJS-Ecommerce/1.0");
    if (this.proxySecret) {
      headers.set("X-Comsri-Proxy", this.proxySecret);
    }

    let attempt = 0;
    let delay = this.initialBackoffMs;

    while (attempt < this.maxRetries) {
      try {
        const response = await fetch(url, {
          ...options,
          headers,
        });

        // Retry on internal server errors, gateway errors, or rate limits (e.g. status 429, 500, 502, 503, 504)
        if ([429, 500, 502, 503, 504].includes(response.status) && attempt < this.maxRetries - 1) {
          throw new Error(`Transient HTTP Error: ${response.status}`);
        }

        return response;
      } catch (error) {
        attempt++;
        if (attempt >= this.maxRetries) {
          throw new Error(
            `WooCommerce API Request failed after ${this.maxRetries} attempts. Endpoint: ${endpoint}. Error: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
        // Wait with exponential jittered backoff
        const jitter = Math.random() * 100;
        await new Promise((resolve) => setTimeout(resolve, delay + jitter));
        delay *= 2;
      }
    }

    throw new Error("WooCommerce API Request exceeded max call loops.");
  }

  /**
   * 1. GET ALL PRODUCTS (Optimized, supporting searching, sorting, and tag-caching)
   */
  async getProducts(
    filters: ProductQueryFilters = {}
  ): Promise<WooCommercePaginatedResponse<WooCommerceProduct>> {
    const params = new URLSearchParams();

    // Mapping relevant query parameters
    if (filters.category) params.append("category", filters.category);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.per_page) params.append("per_page", filters.per_page.toString());
    if (filters.order) params.append("order", filters.order);
    if (filters.orderby) params.append("orderby", filters.orderby);
    if (filters.min_price) params.append("min_price", filters.min_price);
    if (filters.max_price) params.append("max_price", filters.max_price);
    if (filters.on_sale !== undefined) params.append("on_sale", filters.on_sale.toString());
    if (filters.featured !== undefined) params.append("featured", filters.featured.toString());
    if (filters.status) params.append("status", filters.status);
    if (filters.sku) params.append("sku", filters.sku);

    const endpoint = `products${params.toString() ? `?${params.toString()}` : ""}`;

    // Tag based caching to allow surgical validation on webhooks hook
    const response = await this.request(endpoint, {
      method: "GET",
      next: {
        tags: ["woocommerce", "woocommerce-products"],
        revalidate: 3600, // Fallback to 1hr ISR
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch WooCommerce products: ${response.statusText}`);
    }

    const data: WooCommerceProduct[] = await response.json();
    const totalItems = parseInt(response.headers.get("X-WP-Total") || "0", 10);
    const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "0", 10);

    // Resolve regular_price for variable products from variations
    await Promise.all(data.map(async (product) => {
      if (product.type === "variable" && (!product.regular_price || parseFloat(product.regular_price) === 0)) {
        try {
          const variations = await this.getProductVariations(product.id);
          if (variations && variations.length > 0) {
            for (const v of variations) {
              const vr = parseFloat(v.regular_price || "0");
              if (!isNaN(vr) && vr > 0) {
                product.regular_price = v.regular_price;
                break;
              }
            }
          }
        } catch (err) {
          console.error(`Failed to resolve regular price for variable product ${product.id}:`, err);
        }
      }
    }));

    return {
      data,
      totalItems,
      totalPages: totalPages || 1,
    };
  }

  /**
   * 2. FETCH SINGLE PRODUCT BY ID (Surgical, optimized checkout fetch)
   * Resolves the problem of downloading the entire catalog in-memory.
   */
  async getProductById(id: number): Promise<WooCommerceProduct> {
    const endpoint = `products/${id}`;
    const response = await this.request(endpoint, {
      method: "GET",
      next: {
        tags: ["woocommerce", `woocommerce-product-${id}`],
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product with ID ${id}: ${response.statusText}`);
    }

    return response.json();
  }

  private getProductFromDump(slug: string): WooCommerceProduct | null {
    try {
      const fs = require("fs");
      const path = require("path");
      const dumpPath = path.join(process.cwd(), "products_dump.json");
      if (fs.existsSync(dumpPath)) {
        const fileData = fs.readFileSync(dumpPath, "utf-8");
        const products = JSON.parse(fileData);
        const decodedTarget = decodeURIComponent(slug);
        const matched = products.find((p: any) => p.slug === slug || decodeURIComponent(p.slug) === decodedTarget);
        if (matched) {
          return {
            id: matched.id,
            name: matched.name,
            slug: matched.slug,
            permalink: `https://comsri.com/products/${matched.slug}`,
            date_created: matched.date_created || new Date().toISOString(),
            status: "publish",
            featured: false,
            description: matched.description || matched.name,
            short_description: matched.short_description || matched.name,
            sku: matched.sku || `SKU-${matched.id}`,
            price: matched.price || "",
            regular_price: matched.regular_price || "",
            sale_price: matched.sale_price || "",
            on_sale: !!matched.sale_price,
            purchasable: true,
            stock_status: matched.stock_status || "instock",
            categories: matched.categories?.map((c: string) => ({ name: c })) || [],
            images: matched.images || [{ src: "https://picsum.photos/seed/shop/400/300" }],
            attributes: matched.attributes || [],
            related_ids: matched.related_ids || [],
            average_rating: matched.average_rating || "4.7",
            rating_count: matched.rating_count || 14
          } as any;
        }
      }
    } catch (err) {
      console.error("Failed to read product from dump:", err);
    }
    return null;
  }

  /**
   * 3. FETCH SINGLE PRODUCT BY SLUG (Perfect for dynamic routes and SEO validation)
   */
  async getProductBySlug(slug: string): Promise<WooCommerceProduct | null> {
    const decodedSlug = decodeURIComponent(slug);
    try {
      const endpoint = `products?slug=${encodeURIComponent(decodedSlug)}`;
      const response = await this.request(endpoint, {
        method: "GET",
        next: {
          tags: ["woocommerce", `woocommerce-slug-${decodedSlug}`],
          revalidate: 3600,
        },
      });

      if (response.ok) {
        const products: WooCommerceProduct[] = await response.json();
        if (products.length > 0) return products[0];
      }
    } catch (error) {
      console.warn(`[WooCommerce Service]: Failed to fetch from API, trying fallback for slug: ${decodedSlug}`);
    }

    const fallback = this.getProductFromDump(decodedSlug);
    if (fallback) {
      return fallback;
    }

    return null;
  }

  /**
   * 4. FETCH CATEGORIES
   */
  async getCategories(parent?: number): Promise<WooCommerceCategory[]> {
    const endpoint = parent !== undefined ? `products/categories?parent=${parent}` : "products/categories";
    const response = await this.request(endpoint, {
      method: "GET",
      next: {
        tags: ["woocommerce", "woocommerce-categories"],
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 5. GET RELATED PRODUCTS (Retrieves related items by category ids safely)
   */
  async getRelatedProducts(relatedIds: number[]): Promise<WooCommerceProduct[]> {
    if (!relatedIds || relatedIds.length === 0) return [];
    
    try {
      // WooCommerce limits fetching by includes: max per page default
      const subset = relatedIds.slice(0, 4); // Show top 4
      const endpoint = `products?include=${subset.join(",")}`;
      
      const response = await this.request(endpoint, {
        method: "GET",
        next: {
          tags: ["woocommerce", "woocommerce-related"],
          revalidate: 3600,
        },
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.warn(`[WooCommerce Service]: Failed to fetch related products from API, trying fallback:`, error);
    }

    // Fallback from dump
    try {
      const fs = require("fs");
      const path = require("path");
      const dumpPath = path.join(process.cwd(), "products_dump.json");
      if (fs.existsSync(dumpPath)) {
        const fileData = fs.readFileSync(dumpPath, "utf-8");
        const products = JSON.parse(fileData);
        return products
          .filter((p: any) => relatedIds.includes(p.id))
          .slice(0, 4)
          .map((matched: any) => ({
            id: matched.id,
            name: matched.name,
            slug: matched.slug,
            price: matched.price || "",
            images: matched.images || [{ src: "https://picsum.photos/seed/shop/400/300" }]
          })) as any[];
      }
    } catch (err) {
      console.error("Failed to read related products from dump:", err);
    }

    return [];
  }

  /**
   * 6. CREATE AN ORDER IN WOOCOMMERCE (Strictly Pending until pay confirmation)
   */
  async createOrder(orderPayload: Partial<WooCommerceOrder>): Promise<WooCommerceOrder> {
    const endpoint = "orders";
    const response = await this.request(endpoint, {
      method: "POST",
      body: JSON.stringify({
        ...orderPayload,
        status: orderPayload.status || "pending",
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Failed to create WooCommerce order: ${response.statusText}. Payload: ${errBody}`);
    }

    return response.json();
  }

  /**
   * 7. GET ORDER BY ID (Retrieves specific order to perform status checking and payment verification)
   */
  async getOrderById(id: number): Promise<WooCommerceOrder> {
    const endpoint = `orders/${id}`;
    const response = await this.request(endpoint, {
      method: "GET",
      // Orders should never have active public caches for data privacy and real-time state correctness
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch WooCommerce order with ID ${id}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 8. UPDATE ORDER STATUS (Critical for checkout completed states)
   */
  async updateOrderStatus(
    orderId: number,
    status: WooCommerceOrder["status"],
    transactionId?: string,
    metadata: { key: string; value: any }[] = []
  ): Promise<WooCommerceOrder> {
    const endpoint = `orders/${orderId}`;
    
    const payload: Record<string, any> = { status };
    if (transactionId) {
      payload.transaction_id = transactionId;
    }
    if (metadata.length > 0) {
      payload.meta_data = metadata;
    }

    const response = await this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to update WooCommerce order ${orderId}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch orders filtered by customer email using WooCommerce search.
   */
  async getCustomerOrders(email: string): Promise<WooCommerceOrder[]> {
    const endpoint = `orders?search=${encodeURIComponent(email)}&per_page=50`;
    const response = await this.request(endpoint, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch orders for ${email}: ${response.statusText}`);
    }

    const allOrders: WooCommerceOrder[] = await response.json();
    // Extra guard: strictly filter by billing email
    return allOrders.filter(order => order.billing?.email?.toLowerCase() === email.toLowerCase());
  }

  async getAllProducts(): Promise<WooCommerceProduct[]> {
    try {
      const endpoint = "products?per_page=100&status=publish&_fields=id,name,slug,price,regular_price,sale_price,on_sale,stock_status,categories,images,attributes,date_created,type";
      const response = await this.request(endpoint, {
        method: "GET",
        next: {
          tags: ["woocommerce", "woocommerce-products"],
          revalidate: 3600,
        },
      });

      if (response.ok) {
        const data: WooCommerceProduct[] = await response.json();

        // Resolve regular_price for variable products from variations.
        // This is a best-effort price enhancement: if the upstream
        // variations endpoint is unavailable (e.g. returns 500), the
        // product simply keeps its existing price and the UI falls back
        // to its own discount estimate — so we degrade silently here
        // instead of spamming the error log for every variable product.
        await Promise.all(data.map(async (product) => {
          if (product.type === "variable" && (!product.regular_price || parseFloat(product.regular_price) === 0)) {
            try {
              const variations = await this.getProductVariations(product.id);
              if (variations && variations.length > 0) {
                for (const v of variations) {
                  const vr = parseFloat(v.regular_price || "0");
                  if (!isNaN(vr) && vr > 0) {
                    product.regular_price = v.regular_price;
                    break;
                  }
                }
              }
            } catch {
              // Non-critical: ignore and keep the product's existing price.
            }
          }
        }));

        return data;
      }
    } catch (error) {
      console.warn("[WooCommerce Service]: Failed to fetch all products from API, trying fallback from products_dump.json:", error);
    }

    // Fallback to local catalog dump
    try {
      const fs = require("fs");
      const path = require("path");
      const dumpPath = path.join(process.cwd(), "products_dump.json");
      if (fs.existsSync(dumpPath)) {
        const fileData = fs.readFileSync(dumpPath, "utf-8");
        const rawProducts = JSON.parse(fileData);

        const categoryMapping: Record<string, { id: number; name: string; slug: string }> = {
          "Buy Refurbished Laptops Online in India": { id: 112, name: "Refurbished Laptops", slug: "buy-refurbished-laptops-online-in-india" },
          "Buy High Quality Refurbished Desktops": { id: 129, name: "Refurbished Desktops", slug: "buy-high-quality-refurbished-desktops" },
          "Buy Refurbished Workstations Online in India": { id: 130, name: "Refurbished Workstations", slug: "buy-refurbished-workstations-online-in-india" },
          "Buy Refurbished Mini PCs Online": { id: 131, name: "Refurbished Mini PCs", slug: "buy-refurbished-mini-pcs-online-in-india" },
          "New Laptops": { id: 101, name: "New Laptops", slug: "new-laptops" },
          "New All in One": { id: 102, name: "New All in One", slug: "new-all-in-one" },
        };

        const data: WooCommerceProduct[] = rawProducts.map((p: any) => {
          const formattedCategories = (p.categories || []).map((catName: string) => {
            const mapped = categoryMapping[catName];
            if (mapped) return mapped;
            return {
              id: 999,
              name: catName,
              slug: catName.toLowerCase().replace(/\s+/g, "-"),
            };
          });

          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            permalink: `https://comsri.com/products/${p.slug}`,
            date_created: p.date_created || new Date().toISOString(),
            status: "publish",
            featured: p.featured || false,
            description: p.description || p.name,
            short_description: p.short_description || p.name,
            sku: p.sku || `SKU-${p.id}`,
            price: p.price || "",
            regular_price: p.regular_price || "",
            sale_price: p.sale_price || "",
            on_sale: p.on_sale !== undefined ? p.on_sale : !!p.sale_price,
            purchasable: true,
            stock_status: p.stock_status || "instock",
            categories: formattedCategories,
            images: p.images || [{ src: "https://picsum.photos/seed/shop/400/300" }],
            attributes: p.attributes || [],
            related_ids: p.related_ids || [],
            average_rating: p.average_rating || "4.7",
            rating_count: p.rating_count || 14,
            type: p.type || "simple",
          } as any;
        });

        return data;
      }
    } catch (err) {
      console.error("Failed to read all products from dump fallback:", err);
    }

    return [];
  }

  /**
   * 10. GET PRODUCT VARIATIONS (Fetch all configurations/swatches prices for variable products)
   */
  async getProductVariations(productId: number): Promise<any[]> {
    const endpoint = `products/${productId}/variations?per_page=100`;
    const response = await this.request(endpoint, {
      method: "GET",
      next: {
        tags: ["woocommerce", `woocommerce-product-${productId}-variations`],
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch variations for product ${productId}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 11. GET COUPON BY CODE (Fetches active WooCommerce coupons to compute valid server-side discounts)
   */
  async getCoupon(code: string): Promise<any | null> {
    try {
      const endpoint = `coupons?code=${encodeURIComponent(code.toLowerCase())}`;
      const response = await this.request(endpoint, {
        method: "GET",
        next: {
          revalidate: 300, // Cache coupon details for 5 minutes
        },
      });

      if (response.ok) {
        const coupons = await response.json();
        if (Array.isArray(coupons) && coupons.length > 0) {
          return coupons[0];
        }
      }
    } catch (error) {
      console.warn(`[WooCommerce Service]: Failed to query coupon: ${code}`, error);
    }
    return null;
  }
}

export const woocommerce = new WooCommerceServiceClient();
