import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import JsonLd from "./JsonLd";
import { getBreadcrumbSchema } from "../seo/schemas";

interface BreadcrumbItem {
  name: string;
  item: string; // The URL path relative to domain
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schema = getBreadcrumbSchema(items);

  return (
    <nav className="w-full py-3 bg-transparent" aria-label="Breadcrumb">
      <JsonLd schema={schema} />
      
      <ol className="flex flex-wrap items-center gap-1.5 md:gap-2 text-[13px] md:text-[14px] text-slate-500 font-medium">
        <li>
          <Link href="/" className="hover:text-[#374bf9] transition-colors">
            Home
          </Link>
        </li>
        
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={idx}>
              <li className="text-slate-400">
                <ChevronRight size={14} className="stroke-[2.5px]" />
              </li>
              <li>
                {isLast ? (
                  <span className="text-slate-900 font-bold underline decoration-slate-300 decoration-2 underline-offset-4" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.item} className="hover:text-[#374bf9] transition-colors">
                    {item.name}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
