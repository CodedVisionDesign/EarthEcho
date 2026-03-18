"use client";

import { useState, useMemo, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  faEnvelope,
  faLock,
  faUser,
  faUserPlus,
  faCircleCheck,
} from "@/lib/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerUser } from "@/lib/actions";

function getPasswordStrength(pw: string): { score: number; label: string; color: string; tips: string[] } {
  if (!pw) return { score: 0, label: "", color: "", tips: [] };

  let score = 0;
  const tips: string[] = [];

  if (pw.length >= 8) score++;
  else tips.push("At least 8 characters");

  if (pw.length >= 12) score++;

  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  else tips.push("Mix uppercase & lowercase");

  if (/\d/.test(pw)) score++;
  else tips.push("Add a number");

  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  else tips.push("Add a special character");

  if (score <= 1) return { score, label: "Weak", color: "bg-coral", tips };
  if (score <= 2) return { score, label: "Fair", color: "bg-amber-500", tips };
  if (score <= 3) return { score, label: "Good", color: "bg-sunshine", tips };
  if (score <= 4) return { score, label: "Strong", color: "bg-leaf", tips };
  return { score, label: "Excellent", color: "bg-forest", tips };
}

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!agreedToTerms) {
      setError("Please accept the Terms of Service and Privacy Policy to continue.");
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser({ name, email, password });

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Auto sign-in after successful registration
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("Account created but sign-in failed. Please log in manually.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      {/* Error message */}
      {error && (
        <div className="mb-4 rounded-lg bg-coral/10 px-4 py-2.5 text-sm text-coral">
          {error}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          type="text"
          icon={faUser}
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          icon={faEnvelope}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div>
          <Input
            label="Password"
            type="password"
            icon={faLock}
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="mt-2">
              <div className="mb-1.5 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i < strength.score ? strength.color : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-medium ${
                  strength.score <= 1 ? "text-coral" :
                  strength.score <= 2 ? "text-amber-500" :
                  strength.score <= 3 ? "text-sunshine" :
                  "text-forest"
                }`}>
                  {strength.label}
                </span>
                {strength.tips.length > 0 && (
                  <span className="text-[11px] text-slate">
                    {strength.tips[0]}
                  </span>
                )}
                {strength.score >= 4 && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-forest">
                    <FontAwesomeIcon icon={faCircleCheck} className="h-2.5 w-2.5" aria-hidden />
                    Secure
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* GDPR Terms Checkbox */}
        <label className="flex cursor-pointer items-start gap-3 rounded-lg px-1 py-0.5">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 text-forest accent-forest focus:ring-forest"
          />
          <span className="text-xs leading-relaxed text-slate">
            I agree to the{" "}
            <Link href="/terms" className="font-medium text-forest underline decoration-forest/30 hover:decoration-forest">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-forest underline decoration-forest/30 hover:decoration-forest">
              Privacy Policy
            </Link>
            . Your data is handled in accordance with GDPR.
          </span>
        </label>

        <Button
          type="submit"
          variant="primary"
          size="md"
          leftIcon={faUserPlus}
          loading={loading}
          className="w-full"
        >
          Create Account
        </Button>
      </form>
    </>
  );
}
