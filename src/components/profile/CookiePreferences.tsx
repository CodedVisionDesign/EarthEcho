"use client";

import { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved } from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { resetCookieConsent } from "@/components/CookieConsent";

export function CookiePreferences() {
  const handleManageCookies = useCallback(() => {
    resetCookieConsent();
    // Scroll to top so the user sees the modal
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Card variant="default" className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={faShieldHalved} className="h-4 w-4 text-forest" aria-hidden />
        <h3 className="text-[15px] font-semibold text-charcoal">
          Cookie Preferences
        </h3>
      </div>
      <p className="mb-4 text-sm text-slate">
        You can change your cookie preferences at any time. This will re-open the
        consent dialog where you can accept or reject analytics cookies.
      </p>
      <button
        type="button"
        onClick={handleManageCookies}
        className="rounded-xl bg-forest/10 px-4 py-2.5 text-sm font-medium text-forest transition-colors hover:bg-forest/20"
      >
        Manage Cookie Preferences
      </button>
    </Card>
  );
}
