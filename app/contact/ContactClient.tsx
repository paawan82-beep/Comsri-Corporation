"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  ChevronRight,
  MessageCircle,
  Headphones,
  Zap,
  ArrowRight,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Package,
  ShieldCheck,
  Star,
  Play,
  Apple,
} from "lucide-react";
import Header from "../Header";
import Footer from "../Footer";

/* ─── Contact Info Card ───────────────────────────────────────────────── */
function ContactCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  href,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
  href?: string;
  delay?: number;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const content = (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`group bg-white rounded-[20px] p-6 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.10)] border border-gray-100 flex flex-col gap-4 transition-all duration-700 ease-out hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.15)] hover:-translate-y-1 cursor-pointer ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
    >
      <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center ${color} shadow-sm`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
        <p className="text-[16px] font-bold text-[#111] leading-snug">{value}</p>
        {sub && <p className="text-[13px] text-gray-500 font-medium mt-0.5">{sub}</p>}
      </div>
      <div className={`flex items-center gap-1.5 text-[13px] font-bold ${color.replace("bg-", "text-").replace(/\/\d+/, "")} group-hover:gap-2.5 transition-all`}>
        <span>{href ? "Get Directions" : "Contact Now"}</span>
        <ArrowRight size={14} />
      </div>
    </div>
  );

  return href ? <a href={href} target="_blank" rel="noopener noreferrer">{content}</a> : <div>{content}</div>;
}

