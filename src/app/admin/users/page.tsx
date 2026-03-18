import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faSearch, faShieldHalved, faUserShield, faBan } from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { UserActions } from "@/components/admin/UserActions";
import Link from "next/link";
import Image from "next/image";

const PAGE_SIZE = 20;

const ROLE_BADGE: Record<string, { variant: "success" | "info" | "warning" | "neutral" | "forest"; label: string }> = {
  superadmin: { variant: "warning", label: "Super Admin" },
  admin: { variant: "info", label: "Admin" },
  user: { variant: "neutral", label: "User" },
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const admin = await requireAdmin();
  const { q, page } = await searchParams;
  const search = q?.trim() ?? "";
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { displayName: { contains: search } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        displayName: true,
        email: true,
        image: true,
        role: true,
        banned: true,
        banReason: true,
        totalPoints: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE,
    }),
    db.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean/10">
            <FontAwesomeIcon icon={faUsers} className="h-5 w-5 text-ocean" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-charcoal">User Management</h1>
            <p className="text-sm text-slate">{total} total users</p>
          </div>
        </div>

        {/* Search */}
        <form method="GET" className="relative w-full sm:w-72">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate/50"
          />
          <input
            name="q"
            type="text"
            defaultValue={search}
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm text-charcoal placeholder:text-slate/50 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
          />
        </form>
      </div>

      {/* Desktop Table */}
      <Card variant="default" className="hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">User</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">Role</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">Points</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">Joined</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const role = ROLE_BADGE[user.role] ?? ROLE_BADGE.user;
                return (
                  <tr key={user.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.displayName || user.name || "User"}
                            width={32}
                            height={32}
                            className="h-8 w-8 shrink-0 rounded-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest/10 text-xs font-bold text-forest">
                            {(user.displayName || user.name || "?")[0]?.toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-charcoal">
                            {user.displayName || user.name || "Unnamed"}
                          </p>
                          <p className="truncate text-xs text-slate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={role.variant} size="sm">{role.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {user.banned ? (
                        <Badge variant="danger" size="sm">
                          <FontAwesomeIcon icon={faBan} className="h-2.5 w-2.5" />
                          Banned
                        </Badge>
                      ) : (
                        <Badge variant="success" size="sm">Active</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-charcoal">
                      {user.totalPoints.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate">
                      {user.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <UserActions
                        userId={user.id}
                        userName={user.displayName || user.name || "User"}
                        userRole={user.role}
                        isBanned={user.banned}
                        currentUserRole={admin.role}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {users.map((user) => {
          const role = ROLE_BADGE[user.role] ?? ROLE_BADGE.user;
          return (
            <Card key={user.id} variant="default" className="p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.displayName || user.name || "User"}
                      width={40}
                      height={40}
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest/10 text-sm font-bold text-forest">
                      {(user.displayName || user.name || "?")[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-charcoal">
                      {user.displayName || user.name || "Unnamed"}
                    </p>
                    <p className="truncate text-xs text-slate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant={role.variant} size="sm">{role.label}</Badge>
                  {user.banned && (
                    <Badge variant="danger" size="sm">Banned</Badge>
                  )}
                </div>
              </div>
              <div className="mb-3 flex items-center gap-4 text-xs text-slate">
                <span>{user.totalPoints.toLocaleString()} pts</span>
                <span>Joined {user.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              <UserActions
                userId={user.id}
                userName={user.displayName || user.name || "User"}
                userRole={user.role}
                isBanned={user.banned}
                currentUserRole={admin.role}
              />
            </Card>
          );
        })}
      </div>

      {/* Empty state */}
      {users.length === 0 && (
        <Card variant="default" className="p-12 text-center">
          <FontAwesomeIcon icon={faUsers} className="mx-auto mb-3 h-8 w-8 text-gray-300" />
          <p className="text-sm text-slate">
            {search ? `No users found for "${search}"` : "No users yet"}
          </p>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={`/admin/users?q=${search}&page=${currentPage - 1}`}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-slate hover:bg-gray-50"
            >
              Previous
            </Link>
          )}
          <span className="px-3 text-sm text-slate">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/admin/users?q=${search}&page=${currentPage + 1}`}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-slate hover:bg-gray-50"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
