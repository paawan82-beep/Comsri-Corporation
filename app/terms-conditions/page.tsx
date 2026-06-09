import { constructMetadata } from "@/app/seo/metadata";
import PolicyClient from "@/app/components/PolicyClient";

export const metadata = constructMetadata({
  title: "Terms & Conditions",
  description: "Read the Terms & Conditions of Comsri for using our website and purchasing refurbished IT products and recycling services in India.",
  path: "/terms-conditions",
});

export default function TermsConditionsPage() {
  return <PolicyClient defaultTab="terms" />;
}
