import Link from "next/link";

export const metadata = {
  title: "Data Deletion | Earth Echo",
  description: "Request deletion of your Earth Echo account and personal data.",
};

export default function DataDeletionPage() {
  return (
    <main className="min-h-screen bg-[#0a1628] text-gray-200 px-6 py-16 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Data Deletion</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: March 17, 2026</p>

      <section className="space-y-6 text-gray-300 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Your Right to Delete Your Data</h2>
          <p>
            Under GDPR and UK data protection law, you have the right to request complete deletion
            of your Earth Echo account and all associated personal data at any time. This includes
            your profile information, tracking history, forum posts, challenge participation, and
            badge records.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">How to Request Deletion</h2>
          <p>To delete your account and data, you can use any of the following methods:</p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>
              <strong className="text-white">In-app:</strong> Go to{" "}
              <Link href="/profile" className="text-emerald-400 underline hover:text-emerald-300">
                Profile Settings
              </Link>{" "}
              and select &ldquo;Delete Account&rdquo;
            </li>
            <li>
              <strong className="text-white">Email:</strong> Send a deletion request to{" "}
              <a href="mailto:contact@codedvisiondesign.co.uk" className="text-emerald-400 underline hover:text-emerald-300">
                contact@codedvisiondesign.co.uk
              </a>{" "}
              from the email address associated with your account
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">What Gets Deleted</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Your user profile (name, email, profile picture)</li>
            <li>All environmental tracking entries</li>
            <li>Challenge participation and badge records</li>
            <li>Forum posts and community contributions</li>
            <li>Leaderboard rankings</li>
            <li>OAuth provider connections (Google, Facebook)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Processing Time</h2>
          <p>
            Account deletion requests are processed within 30 days. You will receive an email
            confirmation once your data has been permanently removed from our systems.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Facebook Data Deletion</h2>
          <p>
            If you signed in with Facebook, you can also remove Earth Echo&apos;s access from your
            Facebook Settings &gt; Apps and Websites. This will trigger our data deletion process
            automatically.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Contact</h2>
          <p>
            For questions about data deletion, contact our Data Protection Officer at{" "}
            <a href="mailto:contact@codedvisiondesign.co.uk" className="text-emerald-400 underline hover:text-emerald-300">
              contact@codedvisiondesign.co.uk
            </a>
            .
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Coded Vision Design, 6 Braiding Crescent, Essex, CM7 3LU, United Kingdom
          </p>
        </div>
      </section>

      <footer className="mt-16 pt-8 border-t border-gray-700 flex gap-6 text-sm text-gray-400">
        <Link href="/privacy" className="hover:text-emerald-400">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-emerald-400">Terms of Service</Link>
        <Link href="/cookies" className="hover:text-emerald-400">Cookie Policy</Link>
      </footer>
    </main>
  );
}
