import { z } from "zod";

export const activitySchema = z.object({
  category: z.enum(["WATER", "CARBON", "PLASTIC", "RECYCLING", "TRANSPORT", "FASHION"]),
  type: z.string().min(1, "Activity type is required"),
  value: z.number().positive("Value must be positive"),
  unit: z.string().min(1),
  note: z.string().optional(),
  date: z.string().optional(), // ISO date string, defaults to now
  // Transport-specific
  transportMode: z.string().optional(),
  distanceKm: z.number().positive().optional(),
});

export const updateActivitySchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1).optional(),
  value: z.number().positive().optional(),
  note: z.string().optional(),
  date: z.string().optional(),
  transportMode: z.string().optional(),
  distanceKm: z.number().positive().optional(),
});

export const threadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  content: z.string().min(10, "Content must be at least 10 characters").max(5000),
  category: z.enum(["tips", "challenges", "wins", "questions"]),
});

export const replySchema = z.object({
  threadId: z.string().min(1),
  content: z.string().min(1, "Reply cannot be empty").max(2000),
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
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const guideCommentSchema = z.object({
  guideSlug: z.string().min(1),
  content: z.string().min(1, "Comment cannot be empty").max(2000, "Comment must be under 2000 characters"),
});
