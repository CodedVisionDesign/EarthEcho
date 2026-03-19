import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@/lib/fontawesome";
import { requireSuperAdmin } from "@/lib/admin";
import { getAdminGuides } from "@/lib/guide-actions";
import { GuideList } from "./GuideList";

const GUIDE_CATEGORIES = [
  { value: "energy", label: "Energy" },
  { value: "water", label: "Water" },
  { value: "waste", label: "Waste" },
  { value: "food", label: "Food" },
  { value: "transport", label: "Transport" },
  { value: "fashion", label: "Fashion" },
  { value: "general", label: "General" },
];

const ICON_OPTIONS = [
  { value: "faBookOpen", label: "Book" },
  { value: "faSun", label: "Sun" },
  { value: "faDroplet", label: "Water Drop" },
  { value: "faRecycle", label: "Recycle" },
  { value: "faCarrot", label: "Carrot" },
  { value: "faShower", label: "Shower" },
  { value: "faLeaf", label: "Leaf" },
  { value: "faSeedling", label: "Seedling" },
  { value: "faLightbulb", label: "Lightbulb" },
  { value: "faEarthAmericas", label: "Earth" },
  { value: "faBicycle", label: "Bicycle" },
  { value: "faCar", label: "Car" },
  { value: "faShirt", label: "Shirt" },
];

export default async function AdminGuidesPage() {
  await requireSuperAdmin();
  const guides = await getAdminGuides();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-forest to-leaf text-white shadow">
            <FontAwesomeIcon icon={faBookOpen} className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-charcoal">Guides</h1>
            <p className="text-sm text-slate">{guides.length} guides</p>
          </div>
        </div>
      </div>

      <GuideList
        guides={JSON.parse(JSON.stringify(guides))}
        categories={GUIDE_CATEGORIES}
        iconOptions={ICON_OPTIONS}
      />
    </div>
  );
}
