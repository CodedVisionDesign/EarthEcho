import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Earth Echo",
  description: "How Earth Echo collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0a1628] text-gray-200 px-6 py-16 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: March 17, 2026</p>

      <section className="space-y-6 text-gray-300 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">1. Who We Are</h2>
          <p>
            Earth Echo is operated by Coded Vision Design. Our Data Protection Officer can be
            contacted at{" "}
            <a href="mailto:contact@codedvisiondesign.co.uk" className="text-emerald-400 underline hover:text-emerald-300">
              contact@codedvisiondesign.co.uk
            </a>
            .
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Coded Vision Design, 6 Braiding Crescent, Essex, CM7 3LU, United Kingdom
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">2. Information We Collect</h2>
          <p>
            When you sign in with Google or Facebook, we receive your name, email address, and
            profile picture from the provider. When you use credential-based sign-in, we store a
            securely hashed version of your password. We also collect data you voluntarily enter
            such as carbon tracking entries, challenge participation, and forum posts.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To authenticate and manage your account</li>
            <li>To display your environmental impact metrics and progress</li>
            <li>To power leaderboards, badges, and community features</li>
            <li>To improve the application and fix issues</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">4. Legal Basis for Processing (GDPR)</h2>
          <p>We process your personal data under the following legal bases:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong className="text-white">Consent:</strong> When you create an account and agree to these terms</li>
            <li><strong className="text-white">Contract:</strong> To provide the service you signed up for</li>
            <li><strong className="text-white">Legitimate interest:</strong> To improve and secure the platform</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">5. Data Sharing</h2>
          <p>
            We do not sell your personal data. We share information only with third-party
            authentication providers (Google, Facebook) as necessary to enable sign-in, and with
            our database hosting provider to store your data securely.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">6. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active. You may request deletion of
            your account and all associated data at any time (see our{" "}
            <Link href="/data-deletion" className="text-emerald-400 underline hover:text-emerald-300">
              Data Deletion
            </Link>{" "}
            page).
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">7. Your Rights</h2>
          <p>Under GDPR, you have the right to:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Access the personal data we hold about you</li>
            <li>Rectify inaccurate personal data</li>
            <li>Request erasure of your personal data</li>
            <li>Restrict or object to processing</li>
            <li>Data portability</li>
            <li>Lodge a complaint with the ICO (Information Commissioner&apos;s Office)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">8. Cookies</h2>
          <p>
            We use essential cookies for authentication sessions. For full details, see our{" "}
            <Link href="/cookies" className="text-emerald-400 underline hover:text-emerald-300">
              Cookie Policy
            </Link>
            .
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">9. Security</h2>
          <p>
            Passwords are hashed with bcrypt. All connections use HTTPS in production. OAuth tokens
            are handled server-side and never exposed to the browser.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">10. Contact</h2>
          <p>
            For privacy-related questions, contact our Data Protection Officer at{" "}
            <a href="mailto:contact@codedvisiondesign.co.uk" className="text-emerald-400 underline hover:text-emerald-300">
              contact@codedvisiondesign.co.uk
            </a>
            .
          </p>
        </div>
      </section>

      <footer className="mt-16 pt-8 border-t border-gray-700 flex gap-6 text-sm text-gray-400">
        <Link href="/terms" className="hover:text-emerald-400">Terms of Service</Link>
        <Link href="/cookies" className="hover:text-emerald-400">Cookie Policy</Link>
        <Link href="/data-deletion" className="hover:text-emerald-400">Data Deletion</Link>
      </footer>
    </main>
  );
}
