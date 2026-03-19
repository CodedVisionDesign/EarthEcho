"use client";

import { useState, useEffect, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faRightToBracket,
  faGoogle,
  faFacebook,
} from "@/lib/fontawesome";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PasskeyLoginButton } from "@/components/auth/PasskeyLoginButton";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const standalone =
      ("standalone" in navigator && (navigator as unknown as { standalone: boolean }).standalone === true) ||
      window.matchMedia("(display-mode: standalone)").matches;
    setIsPWA(standalone);
  }, []);

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        triggerShake();
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Invalid email or password");
      triggerShake();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Passkey / Biometric Login */}
      <div className="mb-4">
        <PasskeyLoginButton onError={(msg) => setError(msg)} />
      </div>

      {/* OAuth Buttons - side by side, Facebook hidden in standalone PWA */}
      <div className="mb-4 flex gap-3">
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-charcoal transition-all duration-200 hover:bg-gray-50 hover:shadow-sm"
        >
          <FontAwesomeIcon
            icon={faGoogle}
            className="h-4 w-4 text-[#4285F4]"
            aria-hidden
          />
          Google
        </button>
        {!isPWA && (
          <button
            type="button"
            onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#1877F2] bg-[#1877F2] px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#166FE5]"
          >
            <FontAwesomeIcon
              icon={faFacebook}
              className="h-4 w-4"
              aria-hidden
            />
            Facebook
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-400" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-gray-600">
          or
        </span>
        <div className="h-px flex-1 bg-gray-400" />
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-3 rounded-lg bg-coral/10 px-4 py-2 text-sm text-coral">
          {error}
        </div>
      )}

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit} className={`space-y-3 ${shake ? "animate-shake" : ""}`}>
        <fieldset disabled={loading} className="space-y-3">
          <Input
            label="Email"
            type="email"
            icon={faEnvelope}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            icon={faLock}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-forest transition-colors hover:text-forest-dark hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </fieldset>
        <Button
          type="submit"
          variant="primary"
          size="md"
          leftIcon={faRightToBracket}
          loading={loading}
          className="w-full"
        >
          Log In
        </Button>
      </form>
    </>
  );
}
