import { Card } from "@/components/ui/Card";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import Link from "next/link";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="w-full animate-scale-in">
        <Card
          variant="glass"
          className="mx-auto w-full max-w-md p-8 md:flex md:min-h-screen md:max-w-none md:items-center md:justify-center md:rounded-none md:border-0 md:p-12 md:shadow-none"
        >
          <div className="w-full max-w-md text-center">
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-charcoal">
              Invalid Link
            </h1>
            <p className="mb-6 text-sm text-slate">
              This password reset link is invalid or has expired.
            </p>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-forest transition-colors hover:text-forest-dark hover:underline"
            >
              Request a new reset link
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full animate-scale-in">
      <Card
        variant="glass"
        className="mx-auto w-full max-w-md p-8 md:flex md:min-h-screen md:max-w-none md:items-center md:justify-center md:rounded-none md:border-0 md:p-12 md:shadow-none"
      >
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-charcoal">
              Set New Password
            </h1>
            <p className="mt-1 text-sm text-slate">
              Choose a strong password for your account
            </p>
          </div>

          <ResetPasswordForm token={token} />
        </div>
      </Card>
    </div>
  );
}
