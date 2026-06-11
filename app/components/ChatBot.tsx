"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles, Laptop, ShieldCheck, RefreshCw, HelpCircle, ArrowRight, User, Mail, Phone } from "lucide-react";
import Link from "next/link";
import productsData from "../../products_dump.json";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ProductRecommendation {
  id: number;
  name: string;
  slug: string;
}

interface UserDetails {
  name: string;
  email: string;
  phone: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formError, setFormError] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user details from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("comsri_user_details");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserDetails(parsed);
        setMessages([
          {
            role: "assistant",
            content: `Hello ${parsed.name}! Welcome back to Comsri support. How can I help you find the perfect laptop, desktop, or answer any policy questions today?`,
            timestamp: new Date()
          }
        ]);
      } catch (e) {
        console.error("Error parsing saved user details", e);
      }
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const quickPrompts = [
    { text: "Recommend a gaming laptop", icon: Laptop },
    { text: "What is the warranty policy?", icon: ShieldCheck },
    { text: "Details about returns/refunds", icon: RefreshCw },
    { text: "Help me choose a budget PC", icon: HelpCircle }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formName.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    if (!formEmail.trim() || !/\S+@\S+\.\S+/.test(formEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!formPhone.trim() || !/^\+?[0-9\s-]{10,15}$/.test(formPhone.replace(/\s+/g, ""))) {
      setFormError("Please enter a valid phone number.");
      return;
    }

    const details: UserDetails = {
      name: formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim()
    };

    localStorage.setItem("comsri_user_details", JSON.stringify(details));
    setUserDetails(details);
    setMessages([
      {
        role: "assistant",
        content: `Hello ${details.name}! Welcome to Comsri support. How can I help you find the perfect laptop, desktop, or answer any policy questions today?`,
        timestamp: new Date()
      }
    ]);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.content,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again or contact support at support@comsri.com.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseBotMessage = (text: string) => {
    const recommendationsRegex = /```json-recommendations\s*([\s\S]*?)\s*```/;
    const match = text.match(recommendationsRegex);
    let cleanText = text;
    let recommendations: ProductRecommendation[] = [];

    if (match) {
      cleanText = text.replace(recommendationsRegex, "").trim();
      try {
        recommendations = JSON.parse(match[1]);
      } catch (e) {
        console.error("Failed to parse recommendations", e);
      }
    }
    return { cleanText, recommendations };
  };

  const renderProductCard = (rec: ProductRecommendation) => {
    const productDetail = productsData.find((p) => p.id === rec.id || p.slug === rec.slug);
    const category = productDetail?.categories?.[0] || "Refurbished Product";
    const specs = productDetail?.attributes || [];

    return (
      <div
        key={rec.slug || rec.id}
        className="flex flex-col bg-white/90 dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 rounded-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 max-w-[260px] flex-shrink-0"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded-full uppercase">
            {category}
          </span>
        </div>
        <h4 className="text-[12px] font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug min-h-[34px] mb-2">
          {productDetail?.name || rec.name}
        </h4>
        <div className="space-y-1 mb-2 flex-grow">
          {specs.slice(0, 3).map((spec, i) => (
            <div key={i} className="flex items-center text-[10px] text-slate-500 dark:text-slate-400">
              <span className="font-medium mr-1">{spec.name}:</span>
              <span className="truncate">{spec.options.join(", ")}</span>
            </div>
          ))}
        </div>
        {/* Price Display */}
        {(productDetail?.price || productDetail?.regular_price) && (
          <div className="mb-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Price</span>
            <div className="text-right">
              {productDetail?.on_sale && productDetail?.sale_price ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 line-through">₹{productDetail.regular_price}</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 price-font">₹{productDetail.sale_price}</span>
                </div>
              ) : (
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 price-font">₹{productDetail?.price}</span>
              )}
            </div>
          </div>
        )}
        <Link
          href={`/products/${productDetail?.slug || rec.slug}`}
          onClick={() => setIsOpen(false)}
          className="flex items-center justify-center w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold tracking-medium transition-colors gap-1 shadow-sm"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  };

  const renderMessageContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        return (
          <li key={i} className="ml-4 list-disc text-sm py-0.5">
            {parseBoldText(line.trim().substring(2))}
          </li>
        );
      }
      return (
        <p key={i} className="text-sm min-h-[1em] leading-relaxed py-0.5">
          {parseBoldText(line)}
        </p>
      );
    });
  };

  const parseBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Chat Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:shadow-indigo-500/20 transition-all relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <MessageSquare className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
        )}
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-18 right-0 w-[92vw] sm:w-[400px] h-[600px] max-h-[80vh] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center border border-white/20 overflow-hidden">
                  <img
                    src="https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/cropped-comsri_favicon_whitebg-modified-2-1.png"
                    alt="Logo"
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = document.getElementById('header-avatar-fallback');
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                  <span id="header-avatar-fallback" className="hidden text-indigo-600">
                    <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                  </span>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-indigo-600 rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-none flex items-center gap-1">
                    Comsri Assistant
                  </h3>
                  <span className="text-[11px] text-indigo-200">Online • Powered by Gemini AI</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Logic */}
            {!userDetails ? (
              /* Details Form screen */
              <div className="flex-grow flex flex-col justify-center p-6 bg-slate-50/50 dark:bg-slate-950/20 overflow-y-auto">
                <div className="text-center mb-6">
                  <h4 className="text-lg font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" /> Let's Connect
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Please fill in your details to start chatting with our AI assistant.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {formError && (
                    <div className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-900/50 px-3 py-2.5 rounded-xl">
                      {formError}
                    </div>
                  )}

                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Your Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/25 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/25 transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        type="tel"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/25 transition-all"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full mt-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold tracking-wide shadow-md hover:shadow-indigo-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Start Chatting
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              /* Active Chat screen */
              <>
                <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/20 scrollbar-none">
                  {messages.map((message, index) => {
                    const { cleanText, recommendations } = parseBotMessage(message.content);
                    const isAssistant = message.role === "assistant";

                    return (
                      <div
                        key={index}
                        className={`flex flex-col ${isAssistant ? "items-start" : "items-end"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${isAssistant
                            ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700/40 rounded-tl-none"
                            : "bg-indigo-600 text-white rounded-tr-none"
                            }`}
                        >
                          {renderMessageContent(cleanText)}
                        </div>
                        {recommendations.length > 0 && (
                          <div className="flex gap-3 overflow-x-auto w-full py-3 scrollbar-none scroll-smooth pr-4 mt-2">
                            {recommendations.map((rec) => renderProductCard(rec))}
                          </div>
                        )}
                        <span className="text-[9px] text-slate-400 mt-1 px-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="flex items-start">
                      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/40 rounded-2xl rounded-tl-none px-4 py-3 text-sm flex gap-1.5 items-center">
                        <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompt Chips */}
                {messages.length === 1 && (
                  <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 mb-2 font-semibold uppercase tracking-wider">Suggested Queries</p>
                    <div className="grid grid-cols-2 gap-2">
                      {quickPrompts.map((prompt, i) => {
                        const Icon = prompt.icon;
                        return (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(prompt.text)}
                            className="flex items-center text-[11px] text-left text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700/60 dark:hover:text-white border border-slate-100 dark:border-slate-700/50 rounded-xl p-2.5 transition-all duration-200 cursor-pointer shadow-sm"
                          >
                            <Icon className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-indigo-500" />
                            <span className="truncate">{prompt.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }}
                  className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-grow bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/25 transition-all placeholder-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
