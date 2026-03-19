import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faPlus } from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { requireSuperAdmin } from "@/lib/admin";
import { getAdminResources } from "@/lib/resource-actions";
import { ResourceList } from "./ResourceList";

const RESOURCE_CATEGORIES = [
  { value: "energy", label: "Energy" },
  { value: "water", label: "Water" },
  { value: "recycling", label: "Recycling" },
  { value: "transport", label: "Transport" },
  { value: "shopping", label: "Shopping" },
  { value: "food_waste", label: "Food Waste" },
];

export default async function AdminResourcesPage() {
  await requireSuperAdmin();
  const resources = await getAdminResources();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ocean to-forest text-white shadow">
            <FontAwesomeIcon icon={faLink} className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-charcoal">Resources</h1>
            <p className="text-sm text-slate">{resources.length} resources</p>
          </div>
        </div>
      </div>

      <ResourceList
        resources={JSON.parse(JSON.stringify(resources))}
        categories={RESOURCE_CATEGORIES}
      />
    </div>
  );
}
