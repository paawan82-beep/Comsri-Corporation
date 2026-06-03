"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, Layers, Database, Key, Globe, ExternalLink, ArrowRight } from "lucide-react";

interface TestResult {
  success: boolean;
  status: "unconfigured" | "connected" | "error";
  message: string;
  errorMessage?: string;
  latencyMs: number;
  handshakeLatencyMs?: number;
  apiHost?: string;
  stats?: {
    categoriesFetched: number;
    productsFoundInCatalog: number;
    totalPagesCount: number;
    sampleReturnedCount: number;
  };
  sampleProducts?: Array<{
    id: number;
    name: string;
    slug: string;
    price: string;
    regular_price: string;
    stock_status: string;
    images: string[];
  }>;
  configCheck?: {
    urlConfigured: boolean;
    url: string;
    keyConfigured: boolean;
    keyPrefix: string;
    secretConfigured: boolean;
    webhookSecretConfigured: boolean;
  };
  troubleshooting?: string[];
}

export default function ConnectionTestPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<TestResult | null>(null);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/test-connection");
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        status: "error",
        message: "An unexpected client-side error occurred while querying the server diagnostics module.",
        errorMessage: error.message,
        latencyMs: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const initialFetch = async () => {
      try {
        const response = await fetch("/api/test-connection");
        const data = await response.json();
        if (active) {
          setResult(data);
        }
      } catch (error: any) {
        if (active) {
          setResult({
            success: false,
            status: "error",
            message: "An unexpected client-side error occurred while querying the server diagnostics module.",
            errorMessage: error.message,
            latencyMs: 0,
          });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    initialFetch();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link 
            href="/products" 
            className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 hover:text-indigo-650 transition-colors flex items-center gap-1.5"
          >
            ← Store Catalog
          </Link>
        </div>

        {/* Header Block */}
        <div className="mb-8 p-8 bg-slate-900 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_12px_40px_rgba(15,23,42,0.1)]">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 inline-block mb-3">
              Headless Systems Validation
            </span>
            <h1 className="text-3xl font-black tracking-tight mb-2">
              WooCommerce REST API Diagnostics
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Verify real-time server-side secure communication with your WordPress headless CMS. Test keys, latency, and retrieve samples.
            </p>
          </div>
          
          <button
            onClick={runDiagnostics}
            disabled={loading}
            className="shrink-0 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-bold text-sm px-6 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            {loading ? "Testing Connection..." : "Retest Connection"}
          </button>
        </div>

        {/* Connection Status Section */}
        {result && (
          <div className="space-y-6">
            
            {/* 1. Status Indicator Card */}
            <div className={`p-6 rounded-3xl border bg-white shadow-sm flex flex-col sm:flex-row items-start gap-4 ${
              result.status === "connected" 
                ? "border-emerald-100" 
                : result.status === "unconfigured" 
                ? "border-amber-100" 
                : "border-rose-100"
            }`}>
              <div className="shrink-0">
                {result.status === "connected" ? (
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={24} />
                  </div>
                ) : result.status === "unconfigured" ? (
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <AlertTriangle size={24} />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <XCircle size={24} />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Connection status</span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  {result.message}
                </h2>
                
                {result.errorMessage && (
                  <div className="mt-3 p-3 bg-rose-50 text-rose-800 rounded-xl font-mono text-xs max-h-40 overflow-y-auto border border-rose-100 leading-relaxed whitespace-pre-wrap">
                    Error Logged: {result.errorMessage}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono font-bold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Globe size={14} className="text-slate-400" />
                    Host: <span className="text-slate-700">{result.apiHost || result.configCheck?.url || "N/A"}</span>
                  </span>
                  
                  {result.latencyMs > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Database size={14} className="text-indigo-500" />
                      Server Roundtrip: <span className="text-indigo-600">{result.latencyMs}ms</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 2. WooCommerce Catalog Metrics (Connected State Only) */}
            {result.status === "connected" && result.stats && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Catalog Total</span>
                  <div className="text-3xl font-black text-slate-950 mt-1">
                    {result.stats.productsFoundInCatalog}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">active products in WooCommerce</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Categories Detected</span>
                  <div className="text-3xl font-black text-slate-950 mt-1">
                    {result.stats.categoriesFetched}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">departments configured</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">ISR Chunk Size</span>
                  <div className="text-3xl font-black text-slate-950 mt-1">
                    {result.stats.totalPagesCount}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">total batch static compile pages</p>
                </div>
              </div>
            )}

            {/* 3. Credentials Health Check Indicators */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <Key size={16} className="text-indigo-500" /> Environment Configurations Verification
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-slate-800">WOOCOMMERCE_URL</span>
                    <span className="text-[11px] font-mono text-slate-400">{result.configCheck?.url || "Not defined"}</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${result.configCheck?.urlConfigured ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
                    {result.configCheck?.urlConfigured ? "Present" : "Missing"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-slate-800">WOOCOMMERCE_CONSUMER_KEY</span>
                    <span className="text-[11px] font-mono text-slate-400">{result.configCheck?.keyPrefix || "Not defined"}</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${result.configCheck?.keyConfigured ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
                    {result.configCheck?.keyConfigured ? "Present" : "Missing"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-slate-800">WOOCOMMERCE_CONSUMER_SECRET</span>
                    <span className="text-[11px] font-mono text-slate-400">cs_xxxxxxxx</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${result.configCheck?.secretConfigured ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
                    {result.configCheck?.secretConfigured ? "Present" : "Missing"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-slate-800">WOOCOMMERCE_WEBHOOK_SECRET</span>
                    <span className="text-[11px] font-mono text-slate-400">whsec_xxxx</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${result.configCheck?.webhookSecretConfigured ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-500"}`}>
                    {result.configCheck?.webhookSecretConfigured ? "Active (Webhooks ready)" : "Optional"}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Troubleshooting Steps (Unconfigured or Error States) */}
            {result.status !== "connected" && (
              <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 text-amber-900">
                <h3 className="text-sm font-extrabold flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} /> WooCommerce Configuration Blueprint instructions
                </h3>
                <ol className="list-decimal pl-5 space-y-2 text-xs leading-relaxed font-medium text-amber-800">
                  <li>Open the <strong>Settings Menu</strong> in Google AI Studio (look for the gear icon in the UI).</li>
                  <li>Click on <strong>Environment Variables</strong> to configure secrets securely.</li>
                  <li>Add these key-value pairs mapping to your WordPress WooCommerce installation:
                    <ul className="list-disc pl-5 mt-1.5 space-y-1 font-mono text-[11px]">
                      <li><strong>WOOCOMMERCE_URL</strong>: The base domain of your site (e.g. <code>https://comsri.com</code>)</li>
                      <li><strong>WOOCOMMERCE_CONSUMER_KEY</strong>: The credentials key starting with <code>ck_</code></li>
                      <li><strong>WOOCOMMERCE_CONSUMER_SECRET</strong>: The secrets key starting with <code>cs_</code></li>
                    </ul>
                  </li>
                  <li>Ensure your WordPress Permalinks are configured with any non-default slug setting (e.g., <strong>Post Name</strong>) to activate WooCommerce REST API routes.</li>
                </ol>
              </div>
            )}

            {/* 5. Dynamic Product Preview Drawer (Connected Mode Only) */}
            {result.status === "connected" && result.sampleProducts && result.sampleProducts.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <h3 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <Layers size={16} className="text-indigo-500" /> live products successfully retrieved (Preview)
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {result.sampleProducts.map((p) => (
                    <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-150 flex gap-4 items-center">
                      {p.images[0] ? (
                        <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden relative shrink-0">
                          <img loading="lazy" src={p.images[0]} 
                            alt={p.name} 
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-indigo-50/50 flex items-center justify-center text-slate-400 font-mono text-xs shrink-0">
                          N/A
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="block font-extrabold text-slate-900 truncate text-sm">{p.name}</span>
                        <span className="block text-xs font-mono text-[#F59E0B] tracking-wide mt-0.5">₹{p.price || "N/A"}</span>
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">slug: {p.slug}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                  <Link 
                    href="/products" 
                    className="inline-flex items-center gap-2 text-xs font-bold bg-[#111] hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/10 text-white px-5 py-3 rounded-xl transition"
                  >
                    Go to dynamic frontend catalog <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
