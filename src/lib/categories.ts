export type ActivityCategory = "WATER" | "CARBON" | "PLASTIC" | "RECYCLING" | "TRANSPORT" | "FASHION";

export interface ActivityTypeConfig {
  value: string;
  label: string;
  defaultValue: number;
  hint: string;
  quickLog?: boolean;
  quickLogEmoji?: string;
}

export interface CategoryConfig {
  key: ActivityCategory;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  unit: string;
  unitLabel: string;
  trackingPath: string;
  activityTypes: ActivityTypeConfig[];
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
      { value: "reusable_bottle", label: "Used reusable bottle", defaultValue: 0.5, hint: "A single-use bottle holds ~0.5L", quickLog: true, quickLogEmoji: "\u{1F4A7}" },
      { value: "shorter_shower", label: "Shorter shower", defaultValue: 30, hint: "A typical shower uses ~65L. Cutting 5 min saves ~30L", quickLog: true, quickLogEmoji: "\u{1F6BF}" },
      { value: "full_load_washing", label: "Full load washing", defaultValue: 50, hint: "One full washing machine cycle uses ~50L", quickLog: true, quickLogEmoji: "\u{1F9FA}" },
      { value: "rain_barrel", label: "Rain barrel collection", defaultValue: 20, hint: "A typical rain barrel collects 10\u201350L per rainfall" },
      { value: "tap_off_brushing", label: "Tap off while brushing", defaultValue: 6, hint: "Leaving the tap on wastes ~6L per minute of brushing", quickLog: true, quickLogEmoji: "\u{1FAA5}" },
      { value: "other_water", label: "Other water saving", defaultValue: 1, hint: "Enter the litres of water you saved" },
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
      { value: "energy_saving", label: "Energy saving at home", defaultValue: 1.5, hint: "Switching off standby saves ~1\u20132 kg CO\u2082/day", quickLog: true, quickLogEmoji: "\u{1F4A1}" },
      { value: "diet_change", label: "Plant-based meal", defaultValue: 2.5, hint: "A plant-based meal saves ~2\u20133 kg CO\u2082 vs beef", quickLog: true, quickLogEmoji: "\u{1F966}" },
      { value: "local_produce", label: "Bought local produce", defaultValue: 0.5, hint: "Local food avoids ~0.5 kg CO\u2082 in transport per shop" },
      { value: "air_dry_clothes", label: "Air dried clothes", defaultValue: 2.5, hint: "One dryer cycle produces ~2.5 kg CO\u2082", quickLog: true, quickLogEmoji: "\u{1F455}" },
      { value: "reduced_heating", label: "Reduced heating/AC", defaultValue: 1.5, hint: "Lowering the thermostat 1\u00B0C saves ~1\u20132 kg CO\u2082/day" },
      { value: "other_carbon", label: "Other carbon saving", defaultValue: 1, hint: "Enter kg CO\u2082 saved" },
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
      { value: "reusable_bag", label: "Used reusable bag", defaultValue: 1, hint: "Each reusable bag replaces 1 single-use bag", quickLog: true, quickLogEmoji: "\u{1F6CD}\u{FE0F}" },
      { value: "reusable_bottle", label: "Used reusable bottle", defaultValue: 1, hint: "Each refill avoids 1 plastic bottle", quickLog: true, quickLogEmoji: "\u{1FAD9}" },
      { value: "refused_straw", label: "Refused plastic straw", defaultValue: 1, hint: "1 plastic straw refused", quickLog: true, quickLogEmoji: "\u{1F964}" },
      { value: "refused_packaging", label: "Refused excess packaging", defaultValue: 1, hint: "Each time you refuse excess packaging counts as 1 item" },
      { value: "bulk_buy", label: "Bought in bulk / refill", defaultValue: 3, hint: "Buying in bulk typically avoids 2\u20135 plastic containers" },
      { value: "other_plastic", label: "Other plastic avoidance", defaultValue: 1, hint: "Enter the number of plastic items avoided" },
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
      { value: "paper", label: "Paper & cardboard", defaultValue: 2, hint: "A newspaper ~0.3 kg, a cardboard box ~0.5\u20132 kg", quickLog: true, quickLogEmoji: "\u{1F4F0}" },
      { value: "plastic_recycling", label: "Plastic recycling", defaultValue: 0.5, hint: "A plastic bottle ~30g, a container ~100\u2013500g" },
      { value: "glass", label: "Glass recycling", defaultValue: 0.5, hint: "A glass bottle weighs ~0.3\u20130.5 kg", quickLog: true, quickLogEmoji: "\u{1FAD9}" },
      { value: "metal", label: "Metal / cans", defaultValue: 0.5, hint: "An aluminium can ~15g, a tin can ~50g" },
      { value: "electronics", label: "Electronics recycling", defaultValue: 2, hint: "A phone ~0.2 kg, a laptop ~2 kg" },
      { value: "textiles", label: "Textile recycling", defaultValue: 1, hint: "A t-shirt ~0.2 kg, jeans ~0.8 kg" },
      { value: "other_recycling", label: "Other recycling", defaultValue: 1, hint: "Enter weight in kg" },
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
      { value: "commute", label: "Daily commute", defaultValue: 10, hint: "The average UK commute is ~15 km each way" },
      { value: "errand", label: "Errand / shopping trip", defaultValue: 5, hint: "A typical errand trip is 3\u20138 km" },
      { value: "leisure", label: "Leisure trip", defaultValue: 10, hint: "Enter the distance of your trip in km" },
      { value: "other_transport", label: "Other journey", defaultValue: 5, hint: "Enter the distance in km" },
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
      { value: "secondhand_purchase", label: "Secondhand purchase", defaultValue: 1, hint: "Each secondhand item saves ~8 kg CO\u2082 vs buying new", quickLog: true, quickLogEmoji: "\u{1F6CD}\u{FE0F}" },
      { value: "clothing_swap", label: "Clothing swap", defaultValue: 1, hint: "Each swapped item is 1 item saved from landfill", quickLog: true, quickLogEmoji: "\u{1F504}" },
      { value: "repair", label: "Repaired clothing", defaultValue: 1, hint: "Each repair extends a garment\u2019s life" },
      { value: "upcycle", label: "Upcycled item", defaultValue: 1, hint: "Each upcycled item given new purpose" },
      { value: "other_fashion", label: "Other sustainable fashion", defaultValue: 1, hint: "Enter the number of sustainable fashion items" },
    ],
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);
