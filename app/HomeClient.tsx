"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, ArrowUpRight, MessageCircle, Instagram, Facebook, Youtube, Play, Apple } from "lucide-react";
import Header from "./Header";
import ProductCard from "./shop/ProductCard";

interface HomeClientProps {
  initialLaptops?: any[];
  initialDesktops?: any[];
}

export default function HomeClient({ initialLaptops = [], initialDesktops = [] }: HomeClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // States to fetch real WooCommerce products dynamically, initialized with server-rendered props
  const [laptops, setLaptops] = useState<any[]>(initialLaptops);
  const [desktops, setDesktops] = useState<any[]>(initialDesktops);

  const laptopSliderRef = useRef<HTMLDivElement>(null);
  const desktopSliderRef = useRef<HTMLDivElement>(null);
  const blogSliderRef = useRef<HTMLDivElement>(null);

  const [laptopScroll, setLaptopScroll] = useState({ left: 0, width: 20 });
  const [desktopScroll, setDesktopScroll] = useState({ left: 0, width: 20 });
  const [blogScroll, setBlogScroll] = useState({ left: 0, width: 20 });

  const updateScroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    setScroll: React.Dispatch<React.SetStateAction<{ left: number; width: number }>>
  ) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      if (scrollWidth > 0) {
        const width = (clientWidth / scrollWidth) * 100;
        const left = (scrollLeft / scrollWidth) * 100;
        setScroll({ left, width });
      }
    }
  };

  const handleTrackClick = (
    e: React.MouseEvent<HTMLDivElement>,
    ref: React.RefObject<HTMLDivElement | null>
  ) => {
    if (ref.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const targetScroll = percentage * ref.current.scrollWidth - ref.current.clientWidth / 2;
      ref.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    async function loadProducts() {
      try {
        const [laptopsRes, desktopsRes] = await Promise.all([
          fetch("/api/products?category=112&per_page=15").then((r) => r.json()),
          fetch("/api/products?category=129&per_page=15").then((r) => r.json())
        ]);
        if (laptopsRes && laptopsRes.data) {
          setLaptops(laptopsRes.data);
        }
        if (desktopsRes && desktopsRes.data) {
          setDesktops(desktopsRes.data);
        }
      } catch (err) {
        console.error("Failed to load products on homepage:", err);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    updateScroll(laptopSliderRef, setLaptopScroll);
    updateScroll(desktopSliderRef, setDesktopScroll);
    updateScroll(blogSliderRef, setBlogScroll);
  }, [laptops, desktops]);

  useEffect(() => {
    const handleResize = () => {
      updateScroll(laptopSliderRef, setLaptopScroll);
      updateScroll(desktopSliderRef, setDesktopScroll);
      updateScroll(blogSliderRef, setBlogScroll);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [laptops, desktops]);

  const slides = [
    "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/Comsri-Banner%202.png",
    "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/Apple-Macbook-sale-Banner.jpg",
    "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/comsri_banner%20(2).png",
    "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/Happy-Custommer-Banner-scaled%20(1).png"
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-[#f6f5f8] flex flex-col font-sans">
      <Header />

      {/* Hero Section */}
      <main className="relative bg-gray-200 overflow-hidden w-full">
        {/* Slider Images */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 relative z-10' : 'opacity-0 absolute inset-0 z-0'}`}
          >
            <Image
              src={slide}
              alt={`Slide ${index + 1}`}
              width={1920}
              height={686}
              sizes="100vw"
              priority={index === 0}
              className="w-full h-auto object-contain block"
            />
          </div>
        ))}

        {/* Left and Right Nav Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white z-30 transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-800 md:hidden" />
          <ChevronLeft size={24} className="text-gray-800 hidden md:block" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white z-30 transition-colors"
        >
          <ChevronRight size={20} className="text-gray-800 md:hidden" />
          <ChevronRight size={24} className="text-gray-800 hidden md:block" />
        </button>

        {/* Banner with a gear icon on the right edge */}
        <div className="absolute right-0 top-1/3 bg-gray-800 text-yellow-400 p-2 rounded-l-md z-30 cursor-pointer shadow-lg blur-[0.5px] hidden md:block">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </div>
      </main>

      {/* Shop By Categories Section */}
      <section className="max-w-[1600px] mx-auto bg-[#f6f5f8] py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-12 w-full">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[20px] md:text-[24px] lg:text-[28px] font-extrabold text-[#2d2d2d] tracking-tight">Shop By Categories</h2>
            {/* Nav Circle Placeholder */}
            <div className="w-10 h-10 rounded-full bg-[#f0f0f0] flex items-center justify-center cursor-pointer hover:bg-[#e0e0e0] transition-colors"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Refurbished Laptops",
                bgImage: "https://comsri.com/wp-content/uploads/al_opt_content/IMAGE/comsri.com/wp-content/uploads/2025/10/510uTHyDqGL-removebg-preview-1.png.bv_resized_desktop.png.bv.webp?bv_host=comsri.com",
                link: "/categories/buy-refurbished-laptops-online-in-india"
              },
              {
                title: "Refurbished Desktops",
                bgImage: "https://comsri.com/wp-content/uploads/al_opt_content/IMAGE/comsri.com/wp-content/uploads/2025/10/32-removebg-preview-1.png.bv.webp?bv_host=comsri.com",
                link: "/categories/buy-high-quality-refurbished-desktops"
              },
              {
                title: "Refurbished Workstations",
                bgImage: "https://comsri.com/wp-content/uploads/al_opt_content/IMAGE/comsri.com/wp-content/uploads/2025/10/z6_g5_v3_2x-removebg-preview-1.png.bv.webp?bv_host=comsri.com",
                link: "/categories/buy-refurbished-workstations-online-in-india"
              },
              {
                title: "Refurbished Mini PCs",
                bgImage: "https://comsri.com/wp-content/uploads/al_opt_content/IMAGE/comsri.com/wp-content/uploads/2025/10/7040-micro-1-removebg-preview-1.png.bv.webp?bv_host=comsri.com",
                link: "/categories/buy-refurbished-mini-pcs-online-in-india"
              }
            ].map((cat, idx) => (
              <Link
                key={idx}
                href={cat.link}
                className="relative rounded-[16px] md:rounded-[20px] overflow-hidden cursor-pointer group pt-6 px-5 h-[380px] sm:h-[260px] md:h-[300px] lg:h-[340px] flex flex-col items-start bg-[#fac656] shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <div
                  className="absolute inset-0 opacity-100 z-0 bg-no-repeat pointer-events-none transform transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('${cat.bgImage}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />

                <h3 className="relative z-10 text-[18px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-bold text-[#1f2937] text-left tracking-tight px-1">
                  {cat.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products & Promo Banners */}
      <section className="max-w-[1600px] mx-auto bg-[#f6f5f8] pb-8 md:pb-12 lg:pb-16 px-4 md:px-6 lg:px-12 w-full">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-6">

          {/* Top Row: 2 items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-auto">
            {/* Refurbished Mini PCs */}
            <Link href="/categories/buy-refurbished-mini-pcs-online-in-india" className="relative rounded-[16px] md:rounded-[24px] overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 h-[180px] sm:h-[220px] md:h-[350px]">
              <Image src="https://comsri.com/wp-content/uploads/2025/10/mini-pc-showcase-1.jpg" alt="New Mini PCs" fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>
              <div className="absolute inset-0 p-5 md:p-8 lg:p-12 flex flex-col justify-center items-start text-white">
                <h3 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-1 md:mb-2 drop-shadow-md tracking-tight transform transition-transform duration-500 group-hover:-translate-y-2">Refurbished Mini PCs</h3>
                <p className="text-xs sm:text-sm text-slate-200 mb-3 md:mb-5 max-w-[80%] leading-relaxed drop-shadow-sm transform transition-transform duration-500 group-hover:-translate-y-2">
                  Starting from ₹10,499 – Ultra-Compact, Space-Saving Corporate Powerhouses.
                </p>
                <div className="flex items-center gap-2 text-sm md:text-base lg:text-lg font-bold transform transition-transform duration-500 group-hover:-translate-y-2">
                  <span className="border-b-2 border-transparent group-hover:border-white pb-0.5 transition-colors duration-300">Shop Now</span>
                  <ArrowRight size={18} className="transform -translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
              </div>
            </Link>

            {/* Refurbished Workstations */}
            <Link href="/categories/buy-refurbished-workstations-online-in-india" className="relative rounded-[16px] md:rounded-[24px] overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 h-[180px] sm:h-[220px] md:h-[350px]">
              <Image src="https://comsri.com/wp-content/uploads/2025/10/dark-desk-setup-img.jpg-1.webp" alt="New All-In-One PCs" fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>
              <div className="absolute inset-0 p-5 md:p-8 lg:p-12 flex flex-col justify-center items-start text-white">
                <h3 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-1 md:mb-2 max-w-[70%] leading-tight drop-shadow-md tracking-tight transform transition-transform duration-500 group-hover:-translate-y-2">Refurbished Workstations</h3>
                <p className="text-xs sm:text-sm text-slate-200 mb-3 md:mb-5 max-w-[70%] leading-relaxed drop-shadow-sm transform transition-transform duration-500 group-hover:-translate-y-2">
                  Starting from ₹48,499 – Heavy-Duty Performance Built for Complex Business Tasks.
                </p>
                <div className="flex items-center gap-2 text-sm md:text-base lg:text-lg font-bold transform transition-transform duration-500 group-hover:-translate-y-2">
                  <span className="border-b-2 border-transparent group-hover:border-white pb-0.5 transition-colors duration-300">Shop Now</span>
                  <ArrowRight size={18} className="transform -translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
              </div>
            </Link>
          </div>

          {/* Bottom Row: 3 items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-auto md:h-[450px]">
            {/* Refurbished Desktops */}
            <Link href="/categories/buy-high-quality-refurbished-desktops" className="bg-[#529b71] rounded-[16px] md:rounded-[24px] overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col min-h-[280px] md:min-h-0">
              <div className="h-[65%] relative overflow-hidden">
                <Image src="https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/Desktop-Showcase.png" alt="New Desktops" fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
              </div>
              <div className="flex-1 p-8 flex flex-col justify-end items-start text-white relative">
                <div className="absolute inset-0 bg-white/0 transition-colors duration-500 group-hover:bg-white/10 pointer-events-none"></div>
                <h3 className="text-2xl md:text-3xl font-bold mb-1 tracking-tight transform transition-transform duration-500 group-hover:-translate-y-1 relative z-10">Refurbished Desktops</h3>
                <p className="text-xs text-emerald-100 mb-3 leading-relaxed transform transition-transform duration-500 group-hover:-translate-y-1 relative z-10">
                  Starting from ₹10,499 – Reliable & Scalable Desktop Systems for Offices and Classrooms.
                </p>
                <div className="flex items-center gap-2 text-base font-bold transform transition-transform duration-500 group-hover:-translate-y-1 relative z-10">
                  <span className="border-b-2 border-transparent group-hover:border-white pb-0.5 transition-colors duration-300">Shop Now</span>
                  <ArrowRight size={18} className="transform -translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
              </div>
            </Link>

            {/* Refurbished Laptops */}
            <Link href="/categories/buy-refurbished-laptops-online-in-india" className="relative rounded-[16px] md:rounded-[24px] overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 min-h-[250px] md:min-h-0 md:h-full">
              <Image src="https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/Laptop-Showcase.webp" alt="New Laptops" fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end items-start text-white">
                <h3 className="text-2xl md:text-4xl font-bold mb-1 drop-shadow-md tracking-tight transform transition-transform duration-500 group-hover:-translate-y-1">Refurbished Laptops</h3>
                <p className="text-xs sm:text-sm text-slate-200 mb-3 leading-relaxed drop-shadow-sm transform transition-transform duration-500 group-hover:-translate-y-1">
                  Starting from ₹14,499 – Premium business notebooks certified for productivity on the go.
                </p>
                <div className="flex items-center gap-2 text-base font-bold transform transition-transform duration-500 group-hover:-translate-y-1">
                  <span className="border-b-2 border-transparent group-hover:border-white pb-0.5 transition-colors duration-300">Shop Now</span>
                  <ArrowRight size={18} className="transform -translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
              </div>
            </Link>

            {/* Get Upto 70% off */}
            <Link href="/shop" className="bg-[#5a80d8] rounded-[16px] md:rounded-[24px] overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col relative min-h-[280px] md:min-h-0">
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-500 pointer-events-none z-10"></div>
              <div className="h-[50%] relative overflow-hidden">
                <Image src="https://picsum.photos/seed/promo/600/400" alt="Promo" fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
              </div>
              <div className="flex-1 p-8 flex flex-col justify-center items-start text-white relative z-20">
                <span className="bg-[#ff5b4f] text-white px-4 md:px-5 py-1.5 md:py-2 rounded-full text-lg md:text-2xl font-bold mb-3 md:mb-4 tracking-tight shadow-sm inline-block transform transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2">
                  Get Upto 70% off
                </span>
                <h3 className="text-[20px] md:text-[26px] font-bold mb-4 md:mb-6 leading-snug tracking-tight">On All The Refurbished Products</h3>
                <div className="flex items-center gap-2 text-base font-bold">
                  <span className="border-b-2 border-transparent group-hover:border-white pb-0.5 transition-colors duration-300">Shop Now</span>
                  <ArrowRight size={18} className="transform -translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <section className="bg-[#4169e1] border-y border-[#4169e1] text-white py-3 md:py-4 overflow-hidden whitespace-nowrap relative flex">
        <div className="animate-marquee flex items-center shrink-0">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="mx-6 text-[15px] font-bold">Upto 70% on New & Refurbished Laptops & Desktops</span>
              <span className="text-black text-lg">✦</span>
              <span className="mx-6 text-[15px] font-bold">Best Deals in India</span>
              <span className="text-black text-lg">✦</span>
              <span className="mx-6 text-[15px] font-bold">Fast & Secure PAN-India Delivery</span>
              <span className="text-black text-lg">✦</span>
              <span className="mx-6 text-[15px] font-bold">Bulk Orders Available for Corporates</span>
              <span className="text-black text-lg">✦</span>
              <span className="mx-6 text-[15px] font-bold">24/7 Customer Support</span>
              <span className="text-black text-lg">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Brands */}
      <section className="max-w-[1600px] mx-auto bg-[#f6f5f8] py-12 md:py-16 px-6 lg:px-12 w-full">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <h2 className="text-[28px] md:text-3xl font-bold text-gray-900 tracking-tight">Shop by Brands</h2>
            <button className="bg-[#4169e1] hover:bg-[#345bc5] text-white px-6 md:px-8 py-2 md:py-2.5 rounded-full font-bold text-sm md:text-base transition-colors shadow-sm">
              All Brands
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {[
              { name: 'Apple', src: 'https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/apple.webp' },
              { name: 'Dell', src: 'https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/dell.webp' },
              { name: 'HP', src: 'https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/hp.webp' },
              { name: 'Lenovo', src: 'https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/lenovo.webp' },
              { name: 'Microsoft', src: 'https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/microsoft.webp' },
            ].map((brand, idx) => (
              <div key={idx} className="bg-white rounded-[20px] p-5 flex flex-col items-center justify-center h-[100px] md:h-[120px] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100">
                <img loading="lazy" src={brand.src} alt={brand.name} className="w-auto h-auto max-h-[105px] max-w-[90px] object-contain opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Carousel Section */}
      <section className="max-w-[1600px] mx-auto bg-[#f6f5f8] pb-8 md:pb-12 lg:pb-16 px-4 md:px-6 lg:px-12 w-full">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8 gap-3">
            <h2 className="text-[18px] sm:text-[20px] md:text-[28px] font-bold text-gray-900 tracking-tight">Buy Refurbished Laptops Online in India</h2>
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                onClick={() => scroll(laptopSliderRef, 'left')}
                className="w-10 h-10 rounded-full bg-[#4169e1] text-white flex items-center justify-center hover:bg-[#345bc5] transition-colors shadow-sm focus:outline-none"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll(laptopSliderRef, 'right')}
                className="w-10 h-10 rounded-full bg-[#4169e1] text-white flex items-center justify-center hover:bg-[#345bc5] transition-colors shadow-sm focus:outline-none"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Cards Slider */}
          <div
            ref={laptopSliderRef}
            onScroll={() => updateScroll(laptopSliderRef, setLaptopScroll)}
            className="flex flex-nowrap gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-8 px-1"
          >
            {laptops.map((prod, idx) => (
              <div key={prod.id || idx} className="w-full md:w-[calc((100%-32px)/3)] lg:w-[calc((100%-64px)/5)] shrink-0">
                <ProductCard product={prod} index={idx} />
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div
            onClick={(e) => handleTrackClick(e, laptopSliderRef)}
            className="w-full h-1.5 bg-[#e9ecef] rounded-full relative overflow-hidden cursor-pointer"
          >
            <div
              className="h-full bg-[#ffb03a] rounded-full absolute top-0 left-0 transition-transform duration-100 ease-out will-change-transform"
              style={{
                width: `${laptopScroll.width}%`,
                transform: `translate3d(${laptopScroll.width > 0 ? (laptopScroll.left / laptopScroll.width) * 100 : 0}%, 0, 0)`
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* Desktop Carousel Section */}
      <section className="max-w-[1600px] mx-auto bg-[#f6f5f8] pb-8 md:pb-12 lg:pb-16 px-4 md:px-6 lg:px-12 w-full">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8 gap-3">
            <h2 className="text-[18px] sm:text-[20px] md:text-[28px] font-bold text-gray-900 tracking-tight">Buy High Quality Refurbished Desktops</h2>
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                onClick={() => scroll(desktopSliderRef, 'left')}
                className="w-10 h-10 rounded-full bg-[#4169e1] text-white flex items-center justify-center hover:bg-[#345bc5] transition-colors shadow-sm focus:outline-none"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll(desktopSliderRef, 'right')}
                className="w-10 h-10 rounded-full bg-[#4169e1] text-white flex items-center justify-center hover:bg-[#345bc5] transition-colors shadow-sm focus:outline-none"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Cards Slider */}
          <div
            ref={desktopSliderRef}
            onScroll={() => updateScroll(desktopSliderRef, setDesktopScroll)}
            className="flex flex-nowrap gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-8 px-1"
          >
            {desktops.map((prod, idx) => (
              <div key={prod.id || idx} className="w-full md:w-[calc((100%-32px)/3)] lg:w-[calc((100%-64px)/5)] shrink-0">
                <ProductCard product={prod} index={idx} />
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div
            onClick={(e) => handleTrackClick(e, desktopSliderRef)}
            className="w-full h-1.5 bg-[#e9ecef] rounded-full relative overflow-hidden cursor-pointer"
          >
            <div
              className="h-full bg-[#ffb03a] rounded-full absolute top-0 left-0 transition-transform duration-100 ease-out will-change-transform"
              style={{
                width: `${desktopScroll.width}%`,
                transform: `translate3d(${desktopScroll.width > 0 ? (desktopScroll.left / desktopScroll.width) * 100 : 0}%, 0, 0)`
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* Promo Banner Section */}
      <section className="max-w-[1600px] mx-auto bg-[#f6f5f8] pb-8 md:pb-12 lg:pb-16 px-4 md:px-6 lg:px-12 w-full">
        <div className="max-w-[1600px] mx-auto bg-[#3a5bf6] rounded-[20px] md:rounded-[32px] p-6 md:p-8 lg:p-12 xl:p-16 flex flex-col lg:flex-row items-center gap-8 md:gap-12 shadow-md">

          {/* Left Content */}
          <div className="flex-1 text-white">
            <div className="inline-block bg-[#ff4522] text-white text-[14px] font-bold px-4 py-1.5 rounded-full mb-6 shadow-sm">
              Get Upto 70% Off on New & Refurbished Products
            </div>

            <h2 className="text-[24px] sm:text-[28px] md:text-5xl font-extrabold leading-[1.15] mb-4 md:mb-6">
              Save Big on New / Refurbished<br className="hidden xl:block" /> Laptops & Desktops
            </h2>

            <div className="space-y-3 md:space-y-4 text-white/90 text-[13px] md:text-[14px] leading-relaxed mb-6 md:mb-10">
              <p>
                At <strong className="text-white">Comsri Corporation</strong>, we believe premium computing should be accessible to everyone. As a trusted destination for <strong className="text-white">Refurbished Computers Online in India</strong>, we specialize in delivering high-quality refurbished and brand-new laptops and desktops to students, professionals, startups, enterprises, and gamers across India. Whether you&apos;re upgrading your office infrastructure, purchasing a personal device, or sourcing systems in bulk, our online computer store provides dependable performance at competitive prices.
              </p>
              <p>
                Recognized by customers as one of the <strong className="text-white">Top 10 Refurbished Laptops Online Store</strong> options in India, Comsri Corporation offers a carefully curated range of systems designed for productivity, learning, and business use. From <strong className="text-white">cheap refurbished laptops India</strong> for everyday tasks to powerful workstations for professional workloads, we help you find the right device without overspending.
              </p>
              <p>
                Every refurbished laptop and desktop undergoes a strict multi-point quality inspection, professional hardware testing, and performance validation. Our expert technicians ensure each system delivers smooth, long-lasting operation—giving you complete confidence when you <strong className="text-white">Buy Refurbished Laptops Online in India</strong>. Each unit is cleaned, optimized, and configured to offer like-new reliability, making Comsri Corporation a preferred choice for anyone searching for the <strong className="text-white">Best refurbished laptop India</strong>.
              </p>
              <p>
                If you&apos;re looking to buy refurbished computers online in India with peace of mind, Comsri Corporation is your trusted partner—delivering value, performance, and reliability nationwide.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/shop" className="bg-[#ffb03a] hover:bg-[#faa129] text-gray-900 font-bold px-8 py-3 rounded-full transition-colors shadow-sm focus:outline-none text-center">
                Shop Now!
              </Link>
              <Link href="/about" className="bg-transparent border-2 border-white/60 hover:border-white hover:bg-white/10 text-white font-bold px-8 py-3 rounded-full transition-all focus:outline-none text-center">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:w-[450px] xl:w-[500px] flex-shrink-0 w-full relative">
            <div className="aspect-[16/10] md:aspect-[4/5] w-full rounded-[16px] md:rounded-[24px] overflow-hidden shadow-2xl relative">
              <Image
                src="https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/hp-envy-34.jpg-1.webp"
                alt="Desktop setup with monitor"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Blog Section */}
      <section className="max-w-[1600px] mx-auto bg-[#f6f5f8] pb-8 md:pb-12 lg:pb-16 px-4 md:px-6 lg:px-12 w-full">
        <div className="max-w-[1600px] mx-auto flex flex-col pt-8 border-t-2 border-[#ffb03a]">
          {/* Header */}
          <div className="flex flex-col items-start mb-8 gap-4">
            <h2 className="text-[28px] md:text-3xl font-bold text-[#111] tracking-tight">Latest from The Blog</h2>
            <button className="bg-[#3452ef] hover:bg-[#203bca] text-white px-8 py-3 rounded-full font-bold text-sm transition-all duration-200 active:scale-[0.98] shadow-md shadow-blue-500/10 focus:outline-none">
              More Articles
            </button>
          </div>

          {/* Cards Slider */}
          <div
            ref={blogSliderRef}
            onScroll={() => updateScroll(blogSliderRef, setBlogScroll)}
            className="flex flex-nowrap gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-8 px-1"
          >
            {/* Card 1 */}
            <div className="w-full md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] shrink-0">
              <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-3 h-full flex flex-col group cursor-pointer hover:shadow-[0_8px_35px_rgb(0,0,0,0.1)] transition-all duration-300 border border-transparent hover:border-gray-100">
                {/* Image */}
                <div className="relative aspect-[16/10] w-full bg-[#f4f5f7] rounded-[16px] overflow-hidden mb-4">
                  <img loading="lazy"
                    src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600"
                    alt="Blog cover"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="px-2 pb-2 flex flex-col flex-1">
                  {/* Author and Read Time */}
                  <div className="text-[13px] text-gray-500 mb-2 font-medium flex items-center gap-2">
                    <span>Comsri Corporation</span>
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    <span>5 min read</span>
                  </div>

                  {/* Title and Icon */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-[18px] font-bold text-[#111] leading-snug line-clamp-2">
                      Bulk Refurbished Computers Dealers: Smart IT Solutions for Businesses
                    </h3>
                    <button className="text-gray-400 group-hover:text-black transition-colors focus:outline-none flex-shrink-0 mt-1">
                      <ArrowUpRight size={20} />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-[15px] text-gray-500 mb-6 line-clamp-2 leading-relaxed">
                    In an era where technology upgrades are frequent and budgets are closely monitored, businesses acro...
                  </p>

                  {/* Footer (Tag and Date) */}
                  <div className="flex items-center gap-4 mt-auto">
                    <span className="bg-[#f6f6f9] text-[#111] text-[13px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                      Refurbished Products
                    </span>
                    <span className="text-[13px] text-gray-500 font-medium whitespace-nowrap">
                      25 Jan 2026
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="w-full md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] shrink-0">
              <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-3 h-full flex flex-col group cursor-pointer hover:shadow-[0_8px_35px_rgb(0,0,0,0.1)] transition-all duration-300 border border-transparent hover:border-gray-100">
                {/* Image */}
                <div className="relative aspect-[16/10] w-full bg-[#f4f5f7] rounded-[16px] overflow-hidden mb-4">
                  <img loading="lazy"
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600"
                    alt="Blog cover"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="px-2 pb-2 flex flex-col flex-1">
                  {/* Author and Read Time */}
                  <div className="text-[13px] text-gray-500 mb-2 font-medium flex items-center gap-2">
                    <span>Comsri Corporation</span>
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    <span>4 min read</span>
                  </div>

                  {/* Title and Icon */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-[18px] font-bold text-[#111] leading-snug line-clamp-2">
                      Bulk Refurbished Laptops for Offices: Cost vs Performance
                    </h3>
                    <button className="text-gray-400 group-hover:text-black transition-colors focus:outline-none flex-shrink-0 mt-1">
                      <ArrowUpRight size={20} />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-[15px] text-gray-500 mb-6 line-clamp-2 leading-relaxed">
                    In today&apos;s competitive business environment, organizations are under constant pressure to reduce op...
                  </p>

                  {/* Footer (Tag and Date) */}
                  <div className="flex items-center gap-4 mt-auto">
                    <span className="bg-[#f6f6f9] text-[#111] text-[13px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                      Refurbished Products
                    </span>
                    <span className="text-[13px] text-gray-500 font-medium whitespace-nowrap">
                      07 Jan 2026
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="w-full md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] shrink-0">
              <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-3 h-full flex flex-col group cursor-pointer hover:shadow-[0_8px_35px_rgb(0,0,0,0.1)] transition-all duration-300 border border-transparent hover:border-gray-100">
                {/* Image */}
                <div className="relative aspect-[16/10] w-full bg-[#f4f5f7] rounded-[16px] overflow-hidden mb-4">
                  <img loading="lazy"
                    src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=600"
                    alt="Blog cover"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="px-2 pb-2 flex flex-col flex-1">
                  {/* Author and Read Time */}
                  <div className="text-[13px] text-gray-500 mb-2 font-medium flex items-center gap-2">
                    <span>Comsri Corporation</span>
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    <span>7 min read</span>
                  </div>

                  {/* Title and Icon */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-[18px] font-bold text-[#111] leading-snug line-clamp-2">
                      E-Waste Recycling Explained: The First Step to Affordable Refurbished Technology
                    </h3>
                    <button className="text-gray-400 group-hover:text-black transition-colors focus:outline-none flex-shrink-0 mt-1">
                      <ArrowUpRight size={20} />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-[15px] text-gray-500 mb-6 line-clamp-2 leading-relaxed">
                    The rapid growth of technology has transformed how India works, studies, and does business. However...
                  </p>

                  {/* Footer (Tag and Date) */}
                  <div className="flex items-center gap-4 mt-auto">
                    <span className="bg-[#f6f6f9] text-[#111] text-[13px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                      Uncategorized
                    </span>
                    <span className="text-[13px] text-gray-500 font-medium whitespace-nowrap">
                      06 Jan 2026
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Progress bar */}
          <div
            onClick={(e) => handleTrackClick(e, blogSliderRef)}
            className="w-full h-1.5 bg-[#e9ecef] rounded-full relative overflow-hidden cursor-pointer mt-12"
          >
            <div
              className="h-full bg-[#ffb03a] rounded-full absolute top-0 left-0 transition-transform duration-100 ease-out will-change-transform"
              style={{
                width: `${blogScroll.width}%`,
                transform: `translate3d(${blogScroll.width > 0 ? (blogScroll.left / blogScroll.width) * 100 : 0}%, 0, 0)`
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="bg-[#f3eee7] py-12 lg:py-16 w-full flex flex-col items-center overflow-hidden">
        <div className="max-w-[1600px] mx-auto flex flex-col items-center w-full px-4 lg:px-6">
          <div className="mb-8 text-center flex flex-col items-center w-full">
            <div className="mb-[18px] text-[#111] bg-transparent border-[1.5px] border-[#111] rounded-[8px] p-1.5 inline-flex">
              <Instagram size={28} strokeWidth={1.5} />
            </div>
            <h2 className="text-[28px] md:text-[36px] font-bold text-[#111] tracking-tight mb-2">Comsri Corporation</h2>
            <p className="text-[16px] md:text-[18px] text-[#333] font-medium">
              Follow us on social <a href="#" className="text-[#3452ef] hover:underline font-semibold">@comsricorporation</a> for updates & offers
            </p>
          </div>

          {/* Instagram Images Grid */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4 pb-4 px-4 lg:px-0">
            {[
              "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-1.jpg",
              "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-2.jpg",
              "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-3.jpg",
              "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-4.jpg",
              "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-5.jpg",
              "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-6.jpg",
              "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-7.jpg",
              "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-8.jpg",
            ].map((src, index) => (
              <div key={index} className="w-full aspect-square md:rounded-[20px] rounded-[12px] overflow-hidden bg-white shadow-sm group relative">
                <img loading="lazy" src={src} alt="Instagram post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
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
                  <Link key={i} href="/shop" className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item}</Link>
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
                  <Link key={i} href={item.path} className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item.label}</Link>
                ))}
              </div>
            </div>

            {/* Get to Know Us */}
            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Get to Know Us</h3>
              <div className="flex flex-col gap-3">
                {["About Us", "FAQS", "Contact Us", "Blogs", "Bulk Orders"].map((item, i) => (
                  <Link key={i} href="/about" className="text-[14px] font-semibold text-[#2d2d2d] hover:text-[#3452ef] transition-colors">{item}</Link>
                ))}
              </div>
            </div>

            {/* Available On & Social Links */}
            <div className="flex flex-col">
              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Available On:</h3>
              <div className="flex flex-wrap xl:flex-nowrap gap-3 mb-8 items-center">
                <a href="#" className="inline-block transition-transform hover:scale-[1.02] active:scale-95">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-[42px] w-auto" />
                </a>
                <a href="#" className="inline-block transition-transform hover:scale-[1.02] active:scale-95 border border-black rounded-[6px]">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="h-[40px] w-auto block" />
                </a>
              </div>

              <h3 className="text-[18px] font-semibold text-[#3452ef] mb-3">Social links:</h3>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/comsri.store" className="w-[36px] h-[36px] rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-sm">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" /></svg>
                </a>
                <a href="https://twitter.com/comsricorp" className="w-[36px] h-[36px] rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-sm">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
                <a href="https://www.instagram.com/comsricorporation/" className="w-[36px] h-[36px] rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-sm">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                </a>
                <a href="https://www.youtube.com/@ComsriCorporation" className="w-[36px] h-[36px] rounded-full bg-[#ff0000] text-white flex items-center justify-center hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-sm">
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
                className="px-5 md:px-6 py-3 md:py-3.5 rounded-full text-[14px] focus:outline-none font-medium h-[44px] md:h-[48px] text-black w-full min-w-0 md:min-w-[280px] md:w-[340px]"
              />
              <button className="bg-[#fcb643] hover:bg-[#fca61f] text-[#111] px-6 md:px-8 h-[44px] md:h-[48px] rounded-full font-bold text-[14px] md:text-[15px] transition-colors whitespace-nowrap shadow-sm w-full sm:w-auto">
                Sign Up
              </button>
            </div>
          </div>

          {/* Copyright & Payments */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-1 gap-4 w-full">
            <p className="text-[14px] font-bold text-[#111]">Copyright 2026 by Comsri Corporation All Rights Reserved.</p>
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

        {/* Floating Chat Icon placeholder */}
        <div className="absolute right-6 bottom-6 w-14 h-14 bg-[#3452ef] rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform z-50">
          <MessageCircle size={28} className="text-white fill-white" />
        </div>
      </footer>
    </div>
  );
}
