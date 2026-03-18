import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faSearch, faShieldHalved, faUserShield, faBan, faUserPlus, faEnvelopeOpenText, faArrowUp, faArrowDown, faGoogle, faFacebook, faEnvelope, faApple, faRotateRight } from "@/lib/fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { UserActions } from "@/components/admin/UserActions";
import { InviteAdminButton } from "@/components/admin/InviteAdminButton";
import Link from "next/link";
import Image from "next/image";

const PAGE_SIZE = 20;

const ROLE_BADGE: Record<string, { variant: "success" | "info" | "warning" | "neutral" | "forest"; label: string }> = {
  developer: { variant: "forest", label: "Developer" },
  superadmin: { variant: "warning", label: "Super Admin" },
  admin: { variant: "info", label: "Admin" },
  user: { variant: "neutral", label: "User" },
};

const PROVIDER_CONFIG: Record<string, { icon: IconDefinition; color: string; label: string }> = {
  google:      { icon: faGoogle,   color: "text-[#4285F4]", label: "Google" },
  facebook:    { icon: faFacebook, color: "text-[#1877F2]", label: "Facebook" },
  apple:       { icon: faApple,    color: "text-charcoal",  label: "Apple" },
  credentials: { icon: faEnvelope, color: "text-slate",     label: "Email" },
};

