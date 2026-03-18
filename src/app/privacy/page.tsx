import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faUserShield,
  faClipboardList,
  faLock,
  faEye,
  faTrashCan,
  faGear,
  faEnvelope,
  faArrowLeft,
  faKey,
} from "@/lib/fontawesome";
import { Navigation } from "@/components/landing/Navigation";
import { FooterSection } from "@/components/landing/FooterSection";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export const metadata = {
  title: "Privacy Policy | Earth Echo",
  description: "How Earth Echo collects, uses, and protects your personal data.",
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

export default function PrivacyPolicyPage() {
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
              <FontAwesomeIcon icon={faShieldHalved} className="h-5 w-5 text-leaf" aria-hidden />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
              <p className="mt-1 text-sm text-white/40">Last updated: March 17, 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 pb-24">
        <div className="space-y-4">
          <Section icon={faUserShield} title="1. Who We Are">
            <p>
              Earth Echo is operated by Coded Vision Design. Our Data Protection Officer can be
              contacted at{" "}
              <a href="mailto:contact@earthecho.co.uk" className="text-leaf underline decoration-leaf/30 hover:text-leaf/80">
                contact@earthecho.co.uk
              </a>
              .
            </p>
            <p className="mt-2 text-sm text-white/35">
              Coded Vision Design, 6 Braiding Crescent, Essex, CM7 3LU, United Kingdom
            </p>
          </Section>

          <Section icon={faClipboardList} title="2. Information We Collect">
            <p>
              When you sign in with Google or Facebook, we receive your name, email address, and
              profile picture from the provider. When you use credential-based sign-in, we store a
              securely hashed version of your password. We also collect data you voluntarily enter
              such as carbon tracking entries, challenge participation, and forum posts.
            </p>
          </Section>

          <Section icon={faGear} title="3. How We Use Your Information">
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2"><Dot />To authenticate and manage your account</li>
              <li className="flex items-start gap-2"><Dot />To display your environmental impact metrics and progress</li>
              <li className="flex items-start gap-2"><Dot />To power leaderboards, badges, and community features</li>
              <li className="flex items-start gap-2"><Dot />To improve the application and fix issues</li>
            </ul>
          </Section>

          <Section icon={faEye} title="4. Legal Basis for Processing (GDPR)">
            <p>We process your personal data under the following legal bases:</p>
            <ul className="mt-3 space-y-2">
              <li className="flex items-start gap-2">
                <Dot />
                <span><strong className="text-white/80">Consent:</strong> When you create an account and agree to these terms</span>
              </li>
              <li className="flex items-start gap-2">
                <Dot />
                <span><strong className="text-white/80">Contract:</strong> To provide the service you signed up for</span>
              </li>
              <li className="flex items-start gap-2">
                <Dot />
                <span><strong className="text-white/80">Legitimate interest:</strong> To improve and secure the platform</span>
              </li>
            </ul>
          </Section>

          <Section icon={faUserShield} title="5. Data Sharing">
            <p>
              We do not sell your personal data. We share information only with third-party
              authentication providers (Google, Facebook) as necessary to enable sign-in, and with
              our database hosting provider to store your data securely.
            </p>
          </Section>

          <Section icon={faTrashCan} title="6. Data Retention">
            <p>
              We retain your data for as long as your account is active. You may request deletion of
              your account and all associated data at any time (see our{" "}
              <Link href="/data-deletion" className="text-leaf underline decoration-leaf/30 hover:text-leaf/80">
                Data Deletion
              </Link>{" "}
              page).
            </p>
          </Section>

          <Section icon={faClipboardList} title="7. Your Rights">
            <p>Under GDPR, you have the right to:</p>
            <ul className="mt-3 space-y-1.5">
              {[
                "Access the personal data we hold about you",
                "Rectify inaccurate personal data",
                "Request erasure of your personal data",
                "Restrict or object to processing",
                "Data portability",
                "Lodge a complaint with the ICO (Information Commissioner\u2019s Office)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Dot />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={faKey} title="8. Cookies">
            <p>
              We use essential cookies for authentication sessions. For full details, see our{" "}
              <Link href="/cookies" className="text-leaf underline decoration-leaf/30 hover:text-leaf/80">
                Cookie Policy
              </Link>
              .
            </p>
          </Section>

          <Section icon={faLock} title="9. Security">
            <p>
              Passwords are hashed with bcrypt. All connections use HTTPS in production. OAuth tokens
              are handled server-side and never exposed to the browser.
            </p>
          </Section>

          <Section icon={faEnvelope} title="10. Contact">
            <p>
              For privacy-related questions, contact our Data Protection Officer at{" "}
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
            { href: "/terms", label: "Terms of Service" },
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