/* ─── Floating Label Input ────────────────────────────────────────────── */
function FloatInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  required = false,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;
  return (
    <div className="relative w-full">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        aria-label={label}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`peer w-full px-4 pt-6 pb-2 rounded-[14px] border-2 text-[15px] font-medium text-[#111] bg-white transition-all duration-200 focus:outline-none appearance-none ${error
          ? "border-red-400 focus:border-red-500"
          : focused
            ? "border-[#121e42] shadow-[0_0_0_4px_rgba(18,30,66,0.08)]"
            : "border-gray-200 hover:border-gray-300"
          }`}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 font-medium pointer-events-none transition-all duration-200 ${focused || filled
          ? "top-2 text-[11px] tracking-wider uppercase"
          : "top-4 text-[15px] text-gray-400"
          } ${error ? "text-red-400" : focused ? "text-[#121e42]" : "text-gray-400"}`}
      >
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[12px] text-red-500 font-medium flex items-center gap-1 px-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

/* ─── Floating Label Textarea ─────────────────────────────────────────── */
function FloatTextarea({
  id,
  label,
  value,
  onChange,
  error,
  rows = 5,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;
  return (
    <div className="relative w-full">
      <textarea
        id={id}
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label={label}
        className={`w-full px-4 pt-7 pb-3 rounded-[14px] border-2 text-[15px] font-medium text-[#111] bg-white transition-all duration-200 focus:outline-none resize-none ${error
          ? "border-red-400 focus:border-red-500"
          : focused
            ? "border-[#121e42] shadow-[0_0_0_4px_rgba(18,30,66,0.08)]"
            : "border-gray-200 hover:border-gray-300"
          }`}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 font-medium pointer-events-none transition-all duration-200 ${focused || filled ? "top-2 text-[11px] tracking-wider uppercase" : "top-4 text-[15px] text-gray-400"
          } ${error ? "text-red-400" : focused ? "text-[#121e42]" : "text-gray-400"}`}
      >
        {label} <span className="text-red-400">*</span>
      </label>
      {error && (
        <p className="mt-1.5 text-[12px] text-red-500 font-medium flex items-center gap-1 px-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

/* ─── Section Fade-in Hook ────────────────────────────────────────────── */
function useFadeIn() {
  const [visible, setVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);
  return { elementRef, visible };
}

/* ─── Main Component ──────────────────────────────────────────────────── */
export default function ContactClient() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeSubject, setActiveSubject] = useState("");

  const subjects = ["Product Inquiry", "Bulk Order", "Technical Support", "Warranty / Repair", "General Question"];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (form.phone && !/^[+]?[\d\s\-()]{7,15}$/.test(form.phone)) e.phone = "Enter a valid phone number";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setErrors({});
    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formType: "contact",
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.subject || activeSubject,
          message: form.message,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit message.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrors({ submit: err.message || "An unexpected error occurred. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const heroFade = useFadeIn();
  const infoFade = useFadeIn();
  const formFade = useFadeIn();

  /* JSON-LD for contact page */
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Comsri Corporation",
    description: "Reach out to Comsri Corporation for product inquiries, bulk orders, and customer support.",
    url: "https://comsri-corporation.vercel.app/contact",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-8601-899-899",
      contactType: "customer service",
      email: "info@comsri.com",
      areaServed: "IN",
      availableLanguage: "en",
    },
  };

  return (
    <div className="min-h-screen bg-[#f6f5f8] flex flex-col font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
      <Header />

      {/* ─── Breadcrumb ──────────────────────────────────────────────── */}
      <div className="bg-[#f2ece4] w-full py-2.5">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center gap-2 text-[14px] text-gray-500 font-medium">
          <Link href="/" className="hover:text-[#121e42] transition-colors">Home</Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-[#121e42] font-bold">Contact Us</span>
        </div>
      </div>

      <main className="flex-1 w-full">

        {/* ─── Hero Section ────────────────────────────────────────── */}
        <section
          ref={heroFade.elementRef as React.RefObject<HTMLElement>}
          className="relative w-full bg-[#121e42] overflow-hidden min-h-[480px] lg:min-h-[560px] flex items-center"
        >
          {/* Animated gradient orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#faba5b]/10 blur-3xl animate-pulse" />
            <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] rounded-full bg-[#374bf9]/15 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full bg-white/3 blur-3xl" />
            {/* Grid lines */}
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(250,186,91,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(250,186,91,0.04) 1px, transparent 1px)`,
              backgroundSize: "60px 60px"
            }} />
          </div>

          <div
            className={`max-w-[1600px] mx-auto px-6 lg:px-12 w-full py-20 lg:py-24 flex flex-col lg:flex-row items-center gap-12 relative z-10 transition-all duration-1000 ease-out ${heroFade.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            {/* Left: Text */}
            <div className="flex-1 text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <MessageCircle size={14} className="text-[#faba5b]" />
                <span className="text-[13px] font-bold text-white/90 uppercase tracking-widest">We&apos;re Here to Help</span>
              </div>
              <h1 className="text-[38px] md:text-[54px] lg:text-[60px] font-extrabold tracking-tight leading-[1.1] mb-6">
                Get in{" "}
                <span className="relative">
                  <span className="text-[#faba5b]">Touch</span>
                  <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
                    <path d="M0 3 Q50 0 100 3 Q150 6 200 3" stroke="#faba5b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  </svg>
                </span>{" "}
                With Us
              </h1>
              <p className="text-[16px] md:text-[18px] text-white/75 font-medium leading-relaxed max-w-xl">
                Have a question about our refurbished computers, a bulk order requirement, or need technical support? Our expert team is ready to assist you every step of the way.
              </p>

              {/* Quick contact chips */}
              <div className="flex flex-wrap gap-3 mt-8">
                <a
                  href="tel:+918601899899"
                  className="flex items-center gap-2 bg-[#faba5b] text-[#121e42] px-5 py-2.5 rounded-full text-[14px] font-bold hover:bg-[#f9c876] transition-all active:scale-95 shadow-lg"
                >
                  <Phone size={15} />
                  +91 8601-899-899
                </a>
                <a
                  href="mailto:info@comsri.com"
                  className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-5 py-2.5 rounded-full text-[14px] font-bold hover:bg-white/20 transition-all active:scale-95"
                >
                  <Mail size={15} />
                  info@comsri.com
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-6 mt-10 pt-8 border-t border-white/10">
                {[
                  { icon: Headphones, label: "24/7 Support" },
                  { icon: Zap, label: "Quick Response" },
                  { icon: ShieldCheck, label: "Trusted Since 2020" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-white/70">
                    <Icon size={16} className="text-[#faba5b]" />
                    <span className="text-[13px] font-semibold">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Floating card */}
            <div className="w-full lg:w-[380px] shrink-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[24px] p-6 space-y-4">
                <h3 className="text-[18px] font-bold text-white mb-2">Office Hours</h3>
                {[
                  { day: "Monday – Friday", hours: "9:00 AM – 7:00 PM", active: true },
                  { day: "Saturday", hours: "10:00 AM – 5:00 PM", active: true },
                  { day: "Sunday", hours: "Closed", active: false },
                ].map(({ day, hours, active }) => (
                  <div key={day} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                    <span className="text-[14px] text-white/70 font-medium">{day}</span>
                    <span className={`text-[14px] font-bold ${active ? "text-[#faba5b]" : "text-white/40"}`}>{hours}</span>
                  </div>
                ))}
                <div className="pt-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[13px] text-green-300 font-semibold">We&apos;re currently available</span>
                </div>
              </div>

              {/* Rating card */}
              <div className="mt-4 bg-[#faba5b] rounded-[20px] p-5 flex items-center gap-4">
                <div className="flex flex-col">
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-[#121e42] text-[#121e42]" />
                    ))}
                  </div>
                  <p className="text-[22px] font-extrabold text-[#121e42]">4.9 / 5.0</p>
                  <p className="text-[12px] text-[#121e42]/70 font-semibold">from 2,400+ happy customers</p>
                </div>
                <div className="ml-auto flex flex-col items-end gap-1">
                  <div className="flex -space-x-2">
                    {["photo-1544005313-94ddf0286df2", "photo-1506794778202-cad84cf45f1d", "photo-1438761681033-6461ffad8d80"].map((id) => (
                      <img key={id} src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=60&h=60&q=70`} alt="Customer" className="w-9 h-9 rounded-full border-2 border-[#faba5b] object-cover" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Contact Info Cards ───────────────────────────────────── */}
        <section
          ref={infoFade.elementRef as React.RefObject<HTMLElement>}
          className="max-w-[1600px] mx-auto px-6 lg:px-12 py-14 w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <ContactCard
              icon={MapPin}
              label="Our Office"
              value="Andheri East, Mumbai"
              sub="Office No. T-15, Pinnacle Business Park, 400093"
              color="bg-[#121e42]"
              href="https://maps.google.com/?q=Pinnacle+Business+Park+Andheri+East+Mumbai"
              delay={0}
            />
            <ContactCard
              icon={Phone}
              label="Phone"
              value="+91 8601-899-899"
              sub="Mon – Sat, 9 AM to 7 PM"
              color="bg-[#374bf9]"
              href="tel:+918601899899"
              delay={100}
            />
            <ContactCard
              icon={Mail}
              label="Email"
              value="info@comsri.com"
              sub="We reply within 24 hours"
              color="bg-[#b81d06]"
              href="mailto:info@comsri.com"
              delay={200}
            />
            <ContactCard
              icon={Clock}
              label="Business Hours"
              value="Mon – Fri: 9AM – 7PM"
              sub="Saturday: 10AM – 5PM"
              color="bg-[#143f29]"
              delay={300}
            />
          </div>
        </section>

        {/* ─── Form + Map Section ───────────────────────────────────── */}
        <section
          ref={formFade.elementRef as React.RefObject<HTMLElement>}
          className="max-w-[1600px] mx-auto px-6 lg:px-12 pb-20 w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-8 xl:gap-12">

            {/* Contact Form */}
            <div
              className={`transition-all duration-700 ease-out ${formFade.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <div className="bg-white rounded-[28px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] border border-gray-100 p-8 md:p-10">
                {!submitted ? (
                  <>
                    <div className="mb-8">
                      <span className="text-[12px] font-bold uppercase tracking-widest text-[#374bf9] bg-[#374bf9]/8 px-3 py-1.5 rounded-full">Send a Message</span>
                      <h2 className="text-[28px] md:text-[34px] font-bold text-[#111] tracking-tight mt-4 mb-2 leading-tight">
                        How can we help you?
                      </h2>
                      <p className="text-gray-500 font-medium text-[15px]">Fill in the form below and we'll respond within 24 hours.</p>
                    </div>

                    {/* Subject selector */}
                    <div className="mb-7">
                      <p className="text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-3">Select a topic</p>
                      <div className="flex flex-wrap gap-2">
                        {subjects.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => { setActiveSubject(s); setForm((f) => ({ ...f, subject: s })); }}
                            className={`px-4 py-2 rounded-full text-[13px] font-bold border-2 transition-all duration-200 ${activeSubject === s
                              ? "bg-[#121e42] border-[#121e42] text-white shadow-md scale-[1.03]"
                              : "border-gray-200 text-gray-500 hover:border-[#121e42]/40 hover:text-[#121e42]"
                              }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FloatInput
                          id="contact-name"
                          label="Full Name"
                          value={form.name}
                          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                          error={errors.name}
                          required
                        />
                        <FloatInput
                          id="contact-email"
                          label="Email Address"
                          type="email"
                          value={form.email}
                          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                          error={errors.email}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FloatInput
                          id="contact-phone"
                          label="Phone Number (optional)"
                          type="tel"
                          value={form.phone}
                          onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                          error={errors.phone}
                        />
                        <FloatInput
                          id="contact-subject"
                          label="Subject"
                          value={form.subject}
                          onChange={(v) => { setForm((f) => ({ ...f, subject: v })); setActiveSubject(""); }}
                          error={errors.subject}
                        />
                      </div>
                      <FloatTextarea
                        id="contact-message"
                        label="Your Message"
                        value={form.message}
                        onChange={(v) => setForm((f) => ({ ...f, message: v }))}
                        error={errors.message}
                        rows={5}
                      />

                      {errors.submit && (
                        <p className="text-red-500 text-sm font-semibold -mt-2">{errors.submit}</p>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="group relative flex items-center justify-center gap-3 bg-[#121e42] text-white h-[54px] rounded-[14px] text-[16px] font-bold transition-all duration-300 hover:bg-[#1a2f61] active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed overflow-hidden shadow-lg shadow-[#121e42]/30 mt-2"
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                        {submitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending your message…
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            Send Message
                            <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>

                      <p className="text-[12px] text-gray-400 text-center font-medium">
                        🔒 Your information is kept private and never shared with third parties.
                      </p>
                    </form>
                  </>
                ) : (
                  /* ── Success State ── */
                  <div className="flex flex-col items-center justify-center py-16 text-center gap-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                      <CheckCircle size={40} className="text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-[28px] font-bold text-[#111] mb-2">Message Sent!</h3>
                      <p className="text-gray-500 font-medium max-w-md text-[15px]">
                        Thank you for reaching out to Comsri Corporation. We&apos;ll get back to you within 24 hours.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); setActiveSubject(""); }}
                        className="px-6 py-2.5 rounded-full border-2 border-[#121e42] text-[#121e42] font-bold text-[14px] hover:bg-[#121e42] hover:text-white transition-all"
                      >
                        Send Another
                      </button>
                      <Link href="/shop" className="px-6 py-2.5 rounded-full bg-[#faba5b] text-[#121e42] font-bold text-[14px] hover:bg-[#f9c876] transition-all">
                        Browse Products
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Map + extra info */}
            <div
              className={`flex flex-col gap-6 transition-all duration-700 ease-out delay-150 ${formFade.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              {/* Real Google Maps Embed */}
              <div className="w-full rounded-[24px] overflow-hidden shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] border border-gray-100 bg-white">
                {/* Header */}
                <div className="flex items-center gap-3 px-5 pt-5 pb-3">
                  <div className="w-9 h-9 bg-[#121e42] rounded-[11px] flex items-center justify-center shrink-0">
                    <MapPin size={17} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-[#111] leading-tight">Comsri Corporation</p>
                    <p className="text-[12px] text-gray-400 font-medium">Andheri East, Mumbai – 400093</p>
                  </div>
                  <a
                    href="https://www.google.com/maps/place/Comsri+Corporation+-+Refurbished+%2F+New+Laptops+%26+Desktops+Store/@19.2112534,72.8197376,29525m/data=!3m1!1e3!4m6!3m5!1s0xa0974c04dd8b242f:0xadb12260292c4d24!8m2!3d19.1198823!4d72.8640746!16s%2Fg%2F11tjs6hh24?entry=ttu&g_ep=EgoyMDI2MDYwOS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-[12px] text-[#374bf9] font-bold hover:underline flex items-center gap-1"
                  >
                    Open Maps <ArrowRight size={11} />
                  </a>
                </div>

                {/* Real iframe */}
                <div className="relative w-full h-[260px] overflow-hidden">
                  <iframe
                    title="Comsri Corporation Location — Pinnacle Business Park, Andheri East, Mumbai"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.1!2d72.8640746!3d19.1198823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa0974c04dd8b242f%3A0xadb12260292c4d24!2sComsri%20Corporation%20-%20Refurbished%20%2F%20New%20Laptops%20%26%20Desktops%20Store!5e0!3m2!1sen!2sin!4v1718118000000!5m2!1sen!2sin"
                    width="100%"
                    height="260"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="block w-full"
                  />
                </div>

                {/* Address footer */}
                <div className="px-5 py-4 bg-gray-50/80 flex items-start gap-3">
                  <MapPin size={15} className="text-[#374bf9] mt-0.5 shrink-0" />
                  <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
                    Office No.-T-15, Pinnacle Business Park, MC Rd, Shanti Nagar, Andheri East, Mumbai, Maharashtra – 400093
                  </p>
                </div>

                {/* Directions button */}
                <div className="px-5 pb-5">
                  <a
                    href="https://www.google.com/maps/place/Comsri+Corporation+-+Refurbished+%2F+New+Laptops+%26+Desktops+Store/@19.2112534,72.8197376,29525m/data=!3m1!1e3!4m6!3m5!1s0xa0974c04dd8b242f:0xadb12260292c4d24!8m2!3d19.1198823!4d72.8640746!16s%2Fg%2F11tjs6hh24?entry=ttu&g_ep=EgoyMDI2MDYwOS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full h-[44px] bg-[#121e42] hover:bg-[#1a2f61] text-white rounded-[12px] text-[14px] font-bold transition-colors shadow-sm"
                  >
                    <MapPin size={15} />
                    Get Directions
                  </a>
                </div>
              </div>

              {/* Social links card */}
              <div className="bg-[#121e42] rounded-[24px] p-6 text-white">
                <h3 className="text-[18px] font-bold mb-1">Connect with Us</h3>
                <p className="text-[13px] text-white/60 font-medium mb-5">Follow us for the latest deals and updates</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Facebook, label: "Facebook", sub: "@comsri.store", bg: "bg-[#1877f2]", href: "https://www.facebook.com/comsri.store" },
                    { icon: Instagram, label: "Instagram", sub: "@comsricorporation", bg: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]", href: "https://www.instagram.com/comsricorporation/" },
                    { icon: Youtube, label: "YouTube", sub: "@ComsriCorporation", bg: "bg-[#ff0000]", href: "https://www.youtube.com/@ComsriCorporation" },
                    { icon: Twitter, label: "Twitter / X", sub: "@comsricorp", bg: "bg-black", href: "https://twitter.com/comsricorp" },
                  ].map(({ icon: Icon, label, sub, bg, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-white/8 hover:bg-white/15 border border-white/10 rounded-[14px] p-3.5 transition-all group"
                    >
                      <div className={`w-9 h-9 ${bg} rounded-[10px] flex items-center justify-center shrink-0`}>
                        <Icon size={16} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-white leading-tight">{label}</p>
                        <p className="text-[11px] text-white/50 font-medium truncate">{sub}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick links */}
              <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
                <h3 className="text-[16px] font-bold text-[#111] mb-4">Quick Actions</h3>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Browse All Products", href: "/shop", icon: Package },
                    { label: "Bulk Order Inquiry", href: "/bulk-orders", icon: Zap },
                    { label: "Frequently Asked Questions", href: "/faq", icon: MessageCircle },
                    { label: "View Warranty Policy", href: "/privacy-policy?tab=warranty", icon: ShieldCheck },
                  ].map(({ label, href, icon: Icon }) => (
                    <Link
                      key={label}
                      href={href}
                      className="flex items-center gap-3 px-4 py-3 rounded-[12px] hover:bg-[#f6f5f8] transition-colors group"
                    >
                      <div className="w-8 h-8 bg-[#f6f5f8] group-hover:bg-[#121e42] rounded-[9px] flex items-center justify-center transition-colors">
                        <Icon size={15} className="text-[#121e42] group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-[14px] font-semibold text-gray-700 group-hover:text-[#121e42] transition-colors">{label}</span>
                      <ChevronRight size={14} className="ml-auto text-gray-300 group-hover:text-[#121e42] transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Why Choose Us Section ────────────────────────────────── */}
        <section className="w-full bg-[#f2ece4] py-16 lg:py-20">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <span className="text-[12px] font-bold uppercase tracking-widest text-[#374bf9] bg-white/70 px-3 py-1.5 rounded-full inline-block mb-4">Why Contact Us</span>
              <h2 className="text-[30px] md:text-[38px] font-bold text-[#111] tracking-tight">Dedicated support at every step</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Headphones,
                  title: "Expert Guidance",
                  desc: "Our team of IT specialists helps you choose the right device for your needs and budget—laptops, desktops, or workstations.",
                  bg: "bg-[#121e42]",
                  delay: 0,
                },
                {
                  icon: Package,
                  title: "Bulk Order Support",
                  desc: "Looking to equip your office or institution? We offer dedicated pricing, bulk procurement, and tailored support for large orders.",
                  bg: "bg-[#374bf9]",
                  delay: 100,
                },
                {
                  icon: ShieldCheck,
                  title: "After-Sales Service",
                  desc: "From warranty claims to technical support and returns, our customer care team ensures a hassle-free post-purchase experience.",
                  bg: "bg-[#143f29]",
                  delay: 200,
                },
              ].map(({ icon: Icon, title, desc, bg, delay }) => (
                <div
                  key={title}
                  style={{ transitionDelay: `${delay}ms` }}
                  className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4"
                >
                  <div className={`w-12 h-12 ${bg} rounded-[14px] flex items-center justify-center shadow-sm`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-[20px] font-bold text-[#111]">{title}</h3>
                  <p className="text-[14px] text-gray-500 font-medium leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
