"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Header from "../Header";
import { Trash2, Plus, Minus, ArrowLeft, ShieldCheck, ShoppingCart, CreditCard } from "lucide-react";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "Maharashtra",
    postcode: "",
    email: "",
    phone: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user email from local storage if logged in
  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(logged);

    const email = localStorage.getItem("userEmail") || "";
    if (email) {
      setFormData((prev) => ({ ...prev, email }));
    }

    // Inject Razorpay payment script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Update coupon discount value when cart items or coupon changes
  useEffect(() => {
    if (appliedCoupon) {
      const subtotal = getCartTotal();
      let discount = 0;
      if (appliedCoupon === "WELCOME10") {
        discount = subtotal * 0.1;
      } else if (appliedCoupon === "COMSRI70") {
        discount = subtotal * 0.7;
      } else if (appliedCoupon === "DEAL1500") {
        discount = Math.min(1500, subtotal);
      }
      setCouponDiscount(discount);
    }
  }, [cartItems, appliedCoupon, getCartTotal]);

  const handleApplyCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    const subtotal = getCartTotal();
    let discount = 0;

    if (code === "WELCOME10") {
      discount = subtotal * 0.1;
    } else if (code === "COMSRI70") {
      discount = subtotal * 0.7;
    } else if (code === "DEAL1500") {
      discount = Math.min(1500, subtotal);
    } else {
      setCouponError("Invalid coupon code.");
      return;
    }

    setAppliedCoupon(code);
    setCouponDiscount(discount);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon("");
    setCouponDiscount(0);
    setCouponCode("");
    setCouponError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (!isLoggedIn) {
      setErrorMessage("Please log in or register an account to proceed with checkout.");
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.postcode || !formData.email || !formData.phone) {
      setErrorMessage("Please complete all billing fields.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      // Map cart items to the server checkout payload
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const billingPayload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address_1: formData.address,
        city: formData.city,
        state: formData.state,
        postcode: formData.postcode,
        country: "IN",
        email: formData.email,
        phone: formData.phone,
      };

      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          billing: billingPayload,
          shipping: billingPayload, // ship to billing address
          couponCode: appliedCoupon || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create checkout order.");
      }

      // Initialize Razorpay Payments overlay
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Comsri Corporation",
        description: `Order Receipt Ref: #${data.wooCommerceOrderId}`,
        image: "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/Comsri-Logo.png",
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          console.log("[Razorpay Transaction Completed]:", response);
          setIsProcessing(false);
          setCheckoutSuccess(true);
          clearCart();
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#374bf9",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("[Cart Checkout Error]:", err);
      setErrorMessage(err.message || "Something went wrong during checkout.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f5f8] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-12">
        {checkoutSuccess ? (
          <div className="max-w-xl mx-auto bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 text-center animate-fade-in my-12 border border-emerald-100">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Payment Successful!</h2>
            <p className="text-gray-500 text-sm mb-8">
              Thank you for your order. We have received your payment, and your order is currently being prepared for shipping. A receipt has been dispatched to your email.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#374bf9] hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full transition-colors shadow-md"
            >
              Continue Shopping
            </Link>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="max-w-lg mx-auto bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 text-center animate-fade-in my-12">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-6">
              <ShoppingCart size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Looks like you haven&apos;t added any products to your cart yet. Head over to our catalog to discover the best deals on refurbished computers.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#374bf9] hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-full transition-colors shadow-md"
            >
              Shop Refurbished Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left side: Cart items list */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 border border-gray-100">
                <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
                  <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Shopping Cart</h1>
                  <span className="text-sm font-semibold text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 group">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-slate-50 border border-gray-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center relative p-1">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>

                      {/* Product details */}
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                          {item.category}
                        </span>
                        <h3 className="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-1 hover:text-[#374bf9] transition-colors">
                          <Link href={`/products/${item.slug}`}>{item.name}</Link>
                        </h3>
                        <p className="text-[16px] font-bold text-[#111] mt-1 price-font">
                          ₹{parseFloat(item.price).toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Quantity & Delete Controls */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-gray-200 rounded-full bg-white h-10 px-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-10 text-center text-sm font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-6 mt-6">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#374bf9] hover:underline"
                  >
                    <ArrowLeft size={16} />
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 border border-gray-100 animate-fade-in">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Have a coupon code?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="WELCOME10, COMSRI70, DEAL1500"
                    className="flex-1 border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 uppercase"
                    disabled={!!appliedCoupon}
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="bg-red-50 hover:bg-red-100 text-red-500 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-[#374bf9] hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {couponError && (
                  <p className="text-red-500 text-xs mt-1.5 font-semibold">{couponError}</p>
                )}
                {appliedCoupon && (
                  <p className="text-emerald-600 text-xs mt-1.5 font-semibold">
                    Coupon &quot;{appliedCoupon}&quot; applied successfully!
                  </p>
                )}
              </div>
            </div>

            {/* Right side: Billing form and Summary */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Order Summary & Billing Form */}
              <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                  Billing Details & Checkout
                </h2>

                <form onSubmit={handleCheckout} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                      placeholder="Office T-15, Pinnacle Business Park"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                        placeholder="Mumbai"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">PIN Code</label>
                      <input
                        type="text"
                        name="postcode"
                        required
                        value={formData.postcode}
                        onChange={handleInputChange}
                        className="w-full border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                        placeholder="400093"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full border border-gray-250 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Gujarat">Gujarat</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                      placeholder="info@comsri.com"
                    />
                  </div>

                  {errorMessage && (
                    <div className="bg-red-50 text-red-650 text-xs font-medium p-3 rounded-xl border border-red-100 mt-2">
                      {errorMessage}
                    </div>
                  )}



                  {/* Summary items */}
                  <div className="bg-slate-50/80 rounded-2xl p-5 space-y-3 mt-6 border border-slate-100">
                    <div className="flex justify-between text-sm text-gray-500 font-medium">
                      <span>Subtotal</span>
                      <span className="text-gray-900 font-bold price-font">
                        ₹{getCartTotal().toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-sm text-emerald-600 font-medium animate-fade-in">
                        <span>Discount ({appliedCoupon})</span>
                        <span className="font-bold price-font">
                          -₹{couponDiscount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-500 font-medium">
                      <span>Shipping</span>
                      <span className="text-emerald-600 font-bold">FREE Delivery</span>
                    </div>
                    <div className="border-t border-gray-200/60 my-2 pt-3 flex justify-between items-center">
                      <span className="text-base font-extrabold text-gray-900">Total (INR)</span>
                      <span className="text-xl font-extrabold text-[#374bf9] price-font">
                        ₹{Math.max(0, getCartTotal() - couponDiscount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {!isLoggedIn ? (
                    <div className="bg-amber-50 text-amber-800 p-4 rounded-2xl border border-amber-100 flex flex-col gap-3 mt-4">
                      <p className="text-xs font-semibold leading-relaxed">
                        You must be logged in to proceed with checking out. Please log in or register an account.
                      </p>
                      <Link
                        href="/login"
                        className="bg-[#374bf9] hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-full text-xs transition-colors text-center inline-block"
                      >
                        Login / Register
                      </Link>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-[#374bf9] hover:bg-blue-700 text-white font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2.5 shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-50"
                    >
                      <CreditCard size={18} />
                      {isProcessing ? "Processing Security Payment..." : "Proceed to Secured Payment"}
                    </button>
                  )}
                </form>

                <div className="flex items-center justify-center gap-2 mt-4 text-[12px] font-semibold text-gray-500">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  Secured & Insured Transaction By Razorpay
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

