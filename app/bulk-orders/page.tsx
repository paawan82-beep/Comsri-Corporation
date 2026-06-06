import { Metadata } from "next";
import BulkOrdersClient from "./BulkOrdersClient";
import { constructMetadata } from "../seo/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Bulk Refurbished Laptops & Desktops for Corporate Offices",
  description: "Enterprise-grade refurbished laptops, desktops, and IT hardware for India's leading companies. High quality with 1-year warranty and flexible bulk plans.",
  path: "/bulk-orders",
  keywords: ["bulk refurbished laptops", "corporate IT procurement", "wholesale desktops India", "office laptops bulk"],
});

export default function BulkOrdersPage() {
  return <BulkOrdersClient />;
}
