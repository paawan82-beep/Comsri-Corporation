"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Apple, Play, Facebook, Instagram, Youtube, MessageCircle, ShieldCheck, Package } from "lucide-react";
import Header from "../Header";

const reviews = [
  {
    name: "Rahul Sharma",
    city: "MUMBAI",
    product: "BOUGHT: MACBOOK AIR M1",
    text: `"I purchased a refurbished laptop from Comsri Corporation and the experience was excellent. The laptop quality was as promised, pricing was transparent, and delivery was on time."`,
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Priya Verma",
    city: "NEW DELHI",
    product: "BOUGHT: DELL XPS 15",
    text: `"Very satisfied with Comsri Corporation. The laptop arrived well packed, fully tested, and with proper warranty support. Great option for students and working professionals looking for reliable computers online."`,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Suresh Yadav",
    city: "PUNE",
    product: "BOUGHT: THINKPAD T14",
    text: `"Comsri Corporation is a dependable place to buy refurbished laptops and desktops. The ordering process was simple, packaging was secure, and the product quality met my expectations."`,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Amit Patel",
    city: "HYDERABAD",
    product: "BOUGHT: HP ELITEBOOK",
    text: `"Comsri Corporation is the best place to buy refurbished laptops in India. Genuine products, reasonable pricing, and smooth ordering process. I would definitely recommend them."`,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Neha Kulkarni",
    city: "BANGALORE",
    product: "BOUGHT: MAC MINI M2",
    text: `"We ordered desktops for office use from Comsri Corporation. Professional service, timely delivery, and responsive customer support. A dependable IT hardware supplier for businesses."`,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Rakesh Singh",
    city: "CHENNAI",
    product: "BOUGHT: LENOVO IDEAPAD",
    text: `"Good quality laptop, secure packaging, and prompt delivery. Comsri ensures quality checks and provides trustworthy after-sales support. Highly recommended."`,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150"
  }
];

