import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { TourShell } from "@/components/tour/TourShell";
import { PushOptIn } from "@/components/pwa/PushOptIn";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userRole = (session?.user as Record<string, unknown>)?.role as string | undefined;

  return (
    <TourShell>
      <div className="flex min-h-screen bg-gradient-to-br from-off-white via-leaf/5 to-ocean/5">
        {/* Subtle decorative background orbs */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-forest/[0.03] blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-ocean/[0.04] blur-3xl" />
          <div className="absolute top-1/2 right-1/4 h-64 w-64 rounded-full bg-sunshine/[0.03] blur-3xl" />
        </div>

        <Sidebar
          userName={session?.user?.name ?? undefined}
          userImage={session?.user?.image ?? undefined}
          userRole={userRole}
        />

        {/* Main content — pb-20 on mobile for bottom tab bar clearance */}
        <main className="relative z-10 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 pt-16 pb-20 md:px-8 md:pt-8 md:pb-10">
            <ToastProvider>
              {children}
            </ToastProvider>
          </div>
        </main>

        {/* Mobile bottom tab bar */}
        <BottomTabBar
          userName={session?.user?.name ?? undefined}
          userImage={session?.user?.image ?? undefined}
          userRole={userRole}
        />

        {session?.user && <PushOptIn />}
      </div>
    </TourShell>
  );
}
