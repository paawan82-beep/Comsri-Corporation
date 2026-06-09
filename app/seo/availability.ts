export const availabilityMap = {
  in_stock: "https://schema.org/InStock",
  instock: "https://schema.org/InStock",
  out_of_stock: "https://schema.org/OutOfStock",
  outofstock: "https://schema.org/OutOfStock",
  preorder: "https://schema.org/PreOrder",
  limited: "https://schema.org/LimitedAvailability",
  discontinued: "https://schema.org/Discontinued",
};

export function getAvailabilityUrl(status: string): string {
  // Normalize WooCommerce status values (e.g. 'instock' -> 'instock', 'outofstock' -> 'outofstock')
  const cleanStatus = status?.toLowerCase().replace(/[-_]/g, "").trim() || "instock";
  return availabilityMap[cleanStatus as keyof typeof availabilityMap] || "https://schema.org/InStock";
}
