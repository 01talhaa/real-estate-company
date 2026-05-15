import { z } from "zod";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
}

const LocalizedStringSchema = z.object({
  en: z.string(),
  bn: z.string(),
});

export const ManagementMemberSchema = z.object({
  id: z.string(),
  name: LocalizedStringSchema,
  role: LocalizedStringSchema,
  department: LocalizedStringSchema,
  bio: LocalizedStringSchema,
  image: z.string(),
  linkedin: z.string().optional(),
  order: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type ManagementMember = z.infer<typeof ManagementMemberSchema>;
