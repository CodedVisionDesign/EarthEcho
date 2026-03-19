import { Navigation } from "@/components/landing/Navigation";
import { AuthDecorativePanel } from "@/components/auth/AuthDecorativePanel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-black">
      <Navigation variant="light" />

      <div className="flex min-h-screen w-full">
        {/* Decorative side panel (hidden on mobile) */}
        <AuthDecorativePanel />

        {/* Form side - fills exactly the other half */}
        <div className="relative w-full shrink-0 overflow-hidden bg-black md:w-1/2">
          {/* Background video - covers entire panel */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 z-0 h-full w-full object-cover"
            style={{ filter: "brightness(0.98) saturate(1.1)" }}
          >
            <source src="/assets/auth_bg.webm" type="video/webm" />
            <source src="/assets/auth_bg.mp4" type="video/mp4" />
          </video>
          {/* Soft glass overlay - also fixed */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-white/10 via-transparent to-white/20 backdrop-blur-[1px]" />

          <main className="relative z-[2] flex min-h-screen w-full items-center justify-center overflow-y-auto px-4 pb-6 pt-20 md:px-0 md:py-0">
            <div className="w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
