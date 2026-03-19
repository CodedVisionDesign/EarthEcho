"use client";

import { useState, useMemo, useCallback, useEffect, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  faEnvelope,
  faLock,
  faUser,
  faUserPlus,
  faCircleCheck,
  faClock,
  faXmark,
  faArrowUpRightFromSquare,
} from "@/lib/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerUser } from "@/lib/actions";
import Link from "next/link";

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

/* ── Terms / Privacy inline dialog ── */

function PolicyDialog({
  type,
  onClose,
}: {
  type: "terms" | "privacy";
  onClose: () => void;
}) {
  const isTerms = type === "terms";

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 flex max-h-[85vh] w-full flex-col rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
          <h3 className="text-base font-semibold text-charcoal">
            {isTerms ? "Terms of Service" : "Privacy Policy"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate transition-colors hover:bg-gray-100 hover:text-charcoal"
            aria-label="Close"
          >
            <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 text-sm leading-relaxed text-gray-600">
          {isTerms ? <TermsSummary /> : <PrivacySummary />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
          <Link
            href={isTerms ? "/terms" : "/privacy"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-forest transition-colors hover:text-forest-dark"
          >
            View full version
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-2.5 w-2.5" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-forest px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-forest-dark"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h4 className="mb-1 mt-3 text-sm font-semibold text-charcoal first:mt-0">{children}</h4>;
}

function TermsSummary() {
  return (
    <>
      <SectionTitle>1. Acceptance</SectionTitle>
      <p>By creating an account, you agree to these terms, our Privacy Policy, and Cookie Policy.</p>

      <SectionTitle>2. Service</SectionTitle>
      <p>Earth Echo is an environmental impact tracking platform with gamification features including challenges, badges, and leaderboards.</p>

      <SectionTitle>3. Accounts</SectionTitle>
      <p>You must be at least 13 years old, provide accurate information, and maintain one account only.</p>

      <SectionTitle>4. Acceptable Use</SectionTitle>
      <p>Do not submit false data, harass other users, or attempt unauthorized access.</p>

      <SectionTitle>5. Content</SectionTitle>
      <p>You retain ownership of your content. By submitting, you grant us a licence to display it within the platform.</p>

      <SectionTitle>6. Termination</SectionTitle>
      <p>We may suspend accounts that violate these terms. You may delete your account at any time.</p>

      <SectionTitle>7. Governing Law</SectionTitle>
      <p>These terms are governed by the laws of England and Wales.</p>

      <SectionTitle>8. Contact</SectionTitle>
      <p>Questions? Email <span className="font-medium text-forest">contact@earthecho.co.uk</span></p>
    </>
  );
}

function PrivacySummary() {
  return (
    <>
      <SectionTitle>1. Who We Are</SectionTitle>
      <p>Earth Echo is operated by Coded Vision Design, 6 Braiding Crescent, Essex, CM7 3LU, UK.</p>

      <SectionTitle>2. What We Collect</SectionTitle>
      <p>Name, email, and profile picture from OAuth providers; hashed passwords for credential sign-in; tracking data and forum posts you enter.</p>

      <SectionTitle>3. How We Use It</SectionTitle>
      <p>To authenticate your account, display your environmental metrics, power leaderboards and badges, and improve the app.</p>

      <SectionTitle>4. Legal Basis (GDPR)</SectionTitle>
      <p>Consent (account creation), Contract (providing the service), and Legitimate Interest (improving and securing the platform).</p>

      <SectionTitle>5. Data Sharing</SectionTitle>
      <p>We do not sell your data. We share only with auth providers (Google/Facebook) and our database host.</p>

      <SectionTitle>6. Your Rights</SectionTitle>
      <p>Access, rectify, delete, restrict, or export your data. You can also lodge a complaint with the ICO.</p>

      <SectionTitle>7. Security</SectionTitle>
      <p>Passwords hashed with bcrypt. All connections use HTTPS. OAuth tokens are server-side only.</p>

      <SectionTitle>8. Contact</SectionTitle>
      <p>DPO: <span className="font-medium text-forest">contact@earthecho.co.uk</span></p>
    </>
  );
}

/* ── Field-level validation ── */

type FieldErrors = Partial<Record<"name" | "email" | "password" | "dateOfBirth", string>>;

function validateField(field: string, value: string): string {
  switch (field) {
    case "name":
      if (value && value.trim().length < 2) return "Name must be at least 2 characters";
      return "";
    case "email":
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
      return "";
    case "password":
      if (value && value.length < 8) return "Password must be at least 8 characters";
      return "";
    case "dateOfBirth": {
      if (!value) return "";
      const dob = new Date(value);
      const minAge = new Date();
      minAge.setFullYear(minAge.getFullYear() - 13);
      if (dob > minAge) return "You must be at least 13 years old";
      return "";
    }
    default:
      return "";
  }
}

/* ── Main form ── */

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [policyDialog, setPolicyDialog] = useState<"terms" | "privacy" | null>(null);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const closeDialog = useCallback(() => setPolicyDialog(null), []);

  // Validate individual field on blur
  function handleBlur(field: keyof FieldErrors, value: string) {
    const err = validateField(field, value);
    setFieldErrors((prev) => ({ ...prev, [field]: err }));
  }

  // Clear field error when user resumes typing
  function handleChange(field: keyof FieldErrors, value: string, setter: (v: string) => void) {
    setter(value);
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    // Run all validations at once
    const errors: FieldErrors = {
      name: validateField("name", name),
      email: validateField("email", email),
      password: validateField("password", password),
      dateOfBirth: validateField("dateOfBirth", dateOfBirth),
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) {
      triggerShake();
      return;
    }

    if (!agreedToTerms) {
      setError("Please accept the Terms of Service and Privacy Policy to continue.");
      triggerShake();
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser({ name, email, password, dateOfBirth });

      if (result.error) {
        setError(result.error);
        setLoading(false);
        triggerShake();
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
      triggerShake();
    }
  }

  return (
    <>
      {/* Error message */}
      {error && (
        <div className="mb-3 rounded-lg bg-coral/10 px-4 py-2 text-sm text-coral">
          {error}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className={`space-y-3 ${shake ? "animate-shake" : ""}`}>
        <fieldset disabled={loading} className="space-y-3">
          {/* Name + Email side by side on desktop */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="Name"
              type="text"
              icon={faUser}
              placeholder="Your name"
              value={name}
              onChange={(e) => handleChange("name", e.target.value, setName)}
              onBlur={() => handleBlur("name", name)}
              error={fieldErrors.name}
              required
              autoFocus
              autoComplete="name"
            />
            <Input
              label="Email"
              type="email"
              icon={faEnvelope}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => handleChange("email", e.target.value, setEmail)}
              onBlur={() => handleBlur("email", email)}
              error={fieldErrors.email}
              required
              autoComplete="email"
            />
          </div>

          {/* Password + DOB side by side on desktop */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Input
                label="Password"
                type="password"
                icon={faLock}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => handleChange("password", e.target.value, setPassword)}
                onBlur={() => handleBlur("password", password)}
                error={fieldErrors.password}
                required
                minLength={8}
                autoComplete="new-password"
              />
              {/* Password Strength Indicator — hide when field has error */}
              {password.length > 0 && !fieldErrors.password && (
                <div className="mt-1.5">
                  <div className="mb-1 flex gap-1">
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

            <Input
              label="Date of Birth"
              type="date"
              icon={faClock}
              value={dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value, setDateOfBirth)}
              onBlur={() => handleBlur("dateOfBirth", dateOfBirth)}
              error={fieldErrors.dateOfBirth}
              required
              max={new Date(new Date().getFullYear() - 13, new Date().getMonth(), new Date().getDate()).toISOString().split("T")[0]}
              min="1900-01-01"
              autoComplete="bday"
            />
          </div>

          {/* GDPR Terms Checkbox */}
          <label className="flex cursor-pointer items-start gap-2.5 rounded-lg px-1 py-0.5">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 text-forest accent-forest focus:ring-forest"
            />
            <span className="text-xs leading-relaxed text-slate">
              I agree to the{" "}
              <button
                type="button"
                onClick={() => setPolicyDialog("terms")}
                className="font-medium text-forest underline decoration-forest/30 hover:decoration-forest"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() => setPolicyDialog("privacy")}
                className="font-medium text-forest underline decoration-forest/30 hover:decoration-forest"
              >
                Privacy Policy
              </button>
            </span>
          </label>
        </fieldset>

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

      {/* Policy dialog overlay */}
      {policyDialog && (
        <PolicyDialog type={policyDialog} onClose={closeDialog} />
      )}
    </>
  );
}
