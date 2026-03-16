export type ActivityCategory = "WATER" | "CARBON" | "PLASTIC" | "RECYCLING" | "TRANSPORT" | "FASHION";

export interface CategoryConfig {
  key: ActivityCategory;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  unit: string;
  unitLabel: string;
  trackingPath: string;
  activityTypes: { value: string; label: string }[];
}

export const CATEGORIES: Record<ActivityCategory, CategoryConfig> = {
  WATER: {
    key: "WATER",
    label: "Water Saved",
    icon: "\u{1F4A7}",
    color: "text-ocean",
    bgColor: "bg-ocean",
    unit: "litres",
    unitLabel: "Litres",
    trackingPath: "/track/water",
    activityTypes: [
      { value: "reusable_bottle", label: "Used reusable bottle" },
      { value: "shorter_shower", label: "Shorter shower" },
      { value: "full_load_washing", label: "Full load washing" },
      { value: "rain_barrel", label: "Rain barrel collection" },
      { value: "tap_off_brushing", label: "Tap off while brushing" },
      { value: "other_water", label: "Other water saving" },
    ],
  },
  CARBON: {
    key: "CARBON",
    label: "Carbon Reduced",
    icon: "\u{1F30D}",
    color: "text-forest",
    bgColor: "bg-forest",
    unit: "kg_co2",
    unitLabel: "kg CO2",
    trackingPath: "/track/carbon",
    activityTypes: [
      { value: "energy_saving", label: "Energy saving at home" },
      { value: "diet_change", label: "Plant-based meal" },
      { value: "local_produce", label: "Bought local produce" },
      { value: "air_dry_clothes", label: "Air dried clothes" },
      { value: "reduced_heating", label: "Reduced heating/AC" },
      { value: "other_carbon", label: "Other carbon saving" },
    ],
  },
  PLASTIC: {
    key: "PLASTIC",
    label: "Plastic Avoided",
    icon: "\u{1F6CD}\u{FE0F}",
    color: "text-amber",
    bgColor: "bg-amber",
    unit: "items",
    unitLabel: "Items",
    trackingPath: "/track/plastic",
    activityTypes: [
      { value: "reusable_bag", label: "Used reusable bag" },
      { value: "reusable_bottle", label: "Used reusable bottle" },
      { value: "refused_straw", label: "Refused plastic straw" },
      { value: "refused_packaging", label: "Refused excess packaging" },
      { value: "bulk_buy", label: "Bought in bulk / refill" },
      { value: "other_plastic", label: "Other plastic avoidance" },
    ],
  },
  RECYCLING: {
    key: "RECYCLING",
    label: "Recycling Impact",
    icon: "\u{267B}\u{FE0F}",
    color: "text-leaf",
    bgColor: "bg-leaf",
    unit: "kg",
    unitLabel: "kg",
    trackingPath: "/track/recycling",
    activityTypes: [
      { value: "paper", label: "Paper & cardboard" },
      { value: "plastic_recycling", label: "Plastic recycling" },
      { value: "glass", label: "Glass recycling" },
      { value: "metal", label: "Metal / cans" },
      { value: "electronics", label: "Electronics recycling" },
      { value: "textiles", label: "Textile recycling" },
      { value: "other_recycling", label: "Other recycling" },
    ],
  },
  TRANSPORT: {
    key: "TRANSPORT",
    label: "Transport Savings",
    icon: "\u{1F697}",
    color: "text-ocean-light",
    bgColor: "bg-ocean-light",
    unit: "km",
    unitLabel: "km",
    trackingPath: "/track/transport",
    activityTypes: [
      { value: "commute", label: "Daily commute" },
      { value: "errand", label: "Errand / shopping trip" },
      { value: "leisure", label: "Leisure trip" },
      { value: "other_transport", label: "Other journey" },
    ],
  },
  FASHION: {
    key: "FASHION",
    label: "Fashion Impact",
    icon: "\u{1F457}",
    color: "text-forest-light",
    bgColor: "bg-forest-light",
    unit: "items",
    unitLabel: "Items",
    trackingPath: "/track/shopping",
    activityTypes: [
      { value: "secondhand_purchase", label: "Secondhand purchase" },
      { value: "clothing_swap", label: "Clothing swap" },
      { value: "repair", label: "Repaired clothing" },
      { value: "upcycle", label: "Upcycled item" },
      { value: "other_fashion", label: "Other sustainable fashion" },
    ],
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);
