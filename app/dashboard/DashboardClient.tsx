"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, hasSupabaseConfig } from "@/lib/supabase";
import { 
  User, 
  ShoppingBag, 
  ShieldCheck, 
  MapPin, 
  Settings, 
  LogOut, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Edit3, 
  Plus, 
  Search, 
  Mail, 
  Phone,
  AlertCircle
} from "lucide-react";
import Header from "../Header";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
};

type Order = {
  id: string;
  date: string;
  total: number;
  status: "Processing" | "Shipped" | "Delivered";
  trackingNo: string;
  carrier: string;
  items: OrderItem[];
};

type Warranty = {
  id: string;
  deviceName: string;
  serialNo: string;
  startDate: string;
  durationMonths: number;
  status: "Active" | "Expired";
};

const mockOrders: Order[] = [
  {
    id: "CO-98276",
    date: "June 08, 2026",
    total: 36500,
    status: "Shipped",
    trackingNo: "IN-TRK-7840192",
    carrier: "BlueDart Express",
    items: [
      {
        id: "1",
        name: "Dell Latitude 7490 Refurbished Laptop",
        price: 35000,
        qty: 1,
        image: "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-1.jpg"
      },
      {
        id: "2",
        name: "Premium Keyboard Dust Cover Upgrade",
        price: 1500,
        qty: 1,
        image: "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-5.jpg"
      }
    ]
  },
  {
    id: "CO-96102",
    date: "April 15, 2026",
    total: 42000,
    status: "Delivered",
    trackingNo: "IN-TRK-1084729",
    carrier: "Delhivery Premium",
    items: [
      {
        id: "3",
        name: "HP EliteDesk 800 G4 Refurbished Mini PC",
        price: 42000,
        qty: 1,
        image: "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-3.jpg"
      }
    ]
  }
];

const mockWarranties: Warranty[] = [
  {
    id: "W-7490-DEL",
    deviceName: "Dell Latitude 7490 Refurbished Laptop",
    serialNo: "S/N: 7490-2026-X8F",
    startDate: "June 08, 2026",
    durationMonths: 12,
    status: "Active"
  },
  {
    id: "W-800-HP",
    deviceName: "HP EliteDesk 800 G4 Refurbished Mini PC",
    serialNo: "S/N: 800-G4-99K2W",
    startDate: "April 15, 2026",
    durationMonths: 6,
    status: "Active"
  }
];

