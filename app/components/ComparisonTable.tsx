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
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm scrollbar-thin">
      <table className="w-full border-collapse text-left text-sm md:text-base">
        {caption && (
          <caption className="sr-only">
            {caption}
          </caption>
        )}
        
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {headers.map((header, idx) => (
              <th 
                key={idx} 
                className="px-6 py-4 font-bold text-slate-800 text-xs md:text-sm uppercase tracking-wider"
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
              className="hover:bg-slate-50/50 transition-colors"
            >
              <td className="px-6 py-4 font-bold text-slate-900 bg-slate-50/30">
                {row.label}
              </td>
              {row.values.map((val, valIdx) => (
                <td 
                  key={valIdx} 
                  className="px-6 py-4 text-slate-650 font-medium whitespace-pre-wrap"
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
