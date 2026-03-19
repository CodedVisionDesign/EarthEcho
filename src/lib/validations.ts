import { z } from "zod";

// Maximum realistic single-activity values per category (OWASP: input validation)
export const CATEGORY_MAX_VALUES: Record<string, number> = {
  WATER: 2000,      // 2,000 litres (large household daily max)
  CARBON: 100,      // 100 kg CO₂ offset in a single activity
  PLASTIC: 200,     // 200 items avoided
  RECYCLING: 500,   // 500 kg recycled
  TRANSPORT: 500,   // 500 km green travel in one go
  FASHION: 50,      // 50 sustainable fashion items
};

// Maximum points a user can earn per calendar day
export const DAILY_POINT_CAP = 500;

// Anomaly thresholds (~50% of max) - activities above these are flagged for admin review
export const ANOMALY_THRESHOLDS: Record<string, number> = {
  WATER: 1000,
  CARBON: 50,
  PLASTIC: 100,
  RECYCLING: 250,
  TRANSPORT: 300,
  FASHION: 25,
};

export const activitySchema = z.object({
  category: z.enum(["WATER", "CARBON", "PLASTIC", "RECYCLING", "TRANSPORT", "FASHION"]),
  type: z.string().min(1, "Activity type is required"),
  value: z.number().positive("Value must be positive").max(10000, "Value exceeds maximum allowed"),
  unit: z.string().min(1),
  note: z.string().optional(),
  date: z.string().optional(), // ISO date string, defaults to now
  // Transport-specific
  transportMode: z.string().optional(),
  distanceKm: z.number().positive().max(5000, "Distance exceeds maximum allowed").optional(),
}).superRefine((data, ctx) => {
  const max = CATEGORY_MAX_VALUES[data.category];
  if (max && data.value > max) {
    ctx.addIssue({
      code: "custom",
      message: `Value for ${data.category} cannot exceed ${max}`,
      path: ["value"],
    });
  }
});

export const updateActivitySchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1).optional(),
  value: z.number().positive().max(10000, "Value exceeds maximum allowed").optional(),
  note: z.string().optional(),
  date: z.string().optional(),
  transportMode: z.string().optional(),
  distanceKm: z.number().positive().max(5000, "Distance exceeds maximum allowed").optional(),
});

export const threadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  content: z.string().min(10, "Content must be at least 10 characters").max(5000),
  category: z.enum(["tips", "challenges", "wins", "questions"]),
});

export const replySchema = z.object({
  threadId: z.string().min(1),
  content: z.string().min(1, "Reply cannot be empty").max(2000),
  parentReplyId: z.string().optional(),
});

export const reactionSchema = z.object({
  replyId: z.string().min(1),
  type: z.enum(["cheer", "helpful", "inspiring"]),
});

export const editThreadSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3, "Title must be at least 3 characters").max(200).optional(),
  content: z.string().min(10, "Content must be at least 10 characters").max(5000).optional(),
});

export const editReplySchema = z.object({
  id: z.string().min(1),
  content: z.string().min(1, "Reply cannot be empty").max(2000),
});

export const profileSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional(),
  isPublic: z.boolean().optional(),
  dateOfBirth: z.string().optional(),
}).refine((data) => {
  if (!data.dateOfBirth) return true;
  const dob = new Date(data.dateOfBirth);
  if (isNaN(dob.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age >= 13;
}, { message: "You must be at least 13 years old", path: ["dateOfBirth"] });

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
}).refine((data) => {
  const dob = new Date(data.dateOfBirth);
  if (isNaN(dob.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age >= 13;
}, { message: "You must be at least 13 years old to create an account", path: ["dateOfBirth"] });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const guideCommentSchema = z.object({
  guideSlug: z.string().min(1),
  content: z.string().min(1, "Comment cannot be empty").max(2000, "Comment must be under 2000 characters"),
});
