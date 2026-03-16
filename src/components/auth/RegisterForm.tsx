"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  faEnvelope,
  faLock,
  faUser,
  faUserPlus,
} from "@/lib/fontawesome";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerUser } from "@/lib/actions";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
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
