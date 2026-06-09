"use client";

import { useState } from "react";
import Link from "next/link";
import { Terminal, RefreshCw, Key, ShieldAlert, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";

export default function AdminSecretPortal() {
  const [token, setToken] = useState("");
  const [customTag, setCustomTag] = useState("");
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Secure Admin Cache Purge Portal initiated.",
    "[SYSTEM] Awaiting client revalidation token..."
  ]);
  const [loading, setLoading] = useState<string | null>(null);

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${time}] ${message}`]);
  };

  const handleRevalidate = async (tag: string, buttonId: string) => {
    if (!token) {
      addLog("[ERROR] Revalidation aborted: Token field is empty.");
      return;
    }

    setLoading(buttonId);
    addLog(`[REQUEST] Initiating cache flush request for tag: "${tag}"...`);

    try {
      const response = await fetch(`/api/revalidate?token=${encodeURIComponent(token)}&tag=${encodeURIComponent(tag)}`);
      const data = await response.json();

      if (response.ok && data.revalidated) {
        addLog(`[SUCCESS] Purged Next.js cache for tag: "${tag}". Source: ${data.source || "remote"}`);
      } else {
        addLog(`[FAILURE] API Response: ${response.status} - ${data.error || "Unknown error occurred."}`);
      }
    } catch (error: any) {
      addLog(`[EXCEPTION] Network call failed: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-mono relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] aspect-square rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      {/* Portal Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h1 className="text-sm md:text-base font-bold text-white tracking-wider uppercase leading-none">Comsri Security Engine</h1>
              <span className="text-[10px] text-slate-500 font-bold block mt-1 tracking-widest uppercase">Admin Cache Control Portal</span>
            </div>
          </div>
          <Link 
            href="/"
            className="flex items-center gap-2 text-[11px] font-bold text-slate-400 hover:text-white transition-colors bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
          >
            <ArrowLeft size={13} />
            <span>Store Front</span>
          </Link>
        </div>
      </header>

      {/* Main Panel Content */}
      <main className="flex-1 max-w-[1200px] mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Controls Card (Span 7) */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-900 rounded-[24px] p-6 md:p-8 backdrop-blur-sm shadow-2xl flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">System Cache Controllers</h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Flush the Incremental Static Regeneration (ISR) and data caches to instantly synchronize newly published or edited WordPress WooCommerce catalog details.
            </p>
          </div>

          {/* Token input element */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Key size={12} className="text-emerald-400" />
              Revalidation Authorization Token
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter server environment REVALIDATION_TOKEN..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors text-emerald-400 tracking-wider placeholder:text-slate-700"
            />
          </div>

          <div className="h-px bg-slate-900 my-1" />

          {/* Revalidation Actions Grid */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cache Flush Triggers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Purge All */}
              <button
                onClick={() => handleRevalidate("woocommerce", "all")}
                disabled={loading !== null}
                className="bg-slate-950 border border-slate-800 hover:border-emerald-500/30 rounded-xl p-4.5 text-left cursor-pointer transition-all hover:bg-slate-950/70 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-emerald-400 transition-colors">
                    Global Flush
                  </span>
                  <RefreshCw size={14} className={`text-slate-600 group-hover:text-emerald-400 transition-all ${loading === "all" ? "animate-spin text-emerald-400" : ""}`} />
                </div>
                <span className="text-[10px] text-slate-500 leading-normal block">
                  Purges all WooCommerce cache tables including products list, categories, and slugs.
                </span>
              </button>

              {/* Purge Catalog */}
              <button
                onClick={() => handleRevalidate("woocommerce-products", "catalog")}
                disabled={loading !== null}
                className="bg-slate-950 border border-slate-800 hover:border-emerald-500/30 rounded-xl p-4.5 text-left cursor-pointer transition-all hover:bg-slate-950/70 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-emerald-400 transition-colors">
                    Catalog Grid Only
                  </span>
                  <RefreshCw size={14} className={`text-slate-600 group-hover:text-emerald-400 transition-all ${loading === "catalog" ? "animate-spin text-emerald-400" : ""}`} />
                </div>
                <span className="text-[10px] text-slate-500 leading-normal block">
                  Purges the shop listing grid query cache. Fixes pricing sort tables and pagination grids.
                </span>
              </button>

              {/* Purge Related */}
              <button
                onClick={() => handleRevalidate("woocommerce-related", "related")}
                disabled={loading !== null}
                className="bg-slate-950 border border-slate-800 hover:border-emerald-500/30 rounded-xl p-4.5 text-left cursor-pointer transition-all hover:bg-slate-950/70 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-emerald-400 transition-colors">
                    Related Products
                  </span>
                  <RefreshCw size={14} className={`text-slate-600 group-hover:text-emerald-400 transition-all ${loading === "related" ? "animate-spin text-emerald-400" : ""}`} />
                </div>
                <span className="text-[10px] text-slate-500 leading-normal block">
                  Purges &quot;Frequently Viewed Together&quot; listings displayed at the bottom of product pages.
                </span>
              </button>

              {/* Custom Tag Trigger */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Custom Target Tag</span>
                    <RefreshCw size={14} className={`text-slate-600 ${loading === "custom" ? "animate-spin text-emerald-400" : ""}`} />
                  </div>
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder="e.g. woocommerce-product-123"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500/50 rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-none transition-colors text-emerald-400 mb-2"
                  />
                </div>
                <button
                  onClick={() => handleRevalidate(customTag, "custom")}
                  disabled={loading !== null || !customTag}
                  className="w-full bg-slate-900 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 border border-slate-800 hover:border-emerald-800/40 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Purge Custom Tag
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Right Side: Virtual Terminal Console (Span 5) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-900 rounded-[24px] h-[480px] flex flex-col overflow-hidden shadow-inner">
          {/* Terminal Title Bar */}
          <div className="bg-slate-900/80 border-b border-slate-900 px-5 py-3.5 flex items-center gap-2 select-none">
            <Terminal size={14} className="text-emerald-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Portal Developer Logs</span>
            <div className="flex gap-1.5 ml-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
            </div>
          </div>

          {/* Logs Terminal Window */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-2.5 scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-900">
            {logs.map((log, idx) => {
              const isError = log.includes("[ERROR]") || log.includes("[FAILURE]") || log.includes("[EXCEPTION]");
              const isSuccess = log.includes("[SUCCESS]");
              const isRequest = log.includes("[REQUEST]");
              
              let color = "text-slate-400";
              if (isError) color = "text-rose-400 font-bold";
              if (isSuccess) color = "text-emerald-400 font-bold";
              if (isRequest) color = "text-sky-400";
              if (log.includes("[SYSTEM]")) color = "text-amber-400/85";

              return (
                <div key={idx} className={`text-[11px] leading-relaxed break-all ${color}`}>
                  {log}
                </div>
              );
            })}
          </div>

          {/* Terminal Console Footer */}
          <div className="bg-slate-900/40 border-t border-slate-900 px-5 py-3 flex items-center justify-between text-[9px] text-slate-650 select-none uppercase font-bold tracking-widest">
            <span>Terminal status: Online</span>
            <button 
              onClick={() => setLogs(["[SYSTEM] Logs cleared. Console ready."])}
              className="text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              Clear Logs
            </button>
          </div>
        </div>

      </main>

      {/* Portal Footer */}
      <footer className="border-t border-slate-900 py-4 text-center select-none bg-slate-950">
        <span className="text-[9px] text-slate-650 font-bold tracking-widest uppercase">
          Copyright © 2026 Comsri Corporation. Authorized Access Only.
        </span>
      </footer>

    </div>
  );
}
