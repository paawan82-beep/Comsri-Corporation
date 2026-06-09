import { constructMetadata } from "@/app/seo/metadata";
import PolicyClient from "@/app/components/PolicyClient";

export const metadata = constructMetadata({
  title: "Return & Refund Policy",
  description: "Read Comsri Corporation’s Return & Refund Policy to learn about order cancellations, returns, refunds, and non-returnable sealed products. Transparent policies, fair timelines, and customer-first support across India.",
  path: "/return-refund",
});

export default function ReturnRefundPage() {
  return <PolicyClient defaultTab="refund" />;
}
