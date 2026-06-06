import { constructMetadata } from "@/app/seo/metadata";
import PolicyClient from "@/app/components/PolicyClient";

export const metadata = constructMetadata({
  title: "Privacy Policy",
  description: "Learn how Comsri Corporation handles your personal data, customer privacy, and transaction security.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return <PolicyClient defaultTab="privacy" />;
}
