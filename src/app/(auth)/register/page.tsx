import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { RegisterOAuthButtons } from "@/components/auth/RegisterOAuthButtons";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md animate-scale-in">
      <Card variant="glass" className="p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-charcoal">
            Create Account
          </h1>
          <p className="mt-1 text-sm text-slate">
            Start tracking your environmental impact today
          </p>
        </div>

        {/* OAuth Buttons */}
        <RegisterOAuthButtons />

        {/* Divider */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate/50">
            or
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-slate">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-forest transition-colors hover:text-forest-dark hover:underline"
          >
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
