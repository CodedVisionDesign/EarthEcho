import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSeedling } from "@/lib/fontawesome";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Decorative side panel (hidden on mobile) */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-forest-dark via-forest to-ocean md:block">
        <div
          className="pointer-events-none absolute inset-0 animate-gradient-shift opacity-25"
          style={{
            background:
              "radial-gradient(ellipse at 30% 40%, rgba(255,193,7,0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(64,145,108,0.4) 0%, transparent 50%)",
          }}
          aria-hidden
        />
        <div className="relative flex h-full flex-col items-center justify-center px-12 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <FontAwesomeIcon
              icon={faSeedling}
              className="h-7 w-7 text-sunshine"
              aria-hidden
            />
          </div>
          <h2 className="mb-3 text-3xl font-bold text-white">
            Track Your Impact
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-white/65">
            Join thousands making a real difference. See your environmental
            impact in human-readable terms and be part of a community that
            cares.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-1 flex-col bg-off-white">
        <nav className="border-b border-gray-200/60 bg-white/80 px-6 py-3.5 backdrop-blur-sm md:bg-transparent md:border-none md:backdrop-blur-none">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest">
              <FontAwesomeIcon
                icon={faSeedling}
                className="h-4 w-4 text-white"
                aria-hidden
              />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-charcoal">
              CarbonFootprint
            </span>
          </Link>
        </nav>
        <main className="flex flex-1 items-center justify-center px-6 py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
