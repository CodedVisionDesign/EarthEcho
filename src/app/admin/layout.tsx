import { requireAdmin } from "@/lib/admin";
import { AdminNav } from "@/components/admin/AdminNav";
import { BottomTabBar } from "@/components/layout/BottomTabBar";

export const metadata = {
  title: "Admin | EarthEcho",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="flex h-dvh flex-col bg-gray-50/50">
      <AdminNav role={admin.role} userName={admin.displayName || admin.name || admin.email || "Admin"} userImage={admin.image} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
          {children}
        </div>
      </main>
      <BottomTabBar
        userName={admin.displayName || admin.name || undefined}
        userImage={admin.image ?? undefined}
        userRole={admin.role}
      />
    </div>
  );
}