type RoleFilter = "all" | "admins" | "users";
type SortField = "name" | "role" | "points" | "joined";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; role?: string; sort?: string; order?: string; provider?: string }>;
}) {
  const admin = await requireAdmin();
  const { q, page, role, sort, order, provider } = await searchParams;
  const search = q?.trim() ?? "";
  const roleFilter = (["all", "admins", "users"].includes(role ?? "") ? role : "all") as RoleFilter;
  const providerFilter = (["google", "facebook", "apple", "credentials"].includes(provider ?? "") ? provider : null) as string | null;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  // Determine sort field and order
  const sortField = (["name", "role", "points", "joined"].includes(sort ?? "") ? sort : "joined") as SortField;
  const sortOrder = (order === "asc" ? "asc" : "desc") as "asc" | "desc";

  const searchFilter = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { displayName: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const roleFilterWhere =
    roleFilter === "admins"
      ? { role: { in: ["admin", "superadmin", "developer"] } }
      : roleFilter === "users"
        ? { role: "user" }
        : {};

  // Provider filter: credentials = has password, others = has matching account
  const providerFilterWhere = providerFilter === "credentials"
    ? { password: { not: null } }
    : providerFilter
      ? { accounts: { some: { provider: providerFilter } } }
      : {};

  const where = { ...searchFilter, ...roleFilterWhere, ...providerFilterWhere };

  // Build orderBy based on sort field
  const orderByMap: Record<SortField, Record<string, "asc" | "desc">> = {
    name: { name: sortOrder },
    role: { role: sortOrder },
    points: { totalPoints: sortOrder },
    joined: { createdAt: sortOrder },
  };

  const [users, total, providerCounts, emailPasswordCount] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        displayName: true,
        email: true,
        image: true,
        customImage: true,
        role: true,
        banned: true,
        banReason: true,
        totalPoints: true,
        password: true,
        resetTokenExpiry: true,
        createdAt: true,
        accounts: { select: { provider: true } },
      },
      orderBy: orderByMap[sortField],
      take: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE,
    }),
    db.user.count({ where }),
    db.account.groupBy({ by: ["provider"], _count: { provider: true } }),
    db.user.count({ where: { password: { not: null } } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const isSuperAdmin = admin.role === "superadmin" || admin.role === "developer";

  function buildUrl(overrides: { page?: number; role?: string; q?: string; sort?: string; order?: string; provider?: string | null } = {}) {
    const params = new URLSearchParams();
    const s = overrides.q ?? search;
    const r = overrides.role ?? roleFilter;
    const p = overrides.page ?? undefined;
    const st = overrides.sort ?? sort;
    const o = overrides.order ?? order;
    const prov = overrides.provider !== undefined ? overrides.provider : providerFilter;
    if (s) params.set("q", s);
    if (r && r !== "all") params.set("role", r);
    if (st) params.set("sort", st);
    if (o) params.set("order", o);
    if (prov) params.set("provider", prov);
    if (p && p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/admin/users${qs ? `?${qs}` : ""}`;
  }

  // Helper to get sort icon and toggle order
  function getSortUrl(field: SortField) {
    const isCurrentSort = sortField === field;
    const newOrder = isCurrentSort && sortOrder === "desc" ? "asc" : "desc";
    return buildUrl({ sort: field, order: newOrder, page: 1 });
  }

  function getSortIcon(field: SortField) {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? faArrowUp : faArrowDown;
  }

  function getUserProviders(user: { password: string | null; accounts: { provider: string }[] }) {
    const providers: string[] = [];
    if (user.password) providers.push("credentials");
    for (const a of user.accounts) {
      if (!providers.includes(a.provider)) providers.push(a.provider);
    }
    return providers;
  }

  function hasActiveReset(user: { resetTokenExpiry: Date | null }) {
    return user.resetTokenExpiry !== null && user.resetTokenExpiry > new Date();
  }

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
            <p className="text-sm text-slate">{total} {roleFilter === "all" ? "total" : roleFilter} users</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Invite Admin Button (superadmin/developer only) */}
          {isSuperAdmin && <InviteAdminButton />}

          {/* Email Previews Link */}
          <Link
            href="/admin/emails"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-slate transition-colors hover:bg-gray-50"
          >
            <FontAwesomeIcon icon={faEnvelopeOpenText} className="h-3 w-3" />
            Email Previews
          </Link>
        </div>
      </div>

      {/* Search + Role Filter */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1.5">
          {(["all", "admins", "users"] as const).map((r) => {
            const labels: Record<RoleFilter, string> = { all: "All", admins: "Admins", users: "Users" };
            const isActive = roleFilter === r;
            return (
              <Link
                key={r}
                href={buildUrl({ role: r, page: 1 })}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-forest text-white shadow-sm"
                    : "bg-gray-100 text-slate hover:bg-gray-200"
                }`}
              >
                {labels[r]}
              </Link>
            );
          })}
        </div>

        {/* Search */}
        <form method="GET" className="relative w-full sm:w-72">
          {/* Preserve role filter when searching */}
          {roleFilter !== "all" && <input type="hidden" name="role" value={roleFilter} />}
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

      {/* Provider Filter Toggles */}
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
        {Object.entries(PROVIDER_CONFIG).map(([key, cfg]) => {
          const count =
            key === "credentials"
              ? emailPasswordCount
              : providerCounts.find((p) => p.provider === key)?._count.provider ?? 0;
          if (count === 0) return null;
          const isActive = providerFilter === key;
          return (
            <Link
              key={key}
              href={buildUrl({ provider: isActive ? null : key, page: 1 })}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-all ${
                isActive
                  ? "bg-charcoal text-white shadow-sm"
                  : "bg-gray-100 text-slate hover:bg-gray-200"
              }`}
            >
              <FontAwesomeIcon icon={cfg.icon} className={`h-3 w-3 ${isActive ? "text-white" : cfg.color}`} aria-hidden />
              {count} {cfg.label}
            </Link>
          );
        })}
      </div>

      {/* Desktop Table */}
      <Card variant="default" className="hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">User</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">Auth</th>
                <th className="px-4 py-3">
                  <Link href={getSortUrl("role")} className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate/70 hover:text-forest transition-colors">
                    Role
                    {getSortIcon("role") && <FontAwesomeIcon icon={getSortIcon("role")!} className="h-3 w-3" />}
                  </Link>
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">Status</th>
                <th className="px-4 py-3">
                  <Link href={getSortUrl("points")} className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate/70 hover:text-forest transition-colors">
                    Points
                    {getSortIcon("points") && <FontAwesomeIcon icon={getSortIcon("points")!} className="h-3 w-3" />}
                  </Link>
                </th>
                <th className="px-4 py-3">
                  <Link href={getSortUrl("joined")} className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate/70 hover:text-forest transition-colors">
                    Joined
                    {getSortIcon("joined") && <FontAwesomeIcon icon={getSortIcon("joined")!} className="h-3 w-3" />}
                  </Link>
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const role = ROLE_BADGE[user.role] ?? ROLE_BADGE.user;
                const avatar = user.customImage || user.image;
                const providers = getUserProviders(user);
                return (
                  <tr key={user.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {avatar ? (
                          <Image
                            src={avatar}
                            alt={user.displayName || user.name || "User"}
                            width={32}
                            height={32}
                            className="h-8 w-8 shrink-0 rounded-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest/10 text-xs font-bold text-forest">
                            {(user.name || user.displayName || "?")[0]?.toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-charcoal">
                            {user.name || user.displayName || "Unnamed"}
                          </p>
                          <p className="truncate text-xs text-slate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {providers.map((p) => {
                          const cfg = PROVIDER_CONFIG[p];
                          if (!cfg) return null;
                          return (
                            <FontAwesomeIcon
                              key={p}
                              icon={cfg.icon}
                              className={`h-3.5 w-3.5 ${cfg.color}`}
                              title={cfg.label}
                              aria-hidden
                            />
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={role.variant} size="sm">{role.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {user.banned ? (
                          <Badge variant="danger" size="sm">
                            <FontAwesomeIcon icon={faBan} className="h-2.5 w-2.5" />
                            Banned
                          </Badge>
                        ) : (
                          <Badge variant="success" size="sm">Active</Badge>
                        )}
                        {hasActiveReset(user) && (
                          <Badge variant="warning" size="sm">
                            <FontAwesomeIcon icon={faRotateRight} className="h-2.5 w-2.5" />
                            Reset Pending
                          </Badge>
                        )}
                      </div>
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
                        userName={user.name || user.displayName || "User"}
                        userEmail={user.email ?? ""}
                        hasPassword={!!user.password}
                        resetPending={hasActiveReset(user)}
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
          const avatar = user.customImage || user.image;
          const providers = getUserProviders(user);
          return (
            <Card key={user.id} variant="default" className="p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={user.name || user.displayName || "User"}
                      width={40}
                      height={40}
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest/10 text-sm font-bold text-forest">
                      {(user.name || user.displayName || "?")[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-charcoal">
                      {user.name || user.displayName || "Unnamed"}
                    </p>
                    <p className="truncate text-xs text-slate">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant={role.variant} size="sm">{role.label}</Badge>
                  {user.banned && (
                    <Badge variant="danger" size="sm">Banned</Badge>
                  )}
                  {hasActiveReset(user) && (
                    <Badge variant="warning" size="sm">
                      <FontAwesomeIcon icon={faRotateRight} className="h-2.5 w-2.5" />
                      Reset
                    </Badge>
                  )}
                </div>
              </div>
              <div className="mb-3 flex items-center gap-4 text-xs text-slate">
                <span className="flex items-center gap-1">
                  {providers.map((p) => {
                    const cfg = PROVIDER_CONFIG[p];
                    if (!cfg) return null;
                    return (
                      <FontAwesomeIcon
                        key={p}
                        icon={cfg.icon}
                        className={`h-3 w-3 ${cfg.color}`}
                        title={cfg.label}
                        aria-hidden
                      />
                    );
                  })}
                </span>
                <span>{user.totalPoints.toLocaleString()} pts</span>
                <span>Joined {user.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              <UserActions
                userId={user.id}
                userName={user.name || user.displayName || "User"}
                userEmail={user.email ?? ""}
                hasPassword={!!user.password}
                resetPending={hasActiveReset(user)}
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
              href={buildUrl({ page: currentPage - 1 })}
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
              href={buildUrl({ page: currentPage + 1 })}
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
