/**
 * Zod validation schemas for events
 */

import { z } from "zod"

// Bilingual text validation
export const BilingualTextSchema = z.object({
  en: z.string().min(1, "English text is required").max(500, "Text must be less than 500 characters"),
  bn: z.string().min(1, "Bangla text is required").max(500, "Text must be less than 500 characters"),
})

// Main event validation schema
export const SabitEventSchema = z.object({
  id: z.string().min(1, "ID is required").regex(/^[a-z0-9-]+$/, "ID must be lowercase alphanumeric with hyphens"),
  title: BilingualTextSchema,
  date: z.string().datetime("Invalid date format"),
  location: BilingualTextSchema,
  description: BilingualTextSchema,
  type: z.enum(["launch", "investor-meet", "community", "announcement"]),
  registrationLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  isUpcoming: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

// Event form schema (without id/timestamps)
export const EventFormSchema = SabitEventSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type SabitEventInput = z.infer<typeof EventFormSchema>
export type SabitEventType = z.infer<typeof SabitEventSchema>
