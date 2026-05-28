"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WarrantyPolicyRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/privacy-policy?tab=warranty");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f6f5f8] flex flex-col justify-center items-center font-sans">
      <div className="animate-spin w-12 h-12 border-t-4 border-indigo-600 rounded-full mb-4" />
      <p className="text-slate-600 font-bold text-sm tracking-wide">Syncing Comsri Warranty Policy...</p>
    </div>
  );
}
