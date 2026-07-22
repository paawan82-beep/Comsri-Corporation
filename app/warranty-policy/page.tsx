import { constructMetadata } from "@/app/seo/metadata";
import PolicyClient from "@/app/components/PolicyClient";

export const metadata = constructMetadata({
  title: "Warranty Policy",
  description: "Comsri Corporation’s warranty policy for refurbished laptops, desktops, workstations and mini PCs: 1-year comprehensive hardware coverage, what’s included, and how to raise a claim.",
  path: "/warranty-policy",
});

export default function WarrantyPolicyPage() {
  return <PolicyClient defaultTab="warranty" />;
}
