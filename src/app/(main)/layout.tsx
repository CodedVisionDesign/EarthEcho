import Link from "next/link";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "\u{1F4CA}" },
  { href: "/track/water", label: "Water", icon: "\u{1F4A7}" },
  { href: "/track/carbon", label: "Carbon", icon: "\u{1F30D}" },
  { href: "/track/plastic", label: "Plastic", icon: "\u{1F6CD}\u{FE0F}" },
  { href: "/track/recycling", label: "Recycling", icon: "\u{267B}\u{FE0F}" },
  { href: "/track/transport", label: "Transport", icon: "\u{1F697}" },
  { href: "/track/shopping", label: "Fashion", icon: "\u{1F457}" },
  { href: "/challenges", label: "Challenges", icon: "\u{1F3AF}" },
  { href: "/leaderboard", label: "Leaderboard", icon: "\u{1F3C6}" },
  { href: "/badges", label: "Badges", icon: "\u{1F396}\u{FE0F}" },
  { href: "/forum", label: "Forum", icon: "\u{1F4AC}" },
  { href: "/resources", label: "Resources", icon: "\u{1F517}" },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-off-white">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
        {/* Logo */}
        <div className="border-b border-gray-200 px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">{"\u{1F331}"}</span>
            <span className="text-lg font-bold text-forest">
              CarbonFootprint
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate transition-colors hover:bg-gray-100 hover:text-charcoal"
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-4">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate transition-colors hover:bg-gray-100 hover:text-charcoal"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-sm text-white">
              U
            </div>
            <div>
              <div className="text-sm font-medium text-charcoal">Profile</div>
              <div className="text-xs text-slate">Settings</div>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
