"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import JsonLd from "./JsonLd";
import { getFAQSchema } from "../seo/schemas";

interface FAQItem {
  q: string;
  a: string; // The short direct answer (40-60 words)
  expanded?: string; // Additional detailed description
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  isLowEnd?: boolean;
}

export default function FAQ({ items, title = "Frequently Asked Questions", isLowEnd = false }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Generate structured FAQ schema data
  const faqSchema = getFAQSchema(
    items.map((item) => ({
      q: item.q,
      a: item.expanded ? `${item.a} ${item.expanded}` : item.a,
    }))
  );

  return (
    <section className="w-full flex flex-col gap-6" aria-label="FAQ Section">
      <JsonLd schema={faqSchema} />
      
      {title && (
        <h2 className="text-2xl font-extrabold text-[#111] tracking-tight mb-2">
          {title}
        </h2>
      )}

      <div className="space-y-4">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`bg-white rounded-2xl border ${
                isLowEnd ? "" : "transition-all duration-300"
              } ${isOpen ? "border-[#374bf9]/30 shadow-md" : "border-slate-150 shadow-sm"}`}
            >
              <h3 className="m-0">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left px-6 lg:px-8 py-5 flex items-center justify-between focus:outline-none group"
                  aria-expanded={isOpen}
                >
                  <span className={`text-[16px] md:text-[18px] font-bold pr-8 ${
                    isOpen ? "text-[#374bf9]" : "text-slate-800 group-hover:text-[#374bf9]"
                  } ${isLowEnd ? "" : "transition-colors"}`}>
                    {item.q}
                  </span>
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isOpen ? "bg-[#374bf9] text-white" : "bg-slate-50 text-slate-800 group-hover:bg-[#374bf9]/10 group-hover:text-[#374bf9]"
                  } ${isLowEnd ? "" : "transition-colors duration-300"}`}>
                    <ChevronDown size={18} className={isLowEnd ? (isOpen ? "rotate-180" : "") : `transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </span>
                </button>
              </h3>

              {isLowEnd ? (
                isOpen && (
                  <div className="px-6 lg:px-8 pb-6 pt-0 text-[15px] text-slate-650 font-medium leading-relaxed">
                    <p className="font-extrabold text-[#111] mb-2">{item.a}</p>
                    {item.expanded && <p className="mt-2 text-slate-600">{item.expanded}</p>}
                  </div>
                )
              ) : (
                <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <div className="px-6 lg:px-8 pb-6 pt-0 text-[15px] text-slate-650 font-medium leading-relaxed">
                      <p className="font-semibold text-slate-900 mb-2">{item.a}</p>
                      {item.expanded && <p className="mt-2 text-slate-600 font-normal">{item.expanded}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
