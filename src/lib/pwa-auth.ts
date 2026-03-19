import { signIn } from "next-auth/react";

/**
 * Detects whether the app is running as an installed PWA (standalone mode).
 */
function isStandalonePWA(): boolean {
  if (typeof window === "undefined") return false;

  // iOS Safari standalone mode
  if ("standalone" in window.navigator && (window.navigator as unknown as { standalone: boolean }).standalone) {
    return true;
  }

  // Android / desktop PWA (Chrome, Edge, etc.)
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return true;
  }

  return false;
}

/**
 * Starts an OAuth sign-in flow that works in both browser and PWA standalone mode.
 *
 * In a normal browser, uses the standard next-auth signIn() redirect.
 * In standalone PWA mode on iOS, OAuth callbacks can't return to the webview,
 * so we open the login page in the system browser where OAuth works normally.
 */
export function startOAuthSignIn(provider: "google" | "facebook") {
  if (isStandalonePWA()) {
    // Open the login page in the system browser where OAuth redirects work.
    // After successful auth, the user lands on /dashboard in the browser.
    window.open(`/login`, "_blank");
  } else {
    // Normal browser — use standard next-auth signIn with CSRF protection
    signIn(provider, { callbackUrl: "/dashboard" });
  }
}
