"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook, faArrowUpRightFromSquare } from "@/lib/fontawesome";

export function RegisterOAuthButtons() {
  const [isIOSPWA, setIsIOSPWA] = useState(false);

  useEffect(() => {
    const standalone = "standalone" in navigator && (navigator as unknown as { standalone: boolean }).standalone === true;
    setIsIOSPWA(standalone);
  }, []);

  function handleOAuth(provider: "google" | "facebook") {
    if (isIOSPWA) {
      window.location.href = `/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent("/dashboard")}`;
    } else {
      signIn(provider, { callbackUrl: "/dashboard" });
    }
  }

  return (
    <div className="mb-6 space-y-3">
      {isIOSPWA && (
        <div className="rounded-lg border border-ocean/20 bg-ocean/5 px-4 py-3 text-xs text-slate">
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="mr-1.5 h-3 w-3 text-ocean" />
          Social login will open in Safari. Once signed in, return to the app.
        </div>
      )}
      <button
        type="button"
        onClick={() => handleOAuth("google")}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-charcoal transition-all duration-200 hover:bg-gray-50 hover:shadow-sm"
      >
        <FontAwesomeIcon
          icon={faGoogle}
          className="h-4 w-4 text-[#4285F4]"
          aria-hidden
        />
        Sign up with Google
      </button>
      <button
        type="button"
        onClick={() => handleOAuth("facebook")}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#1877F2] bg-[#1877F2] px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-[#166FE5]"
      >
        <FontAwesomeIcon
          icon={faFacebook}
          className="h-4 w-4"
          aria-hidden
        />
        Sign up with Facebook
      </button>
    </div>
  );
}
