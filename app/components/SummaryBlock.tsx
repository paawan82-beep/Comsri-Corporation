import React from "react";
import { Sparkles } from "lucide-react";

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
      className={`bg-indigo-50/70 border border-indigo-100 rounded-3xl p-6 md:p-8 ${className}`}
      aria-label="Summary Overview"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-indigo-100 text-[#374bf9] rounded-lg">
          <Sparkles size={18} />
        </div>
        <h2 className="text-base font-extrabold text-indigo-950 uppercase tracking-wider">
          Quick Summary: {title}
        </h2>
      </div>

      <p className="text-[15px] md:text-base leading-relaxed text-slate-800 font-semibold mb-6">
        {definition}
      </p>

      {takeaways.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Key Takeaways
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {takeaways.map((item, idx) => (
              <li 
                key={idx} 
                className="flex items-start gap-2.5 text-sm text-slate-650 font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#374bf9] mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
