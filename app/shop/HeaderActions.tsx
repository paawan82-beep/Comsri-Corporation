"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HeaderActions() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn") === "true";
    if (logged) {
      const email = localStorage.getItem("userEmail") || "User";
      setTimeout(() => {
        setIsLoggedIn(true);
        setUserEmail(email);
      }, 0);
    }
  }, []);

  return (
    <div className="flex items-center gap-x-6 text-sm font-medium text-gray-800">
      <div className="flex items-center gap-2 cursor-pointer border-r border-gray-300 pr-6">
        <div className="w-6 h-4 overflow-hidden rounded relative flex-shrink-0">
          <div className="h-1/3 bg-[#FF9933] w-full"></div>
          <div className="h-1/3 bg-white w-full flex justify-center items-center">
            <div className="w-2 h-2 rounded-full border border-[0.5px] border-[#000080]"></div>
          </div>
          <div className="h-1/3 bg-[#138808] w-full"></div>
        </div>
        <span>IND</span>
      </div>
      {isLoggedIn ? (
        <div className="flex items-center gap-3 animate-fade-in">
          <span className="text-slate-700 font-bold max-w-[140px] truncate select-none">
            Hello, {userEmail.split("@")[0]}!
          </span>
          <button 
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("userEmail");
              setIsLoggedIn(false);
            }}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-full font-bold transition-all active:scale-95 cursor-pointer"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link href="/login" className="hover:text-[#6366f1] font-bold transition-colors">
          Login / Register
        </Link>
      )}
    </div>
  );
}
