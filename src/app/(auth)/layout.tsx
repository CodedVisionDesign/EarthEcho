import MagicRings from "@/components/ui/MagicRings";
import EcoGlobe from "@/components/ui/EcoGlobe";
import Galaxy from "@/components/ui/Galaxy";
import { Navigation } from "@/components/landing/Navigation";

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
        <div className="relative hidden w-1/2 shrink-0 overflow-hidden bg-black md:block">
          {/* Galaxy background — base layer */}
          <div className="absolute inset-0 z-0">
            <Galaxy
              mouseRepulsion
              mouseInteraction
              density={1}
              glowIntensity={0.3}
              saturation={0}
              hueShift={140}
              twinkleIntensity={0.3}
              rotationSpeed={0.1}
              repulsionStrength={2}
              autoCenterRepulsion={0}
              starSpeed={0.5}
              speed={1}
              transparent={false}
            />
          </div>

          {/* Animated rings — layered on top of galaxy */}
          <div className="absolute inset-0 z-[1]">
            <MagicRings
              color="#52b788"
              colorTwo="#74c69d"
              ringCount={7}
              speed={0.8}
              attenuation={6}
              lineThickness={3}
              baseRadius={0.2}
              radiusStep={0.1}
              scaleRate={0.12}
              opacity={0.85}
              noiseAmount={0.08}
              rotation={20}
              ringGap={1.4}
              fadeIn={0.6}
              fadeOut={0.4}
              followMouse
              mouseInfluence={0.25}
              hoverScale={1.15}
              parallax={0.06}
              clickBurst
            />
          </div>

          {/* Globe — absolutely centred on the rings origin */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="pointer-events-auto">
              <EcoGlobe size={340} />
            </div>
          </div>

          {/* Text — pinned to bottom of panel */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 pb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold text-white drop-shadow-lg">
              Track Your Impact
            </h2>
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-white/75 drop-shadow-md">
              Join thousands making a real difference. See your environmental
              impact in human-readable terms and be part of a community that
              cares.
            </p>
          </div>
        </div>

        {/* Form side — fills exactly the other half */}
        <div className="relative w-full shrink-0 overflow-hidden bg-black md:w-1/2">
          {/* Background video — covers entire panel */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 z-0 h-full w-full object-cover"
            style={{ filter: "brightness(0.98) saturate(1.1)" }}
          >
            <source src="/assets/auth_bg.webm" type="video/webm" />
            <source src="/assets/auth_bg.mp4" type="video/mp4" />
          </video>
          {/* Soft glass overlay — also fixed */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-white/10 via-transparent to-white/20 backdrop-blur-[1px]" />

          <main className="relative z-[2] flex min-h-screen w-full items-center justify-center overflow-y-auto px-4 pb-8 pt-24 md:px-0 md:py-0">
            <div className="w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
