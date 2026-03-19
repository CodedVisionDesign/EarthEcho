"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

type ConsentState = "pending" | "accepted" | "rejected";

const CONSENT_KEY = "ee_cookie_consent";
const GA_ID = "G-DDX1YNQB4Q";

function loadGoogleAnalytics() {
  if (document.getElementById("gtag-script")) return;

  const script = document.createElement("script");
  script.id = "gtag-script";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  gtag("js", new Date());
  gtag("config", GA_ID);
}

function revokeGoogleAnalytics() {
  // Remove gtag script
  document.getElementById("gtag-script")?.remove();

  // Clear GA cookies
  const gaCookies = document.cookie
    .split(";")
    .map((c) => c.trim())
    .filter((c) => c.startsWith("_ga") || c.startsWith("_gid"));
  for (const cookie of gaCookies) {
    const name = cookie.split("=")[0];
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>("pending");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show in Capacitor native app
    if ((window as unknown as Record<string, unknown>).Capacitor) return;

    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === "accepted") {
      setConsent("accepted");
      loadGoogleAnalytics();
    } else if (stored === "rejected") {
      setConsent("rejected");
    } else {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setConsent("accepted");
    setVisible(false);
    loadGoogleAnalytics();
  }, []);

  const handleReject = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "rejected");
    setConsent("rejected");
    setVisible(false);
    revokeGoogleAnalytics();
  }, []);

  // Already decided or native app
  if (consent !== "pending" || !visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1f25] p-6 shadow-2xl">
        {/* Logo */}
        <div className="mb-4 flex justify-center">
          <Image
            src="/assets/ee-logo.webp"
            alt="Earth Echo"
            width={48}
            height={48}
            className="rounded-xl"
          />
        </div>

        {/* Heading */}
        <h2 className="mb-2 text-center text-lg font-semibold text-white">
          We value your privacy
        </h2>

        {/* Description */}
        <p className="mb-1 text-center text-sm leading-relaxed text-white/60">
          We use <strong className="text-white/80">essential cookies</strong> to
          keep you signed in, and{" "}
          <strong className="text-white/80">analytics cookies</strong> (Google
          Analytics) to understand how our site is used so we can improve your
          experience.
        </p>
        <p className="mb-5 text-center text-xs text-white/40">
          Read our{" "}
          <Link
            href="/cookies"
            className="text-[#52B788] underline decoration-[#52B788]/30 hover:text-[#52B788]/80"
          >
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-[#52B788] underline decoration-[#52B788]/30 hover:text-[#52B788]/80"
          >
            Privacy Policy
          </Link>{" "}
          for details.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleReject}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 rounded-xl bg-[#2D6A4F] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#40916C]"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
