import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowLeft } from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { requireAdmin } from "@/lib/admin";
import { ChallengeForm } from "@/components/admin/ChallengeForm";
import Link from "next/link";

export default async function NewChallengePage() {
  const admin = await requireAdmin();
  const isSuperAdmin = admin.role === "superadmin" || admin.role === "developer";

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/challenges"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate hover:text-charcoal transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
          Back to Challenges
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10">
            <FontAwesomeIcon icon={faPlus} className="h-5 w-5 text-forest" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-charcoal">Create Challenge</h1>
            <p className="text-sm text-slate">Set up a new monthly challenge for your community</p>
          </div>
        </div>
      </div>

      <Card variant="default" className="p-6">
        <ChallengeForm mode="create" isSuperAdmin={isSuperAdmin} />
      </Card>
    </div>
  );
}
