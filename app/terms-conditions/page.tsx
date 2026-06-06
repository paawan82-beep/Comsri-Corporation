import { constructMetadata } from "@/app/seo/metadata";
import PolicyClient from "@/app/components/PolicyClient";

export const metadata = constructMetadata({
  title: "Terms & Conditions",
  description: "Review Comsri Corporation's user agreements, service terms, purchase policies, and transaction terms.",
  path: "/terms-conditions",
});

export default function TermsConditionsPage() {
  return <PolicyClient defaultTab="terms" />;
}
