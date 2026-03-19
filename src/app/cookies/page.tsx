import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faCircleInfo,
  faShieldHalved,
  faGear,
  faEnvelope,
  faArrowLeft,
} from "@/lib/fontawesome";
import { Navigation } from "@/components/landing/Navigation";
import { FooterSection } from "@/components/landing/FooterSection";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export const metadata = {
  title: "Cookie Policy | Earth Echo",
  description: "How Earth Echo uses cookies and similar technologies.",
};

function Section({
  icon,
  title,
  children,
}: {
  icon: IconDefinition;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest/15">
          <FontAwesomeIcon icon={icon} className="h-3.5 w-3.5 text-leaf" aria-hidden />
        </div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="pl-11 text-[15px] leading-relaxed text-white/60">{children}</div>
    </div>
  );
}

export default function CookiePolicyPage() {
  return (
    <div className="relative min-h-screen bg-charcoal">
      <Navigation />

      {/* Hero banner */}
      <div className="relative overflow-hidden pt-36 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-forest/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-3xl px-6">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white/70"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" aria-hidden />
            Back to home
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest/15">
              <FontAwesomeIcon icon={faKey} className="h-5 w-5 text-leaf" aria-hidden />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Cookie Policy</h1>
              <p className="mt-1 text-sm text-white/40">Last updated: March 17, 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 pb-24">
        <div className="space-y-4">
          <Section icon={faCircleInfo} title="1. What Are Cookies">
            <p>
              Cookies are small text files stored on your device when you visit a website. They help
              the site remember your preferences and activity.
            </p>
          </Section>

          <Section icon={faKey} title="2. Cookies We Use">
            <div className="mt-2 overflow-x-auto rounded-lg border border-white/[0.06]">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Cookie</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Type</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Purpose</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-white/60">
                  <tr className="border-b border-white/[0.04]">
                    <td className="px-4 py-3 font-mono text-xs text-leaf/80">authjs.session-token</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-forest/15 px-2 py-0.5 text-xs font-medium text-leaf">Essential</span>
                    </td>
                    <td className="px-4 py-3">Keeps you signed in</td>
                    <td className="px-4 py-3 text-white/40">Session / 30 days</td>
                  </tr>
                  <tr className="border-b border-white/[0.04]">
                    <td className="px-4 py-3 font-mono text-xs text-leaf/80">authjs.csrf-token</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-forest/15 px-2 py-0.5 text-xs font-medium text-leaf">Essential</span>
                    </td>
                    <td className="px-4 py-3">Protects against cross-site request forgery</td>
                    <td className="px-4 py-3 text-white/40">Session</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs text-leaf/80">authjs.callback-url</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-forest/15 px-2 py-0.5 text-xs font-medium text-leaf">Essential</span>
                    </td>
                    <td className="px-4 py-3">Redirects you after sign-in</td>
                    <td className="px-4 py-3 text-white/40">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section icon={faShieldHalved} title="3. Analytics Cookies">
            <p className="mb-3">
              With your consent, we use Google Analytics to understand how our site is used.
              These cookies are only set if you click &ldquo;Accept all&rdquo; on our cookie banner.
            </p>
            <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Cookie</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Purpose</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-white/60">
                  <tr className="border-b border-white/[0.04]">
                    <td className="px-4 py-3 font-mono text-xs text-leaf/80">_ga</td>
                    <td className="px-4 py-3">Distinguishes unique users</td>
                    <td className="px-4 py-3 text-white/40">2 years</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs text-leaf/80">_gid</td>
                    <td className="px-4 py-3">Distinguishes unique users (short-lived)</td>
                    <td className="px-4 py-3 text-white/40">24 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              You can change your preference at any time by clearing your browser cookies and
              revisiting the site.
            </p>
          </Section>

          <Section icon={faGear} title="4. Managing Cookies">
            <p>
              Since we only use essential cookies required for authentication, disabling them will
              prevent you from signing in. You can clear cookies at any time through your browser
              settings.
            </p>
          </Section>

          <Section icon={faEnvelope} title="5. Contact">
            <p>
              For questions about our use of cookies, contact us at{" "}
              <a href="mailto:contact@earthecho.co.uk" className="text-leaf underline decoration-leaf/30 hover:text-leaf/80">
                contact@earthecho.co.uk
              </a>
              .
            </p>
          </Section>
        </div>

        {/* Cross-links */}
        <div className="mt-12 flex flex-wrap gap-3">
          {[
            { href: "/privacy", label: "Privacy Policy" },
            { href: "/terms", label: "Terms of Service" },
            { href: "/data-deletion", label: "Data Deletion" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/50 transition-all hover:border-leaf/30 hover:text-leaf"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
