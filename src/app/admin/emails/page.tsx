import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpenText, faArrowLeft } from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { requireAdmin } from "@/lib/admin";
import {
  getWelcomeEmailHtml,
  getPasswordResetEmailHtml,
  getBanNotificationEmailHtml,
  getAdminInviteEmailHtml,
} from "@/lib/email";
import Link from "next/link";

const EMAIL_TEMPLATES = [
  {
    id: "welcome",
    name: "Welcome Email",
    description: "Sent when a new user registers",
    getHtml: () => getWelcomeEmailHtml("Jane Smith"),
  },
  {
    id: "password-reset",
    name: "Password Reset",
    description: "Sent when a user or admin requests a password reset",
    getHtml: () => getPasswordResetEmailHtml("Jane Smith"),
  },
  {
    id: "ban-notification",
    name: "Ban Notification",
    description: "Sent when a user's account is suspended",
    getHtml: () => getBanNotificationEmailHtml("Jane Smith", "Repeated violation of community guidelines regarding harassment in forum posts."),
  },
  {
    id: "admin-invite",
    name: "Admin Invite",
    description: "Sent when inviting a new administrator",
    getHtml: () => getAdminInviteEmailHtml("admin@example.com"),
  },
];

export default async function AdminEmailsPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  await requireAdmin();
  const { template } = await searchParams;
  const activeTemplate = EMAIL_TEMPLATES.find((t) => t.id === template) ?? EMAIL_TEMPLATES[0];

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/users"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate transition-colors hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" />
        </Link>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean/10">
          <FontAwesomeIcon icon={faEnvelopeOpenText} className="h-5 w-5 text-ocean" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-charcoal">Email Previews</h1>
          <p className="text-sm text-slate">Preview all email templates sent by the platform</p>
        </div>
      </div>

      {/* Template Selector */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {EMAIL_TEMPLATES.map((t) => (
          <Link
            key={t.id}
            href={`/admin/emails?template=${t.id}`}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTemplate.id === t.id
                ? "bg-forest text-white shadow-sm"
                : "bg-gray-100 text-slate hover:bg-gray-200"
            }`}
          >
            {t.name}
          </Link>
        ))}
      </div>

      {/* Template Info */}
      <Card variant="default" className="mb-4 px-5 py-3">
        <h2 className="text-sm font-semibold text-charcoal">{activeTemplate.name}</h2>
        <p className="text-xs text-slate">{activeTemplate.description}</p>
      </Card>

      {/* Email Preview */}
      <Card variant="default" className="overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-2">
          <p className="text-xs text-slate">Email Preview (sample data)</p>
        </div>
        <iframe
          srcDoc={activeTemplate.getHtml()}
          className="h-[700px] w-full border-0"
          title={`${activeTemplate.name} preview`}
          sandbox=""
        />
      </Card>
    </div>
  );
}
