import Link from "next/link";
import { Facebook, Instagram, Youtube, Play, Apple } from "lucide-react";

export default function BlogFooter() {
  return (
    <footer className="bg-[#fcb643] pt-16 pb-12 w-full relative">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col gap-12">
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
              {[
                { label: "Refurbished Desktops", path: "/shop?category=129" },
                { label: "Refurbished Laptops", path: "/shop?category=112" },
                { label: "Refurbished Workstations", path: "/shop?category=139" },
                { label: "Refurbished Macbooks", path: "/shop?category=112&search=Apple" },
                { label: "Refurbished Mini PCs", path: "/shop?category=137" }
              ].map((item, i) => (
                <Link key={i} href={item.path} className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item.label}</Link>
              ))}
            </div>
          </div>

          {/* New Products */}
          <div className="flex flex-col">
            <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">New Products</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: "New Laptops", path: "/shop?category=112&search=New" },
                { label: "New Desktops", path: "/shop?category=129&search=New" },
                { label: "New Macbooks", path: "/shop?category=112&search=Apple" },
                { label: "New All in One", path: "/shop?category=129&search=All%20in%20One" },
                { label: "New Mini PCs", path: "/shop?category=137&search=New" }
              ].map((item, i) => (
                <Link key={i} href={item.path} className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item.label}</Link>
              ))}
            </div>
          </div>

          {/* Useful Links */}
          <div className="flex flex-col">
            <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Useful Links</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: "Contact Us", path: "/contact" },
                { label: "Terms & Conditions", path: "/terms-conditions?tab=terms" },
                { label: "Privacy Policy", path: "/privacy-policy?tab=privacy" },
                { label: "Return & Refund Policy", path: "/return-refund?tab=refund" },
                { label: "Warranty Policy", path: "/privacy-policy?tab=warranty" },
                { label: "Shipping Policy", path: "/privacy-policy?tab=shipping" }
              ].map((item, i) => (
                <Link key={i} href={item.path} className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item.label}</Link>
              ))}
            </div>
          </div>

          {/* Available On & Social Links */}
          <div className="flex flex-col">
            <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Avalible On:</h3>
            <div className="flex flex-wrap xl:flex-nowrap gap-3 mb-8">
              <a href="#" className="bg-black text-white px-3 py-1.5 rounded-[6px] flex items-center gap-2 hover:bg-gray-800 transition-colors border border-black min-w-[130px] justify-center">
                <Play size={18} className="fill-white" />
                <div className="flex flex-col items-start justify-center">
                  <span className="text-[8px] font-medium leading-none mb-0.5">GET IT ON</span>
                  <span className="text-[13px] font-semibold leading-none tracking-tight">Google Play</span>
                </div>
              </a>
              <a href="#" className="bg-white text-black px-3 py-1.5 rounded-[6px] flex items-center gap-2 border border-black hover:bg-gray-50 transition-colors min-w-[130px] justify-center">
                <Apple size={20} className="fill-black" />
                <div className="flex flex-col items-start justify-center">
                  <span className="text-[8px] font-medium leading-none mb-0.5 mt-0.5">Download on the</span>
                  <span className="text-[13px] font-semibold leading-none tracking-tight">App Store</span>
                </div>
              </a>
            </div>

            <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Social links:</h3>
            <div className="flex gap-2">
              <a href="#" className="w-[32px] h-[32px] rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:bg-[#2b4170] transition-colors shadow-sm">
                <Facebook size={16} className="fill-white" strokeWidth={0} />
              </a>
              <a href="#" className="w-[32px] h-[32px] rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors shadow-sm">
                <span className="text-white font-bold text-[14px] italic pr-0.5 leading-none mt-0.5">X</span>
              </a>
              <a href="#" className="w-[32px] h-[32px] rounded-full bg-[#833ab4] text-[#833ab4] flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full"></div>
                <Instagram size={16} className="text-white relative z-10" />
              </a>
              <a href="#" className="w-[32px] h-[32px] rounded-full bg-[#ff0000] text-white flex items-center justify-center hover:bg-[#cc0000] transition-colors shadow-sm">
                <Youtube size={14} className="fill-white" strokeWidth={0} />
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter Banner */}
        <div className="bg-[#3452ef] rounded-[24px] px-8 md:px-12 py-10 flex flex-col lg:flex-row items-center justify-between gap-8 mt-2 w-full">
          <div className="flex flex-col text-white flex-1 text-center lg:text-left">
            <h2 className="text-[28px] md:text-[32px] font-bold mb-1.5 tracking-tight">Sign Up to us Newsletter</h2>
            <p className="text-[14px] text-white/90 font-medium">Be the First to Know. Sign up to newsletter today</p>
          </div>
          <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 items-center">
            <input
              type="email"
              placeholder="Your email address"
              className="px-6 py-3.5 rounded-full text-[14px] focus:outline-none font-medium h-[48px] text-black w-full min-w-[280px] md:w-[340px]"
            />
            <button className="bg-[#fcb643] hover:bg-[#fca61f] text-[#111] px-8 h-[48px] rounded-full font-bold text-[15px] transition-colors whitespace-nowrap shadow-sm">
              Sign Up
            </button>
          </div>
        </div>

        {/* Copyright & Payments */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-1 gap-4 w-full">
          <p className="text-[14px] font-bold text-[#111]">Copyright 2026 by Comsri Corporation All Right Reserved.</p>
          <div className="flex gap-1.5">
            <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
              <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/mastercard.svg" className="h-full object-contain" alt="Mastercard" />
            </div>
            <div className="bg-[#1a1f71] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
              <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/visa.svg" className="h-[70%] object-contain mt-[0.5px]" alt="Visa" />
            </div>
            <div className="bg-[#003087] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
              <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/paypal.svg" className="h-[55%] object-contain" alt="PayPal" />
            </div>
            <div className="bg-[#2d9cdb] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
              <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/amex.svg" className="h-[75%] object-contain" alt="Amex" />
            </div>
            <div className="bg-[#6772e5] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
              <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/stripe.svg" className="h-[50%] object-contain" alt="Stripe" />
            </div>
            <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
              <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/google-pay.svg" className="h-[55%] object-contain" alt="Google Pay" />
            </div>
            <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1 border border-gray-700">
              <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/apple-pay.svg" className="h-[60%] object-contain" alt="Apple Pay" />
            </div>
            <div className="bg-[#004b87] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
              <img loading="lazy" src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@latest/dist/unionpay.svg" className="h-[70%] object-contain" alt="UnionPay" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
