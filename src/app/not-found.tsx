import Link from "next/link";

export const metadata = {
  title: "Page Not Found | EarthEcho",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <svg
            className="h-8 w-8 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
            />
          </svg>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Page Not Found
        </h1>

        <p className="mb-6 text-sm text-gray-600">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
