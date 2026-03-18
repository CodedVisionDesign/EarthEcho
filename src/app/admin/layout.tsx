import { requireAdmin } from "@/lib/admin";
import { AdminNav } from "@/components/admin/AdminNav";

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
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <AdminNav role={admin.role} userName={admin.displayName || admin.name || admin.email} userImage={admin.image} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
