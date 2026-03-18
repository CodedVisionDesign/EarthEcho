"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@/lib/fontawesome";
import { startOAuthSignIn } from "@/lib/pwa-auth";

export function RegisterOAuthButtons() {
  return (
    <div className="mb-6 space-y-3">
      <button
        type="button"
        onClick={() => startOAuthSignIn("google")}
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
        onClick={() => startOAuthSignIn("facebook")}
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
