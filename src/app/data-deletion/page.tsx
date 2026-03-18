import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faClipboardList,
  faCircleCheck,
  faGear,
  faEnvelope,
  faArrowLeft,
} from "@/lib/fontawesome";
import { Navigation } from "@/components/landing/Navigation";
import { FooterSection } from "@/components/landing/FooterSection";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export const metadata = {
  title: "Data Deletion | Earth Echo",
  description: "Request deletion of your Earth Echo account and personal data.",
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

export default function DataDeletionPage() {
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
              <FontAwesomeIcon icon={faTrashCan} className="h-5 w-5 text-leaf" aria-hidden />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Data Deletion</h1>
              <p className="mt-1 text-sm text-white/40">Last updated: March 17, 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 pb-24">
        <div className="space-y-4">
          <Section icon={faCircleCheck} title="Your Right to Delete Your Data">
            <p>
              Under GDPR and UK data protection law, you have the right to request complete deletion
              of your Earth Echo account and all associated personal data at any time. This includes
              your profile information, tracking history, forum posts, challenge participation, and
              badge records.
            </p>
          </Section>

          <Section icon={faGear} title="How to Request Deletion">
            <p>To delete your account and data, you can use any of the following methods:</p>
            <ul className="mt-3 space-y-2">
              <li className="flex items-start gap-2">
                <Dot />
                <span>
                  <strong className="text-white/80">In-app:</strong> Go to{" "}
                  <Link href="/profile" className="text-leaf underline decoration-leaf/30 hover:text-leaf/80">
                    Profile Settings
                  </Link>{" "}
                  and select &ldquo;Delete Account&rdquo;
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Dot />
                <span>
                  <strong className="text-white/80">Email:</strong> Send a deletion request to{" "}
                  <a href="mailto:contact@codedvisiondesign.co.uk" className="text-leaf underline decoration-leaf/30 hover:text-leaf/80">
                    contact@codedvisiondesign.co.uk
                  </a>{" "}
                  from the email address associated with your account
                </span>
              </li>
            </ul>
          </Section>

          <Section icon={faClipboardList} title="What Gets Deleted">
            <ul className="space-y-1.5">
              {[
                "Your user profile (name, email, profile picture)",
                "All environmental tracking entries",
                "Challenge participation and badge records",
                "Forum posts and community contributions",
                "Leaderboard rankings",
                "OAuth provider connections (Google, Facebook)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Dot />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={faGear} title="Processing Time">
            <p>
              Account deletion requests are processed within 30 days. You will receive an email
              confirmation once your data has been permanently removed from our systems.
            </p>
          </Section>

          <Section icon={faGear} title="Facebook Data Deletion">
            <p>
              If you signed in with Facebook, you can also remove Earth Echo&apos;s access from your
              Facebook Settings &gt; Apps and Websites. This will trigger our data deletion process
              automatically.
            </p>
          </Section>

          <Section icon={faEnvelope} title="Contact">
            <p>
              For questions about data deletion, contact our Data Protection Officer at{" "}
              <a href="mailto:contact@codedvisiondesign.co.uk" className="text-leaf underline decoration-leaf/30 hover:text-leaf/80">
                contact@codedvisiondesign.co.uk
              </a>
              .
            </p>
            <p className="mt-2 text-sm text-white/35">
              Coded Vision Design, 6 Braiding Crescent, Essex, CM7 3LU, United Kingdom
            </p>
          </Section>
        </div>

        {/* Cross-links */}
        <div className="mt-12 flex flex-wrap gap-3">
          {[
            { href: "/privacy", label: "Privacy Policy" },
            { href: "/terms", label: "Terms of Service" },
            { href: "/cookies", label: "Cookie Policy" },
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
