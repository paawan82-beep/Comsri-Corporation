import { Metadata } from "next";
import BulkOrdersClient from "./BulkOrdersClient";
import { constructMetadata } from "../seo/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Buy Bulk Laptops, Desktops & Mini PCs in India | Comsri Corporation",
  description: "Buy bulk laptops, desktops, and mini PCs in India from Comsri Corporation. Quality-tested systems, competitive pricing, bulk deals, and fast nationwide delivery.",
  path: "/bulk-orders",
  keywords: ["bulk laptops India", "buy bulk laptops", "bulk desktops India", "mini PCs India", "wholesale laptops India", "refurbished laptops India", "bulk computer supplier India", "corporate laptop supplier India", "wholesale computers India", "used laptops in bulk"],
});

export default function BulkOrdersPage() {
  return <BulkOrdersClient />;
}
