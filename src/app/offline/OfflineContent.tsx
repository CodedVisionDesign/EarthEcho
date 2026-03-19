"use client";

export function OfflineContent() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-br from-off-white via-leaf/5 to-ocean/5 px-6 text-center">
      <div className="mx-auto max-w-sm">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-forest/10">
          <svg
            className="h-10 w-10 text-forest"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-charcoal">You&apos;re offline</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate">
          It looks like you&apos;ve lost your internet connection. Check your
          connection and try again.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-xl bg-forest px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-forest/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