const ReviewCard = ({ review }: { review: typeof reviews[0] }) => (
  <div className="bg-white p-7 rounded-[24px] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col gap-4 w-[340px] md:w-[380px] shrink-0">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <img loading="lazy" src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
        <div className="flex flex-col">
          <span className="font-bold text-[#111] text-[15px] leading-tight">{review.name}</span>
          <span className="text-[#3452ef] font-bold text-[11px] uppercase tracking-wider">{review.city}</span>
        </div>
      </div>
      <div className="flex gap-[2px] bg-gray-50 px-2 py-1.5 rounded-md">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-3.5 h-3.5 fill-[#faba5b] text-[#faba5b]" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        ))}
      </div>
    </div>
    <div>
      <span className="bg-[#fcb643] text-[#111] text-[10px] font-bold py-1 px-3 rounded-full uppercase tracking-wide">
        {review.product}
      </span>
    </div>
    <p className="text-[14px] text-gray-600 font-medium italic leading-relaxed flex-1">
      {review.text}
    </p>
    <div className="flex items-center gap-1.5 mt-2">
      <ShieldCheck size={16} className="text-[#138808]" />
      <span className="text-[#138808] font-bold text-[11px] tracking-wide">VERIFIED SALE</span>
    </div>
  </div>
);

const faqs = [
  { q: "What does Comsri Corporation do?", a: "Comsri Corporation is an Indian technology company that provides new and refurbished laptops, desktops, workstations, and mini PCs for personal, professional, and business use." },
  { q: "What products does Comsri Corporation offer?", a: "Comsri Corporation offers new and refurbished laptops, desktops, workstations, and mini PCs designed to meet everyday computing and business requirements." },
  { q: "Are refurbished computers from Comsri Corporation safe to use?", a: "Yes. All refurbished computers from Comsri Corporation are tested, inspected, and quality-checked to ensure reliable performance and safe usage." },
  { q: "Does Comsri Corporation sell brand-new computers?", a: "Yes. Comsri Corporation sells both brand-new and refurbished computers, allowing customers to choose based on budget and performance needs." },
  { q: "Who can buy from Comsri Corporation?", a: "Anyone can buy from Comsri Corporation, including students, professionals, startups, small businesses, and corporate organizations across India." },
  { q: "Does Comsri Corporation provide customer support?", a: "Yes. Comsri Corporation provides 24/7 customer support to assist with product selection, order queries, and post-purchase assistance." },
  { q: "Does Comsri Corporation deliver across India?", a: "Yes. Comsri Corporation offers fast and free delivery across India with secure packaging to ensure safe arrival of products." },
  { q: "Why should I choose Comsri Corporation?", a: "Comsri Corporation is chosen for its quality-tested products, transparent pricing, reliable support, and focus on affordable and responsible computing solutions." },
  { q: "Is buying refurbished computers better for the environment?", a: "Yes. Buying refurbished computers helps reduce electronic waste and supports sustainable and responsible technology use." },
  { q: "Does Comsri Corporation support bulk or multiple orders?", a: "Yes. Comsri Corporation supports single and multiple-unit orders, making it suitable for individual and organizational requirements." }
];

const FAQItem = ({ faq, isOpen, onToggle }: { faq: typeof faqs[0], isOpen: boolean, onToggle: () => void }) => (
  <div className={`bg-white rounded-[16px] border ${isOpen ? 'border-[#3452ef]/30 shadow-md' : 'border-gray-100 shadow-sm'} overflow-hidden transition-all duration-300`}>
    <button 
      onClick={onToggle}
      className="w-full text-left px-6 lg:px-8 py-5 flex items-center justify-between focus:outline-none group"
    >
      <span className={`text-[16px] md:text-[18px] font-bold pr-8 ${isOpen ? 'text-[#3452ef]' : 'text-[#111] group-hover:text-[#3452ef]'} transition-colors`}>{faq.q}</span>
      <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${isOpen ? 'bg-[#3452ef] text-white' : 'bg-[#f6f5f8] text-[#111] group-hover:bg-[#e9edff] group-hover:text-[#3452ef]'}`}>
        <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </span>
    </button>
    <div
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">
        <div className="px-6 lg:px-8 pb-6 pt-0 text-[15.5px] text-gray-600 font-medium leading-relaxed">
          {faq.a}
        </div>
      </div>
    </div>
  </div>
);

export default function AboutClient() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#f6f5f8] flex flex-col font-sans">
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full bg-[#f6f5f8]">
        {/* Breadcrumb Header */}
        <div className="bg-[#f2ece4] w-full py-2.5">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-start gap-4">
            <span className="text-[28px] font-medium text-[#111] tracking-tight">About us</span>
            <p className="text-[15px] text-[#777] font-medium mt-1">Home <span className="mx-1.5 text-gray-400">/</span> <span className="text-[#111] font-bold">About us</span></p>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-8 pb-16">
          {/* Section 1: About & Mission (Split Layout) */}
          <div className="flex flex-col lg:flex-row w-full rounded-[24px] shadow-sm mb-20">
            {/* Left Image */}
            <div className="w-full lg:w-1/2 relative bg-gray-100 min-h-[400px] lg:min-h-[auto] rounded-t-[24px] lg:rounded-tr-none lg:rounded-l-[24px] overflow-hidden">
              <Image 
                src="https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/Comsri-Office-Reception-1.jpeg" 
                alt="Comsri Corporation Office" 
                fill 
                referrerPolicy="no-referrer"
                className="object-cover" 
              />
            </div>
            
            {/* Right Content */}
            <div className="w-full lg:w-1/2 bg-[#3452ef] p-10 lg:p-14 xl:p-16 flex flex-col gap-5 text-white rounded-b-[24px] lg:rounded-bl-none lg:rounded-r-[24px]">
              <h1 className="text-[28px] md:text-[34px] font-medium tracking-tight mb-2 leading-tight">About Comsri Corporation — Trusted Online Store for Refurbished Computers</h1>
              
              <p className="text-[14px] md:text-[15px] font-medium leading-relaxed text-white/95">
                Founded in 2020, Comsri Corporation was established with a vision to make reliable, affordable, and high-performance computing accessible across India. Over the years, we have grown into a trusted online store for refurbished computers in India, serving individuals, professionals, startups, educational institutions, resellers, and businesses with dependable IT hardware solutions.
              </p>
              
              <p className="text-[14px] md:text-[15px] font-medium leading-relaxed text-white/95">
                Comsri Corporation specializes in new and refurbished laptops, desktops, workstations, and mini PCs sourced from leading global brands. Every device undergoes rigorous testing, quality control, and performance verification to ensure reliability, durability, and long-term value. Our commitment to quality has positioned us as a trusted destination for refurbished laptops and desktops in India, helping customers access business-grade technology at cost-effective prices.
              </p>
              
              <p className="text-[14px] md:text-[15px] font-medium leading-relaxed text-white/95">
                Beyond retail sales, we support bulk orders for organizations, resellers, and enterprises seeking scalable IT procurement solutions. Whether you need refurbished laptops for employees, desktops for educational institutions, workstations for professional workloads, or mini PCs for compact deployments, Comsri Corporation delivers quality-tested systems backed by responsive customer support and transparent service standards.
              </p>

              <h3 className="text-[22px] md:text-[24px] font-bold tracking-tight mt-3">Our Mission</h3>
              
              <p className="text-[14px] md:text-[15px] font-medium leading-relaxed text-white/95">
                At <strong>Comsri Corporation</strong>, our mission is to make reliable and high-performance computing accessible to everyone. We aim to provide quality new and refurbished laptops, desktops, workstations, and mini PCs that meet real-world business, professional, and personal needs—without unnecessary cost or compromise.
              </p>
            </div>
          </div>

        {/* Support Section Split Layout */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center mb-24">
            {/* Left Image */}
            <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-[500px] rounded-[32px] overflow-hidden shadow-sm">
              <Image 
                src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=1200" 
                alt="Support Agent" 
                fill 
                referrerPolicy="no-referrer"
                className="object-cover" 
              />
            </div>
            
            {/* Right Content */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <div className="w-16 h-16 relative mb-2">
                <div className="w-full h-full bg-[#ffb03a] rounded-full flex items-center justify-center">
                  <div className="w-10 h-10 bg-[#111] rounded-full border-2 border-white flex items-center justify-center relative">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-1 right-2 text-[#ffb03a] rotate-[30deg]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-[36px] md:text-[42px] font-bold text-[#111] tracking-tight leading-tight">High-quality Support 24/7</h2>
              <p className="text-[15.5px] text-gray-600 leading-relaxed font-medium lg:w-[90%]">
                At <strong>Comsri Corporation</strong>, customer support doesn’t end after a purchase. Our dedicated support team is available <strong>24/7</strong> via chat to assist you with product guidance, order queries, technical support, and post-sales assistance. We believe reliable service is just as important as reliable technology.
              </p>
              <p className="text-[15.5px] text-gray-600 leading-relaxed font-medium lg:w-[90%]">
                Whether you’re buying a new system or a refurbished device, our experts are always ready to help—ensuring a smooth, transparent, and hassle-free experience at every step.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 mt-4">
                <div className="flex -space-x-3">
                  <img loading="lazy" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150" alt="Avatar 1" className="w-[46px] h-[46px] rounded-full border-2 border-[#fcf9f4] object-cover" />
                  <img loading="lazy" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150" alt="Avatar 2" className="w-[46px] h-[46px] rounded-full border-2 border-[#fcf9f4] object-cover" />
                  <img loading="lazy" src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150&h=150" alt="Avatar 3" className="w-[46px] h-[46px] rounded-full border-2 border-[#fcf9f4] object-cover" />
                </div>
                <button className="bg-[#3452ef] text-white px-7 py-3 rounded-full text-[15px] font-bold hover:bg-[#263ec4] transition-colors shadow-sm">Contact With An Expert</button>
              </div>
            </div>
        </div>

        {/* Fast, Free Delivery Section */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center mb-24">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <div className="w-16 h-16 relative mb-2">
                 <div className="w-14 h-14 bg-[#faba5b]/20 rounded-[14px] flex items-center justify-center text-[#faba5b]">
                    <Package size={28} strokeWidth={2} />
                 </div>
              </div>
              <h2 className="text-[36px] md:text-[42px] font-bold text-[#111] tracking-tight leading-tight">Fast, Free Delivery</h2>
              <p className="text-[15.5px] text-gray-600 leading-relaxed font-medium lg:w-[95%]">
                At <strong>Comsri Corporation</strong>, we ensure fast and free delivery across India so you receive your technology without delay or extra cost. Every order is securely packed and shipped through reliable logistics partners to ensure safe and timely doorstep delivery.
              </p>
              <p className="text-[15.5px] text-gray-600 leading-relaxed font-medium lg:w-[95%]">
                Our streamlined fulfillment process helps customers get their new or refurbished laptops, desktops, workstations, and mini PCs quickly—so you can stay productive without waiting.
              </p>
            </div>
            
            {/* Right Image */}
            <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-[500px] rounded-[32px] overflow-hidden shadow-sm">
              <Image 
                src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=1200" 
                alt="Delivery Boxes" 
                fill 
                referrerPolicy="no-referrer"
                className="object-cover" 
              />
            </div>
        </div>

        {/* Low Prices, High Quality Section */}
        <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-16 items-center mb-24">
            {/* Right Content */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <div className="w-16 h-16 relative mb-2">
                 <div className="w-14 h-14 bg-[#3452ef]/10 rounded-[14px] flex items-center justify-center text-[#3452ef]">
                    <ShieldCheck size={28} strokeWidth={2} />
                 </div>
              </div>
              <h2 className="text-[36px] md:text-[42px] font-bold text-[#111] tracking-tight leading-tight">Low Prices, High Quality</h2>
              <p className="text-[15.5px] text-gray-600 leading-relaxed font-medium lg:w-[95%]">
                At <strong>Comsri Corporation</strong>, we believe affordability should never come at the cost of quality. Our new and refurbished laptops, desktops, workstations, and mini PCs are carefully sourced, thoroughly tested, and competitively priced to deliver exceptional value.
              </p>
              <p className="text-[15.5px] text-gray-600 leading-relaxed font-medium lg:w-[95%]">
                By maintaining transparent pricing and strict quality standards, we help customers access dependable technology that performs reliably—without overpaying.
              </p>
            </div>
            
            {/* Left Image */}
            <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-[500px] rounded-[32px] overflow-hidden shadow-sm">
              <Image 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" 
                alt="Quality Assurance" 
                fill 
                referrerPolicy="no-referrer"
                className="object-cover" 
              />
            </div>
        </div>

        {/* Customer Reviews */}
        <div className="mb-24 w-full relative">
          <h2 className="text-[28px] font-bold text-[#111] tracking-tight text-center mb-12">Reviews of Our Customers</h2>
          
          <div className="overflow-hidden w-full relative pb-4">
            {/* Left & Right gradient fades */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/12 md:w-1/6 bg-gradient-to-r from-[#f6f5f8] to-transparent z-10"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/12 md:w-1/6 bg-gradient-to-l from-[#f6f5f8] to-transparent z-10"></div>

            {/* Row 1 (Moves Left) */}
            <div className="flex w-max animate-marquee gap-6 mb-6">
              {[...reviews, ...reviews, ...reviews, ...reviews].map((r, i) => (
                <ReviewCard key={`r1-${i}`} review={r} />
              ))}
            </div>
            {/* Row 2 (Moves Right) */}
            <div className="flex w-max animate-marquee-reverse gap-6">
              {[...reviews.slice().reverse(), ...reviews.slice().reverse(), ...reviews.slice().reverse(), ...reviews.slice().reverse()].map((r, i) => (
                <ReviewCard key={`r2-${i}`} review={r} />
              ))}
            </div>
          </div>
        </div>
        </div>

        {/* FAQs */}
        <div className="w-full bg-[#f6ede4] py-20 mt-10">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-14">
              <span className="bg-white/60 text-[#3452ef] text-[13px] font-bold py-1.5 px-4 rounded-full uppercase tracking-wider mb-4 inline-block shadow-sm">Support</span>
              <h2 className="text-[36px] md:text-[42px] font-bold text-[#111] tracking-tight">Frequently Asked Questions</h2>
            </div>
            <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto px-4 md:px-0">
              {faqs.map((faq, index) => (
                <FAQItem 
                  key={index} 
                  faq={faq} 
                  isOpen={openFaqIndex === index} 
                  onToggle={() => setOpenFaqIndex(openFaqIndex === index ? null : index)} 
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Section */}
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
                {["Refurbished Desktops", "Refurbished Laptops", "Refurbished Workstations", "Refurbished Macbooks", "Refurbished Mini PCs"].map((item, i) => (
                  <a key={i} href="#" className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item}</a>
                ))}
              </div>
            </div>

            {/* New Products */}
            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">New Products</h3>
              <div className="flex flex-col gap-3">
                {["New Laptops", "New Desktops", "New Macbooks", "New All in One", "New Mini PCs"].map((item, i) => (
                  <a key={i} href="#" className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item}</a>
                ))}
              </div>
            </div>

            {/* Useful Links */}
            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Useful Links</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Contact Us", path: "/about" },
                  { label: "Terms & Conditions", path: "/terms-conditions?tab=terms" },
                  { label: "Privacy Policy", path: "/privacy-policy?tab=privacy" },
                  { label: "Return & Refund Policy", path: "/return-refund?tab=refund" },
                  { label: "Warranty Policy", path: "/privacy-policy?tab=warranty" },
                  { label: "Shipping Policy", path: "/privacy-policy?tab=shipping" }
                ].map((item, i) => (
                  <a key={i} href={item.path} className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item.label}</a>
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
                <img loading="lazy" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-full object-contain" alt="Mastercard" />
              </div>
              <div className="bg-[#1a1f71] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-[75%] object-contain mt-[1px]" alt="Visa" />
              </div>
              <div className="bg-[#003087] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png" className="h-[12px] object-contain" alt="PayPal" />
              </div>
              <div className="bg-[#2d9cdb] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" className="h-[80%] object-contain" alt="Amex" />
              </div>
              <div className="bg-[#6772e5] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png" className="h-[14px] object-contain invert hue-rotate-[180deg] brightness-200" alt="Stripe" />
              </div>
              <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center px-1">
                <span className="text-white text-[10px]">G</span><span className="text-white text-[12px] font-bold">Pay</span>
              </div>
              <div className="bg-black w-[42px] h-[28px] rounded-[4px] flex items-center justify-center px-1 border border-gray-700">
                <Apple size={14} className="fill-white text-white mr-0.5" /><span className="text-white text-[10px] font-semibold mt-[1px]">Pay</span>
              </div>
              <div className="bg-[#004b87] w-[42px] h-[28px] rounded-[4px] flex items-center justify-center p-1">
                <img loading="lazy" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/UnionPay_logo.svg/1280px-UnionPay_logo.svg.png" className="h-[80%] object-contain" alt="UnionPay" />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Chat Icon placeholder */}
        <div className="absolute right-6 bottom-6 w-14 h-14 bg-[#3452ef] rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform z-50">
          <MessageCircle size={28} className="text-white fill-white" />
        </div>
      </footer>
    </div>
  );
}
