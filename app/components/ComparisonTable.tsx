import React from "react";

interface ComparisonRow {
  label: string;
  values: string[];
}

interface ComparisonTableProps {
  headers: string[];
  rows: ComparisonRow[];
  caption?: string;
}

export default function ComparisonTable({
  headers,
  rows,
  caption,
}: ComparisonTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-[24px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.02)] scrollbar-thin">
      <table className="w-full border-collapse text-left text-sm md:text-[15px]">
        {caption && (
          <caption className="sr-only">
            {caption}
          </caption>
        )}
        
        <thead>
          <tr className="bg-slate-900 border-b border-slate-800">
            {headers.map((header, idx) => (
              <th 
                key={idx} 
                className="px-6 py-4.5 font-bold text-white text-xs md:text-sm uppercase tracking-wider first:rounded-tl-[24px] last:rounded-tr-[24px]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, rowIdx) => (
            <tr 
              key={rowIdx} 
              className="hover:bg-slate-50/70 transition-all duration-200"
            >
              <td className="px-6 py-4.5 font-bold text-slate-800 bg-slate-50/40 border-r border-slate-100/50 w-[200px] md:w-[260px] shrink-0">
                {row.label}
              </td>
              {row.values.map((val, valIdx) => (
                <td 
                  key={valIdx} 
                  className={`px-6 py-4.5 text-slate-650 font-medium whitespace-pre-wrap ${
                    valIdx === 0 ? "text-slate-800 font-semibold" : "text-emerald-600 font-bold text-[13.5px]"
                  }`}
                >
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
