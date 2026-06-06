import { constructMetadata } from "@/app/seo/metadata";
import PolicyClient from "@/app/components/PolicyClient";

export const metadata = constructMetadata({
  title: "Return & Refund Policy",
  description: "Understand Comsri Corporation's 14-day return framework, buyback terms, and hardware warranty policies.",
  path: "/return-refund",
});

export default function ReturnRefundPage() {
  return <PolicyClient defaultTab="refund" />;
}
