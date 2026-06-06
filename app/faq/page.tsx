import { Metadata } from "next";
import { Suspense } from "react";
import FAQClient from "./FAQClient";
import { constructMetadata } from "../seo/metadata";
import JsonLd from "../components/JsonLd";
import { getFAQSchema } from "../seo/schemas";

export const metadata: Metadata = constructMetadata({
  title: "Frequently Asked Questions | Refurbished IT Hardware Guide",
  description: "Find answers regarding order configurations, delivery insurance, our stringent 40+ point refurbishing cycle, warranty claims, and volume ordering packages.",
  path: "/faq",
  keywords: ["refurbished computer faq", "Comsri support", "laptop warranty questions", "IT sourcing help"],
});

const faqs = [
  { q: "What does Comsri Corporation do?", a: "Comsri Corporation is an Indian technology company that provides new and refurbished laptops, desktops, workstations, and mini PCs for personal, professional, and business use." },
  { q: "What products does Comsri Corporation offer?", a: "Comsri Corporation offers new and refurbished laptops, desktops, workstations, and mini PCs designed to meet everyday computing and business requirements." },
  { q: "Are refurbished computers from Comsri Corporation safe to use?", a: "Yes. All refurbished computers from Comsri Corporation are tested, inspected, and quality-checked to ensure reliable performance and safe usage." },
  { q: "Does Comsri Corporation sell brand-new computers?", a: "Yes. Comsri Corporation sells both brand-new and refurbished computers, allowing customers to choose based on budget and performance needs." },
  { q: "Who can buy from Comsri Corporation?", a: "Anyone can buy from Comsri Corporation, including students, professionals, startups, small businesses, and corporate organizations across India." },
  { q: "Does Comsri Corporation provide customer support?", a: "Yes. Comsri Corporation provides 24/7 customer support to assist with product selection, order queries, and post-purchase assistance." },
  { q: "Does Comsri Corporation deliver across India?", a: "Yes. Comsri Corporation offers fast and free delivery across India with secure packaging to ensure safe arrival of products." },
  { q: "Why should I choose Comsri Corporation?", a: "Comsri Corporation is chosen for its quality-tested products, transparent pricing, reliable support, and focus on affordable and responsible computing solutions." },
  { q: "Is buying refurbished computers better for the environment?", a: "Yes. Buying refurbished computers helps reduce electronic waste and supports sustainable and responsible technology use." },
  { q: "Does Comsri Corporation support bulk or multiple orders?", a: "Yes. Comsri Corporation supports single and multiple-unit orders, making it suitable for individual and organizational requirements." }
];

export default function FAQPage() {
  const faqSchema = getFAQSchema(faqs);

  return (
    <>
      <JsonLd schema={faqSchema} />
      <Suspense fallback={
        <div className="min-h-screen bg-[#f6f5f8] flex flex-col justify-center items-center py-24 gap-4">
          <div className="animate-spin w-12 h-12 border-t-4 border-[#374bf9] rounded-full" />
          <p className="text-slate-600 font-bold font-sans text-sm tracking-wide">Loading FAQ Help Center...</p>
        </div>
      }>
        <FAQClient />
      </Suspense>
    </>
  );
}
