import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md animate-scale-in">
      <Card variant="glass" className="p-8">
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
      </Card>
    </div>
  );
}
