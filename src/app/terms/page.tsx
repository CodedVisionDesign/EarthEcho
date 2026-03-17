import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Earth Echo",
  description: "Terms and conditions for using the Earth Echo platform.",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[#0a1628] text-gray-200 px-6 py-16 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: March 17, 2026</p>

      <section className="space-y-6 text-gray-300 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">1. Acceptance of Terms</h2>
          <p>
            By creating an account or using Earth Echo, you agree to these Terms of Service, our{" "}
            <Link href="/privacy" className="text-emerald-400 underline hover:text-emerald-300">
              Privacy Policy
            </Link>
            , and our{" "}
            <Link href="/cookies" className="text-emerald-400 underline hover:text-emerald-300">
              Cookie Policy
            </Link>
            . If you do not agree, do not use the service.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">2. Description of Service</h2>
          <p>
            Earth Echo is an environmental impact tracking platform operated by Coded Vision Design
            that allows users to log carbon emissions, water usage, plastic consumption, and other
            sustainability metrics. It includes gamification features such as challenges, badges,
            and leaderboards.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">3. User Accounts</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>You must provide accurate information when creating an account</li>
            <li>You are responsible for maintaining the security of your credentials</li>
            <li>You must be at least 13 years old to use the service</li>
            <li>One person may not maintain more than one account</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Submit false or misleading environmental data</li>
            <li>Harass, abuse, or threaten other users in forum or community features</li>
            <li>Attempt to gain unauthorized access to other accounts or systems</li>
            <li>Use automated tools to scrape or overload the service</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">5. Content</h2>
          <p>
            You retain ownership of content you submit (forum posts, tracking data). By submitting
            content, you grant Earth Echo a non-exclusive license to display it within the platform
            (e.g., leaderboard rankings, community forums).
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">6. Termination</h2>
          <p>
            We may suspend or terminate accounts that violate these terms. You may delete your
            account at any time via our{" "}
            <Link href="/data-deletion" className="text-emerald-400 underline hover:text-emerald-300">
              Data Deletion
            </Link>{" "}
            page.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">7. Disclaimer</h2>
          <p>
            Earth Echo is provided &ldquo;as is&rdquo; without warranties of any kind.
            Environmental impact calculations are estimates and should not be relied upon for
            regulatory compliance.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">8. Governing Law</h2>
          <p>
            These terms are governed by the laws of England and Wales. Any disputes will be subject
            to the exclusive jurisdiction of the courts of England and Wales.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">9. Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the service after changes
            constitutes acceptance of the new terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">10. Contact</h2>
          <p>
            For questions about these terms, contact us at{" "}
            <a href="mailto:contact@codedvisiondesign.co.uk" className="text-emerald-400 underline hover:text-emerald-300">
              contact@codedvisiondesign.co.uk
            </a>
            .
          </p>
        </div>
      </section>

      <footer className="mt-16 pt-8 border-t border-gray-700 flex gap-6 text-sm text-gray-400">
        <Link href="/privacy" className="hover:text-emerald-400">Privacy Policy</Link>
        <Link href="/cookies" className="hover:text-emerald-400">Cookie Policy</Link>
        <Link href="/data-deletion" className="hover:text-emerald-400">Data Deletion</Link>
      </footer>
    </main>
  );
}
