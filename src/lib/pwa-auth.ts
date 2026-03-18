/**
 * Detects whether the app is running as an installed PWA (standalone mode).
 * In standalone mode, OAuth redirects break on iOS because the callback
 * opens in Safari instead of returning to the PWA webview.
 */
export function isStandalonePWA(): boolean {
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
 * In a normal browser tab, uses the standard next-auth signIn() redirect.
 * In standalone PWA mode, opens the OAuth flow in the system browser so
 * the redirect callback can complete successfully, then navigates back to the app.
 */
export function startOAuthSignIn(provider: "google" | "facebook") {
  if (isStandalonePWA()) {
    // In standalone PWA, open OAuth in system browser.
    // The callback will land on /dashboard which re-opens the PWA.
    window.open(
      `/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent("/dashboard")}`,
      "_blank"
    );
  } else {
    // Normal browser — use standard next-auth redirect
    // Dynamic import to avoid pulling next-auth/react into the module scope
    import("next-auth/react").then(({ signIn }) => {
      signIn(provider, { callbackUrl: "/dashboard" });
    });
  }
}
