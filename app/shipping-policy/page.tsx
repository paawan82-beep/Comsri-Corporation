import { constructMetadata } from "@/app/seo/metadata";
import PolicyClient from "@/app/components/PolicyClient";

export const metadata = constructMetadata({
  title: "Shipping Policy",
  description: "Comsri Corporation’s shipping policy: free insured PAN-India delivery on refurbished computers, dispatch and transit timelines, and order tracking.",
  path: "/shipping-policy",
});

export default function ShippingPolicyPage() {
  return <PolicyClient defaultTab="shipping" />;
}
