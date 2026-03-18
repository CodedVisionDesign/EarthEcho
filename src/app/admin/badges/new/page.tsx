import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowLeft } from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { requireSuperAdmin } from "@/lib/admin";
import { BadgeForm } from "@/components/admin/BadgeForm";
import Link from "next/link";

export default async function NewBadgePage() {
  await requireSuperAdmin();

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/badges"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate hover:text-charcoal transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
          Back to Badges
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10">
            <FontAwesomeIcon icon={faPlus} className="h-5 w-5 text-forest" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-charcoal">Create Badge</h1>
            <p className="text-sm text-slate">Define a new achievement badge for your community</p>
          </div>
        </div>
      </div>

      <Card variant="default" className="p-6">
        <BadgeForm mode="create" />
      </Card>
    </div>
  );
}
