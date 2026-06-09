import React from "react";
import { Sparkles, CheckCircle } from "lucide-react";

interface SummaryBlockProps {
  title: string;
  definition: string; // concise definition
  takeaways: string[]; // key bullet points
  className?: string;
}

export default function SummaryBlock({
  title,
  definition,
  takeaways,
  className = "",
}: SummaryBlockProps) {
  return (
    <section 
      className={`bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_16px_50px_rgba(0,0,0,0.04)] ${className}`}
      aria-label="Summary Overview"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-gradient-to-tr from-[#374bf9] to-[#2f55f6] text-white rounded-xl shadow-md shadow-blue-500/10">
          <Sparkles size={16} />
        </div>
        <h2 className="text-sm md:text-base font-extrabold text-slate-900 uppercase tracking-wider">
          Quick Overview: {title}
        </h2>
      </div>

      <p className="text-[15px] md:text-[16px] leading-relaxed text-slate-700 font-semibold mb-6">
        {definition}
      </p>

      {takeaways.length > 0 && (
        <div className="pt-6 border-t border-slate-100/70">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Key Assurances & Highlights
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {takeaways.map((item, idx) => (
              <li 
                key={idx} 
                className="flex items-start gap-3 text-sm text-slate-650 font-medium group"
              >
                <div className="mt-0.5 p-0.5 bg-emerald-50 text-emerald-500 rounded-md group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <CheckCircle size={14} className="stroke-[2.5]" />
                </div>
                <span className="leading-snug text-slate-600 font-medium group-hover:text-slate-900 transition-colors duration-300">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
