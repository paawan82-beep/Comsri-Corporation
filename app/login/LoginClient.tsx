"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, hasSupabaseConfig } from "@/lib/supabase";
import Footer from "@/app/Footer";

import { 
  ChevronLeft, 
  ChevronRight,
  Eye, 
  EyeOff, 
  Check, 
  X, 
  ShieldAlert, 
  Laptop, 
  DollarSign, 
  Gift, 
  Star, 
  ArrowRight,
  ChevronDown,
  Play,
  Apple,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle
} from "lucide-react";
import Header from "../Header";

type Slide = {
  title: string;
  subtitle: string;
};

const slides: Slide[] = [
  {
    title: "Manage your Money Anywhere",
    subtitle: "you can Manage your Money on the go with Quicken on the web",
  },
  {
    title: "Insured PAN-India Shipping",
    subtitle: "We wrap to prevent vibration damage during fast logistics transit",
  },
  {
    title: "Premium Certified Hardware",
    subtitle: "Every refurbished PC undergoes strict multi-point performance quality check",
  },
];

export default function LoginClient() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  // Header & User states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsSupabaseConnected(hasSupabaseConfig());
    }, 0);
  }, []);

  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn") === "true";
    if (logged) {
      const storedEmail = localStorage.getItem("userEmail") || "User";
      setTimeout(() => {
        setIsLoggedIn(true);
        setUserEmail(storedEmail);
      }, 0);
    }
  }, []);

  // Auto-play marketing slider on the right
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isSignUp) {
      if (!fullName) {
        setError("Please enter your name.");
        return;
      }
      if (!email) {
        setError("Please enter your email address.");
        return;
      }
      if (!password) {
        setError("Please enter your password.");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      setLoading(true);

      if (isSupabaseConnected) {
        try {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
              emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
            },
          });

          if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
          }

          setSuccess(true);
          setLoading(false);

          const user = data.user;
          // Store locally for general session sync 
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", user?.email || email);
          setIsLoggedIn(true);
          setUserEmail(user?.email || email);

          setTimeout(() => {
            router.push("/");
          }, 1500);
        } catch (err: any) {
          setError(err.message || "An unexpected error occurred.");
          setLoading(false);
        }
      } else {
        // Fallback/Demo mode
        setTimeout(() => {
          setLoading(false);
          setSuccess(true);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", email);
          setIsLoggedIn(true);
          setUserEmail(email);
          setTimeout(() => {
            router.push("/");
          }, 1500);
        }, 1200);
      }
    } else {
      if (!email) {
        setError("Please enter your email address.");
        return;
      }
      if (!password) {
        setError("Please enter your password.");
        return;
      }
      if (password.length < 4) {
        setError("Password must be at least 4 characters.");
        return;
      }

      setLoading(true);

      if (isSupabaseConnected) {
        try {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) {
            setError(signInError.message);
            setLoading(false);
            return;
          }

          setSuccess(true);
          setLoading(false);

          const user = data.user;
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", user?.email || email);
          setIsLoggedIn(true);
          setUserEmail(user?.email || email);

          setTimeout(() => {
            router.push("/");
          }, 1500);
        } catch (err: any) {
          setError(err.message || "An unexpected error occurred.");
          setLoading(false);
        }
      } else {
        // Fallback/Demo mode
        setTimeout(() => {
          setLoading(false);
          setSuccess(true);
          // Persist log-in state so changes on Home page can be shown
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", email);
          setIsLoggedIn(true);
          setUserEmail(email);
          setTimeout(() => {
            router.push("/");
          }, 1500);
        }, 1200);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");

    if (isSupabaseConnected) {
      try {
        const { error: googleError } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
          },
        });

        if (googleError) {
          setError(googleError.message);
          setGoogleLoading(false);
          return;
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred during Google sign in.");
        setGoogleLoading(false);
      }
    } else {
      // Fallback/Demo mode
      setTimeout(() => {
        setGoogleLoading(false);
        setSuccess(true);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", "google-user@comsri.com");
        setIsLoggedIn(true);
        setUserEmail("google-user@comsri.com");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col font-sans select-none">
      
      <Header />

      {/* 3. Centered Login Card Panel */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto bg-[#F5F6F8] flex items-center justify-center p-4 md:p-8 lg:p-16 relative overflow-hidden selection:bg-indigo-100">
        {/* Dynamic ambient soft lighting glows using fast GPU radial gradients instead of heavy blur filters */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] pointer-events-none bg-[radial-gradient(circle_at_center,rgba(165,180,252,0.25)_0%,transparent_70%)]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] pointer-events-none bg-[radial-gradient(circle_at_center,rgba(167,243,208,0.25)_0%,transparent_70%)]" />

        {/* Main card container (ARROW REMOVED AS REQUESTED) */}
        <div 
          id="login-card-container" 
          className={`relative w-full max-w-[1600px] bg-white rounded-[32px] overflow-hidden shadow-[0_24px_70px_rgba(47,48,74,0.08)] border border-slate-100 flex flex-col ${isSignUp ? "md:flex-row-reverse" : "md:flex-row"} min-h-[640px] md:min-h-[700px] z-10 transition-all duration-500 ease-in-out`}
        >
          
          {/* Left Side: Log In / Sign Up Form Panel */}
          <div 
            className="w-full md:w-[52%] p-8 sm:p-12 md:p-16 flex flex-col justify-between relative bg-white transition-all duration-500 ease-in-out"
          >
            
            {/* Logo & Brand to match image mockups */}
            <div className="flex items-center gap-2 mb-10 md:mb-0" id="login-brand-logo">
              <div className="relative w-9 h-9 flex items-center justify-center">
                {/* Custom SVG logo based on .Finance logo style in mockup */}
                <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                  <circle cx="50" cy="50" r="45" className="fill-slate-900" />
                  <path d="M 25 50 A 25 25 0 0 0 75 50" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="10" className="fill-emerald-400" />
                </svg>
              </div>
              <div className="flex items-baseline">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">.comsri</span>
                <span className="text-xs font-semibold text-slate-500 ml-1">finance</span>
              </div>
            </div>
 
            {/* Core Box */}
            <div className={`my-auto ${isSignUp ? "max-w-[640px]" : "max-w-[440px]"} w-full mx-auto transition-all duration-300`} id="signin-primary-form">
              <div className="mb-6">
                <h1 className="text-[34px] font-extrabold text-slate-900 tracking-tight leading-none mb-3">
                  {isSignUp ? "Create Account" : "Wellcome Back!"}
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                  {isSignUp ? "Please enter your details to sign up" : "Please enter log in detals below"}
                </p>
              </div>




 
              {/* Error notifications */}
              {error && (
                <div 
                  className="mb-5 p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in"
                >
                  <ShieldAlert size={16} className="shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}
 
              {/* Success Animation overlay */}
              {success && (
                <div 
                  className="mb-5 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex flex-col items-center gap-2 text-center text-sm font-bold shadow-sm animate-fade-in"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-1">
                    <Check size={20} className="stroke-[3]" />
                  </div>
                  <div>{isSignUp ? "Account Created Successfully!" : "Authentication Successful!"}</div>
                  <div className="text-xs text-emerald-600 font-medium font-mono">Redirecting to Comsri...</div>
                </div>
              )}
 
              <form onSubmit={handleSignIn} className="space-y-4">
                {isSignUp ? (
                  <>
                    {/* Row 1: Full Name & Email side-by-side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative group">
                        <input
                          id="name-input"
                          type="text"
                          value={fullName}
                          disabled={loading || success}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Full Name"
                          className="w-full h-14 px-5 text-sm font-medium text-slate-900 bg-[#f5f5f5] border-2 border-[#bebebe] rounded-2xl focus:outline-none focus:bg-white focus:border-[#bebebe] focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-400"
                        />
                      </div>
                      <div className="relative group">
                        <input
                          id="email-input"
                          type="email"
                          value={email}
                          disabled={loading || success}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                          className="w-full h-14 px-5 text-sm font-medium text-slate-900 bg-[#f5f5f5] border-2 border-[#bebebe] rounded-2xl focus:outline-none focus:bg-white focus:border-[#bebebe] focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Row 2: Password & Confirm Password side-by-side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative group">
                        <input
                          id="password-input"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          disabled={loading || success}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          className="w-full h-14 pl-5 pr-12 text-sm font-medium text-slate-900 bg-[#f5f5f5] border-2 border-[#bebebe] rounded-2xl focus:outline-none focus:bg-white focus:border-[#bebebe] focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-400"
                        />
                        <button
                          type="button"
                          id="password-toggle-eye"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 active:scale-90 transition-all"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <div className="relative group">
                        <input
                          id="confirm-password-input"
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          disabled={loading || success}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm Password"
                          className="w-full h-14 px-5 text-sm font-medium text-slate-900 bg-[#f5f5f5] border-2 border-[#bebebe] rounded-2xl focus:outline-none focus:bg-white focus:border-[#bebebe] focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Email Entry */}
                    <div className="relative group">
                      <input
                        id="email-input"
                        type="email"
                        value={email}
                        disabled={loading || success}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full h-14 px-5 text-sm font-medium text-slate-900 bg-[#f5f5f5] border-2 border-[#bebebe] rounded-2xl focus:outline-none focus:bg-white focus:border-[#bebebe] focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-400"
                      />
                    </div>
     
                    {/* Password Entry */}
                    <div className="relative group">
                      <input
                        id="password-input"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        disabled={loading || success}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full h-14 pl-5 pr-12 text-sm font-medium text-slate-900 bg-[#f5f5f5] border-2 border-[#bebebe] rounded-2xl focus:outline-none focus:bg-white focus:border-[#bebebe] focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        id="password-toggle-eye"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 active:scale-90 transition-all"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </>
                )}
 
                {/* Forget Password */}
                {!isSignUp && (
                  <div className="flex justify-end pt-1">
                    <Link 
                      href="#" 
                      id="forget-password-link"
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      Forget password?
                    </Link>
                  </div>
                )}
 
                {/* Submit Button */}
                <button
                  type="submit"
                  id="sign-in-submit-btn"
                  disabled={loading || googleLoading || success}
                  className="w-full h-14 bg-slate-900 hover:bg-slate-950 text-white font-semibold rounded-2xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center relative cursor-pointer overflow-hidden disabled:bg-slate-400 disabled:cursor-not-allowed group animate-none"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <circle className="opacity-75" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="30, 150" />
                      </svg>
                      <span>{isSignUp ? "Creating account..." : "Signing in..."}</span>
                    </div>
                  ) : (
                    <span className="tracking-wide">{isSignUp ? "Sign Up" : "Sign in"}</span>
                  )}
                </button>
              </form>
 
              {/* Separator */}
              <div className="relative my-7 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>
                <span className="relative px-4 text-xs font-medium text-slate-400 bg-white/0 select-none">
                  or continue
                </span>
              </div>
 
              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading || success}
                type="button"
                id="google-signin-btn"
                className="w-full h-14 border border-[#bebebe] bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-2xl text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-none hover:shadow-sm"
              >
                {googleLoading ? (
                  <svg className="animate-spin h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <circle className="opacity-75" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="30, 150" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.81-2.58-.81-5.12 0-7.7z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                )}
                <span>{isSignUp ? "Sign up with Google" : "Log in with Google"}</span>
              </button>
            </div>
 
            {/* Footer Navigation */}
            <div className="text-center mt-10 md:mt-0" id="login-form-footer">
              <span className="text-xs text-slate-400 font-semibold">{isSignUp ? "Already have an account? " : "Don't have an account? "}</span>
              <button 
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                className="text-xs font-bold text-slate-900 hover:underline cursor-pointer border-none bg-none outline-none inline-flex items-center gap-1 group transition-all"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </div>
 
          {/* Right Side: Charcoal Promo Panel with modern 3D Look and Hexagon */}
          <div 
            className="w-full md:w-[48%] bg-[#121316] relative flex flex-col justify-between p-8 sm:p-12 text-white overflow-hidden transition-all duration-500 ease-in-out"
          >
            
            {/* Subtle Grid Art background inside the pane */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.06] flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-[140%] h-[140%] stroke-white fill-none stroke-[0.2]">
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Diagonals */}
                <line x1="0" y1="0" x2="100" y2="100" />
                <line x1="100" y1="0" x2="0" y2="100" />
              </svg>
            </div>

            {/* Center Graphic Frame with detailed Floating Geometries */}
            <div className="relative flex-1 w-full flex items-center justify-center mt-6 min-h-[280px]">
              
              {/* SVG Floating Dodecahedron (Purple) - Top Left */}
              <div
                style={{ perspective: 400 }}
                className="absolute left-[8%] top-[12%] z-20 cursor-grab active:cursor-grabbing animate-float-1"
              >
                <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
                  <defs>
                    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                  <polygon points="50,5 92,30 92,70 50,95 8,70 8,30" fill="url(#purpleGrad)" opacity="0.85" />
                  <polygon points="50,5 50,50 92,30" fill="none" stroke="#e0e7ff" strokeWidth="2.5" opacity="0.7" />
                  <polygon points="92,30 50,50 92,70" fill="none" stroke="#e0e7ff" strokeWidth="2.5" opacity="0.7" />
                  <polygon points="92,70 50,50 50,95" fill="none" stroke="#e0e7ff" strokeWidth="2.5" opacity="0.7" />
                  <polygon points="50,95 50,50 8,70" fill="none" stroke="#e0e7ff" strokeWidth="2.5" opacity="0.7" />
                  <polygon points="8,70 50,50 8,30" fill="none" stroke="#e0e7ff" strokeWidth="2.5" opacity="0.7" />
                  <polygon points="8,30 50,50 50,5" fill="none" stroke="#e0e7ff" strokeWidth="2.5" opacity="0.7" />
                </svg>
              </div>

              {/* SVG Floating Wireframe (Yellow) - Top Right */}
              <div className="absolute right-[12%] top-[18%] z-20 animate-float-2">
                <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
                  <rect x="15" y="15" width="70" height="70" rx="16" stroke="#facc15" strokeWidth="18" className="opacity-90" />
                </svg>
              </div>

              {/* SVG Floating Torus Ring (Mint Green) - Bottom Right */}
              <div className="absolute right-[5%] bottom-[12%] z-20 animate-float-3">
                <svg width="55" height="55" viewBox="0 0 100 100" fill="none">
                  <defs>
                    <linearGradient id="mintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a7f3d0" />
                      <stop offset="50%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="32" stroke="url(#mintGrad)" strokeWidth="14" fill="none" />
                </svg>
              </div>

              {/* SVG Floating Triangle Pyramid (Green) - Bottom Left */}
              <div className="absolute left-[15%] bottom-[18%] z-20 animate-float-4">
                <svg width="26" height="26" viewBox="0 0 100 100" fill="none">
                  <polygon points="50,15 90,85 10,85" stroke="#a3e635" strokeWidth="14" strokeLinejoin="round" fill="none" />
                </svg>
              </div>

              {/* Radiant Hexagon container */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                 {/* Outer hexagon glowing outline mask using fast radial-gradient */}
                 <div className="absolute inset-x-0 inset-y-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.3)_0%,rgba(129,140,248,0.3)_50%,transparent_100%)] scale-105 pointer-events-none" />

                {/* The glowing gradient hexagon borders */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full fill-none">
                  <defs>
                    <linearGradient id="hexGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4ade80" />
                      <stop offset="50%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#a7f3d0" />
                    </linearGradient>
                  </defs>
                  <polygon 
                    points="50,4 93.3,29 93.3,79 50,104 6.7,79 6.7,29" 
                    stroke="url(#hexGlow)" 
                    strokeWidth="2" 
                    className="fill-[#1b1c21]/95" 
                    transform="translate(0, -4)"
                  />
                </svg>

                {/* HIGH-FIDELITY VECTOR SVG 3D ILLUSTRATION OF CORE TECHNOLOGY WORKER */}
                <div className="relative z-10 w-[78%] h-[78%] flex items-center justify-center pointer-events-none">
                  <svg viewBox="0 0 200 200" className="w-[105%] h-[105%]" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Subtle software grid elements floating behind programmer */}
                    <circle cx="100" cy="80" r="42" stroke="#2a2e38" strokeWidth="1.5" strokeDasharray="3 3"/>
                    <path d="M 60 70 L 140 130" stroke="#2a2e38" strokeWidth="0.75" />
                    
                    {/* Glowing core computer/hologram behind character head */}
                    <g opacity="0.25">
                      <circle cx="100" cy="80" r="14" fill="#a7f3d0" filter="blur(8px)"/>
                    </g>

                    {/* Character Body Structure */}
                    {/* Back neck / collar */}
                    <path d="M 88 102 L 112 102 L 108 122 L 92 122 Z" fill="#e2b49c" />

                    {/* Redneck shadow */}
                    <path d="M 88 111 L 112 111 Q 100 118 88 111" fill="#c38e78" />

                    {/* Cute friendly stylized Head */}
                    <path d="M 82 72 Q 82 60 100 60 Q 118 60 118 72 Q 118 94 100 94 Q 82 94 82 72" fill="#e2b49c" />
                    
                    {/* Tiny Ears */}
                    <circle cx="81" cy="74" r="5" fill="#d19c83" />
                    <circle cx="119" cy="74" r="5" fill="#d19c83" />

                    {/* Hair - Stylish dark layered hair */}
                    <path d="M 83 66 C 80 50, 110 44, 117 64 C 122 56, 115 42, 100 44 C 91 42, 80 52, 83 66 Z" fill="#2d221e" />
                    <path d="M 82 66 C 85 58, 92 56, 95 62" stroke="#2d221e" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 118 66 C 115 58, 108 56, 105 62" stroke="#2d221e" strokeWidth="4" strokeLinecap="round" />
                    {/* Top fringe */}
                    <path d="M 94 48 Q 100 56 106 50 Q 114 56 117 64" stroke="#2d221e" strokeWidth="6" strokeLinecap="round" />

                    {/* Eyes (Simple stylized geometric modern vector dots) */}
                    <circle cx="94" cy="71" r="2.5" fill="#1b1c21" />
                    <circle cx="106" cy="71" r="2.5" fill="#1b1c21" />
                    <path d="M 92 66 Q 94 64 96 66" stroke="#2d221e" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 104 66 Q 106 64 108 66" stroke="#2d221e" strokeWidth="1.5" strokeLinecap="round" />

                    {/* Soft Rosy Cheeks */}
                    <circle cx="87" cy="76" r="3" fill="#f43f5e" opacity="0.25" />
                    <circle cx="113" cy="76" r="3" fill="#f43f5e" opacity="0.25" />

                    {/* Smiling Mouth */}
                    <path d="M 97 78 Q 100 81 103 78" stroke="#1b1c21" strokeWidth="2" strokeLinecap="round" />

                    {/* Modern Torso & Shirt */}
                    {/* White modern standard fit t-shirt */}
                    <path d="M 72 124 L 128 124 L 124 165 L 76 165 Z" fill="#f1f5f9" />
                    {/* Soft shading on shirt */}
                    <path d="M 100 124 L 128 124 L 124 165 L 115 165 Z" fill="#e2e8f0" opacity="0.6"/>

                    {/* Sleeves */}
                    <path d="M 72 124 Q 61 130 58 141 L 70 148 L 76 131 Z" fill="#f1f5f9" />
                    <path d="M 128 124 Q 139 130 142 141 L 130 148 L 124 131 Z" fill="#e2e8f0" />

                    {/* Arm Holding Laptop */}
                    <path d="M 58 141 L 74 158 Q 90 162 98 152" stroke="#e2b49c" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 142 141 L 126 158 Q 110 162 102 152" stroke="#e2b49c" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Blue Jeans */}
                    <path d="M 76 165 L 124 165 L 128 200 L 72 200 Z" fill="#2563eb" />
                    {/* Inner thigh seam / pocket lines */}
                    <line x1="100" y1="165" x2="100" y2="200" stroke="#1d4ed8" strokeWidth="2.5" />
                    <path d="M 80 165 Q 88 175 88 185" stroke="#1d4ed8" strokeWidth="1.5" fill="none" />
                    <path d="M 120 165 Q 112 175 112 185" stroke="#1d4ed8" strokeWidth="1.5" fill="none" />

                    {/* 3D-Look Stylized Laptop in Front */}
                    <g transform="translate(0, -4)">
                      {/* Glowing screen reflection underneath */}
                      <ellipse cx="100" cy="142" rx="34" ry="14" fill="#6366f1" opacity="0.25" filter="blur(6px)" />
                      
                      {/* Opened screen (slanted) */}
                      <polygon points="63,142 137,142 140,118 60,118" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round" />
                      {/* Screen glossy glow reflection strip */}
                      <polygon points="66,120 85,120 102,140 83,140" fill="white" opacity="0.08" />
                      {/* Screen logo */}
                      <circle cx="100" cy="130" r="3" fill="#cbd5e1" />

                      {/* Keyboard lower base deck */}
                      <polygon points="56,155 144,155 137,142 63,142" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round"/>
                      {/* Dark trackpad */}
                      <polygon points="90,153 110,153 108,150 92,150" fill="#64748b" />
                      {/* Port lines */}
                      <line x1="59" y1="149" x2="61" y2="150" stroke="#475569" strokeWidth="1.5" />
                      <line x1="141" y1="149" x2="139" y2="150" stroke="#475569" strokeWidth="1.5" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            {/* Text descriptions Slider & Slide dots indicators */}
            <div className="relative text-center mt-4">
              
              <div className="h-28 overflow-hidden relative max-w-[340px] mx-auto">
                <div
                  key={activeSlide}
                  className="absolute inset-0 flex flex-col justify-center animate-fade-in"
                >
                  <h2 className="text-[21px] font-extrabold tracking-tight mb-2 select-none text-slate-100">
                    {slides[activeSlide].title}
                  </h2>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed select-none max-w-[280px] mx-auto">
                    {slides[activeSlide].subtitle}
                  </p>
                </div>
              </div>

              {/* Slider Dots */}
              <div className="flex justify-center items-center gap-2 mt-6" id="marketing-slide-indicator">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                      activeSlide === idx ? "w-6 bg-emerald-400" : "w-2.5 bg-slate-700 hover:bg-slate-500"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
 
        </div>
      </div>

      {/* 4. Footer Section */}
      <Footer />
    </div>
  );
}
