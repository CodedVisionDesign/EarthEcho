import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="w-full animate-scale-in">
      <Card
        variant="glass"
        className="mx-auto w-full max-w-md p-8 md:flex md:min-h-screen md:max-w-none md:items-center md:justify-center md:rounded-none md:border-0 md:p-12 md:shadow-none"
      >
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-charcoal">
              Welcome Back
            </h1>
            <p className="mt-1 text-sm text-slate">
              Log in to track your environmental impact
            </p>
          </div>

          <LoginForm />

          <p className="mt-6 text-center text-sm text-slate">
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
