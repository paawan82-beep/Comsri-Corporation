export const availabilityMap = {
  in_stock: "https://schema.org/InStock",
  out_of_stock: "https://schema.org/OutOfStock",
  preorder: "https://schema.org/PreOrder",
  limited: "https://schema.org/LimitedAvailability",
  discontinued: "https://schema.org/Discontinued",
};

export function getAvailabilityUrl(status: string): string {
  const cleanStatus = status?.toLowerCase().trim() || "in_stock";
  return availabilityMap[cleanStatus as keyof typeof availabilityMap] || "https://schema.org/InStock";
}
