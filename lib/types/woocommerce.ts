export interface WooCommerceImage {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  src: string;
  name: string;
  alt: string;
}

export interface WooCommerceCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: string;
  image: WooCommerceImage | null;
  count: number;
}

export interface WooCommerceAttribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

export interface WooCommerceDimensions {
  length: string;
  width: string;
  height: string;
}

export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  type: "simple" | "grouped" | "external" | "variable";
  status: "publish" | "draft" | "pending" | "private";
  featured: boolean;
  catalog_visibility: "visible" | "catalog" | "search" | "hidden";
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  stock_status: "instock" | "outofstock" | "onbackorder";
  stock_quantity: number | null;
  manage_stock: boolean;
  weight: string;
  dimensions: WooCommerceDimensions;
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  categories: { id: number; name: string; slug: string }[];
  tags: { id: number; name: string; slug: string }[];
  images: WooCommerceImage[];
  attributes: WooCommerceAttribute[];
  menu_order: number;
  meta_data: { id: number; key: string; value: any }[];
}

export interface WooCommerceOrderLineItem {
  id?: number;
  name?: string;
  product_id: number;
  variation_id?: number;
  quantity: number;
  tax_class?: string;
  subtotal?: string;
  total?: string;
  sku?: string;
  price?: number;
}

export interface BillingAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface WooCommerceOrder {
  id?: number;
  parent_id?: number;
  status: "pending" | "processing" | "on-hold" | "completed" | "cancelled" | "refunded" | "failed";
  currency: string;
  billing: BillingAddress;
  shipping: ShippingAddress;
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  customer_id?: number;
  meta_data: { key: string; value: any }[];
  line_items: WooCommerceOrderLineItem[];
}

export interface ProductQueryFilters {
  category?: string;
  search?: string;
  page?: number;
  per_page?: number;
  order?: "asc" | "desc";
  orderby?: "date" | "id" | "include" | "title" | "slug" | "price" | "popularity" | "rating";
  min_price?: string;
  max_price?: string;
  on_sale?: boolean;
  featured?: boolean;
  sku?: string;
  status?: string;
}

export interface WooCommercePaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
}
