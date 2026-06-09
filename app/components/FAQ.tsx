"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
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
    <section className="w-full flex flex-col gap-5" aria-label="FAQ Section">
      <JsonLd schema={faqSchema} />
      
      {title && (
        <div className="mb-2">
          <span className="text-[#3452ef] text-xs font-extrabold uppercase tracking-wider block mb-1">Help Center</span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`bg-white rounded-[20px] border transition-all duration-300 ${
                isOpen 
                  ? "border-[#3452ef]/30 shadow-[0_12px_30px_rgba(52,82,239,0.04)] bg-gradient-to-b from-white to-slate-50/30" 
                  : "border-slate-200/60 shadow-sm hover:border-slate-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.015)]"
              }`}
            >
              <h3 className="m-0">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left px-6 md:px-8 py-5 flex items-center justify-between focus:outline-none group cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 pr-8">
                    <div className={`p-1.5 rounded-lg shrink-0 transition-colors duration-300 ${
                      isOpen ? "bg-[#3452ef]/10 text-[#3452ef]" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600"
                    }`}>
                      <HelpCircle size={16} />
                    </div>
                    <span className={`text-[15px] md:text-[16px] font-bold ${
                      isOpen ? "text-[#3452ef]" : "text-slate-800 group-hover:text-slate-950"
                    } transition-colors duration-300`}>
                      {item.q}
                    </span>
                  </div>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isOpen ? "bg-[#3452ef] text-white" : "bg-slate-50 text-slate-500 group-hover:bg-[#3452ef]/10 group-hover:text-[#3452ef]"
                  } transition-colors duration-300`}>
                    <ChevronDown size={15} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </span>
                </button>
              </h3>

              <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="px-6 md:px-8 pb-6 pt-1 text-[13.5px] md:text-[14.5px] leading-relaxed pl-[48px] md:pl-[58px]">
                    <p className="font-bold text-slate-800 mb-1.5">{item.a}</p>
                    {item.expanded && <p className="text-slate-500 font-semibold">{item.expanded}</p>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
