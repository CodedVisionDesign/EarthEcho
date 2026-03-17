import Link from "next/link";

export const metadata = {
  title: "Cookie Policy | Earth Echo",
  description: "How Earth Echo uses cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-[#0a1628] text-gray-200 px-6 py-16 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Cookie Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: March 17, 2026</p>

      <section className="space-y-6 text-gray-300 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">1. What Are Cookies</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help
            the site remember your preferences and activity.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">2. Cookies We Use</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-400 border-b border-gray-700">
                <tr>
                  <th className="py-2 pr-4">Cookie</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Purpose</th>
                  <th className="py-2">Duration</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-800">
                  <td className="py-2 pr-4 font-mono text-xs">authjs.session-token</td>
                  <td className="py-2 pr-4">Essential</td>
                  <td className="py-2 pr-4">Keeps you signed in</td>
                  <td className="py-2">Session / 30 days</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2 pr-4 font-mono text-xs">authjs.csrf-token</td>
                  <td className="py-2 pr-4">Essential</td>
                  <td className="py-2 pr-4">Protects against cross-site request forgery</td>
                  <td className="py-2">Session</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2 pr-4 font-mono text-xs">authjs.callback-url</td>
                  <td className="py-2 pr-4">Essential</td>
                  <td className="py-2 pr-4">Redirects you after sign-in</td>
                  <td className="py-2">Session</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">3. Third-Party Cookies</h2>
          <p>
            We do not use any third-party advertising, analytics, or tracking cookies. The only
            third-party interaction occurs during OAuth sign-in with Google or Facebook, which is
            handled server-side and does not set persistent third-party cookies on your device.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">4. Managing Cookies</h2>
          <p>
            Since we only use essential cookies required for authentication, disabling them will
            prevent you from signing in. You can clear cookies at any time through your browser
            settings.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">5. Contact</h2>
          <p>
            For questions about our use of cookies, contact us at{" "}
            <a href="mailto:contact@codedvisiondesign.co.uk" className="text-emerald-400 underline hover:text-emerald-300">
              contact@codedvisiondesign.co.uk
            </a>
            .
          </p>
        </div>
      </section>

      <footer className="mt-16 pt-8 border-t border-gray-700 flex gap-6 text-sm text-gray-400">
        <Link href="/privacy" className="hover:text-emerald-400">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-emerald-400">Terms of Service</Link>
        <Link href="/data-deletion" className="hover:text-emerald-400">Data Deletion</Link>
      </footer>
    </main>
  );
}
