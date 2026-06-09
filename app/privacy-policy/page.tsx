import { constructMetadata } from "@/app/seo/metadata";
import PolicyClient from "@/app/components/PolicyClient";

export const metadata = constructMetadata({
  title: "Secure Privacy Policy",
  description: "Read Comsri Corporation’s Privacy Policy to understand how we collect, use, store, and protect your personal data. We ensure secure transactions, data confidentiality, and compliance with applicable data protection laws across India.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return <PolicyClient defaultTab="privacy" />;
}
