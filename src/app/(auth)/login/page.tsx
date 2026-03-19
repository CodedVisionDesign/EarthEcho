import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";

const AUTH_ERRORS: Record<string, string> = {
  Configuration: "There was a problem with the login provider. Please try a different sign-in method or contact support.",
  AccessDenied: "Access denied. Your account may be suspended.",
  Verification: "The verification link has expired or has already been used.",
  OAuthAccountNotLinked: "This email is already registered with a different sign-in method.",
  Default: "An error occurred during sign-in. Please try again.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? (AUTH_ERRORS[error] ?? AUTH_ERRORS.Default) : null;

  return (
    <div className="w-full animate-scale-in">
      <Card
        variant="glass"
        className="mx-auto w-full max-w-md p-6 md:flex md:min-h-screen md:max-w-none md:items-center md:justify-center md:rounded-none md:border-0 md:p-8 md:shadow-none"
      >
        <div className="w-full max-w-md">
          <div className="mb-4 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Welcome Back
            </h1>
            <p className="mt-0.5 text-sm text-gray-700">
              Log in to track your environmental impact
            </p>
          </div>

          {/* Auth error banner */}
          {errorMessage && (
            <div className="mb-4 rounded-lg border border-coral/20 bg-coral/10 px-4 py-3 text-sm text-coral">
              {errorMessage}
            </div>
          )}

          <LoginForm />

          <p className="mt-4 text-center text-sm text-gray-700">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-forest transition-colors hover:text-forest-dark hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