export default function DashboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "addresses" | "settings">("overview");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("Customer");
  const [userPhone, setUserPhone] = useState("+91 98765-43210");
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Address State
  const [shippingAddress, setShippingAddress] = useState({
    name: "John Doe",
    street: "Flat 402, 4th Floor, Skyline Residency, MC Road",
    area: "Andheri East",
    city: "Mumbai",
    state: "Maharashtra",
    zip: "400093",
    phone: "+91 8601-899-899"
  });

  // Settings State
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formConfirmPassword, setFormConfirmPassword] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [settingsError, setSettingsError] = useState("");

  // Sync Auth State
  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn") === "true";
    if (!logged) {
      router.push("/login");
      return;
    }

    const email = localStorage.getItem("userEmail") || "user@comsri.com";
    setIsLoggedIn(true);
    setUserEmail(email);

    // Derive name from email for preview
    const namePart = email.split("@")[0];
    const cleanName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    setUserName(cleanName);
    setFormName(cleanName);
    setFormPhone(userPhone);

    // Fetch details from Supabase if active
    const checkSession = async () => {
      if (hasSupabaseConfig()) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const u = session.user;
          setUserEmail(u.email || email);
          const fullName = u.user_metadata?.full_name || cleanName;
          setUserName(fullName);
          setFormName(fullName);
        }
      }
    };
    checkSession();
  }, [router]);

  // Fetch real WooCommerce orders and calculate warranties
  useEffect(() => {
    if (!userEmail) return;

    const fetchOrders = async () => {
      try {
        // Orders are PII — the API authenticates the caller via the Supabase
        // access token and derives the email server-side. No token, no data.
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        if (!accessToken) {
          console.warn("No active session; skipping order fetch.");
          return;
        }

        const response = await fetch(`/api/orders`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) throw new Error("Failed to load orders");
        const json = await response.json();
        
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          // Map WooCommerce orders to our Dashboard format
          const mappedOrders: Order[] = json.data.map((wooOrder: any) => {
            const formattedDate = new Date(wooOrder.date_created).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            });

            // Map status
            let dashboardStatus: "Processing" | "Shipped" | "Delivered" = "Processing";
            if (wooOrder.status === "completed") {
              dashboardStatus = "Delivered";
            } else if (wooOrder.status === "processing") {
              dashboardStatus = "Processing";
            } else if (wooOrder.status === "pending" || wooOrder.status === "on-hold") {
              dashboardStatus = "Processing";
            } else {
              dashboardStatus = "Processing";
            }

            // Look for tracking information in metadata
            let trackingNo = "";
            let carrier = "Delhivery Premium";
            if (wooOrder.meta_data && Array.isArray(wooOrder.meta_data)) {
              const trackingMeta = wooOrder.meta_data.find(
                (m: any) => m.key === "_tracking_number" || m.key === "tracking_number"
              );
              if (trackingMeta) trackingNo = trackingMeta.value;

              const carrierMeta = wooOrder.meta_data.find(
                (m: any) => m.key === "_shipping_provider" || m.key === "shipping_provider"
              );
              if (carrierMeta) carrier = carrierMeta.value;
            }

            // Fallback tracking number for shipped-like pending items to show timeline details
            if (!trackingNo && (wooOrder.status === "completed" || wooOrder.status === "processing")) {
              trackingNo = `CO-TRK-${wooOrder.id}`;
            }

            const items: OrderItem[] = wooOrder.line_items.map((item: any) => {
              // Guess image based on name
              let imageUrl = "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-1.jpg";
              const nameLower = item.name.toLowerCase();
              if (nameLower.includes("laptop") || nameLower.includes("macbook")) {
                imageUrl = "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-1.jpg";
              } else if (nameLower.includes("desktop") || nameLower.includes("workstation")) {
                imageUrl = "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-4.jpg";
              } else if (nameLower.includes("mini pc") || nameLower.includes("mini-pc")) {
                imageUrl = "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-3.jpg";
              } else if (nameLower.includes("cover") || nameLower.includes("accessory") || nameLower.includes("bag")) {
                imageUrl = "https://hglntgfpbilqvdcazjsv.supabase.co/storage/v1/object/public/product-images/instagram-5.jpg";
              }

              return {
                id: item.id.toString(),
                name: item.name,
                price: parseFloat(item.price || "0"),
                qty: item.quantity,
                image: imageUrl,
              };
            });

            return {
              id: `#${wooOrder.number || wooOrder.id}`,
              date: formattedDate,
              total: parseFloat(wooOrder.total || "0"),
              status: dashboardStatus,
              trackingNo,
              carrier,
              items,
            };
          });

          setOrders(mappedOrders);

          // Update primary address from latest order if billing exists
          const latestWooOrder = json.data[0];
          if (latestWooOrder && latestWooOrder.billing) {
            const b = latestWooOrder.billing;
            setShippingAddress({
              name: `${b.first_name || ""} ${b.last_name || ""}`.trim() || "John Doe",
              street: `${b.address_1 || ""}${b.address_2 ? ", " + b.address_2 : ""}`,
              area: b.company || "Local Area",
              city: b.city || "Mumbai",
              state: b.state || "Maharashtra",
              zip: b.postcode || "400093",
              phone: b.phone || "+91 8601-899-899"
            });
            if (b.phone) {
              setUserPhone(b.phone);
              setFormPhone(b.phone);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load real WooCommerce orders:", err);
      }
    };

    fetchOrders();
  }, [userEmail]);

  const handleDownloadInvoice = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString()}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.qty).toLocaleString()}</td>
      </tr>
    `).join("");

    const invoiceHtml = `
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 40px; line-height: 1.6; }
            .invoice-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #111; padding-bottom: 20px; margin-bottom: 30px; }
            .invoice-title { font-size: 28px; font-weight: bold; color: #111; }
            .company-details { text-align: right; font-size: 13px; }
            .invoice-meta { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 14px; }
            .invoice-meta strong { color: #111; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #f9f9f9; padding: 12px; text-align: left; font-size: 13px; font-weight: bold; border-bottom: 2px solid #ddd; }
            td { font-size: 13px; }
            .invoice-total { text-align: right; font-size: 16px; font-weight: bold; margin-top: 20px; }
            .footer { text-align: center; font-size: 11px; color: #888; margin-top: 60px; border-top: 1px solid #eee; padding-top: 20px; }
            @media print {
              body { margin: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div>
              <div class="invoice-title">INVOICE</div>
              <div style="font-size: 14px; margin-top: 5px; color: #666;">Order ID: ${order.id}</div>
            </div>
            <div class="company-details">
              <strong>Comsri Corporation</strong><br>
              Office No.-T-15 Pinnacle Business Park MC Rd<br>
              Shanti Nagar Andheri East Mumbai - 400093<br>
              Email: billing@comsri.com | Phone: +91 8601-899-899
            </div>
          </div>

          <div class="invoice-meta">
            <div>
              <strong>Billed To:</strong><br>
              ${shippingAddress.name}<br>
              ${shippingAddress.street || ""}, ${shippingAddress.area || ""}<br>
              ${shippingAddress.city || ""}, ${shippingAddress.state || ""} - ${shippingAddress.zip || ""}<br>
              Phone: ${shippingAddress.phone || ""}
            </div>
            <div style="text-align: right;">
              <strong>Date:</strong> ${order.date}<br>
              <strong>Payment Status:</strong> Paid<br>
              <strong>Method:</strong> Razorpay Secured Payments
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 50%;">Item Description</th>
                <th style="width: 15%; text-align: center;">Qty</th>
                <th style="width: 15%; text-align: right;">Price</th>
                <th style="width: 20%; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="invoice-total">
            Total Paid: ₹${order.total.toLocaleString()}
          </div>

          <div class="footer">
            Thank you for shopping with Comsri Corporation!<br>
            For any queries, please reach out to info@comsri.com or call +91 8601-899-899.
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    if (hasSupabaseConfig()) {
      supabase.auth.signOut();
    }
    router.push("/");
  };

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSuccess("");
    setSettingsError("");

    if (formPassword && formPassword.length < 4) {
      setSettingsError("Password must be at least 4 characters.");
      return;
    }
    if (formPassword !== formConfirmPassword) {
      setSettingsError("Passwords do not match.");
      return;
    }

    setUserName(formName);
    setUserPhone(formPhone);
    setSettingsSuccess("Profile details updated successfully!");
    setFormPassword("");
    setFormConfirmPassword("");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500 font-semibold text-sm">
          <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
          Loading your session...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans select-none">
      <Header />

      {/* Main Section */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-12">
        
        {/* Title / Welcoming Banner */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Account</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Welcome back, <span className="text-indigo-650 font-bold">{userName}</span>. Manage your orders, tracking, and warranty details here.
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-rose-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl text-sm font-bold transition-all cursor-pointer w-fit self-start sm:self-auto"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-3">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-slate-900 flex items-center justify-center text-white text-lg font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-extrabold text-slate-800 truncate leading-tight">{userName}</h4>
                <p className="text-[11px] text-slate-400 font-semibold truncate mt-0.5">{userEmail}</p>
              </div>
            </div>

            <nav className="bg-white rounded-2xl border border-slate-100 p-2.5 shadow-sm flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar shrink-0 gap-1">
              {[
                { id: "overview", label: "Overview", icon: User },
                { id: "orders", label: "My Orders", icon: ShoppingBag },
                { id: "addresses", label: "Addresses", icon: MapPin },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setSelectedOrder(null);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-slate-900 text-white shadow-sm" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <IconComponent size={18} className="shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Panel Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 min-h-[480px] shadow-sm relative overflow-hidden">
              
              {/* Tab 1: Overview */}
              {activeTab === "overview" && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-800">Account Summary</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Quick look at your recent activities</p>
                  </div>

                  {/* Stat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                        <ShoppingBag size={18} />
                      </div>
                      <div className="text-2xl font-black text-slate-800">{orders.length}</div>
                      <div className="text-xs text-slate-400 font-semibold mt-0.5">Total Orders Placed</div>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                        <CheckCircle size={18} />
                      </div>
                      <div className="text-2xl font-black text-slate-800">
                        {orders.filter(o => o.status === "Delivered").length}
                      </div>
                      <div className="text-xs text-slate-400 font-semibold mt-0.5">Completed Orders</div>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-[#fca61f]/10 text-[#fca61f] flex items-center justify-center mb-3">
                        <Package size={18} />
                      </div>
                      <div className="text-2xl font-black text-slate-800">
                        {orders.filter(o => o.status === "Processing" || o.status === "Shipped").length}
                      </div>
                      <div className="text-xs text-slate-400 font-semibold mt-0.5">Pending Deliveries</div>
                    </div>
                  </div>

                  {/* Quick Profile Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="border border-slate-100 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-800">Profile Details</h4>
                        <button onClick={() => setActiveTab("settings")} className="text-xs font-bold text-indigo-650 hover:underline cursor-pointer">
                          Edit
                        </button>
                      </div>
                      <div className="space-y-2.5 text-xs text-slate-600 font-medium">
                        <div className="flex gap-2">
                          <span className="text-slate-400 w-16">Name:</span>
                          <span className="font-bold text-slate-800">{userName}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-slate-400 w-16">Email:</span>
                          <span className="font-bold text-slate-800">{userEmail}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-slate-400 w-16">Phone:</span>
                          <span className="font-bold text-slate-800">{userPhone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-slate-100 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-800">Primary Shipping Address</h4>
                        <button onClick={() => setActiveTab("addresses")} className="text-xs font-bold text-indigo-650 hover:underline cursor-pointer">
                          Edit
                        </button>
                      </div>
                      <div className="text-xs text-slate-600 font-medium leading-relaxed">
                        <p className="font-bold text-slate-800 mb-1">{shippingAddress.name}</p>
                        <p>{shippingAddress.street}</p>
                        <p>{shippingAddress.area}</p>
                        <p>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.zip}</p>
                        <p className="mt-2 text-slate-400">Phone: {shippingAddress.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Order Preview */}
                  <div className="border border-slate-100 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-slate-800">Latest Order</h4>
                      <button 
                        onClick={() => {
                          setActiveTab("orders");
                          setSelectedOrder(orders[0]);
                        }} 
                        className="text-xs font-bold text-indigo-650 hover:underline cursor-pointer"
                      >
                        View Order Details
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center p-1 font-bold text-slate-600">
                          <Package size={20} className="text-slate-400" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">{orders[0].id}</div>
                          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{orders[0].date}</div>
                        </div>
                      </div>
                      <div className="text-xs">
                        <span className="text-slate-400">Status: </span>
                        <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                          orders[0].status === "Shipped" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                        }`}>
                          {orders[0].status}
                        </span>
                      </div>
                      <div className="text-xs font-black text-slate-800">
                        ₹{orders[0].total.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Orders */}
              {activeTab === "orders" && (
                <div className="space-y-6 animate-fade-in">
                  {!selectedOrder ? (
                    <>
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-800">Order History</h2>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">Manage and track your package delivery</p>
                      </div>

                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div 
                            key={order.id}
                            className="border border-slate-100 rounded-2xl p-5 hover:border-slate-200 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                          >
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2.5">
                                <span className="text-sm font-extrabold text-slate-800">{order.id}</span>
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                  order.status === "Shipped" 
                                    ? "bg-blue-50 text-blue-600" 
                                    : order.status === "Delivered"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-[#fca61f]/10 text-[#fca61f]"
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 font-semibold">Ordered on {order.date}</p>
                              <p className="text-xs font-medium text-slate-500 mt-2 truncate max-w-md">
                                {order.items.map(item => `${item.qty}x ${item.name}`).join(", ")}
                              </p>
                            </div>

                            <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-3 shrink-0 border-t border-slate-50 pt-3 md:border-t-0 md:pt-0">
                              <div className="text-right mr-2">
                                <div className="text-sm font-black text-slate-800">₹{order.total.toLocaleString()}</div>
                                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{order.items.length} items</div>
                              </div>
                              <button
                                onClick={() => handleDownloadInvoice(order)}
                                className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-950 text-xs font-bold rounded-xl transition-all cursor-pointer"
                              >
                                Download Invoice
                              </button>
                              <button 
                                onClick={() => setSelectedOrder(order)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-950 transition-all cursor-pointer"
                              >
                                View Details
                                <ChevronRight size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    // Detailed Order View
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <button 
                          onClick={() => setSelectedOrder(null)} 
                          className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          &larr; Back to List
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(selectedOrder)}
                          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:border-slate-350 text-slate-700 hover:text-slate-900 text-xs font-bold rounded-xl transition-all cursor-pointer"
                        >
                          Download Invoice
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                        <div>
                          <h2 className="text-xl font-extrabold text-slate-800">Order {selectedOrder.id}</h2>
                          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Placed on {selectedOrder.date}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] text-slate-400 font-semibold">Total Amount</p>
                          <p className="text-lg font-black text-slate-800">₹{selectedOrder.total.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Timeline / Stepper */}
                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-700 mb-6">Delivery Timeline</h4>
                        <div className="flex items-center w-full relative">
                          <div className="absolute top-[14px] left-[5%] right-[5%] h-[2px] bg-slate-200 -z-0" />
                          <div className="absolute top-[14px] left-[5%] w-[45%] h-[2px] bg-indigo-650 -z-0" />

                          {/* Steps */}
                          <div className="flex justify-between w-full z-10">
                            <div className="flex flex-col items-center w-[20%] text-center">
                              <div className="w-8 h-8 rounded-full bg-indigo-650 text-white flex items-center justify-center">
                                <CheckCircle size={16} />
                              </div>
                              <span className="text-[10px] font-bold text-slate-800 mt-2">Ordered</span>
                            </div>

                            <div className="flex flex-col items-center w-[20%] text-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                selectedOrder.status !== "Processing" ? "bg-indigo-650 text-white" : "bg-indigo-50 text-indigo-600 border-2 border-indigo-650"
                              }`}>
                                {selectedOrder.status !== "Processing" ? <CheckCircle size={16} /> : <Clock size={16} />}
                              </div>
                              <span className="text-[10px] font-bold text-slate-800 mt-2">Processing</span>
                            </div>

                            <div className="flex flex-col items-center w-[20%] text-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                selectedOrder.status === "Delivered"
                                  ? "bg-indigo-650 text-white"
                                  : selectedOrder.status === "Shipped"
                                  ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-650"
                                  : "bg-white text-slate-300 border-2 border-slate-200"
                              }`}>
                                {selectedOrder.status === "Delivered" ? <CheckCircle size={16} /> : <Truck size={16} />}
                              </div>
                              <span className="text-[10px] font-bold text-slate-800 mt-2">Shipped</span>
                            </div>

                            <div className="flex flex-col items-center w-[20%] text-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                selectedOrder.status === "Delivered"
                                  ? "bg-indigo-650 text-white"
                                  : "bg-white text-slate-300 border-2 border-slate-200"
                              }`}>
                                <CheckCircle size={16} />
                              </div>
                              <span className="text-[10px] font-bold text-slate-800 mt-2">Delivered</span>
                            </div>
                          </div>
                        </div>

                        {selectedOrder.status === "Shipped" && (
                          <div className="mt-8 bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex flex-col sm:flex-row justify-between gap-4 text-xs font-semibold text-blue-700">
                            <div>
                              <p className="text-slate-500">Logistics Carrier</p>
                              <p className="font-bold text-slate-850 mt-0.5">{selectedOrder.carrier}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Tracking Number</p>
                              <p className="font-mono font-bold text-slate-850 mt-0.5">{selectedOrder.trackingNo}</p>
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors self-start sm:self-center font-bold text-[11px] cursor-pointer">
                              Track Shipments
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Items List */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Items in Package</h4>
                        <div className="divide-y divide-slate-100">
                          {selectedOrder.items.map((item) => (
                            <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3.5 min-w-0">
                                <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                  <h5 className="text-xs font-bold text-slate-800 truncate">{item.name}</h5>
                                  <p className="text-[10px] text-slate-400 mt-0.5">Quantity: {item.qty}</p>
                                </div>
                              </div>
                              <div className="text-xs font-black text-slate-800 shrink-0">
                                ₹{item.price.toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
               )}

              {/* Tab 4: Addresses */}
              {activeTab === "addresses" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-800">Saved Addresses</h2>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Manage default logistics destination addresses</p>
                    </div>
                    <button className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-950 transition-all cursor-pointer">
                      <Plus size={14} />
                      Add Address
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Address Card */}
                    <div className="border border-indigo-100 bg-indigo-50/20 rounded-2xl p-5 space-y-4 relative">
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <button className="p-1.5 rounded-lg bg-white border border-slate-100 hover:border-slate-200 text-slate-500 hover:text-slate-800 transition-colors shadow-sm cursor-pointer">
                          <Edit3 size={12} />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                          Default Shipping
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-850 pt-2">{shippingAddress.name}</h4>
                      </div>
                      <div className="text-xs text-slate-600 font-medium leading-relaxed">
                        <p>{shippingAddress.street}</p>
                        <p>{shippingAddress.area}</p>
                        <p>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.zip}</p>
                        <p className="mt-2 text-slate-400 font-bold">Phone: {shippingAddress.phone}</p>
                      </div>
                    </div>

                    {/* Address Card 2 (Billing) */}
                    <div className="border border-slate-100 rounded-2xl p-5 space-y-4 relative">
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <button className="p-1.5 rounded-lg bg-white border border-slate-100 hover:border-slate-200 text-slate-500 hover:text-slate-800 transition-colors shadow-sm cursor-pointer">
                          <Edit3 size={12} />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                          Default Billing
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-850 pt-2">{shippingAddress.name}</h4>
                      </div>
                      <div className="text-xs text-slate-600 font-medium leading-relaxed">
                        <p>{shippingAddress.street}</p>
                        <p>{shippingAddress.area}</p>
                        <p>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.zip}</p>
                        <p className="mt-2 text-slate-400 font-bold">Phone: {shippingAddress.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Settings */}
              {activeTab === "settings" && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-800">Account Settings</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Update configuration details and change security credentials</p>
                  </div>

                  {settingsSuccess && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2">
                      <CheckCircle size={16} className="text-emerald-600" />
                      {settingsSuccess}
                    </div>
                  )}

                  {settingsError && (
                    <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2">
                      <AlertCircle size={16} className="text-rose-500" />
                      {settingsError}
                    </div>
                  )}

                  <form onSubmit={handleUpdateSettings} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500">Full Name</label>
                        <input
                          type="text"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="w-full h-11 px-4 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500">Email Address</label>
                        <input
                          type="email"
                          value={userEmail}
                          disabled
                          className="w-full h-11 px-4 text-xs font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-xl cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500">Phone Number</label>
                        <input
                          type="text"
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          className="w-full h-11 px-4 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-100 my-6 pt-6 space-y-4">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Change Password</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500">New Password</label>
                          <input
                            type="password"
                            value={formPassword}
                            onChange={(e) => setFormPassword(e.target.value)}
                            placeholder="Leave blank to keep current"
                            className="w-full h-11 px-4 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500">Confirm New Password</label>
                          <input
                            type="password"
                            value={formConfirmPassword}
                            onChange={(e) => setFormConfirmPassword(e.target.value)}
                            className="w-full h-11 px-4 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-950 transition-all cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>

        </div>

      </main>


    </div>
  );
}
