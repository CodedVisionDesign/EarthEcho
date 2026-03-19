"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { saveCookieConsent } from "@/lib/actions";

type ConsentState = "pending" | "accepted" | "rejected";

const CONSENT_KEY = "ee_cookie_consent";
const CONSENT_TS_KEY = "ee_cookie_consent_ts";
const GA_ID = "G-DDX1YNQB4Q";
const CONSENT_EXPIRY_MS = 365 * 24 * 60 * 60 * 1000; // 12 months

/** Legal pages where the cookie modal should not interrupt the user. */
const LEGAL_PATHS = ["/cookies", "/privacy", "/terms", "/data-deletion"];

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

/** Check if consent has expired (older than 12 months). */
function isConsentExpired(): boolean {
  const ts = localStorage.getItem(CONSENT_TS_KEY);
  if (!ts) return true;
  return Date.now() - Number(ts) > CONSENT_EXPIRY_MS;
}

/** Reset cookie consent — used by the "Manage Cookies" button in settings/footer. */
export function resetCookieConsent() {
  localStorage.removeItem(CONSENT_KEY);
  localStorage.removeItem(CONSENT_TS_KEY);
  revokeGoogleAnalytics();
  // Dispatch a custom event so the CookieConsent component re-shows
  window.dispatchEvent(new Event("cookie-consent-reset"));
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>("pending");
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Don't show in Capacitor native app
    if ((window as unknown as Record<string, unknown>).Capacitor) return;

    const stored = localStorage.getItem(CONSENT_KEY);

    if (stored && !isConsentExpired()) {
      if (stored === "accepted") {
        setConsent("accepted");
        loadGoogleAnalytics();
      } else if (stored === "rejected") {
        setConsent("rejected");
      }
    } else {
      // Expired or no stored value — clear stale data and re-ask
      localStorage.removeItem(CONSENT_KEY);
      localStorage.removeItem(CONSENT_TS_KEY);

      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for "cookie-consent-reset" events (from Manage Cookies button)
  useEffect(() => {
    function handleReset() {
      setConsent("pending");
      // Small delay before re-showing
      setTimeout(() => setVisible(true), 300);
    }
    window.addEventListener("cookie-consent-reset", handleReset);
    return () => window.removeEventListener("cookie-consent-reset", handleReset);
  }, []);

  const handleAccept = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    localStorage.setItem(CONSENT_TS_KEY, String(Date.now()));
    setConsent("accepted");
    setVisible(false);
    loadGoogleAnalytics();
    // Persist to server for audit trail (non-blocking)
    saveCookieConsent({ analytics: true }).catch(() => {});
  }, []);

  const handleReject = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "rejected");
    localStorage.setItem(CONSENT_TS_KEY, String(Date.now()));
    setConsent("rejected");
    setVisible(false);
    revokeGoogleAnalytics();
    // Persist to server for audit trail (non-blocking)
    saveCookieConsent({ analytics: false }).catch(() => {});
  }, []);

  // Already decided, native app, or on a legal page
  if (consent !== "pending" || !visible) return null;
  if (LEGAL_PATHS.includes(pathname)) return null;

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
