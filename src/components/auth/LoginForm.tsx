"use client";

import { useState, type FormEvent } from "react";
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
import { startOAuthSignIn } from "@/lib/pwa-auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Invalid email or password");
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

      {/* OAuth Buttons */}
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
          Continue with Google
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
          Continue with Facebook
        </button>
      </div>

      {/* Divider */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-400" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-gray-600">
          or
        </span>
        <div className="h-px flex-1 bg-gray-400" />
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 rounded-lg bg-coral/10 px-4 py-2.5 text-sm text-coral">
          {error}
        </div>
      )}

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          icon={faEnvelope}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          icon={faLock}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-forest transition-colors hover:text-forest-dark hover:underline"
          >
            Forgot password?
          </Link>
        </div>
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
