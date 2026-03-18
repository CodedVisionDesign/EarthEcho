import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faCircleCheck,
  faGauge,
  faUser,
  faBan,
  faBookOpen,
  faTrashCan,
  faCircleExclamation,
  faEarthAmericas,
  faGear,
  faEnvelope,
  faArrowLeft,
} from "@/lib/fontawesome";
import { Navigation } from "@/components/landing/Navigation";
import { FooterSection } from "@/components/landing/FooterSection";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export const metadata = {
  title: "Terms of Service | Earth Echo",
  description: "Terms and conditions for using the Earth Echo platform.",
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

function Dot() {
  return <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf/50" />;
}

export default function TermsOfServicePage() {
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
              <FontAwesomeIcon icon={faClipboardList} className="h-5 w-5 text-leaf" aria-hidden />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
              <p className="mt-1 text-sm text-white/40">Last updated: March 17, 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 pb-24">
        <div className="space-y-4">
          <Section icon={faCircleCheck} title="1. Acceptance of Terms">
            <p>
              By creating an account or using Earth Echo, you agree to these Terms of Service, our{" "}
              <Link href="/privacy" className="text-leaf underline decoration-leaf/30 hover:text-leaf/80">
                Privacy Policy
              </Link>
              , and our{" "}
              <Link href="/cookies" className="text-leaf underline decoration-leaf/30 hover:text-leaf/80">
                Cookie Policy
              </Link>
              . If you do not agree, do not use the service.
            </p>
          </Section>

          <Section icon={faGauge} title="2. Description of Service">
            <p>
              Earth Echo is an environmental impact tracking platform operated by Coded Vision Design
              that allows users to log carbon emissions, water usage, plastic consumption, and other
              sustainability metrics. It includes gamification features such as challenges, badges,
              and leaderboards.
            </p>
          </Section>

          <Section icon={faUser} title="3. User Accounts">
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2"><Dot />You must provide accurate information when creating an account</li>
              <li className="flex items-start gap-2"><Dot />You are responsible for maintaining the security of your credentials</li>
              <li className="flex items-start gap-2"><Dot />You must be at least 13 years old to use the service</li>
              <li className="flex items-start gap-2"><Dot />One person may not maintain more than one account</li>
            </ul>
          </Section>

          <Section icon={faBan} title="4. Acceptable Use">
            <p>You agree not to:</p>
            <ul className="mt-3 space-y-1.5">
              <li className="flex items-start gap-2"><Dot />Submit false or misleading environmental data</li>
              <li className="flex items-start gap-2"><Dot />Harass, abuse, or threaten other users in forum or community features</li>
              <li className="flex items-start gap-2"><Dot />Attempt to gain unauthorized access to other accounts or systems</li>
              <li className="flex items-start gap-2"><Dot />Use automated tools to scrape or overload the service</li>
            </ul>
          </Section>

          <Section icon={faBookOpen} title="5. Content">
            <p>
              You retain ownership of content you submit (forum posts, tracking data). By submitting
              content, you grant Earth Echo a non-exclusive license to display it within the platform
              (e.g., leaderboard rankings, community forums).
            </p>
          </Section>

          <Section icon={faTrashCan} title="6. Termination">
            <p>
              We may suspend or terminate accounts that violate these terms. You may delete your
              account at any time via our{" "}
              <Link href="/data-deletion" className="text-leaf underline decoration-leaf/30 hover:text-leaf/80">
                Data Deletion
              </Link>{" "}
              page.
            </p>
          </Section>

          <Section icon={faCircleExclamation} title="7. Disclaimer">
            <p>
              Earth Echo is provided &ldquo;as is&rdquo; without warranties of any kind.
              Environmental impact calculations are estimates and should not be relied upon for
              regulatory compliance.
            </p>
          </Section>

          <Section icon={faEarthAmericas} title="8. Governing Law">
            <p>
              These terms are governed by the laws of England and Wales. Any disputes will be subject
              to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </Section>

          <Section icon={faGear} title="9. Changes to Terms">
            <p>
              We may update these terms from time to time. Continued use of the service after changes
              constitutes acceptance of the new terms.
            </p>
          </Section>

          <Section icon={faEnvelope} title="10. Contact">
            <p>
              For questions about these terms, contact us at{" "}
              <a href="mailto:contact@codedvisiondesign.co.uk" className="text-leaf underline decoration-leaf/30 hover:text-leaf/80">
                contact@codedvisiondesign.co.uk
              </a>
              .
            </p>
          </Section>
        </div>

        {/* Cross-links */}
        <div className="mt-12 flex flex-wrap gap-3">
          {[
            { href: "/privacy", label: "Privacy Policy" },
            { href: "/cookies", label: "Cookie Policy" },
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
