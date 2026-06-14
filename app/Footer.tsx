"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#fcb643] pt-10 md:pt-16 pb-8 md:pb-12 w-full relative">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12 flex flex-col gap-8 md:gap-12">

        {/* Top Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 justify-between">
          {/* Address */}
          <div className="flex flex-col pr-4">
            <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Address</h3>
            <p className="text-[14px] font-semibold text-[#2d2d2d] leading-relaxed mb-6">
              Office No.-T-15 Pinnacle Business Park MC Rd Shanti Nagar Andheri East Mumbai Maharastra – 400093
            </p>
            <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Contact Us</h3>
            <p className="text-[14px] font-semibold text-[#2d2d2d] mb-1.5">+91 8601-899-899</p>
            <p className="text-[14px] font-semibold text-[#2d2d2d]">Email: info@comsri.com</p>
          </div>

          {/* Refurbished Products */}
          <div className="flex flex-col">
            <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Refurbished Products</h3>
            <div className="flex flex-col gap-3">
              {["Refurbished Desktops", "Refurbished Laptops", "Refurbished Workstations", "Refurbished Macbooks", "Refurbished Mini PCs"].map((item, i) => (
                <Link key={i} href="/shop" className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#121e42] transition-colors">{item}</Link>
              ))}
            </div>
          </div>

          {/* Useful Links */}
          <div className="flex flex-col">
            <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Useful Links</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: "Terms & Conditions", path: "/terms-conditions?tab=terms" },
                { label: "Privacy Policy", path: "/privacy-policy?tab=privacy" },
                { label: "Return & Refund Policy", path: "/return-refund?tab=refund" },
                { label: "Warranty Policy", path: "/privacy-policy?tab=warranty" },
                { label: "Shipping Policy", path: "/privacy-policy?tab=shipping" }
              ].map((item, i) => (
                <Link key={i} href={item.path} className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#121e42] transition-colors">{item.label}</Link>
              ))}
            </div>
          </div>

          {/* Get to Know Us */}
          <div className="flex flex-col">
            <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Get to Know Us</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: "About Us", path: "/about-us" },
                { label: "FAQS", path: "/faq" },
                { label: "Contact Us", path: "/contact" },
                { label: "Blogs", path: "/blog" },
                { label: "Bulk Orders", path: "/bulk-orders" },
              ].map((item, i) => (
                <Link key={i} href={item.path} className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#121e42] transition-colors">{item.label}</Link>
              ))}
            </div>
          </div>

          {/* Available On & Social Links */}
          <div className="flex flex-col">
            <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Available On:</h3>
            <div className="flex flex-wrap xl:flex-nowrap gap-3 mb-8 items-center">
              <a href="#" className="inline-block transition-transform hover:scale-[1.02] active:scale-95">
                <Image src="/google-play-badge.svg" alt="Get it on Google Play" width={142} height={42} className="h-[42px] w-auto" />
              </a>
              <a href="#" className="inline-block transition-transform hover:scale-[1.02] active:scale-95 border border-black rounded-[6px]">
                <Image src="/app-store-badge.svg" alt="Download on the App Store" width={135} height={40} className="h-[40px] w-auto block" />
              </a>
            </div>

            <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Social links:</h3>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/comsri.store" aria-label="Facebook" className="w-[36px] h-[36px] rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-sm">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" /></svg>
              </a>
              <a href="https://twitter.com/comsricorp" aria-label="Twitter (X)" className="w-[36px] h-[36px] rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-sm">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="https://www.instagram.com/comsricorporation/" aria-label="Instagram" className="w-[36px] h-[36px] rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-sm">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </a>
              <a href="https://www.youtube.com/@ComsriCorporation" aria-label="YouTube" className="w-[36px] h-[36px] rounded-full bg-[#ff0000] text-white flex items-center justify-center hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-sm">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.002 3.002 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter Banner */}
        <div className="bg-[#3452ef] rounded-[16px] md:rounded-[24px] px-5 md:px-8 lg:px-12 py-8 md:py-10 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 mt-2 w-full">
          <div className="flex flex-col text-white flex-1 text-center lg:text-left">
            <h2 className="text-[22px] sm:text-[28px] md:text-[32px] font-bold mb-1.5 tracking-tight">Sign Up to our Newsletter</h2>
            <p className="text-[14px] text-white/90 font-medium">Be the First to Know. Sign up to our newsletter today</p>
          </div>
          <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 items-center">
            <input
              type="email"
              placeholder="Your email address"
              className="px-5 md:px-6 py-3 md:py-3.5 rounded-full text-[14px] focus:outline-none font-medium h-[44px] md:h-[48px] text-black bg-white w-full min-w-0 md:min-w-[280px] md:w-[340px]"
            />
            <button className="bg-[#fcb643] hover:bg-[#fca61f] text-[#111] px-6 md:px-8 h-[44px] md:h-[48px] rounded-full font-bold text-[14px] md:text-[15px] transition-colors whitespace-nowrap shadow-sm w-full sm:w-auto">
              Sign Up
            </button>
          </div>
        </div>

        {/* Copyright & Payments */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-1 gap-4 w-full">
          <p className="text-[14px] font-medium text-[#111]">Copyright 2026 by Comsri Corporation All Rights Reserved.</p>
          <div className="flex gap-1.5">
            <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
              <img loading="lazy" src="https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/Mastercard_2019_logo.svg" className="h-full object-contain" alt="Mastercard" />
            </div>
            <div className="bg-[#1a1f71] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
              <img loading="lazy" src="https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/Visa_White.png" className="h-[70%] object-contain mt-[0.5px]" alt="Visa" />
            </div>
            <div className="bg-[#003087] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
              <img loading="lazy" src="https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/Paypal-logo-white.svg.png" className="h-[55%] object-contain" alt="PayPal" />
            </div>
            <div className="bg-[#2d9cdb] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
              <img loading="lazy" src="https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/1685814419stripe-logo-white.png" className="h-[75%] object-contain" alt="Amex" />
            </div>
            <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
              <img loading="lazy" src="https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/Google_Pay_Logo.svg.webp" className="h-[55%] object-contain" alt="Google Pay" />
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
