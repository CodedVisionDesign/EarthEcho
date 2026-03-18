"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faSpinner } from "@/lib/fontawesome";
import {
  browserSupportsWebAuthn,
  authenticateWithPasskey,
} from "@/lib/webauthn";

interface PasskeyLoginButtonProps {
  onError?: (message: string) => void;
}

export function PasskeyLoginButton({ onError }: PasskeyLoginButtonProps) {
  const router = useRouter();
  const [supported, setSupported] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSupported(browserSupportsWebAuthn());
  }, []);

  if (!supported) return null;

  async function handlePasskeyLogin() {
    setLoading(true);

    try {
      // Trigger biometric prompt (discoverable credentials — no email needed)
      const { userId, token } = await authenticateWithPasskey();

      // Use the one-time token to sign in via next-auth
      const result = await signIn("passkey", {
        userId,
        token,
        redirect: false,
      });

      if (result?.error) {
        onError?.("Passkey authentication failed. Please try again.");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      // Don't show error if user cancelled the biometric prompt
      if (
        !message.includes("cancelled") &&
        !message.includes("canceled") &&
        !message.includes("NotAllowedError") &&
        !message.includes("AbortError")
      ) {
        onError?.(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handlePasskeyLogin}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-forest/30 bg-forest/5 px-4 py-2.5 text-sm font-medium text-forest transition-all duration-200 hover:bg-forest/10 hover:shadow-sm disabled:opacity-50"
    >
      {loading ? (
        <FontAwesomeIcon
          icon={faSpinner}
          className="h-4 w-4 animate-spin"
          aria-hidden
        />
      ) : (
        <FontAwesomeIcon icon={faKey} className="h-4 w-4" aria-hidden />
      )}
      Sign in with Passkey
    </button>
  );
}
