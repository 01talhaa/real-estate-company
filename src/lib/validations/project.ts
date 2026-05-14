/**
 * Zod validation schemas for real estate projects
 */

import { z } from "zod"

// Bilingual text validation
export const BilingualTextSchema = z.object({
  en: z.string().min(1, "English text is required").max(500, "Text must be less than 500 characters"),
  bn: z.string().min(1, "Bangla text is required").max(500, "Text must be less than 500 characters"),
})

// Coordinates validation
export const CoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90, "Invalid latitude"),
  lng: z.number().min(-180).max(180, "Invalid longitude"),
})

// Specifications validation
export const SpecificationSchema = z.object({
  totalAreaSqft: z.number().positive("Area must be positive").optional(),
  bedrooms: z.number().int().positive("Bedrooms must be positive").optional(),
  bathrooms: z.number().int().positive("Bathrooms must be positive").optional(),
  parkingSpaces: z.number().int().nonnegative("Parking spaces cannot be negative").optional(),
  yearBuilt: z.number().int().min(1900).max(new Date().getFullYear() + 10).optional(),
})

// Amenity validation
export const AmenitySchema = z.object({
  en: z.string().min(1, "English amenity name required").max(100),
  bn: z.string().min(1, "Bangla amenity name required").max(100),
})

// Amenities validation
export const AmenitiesSchema = z.object({
  interior: z.array(AmenitySchema).default([]),
  exterior: z.array(AmenitySchema).default([]),
  building: z.array(AmenitySchema).default([]),
})

// Financials validation
export const FinancialsSchema = z.object({
  sharePrice: z.number().positive("Share price must be positive").optional(),
  pricePerSqft: z.number().positive("Price per sqft must be positive").optional(),
  currency: z.string().min(1, "Currency is required").max(10),
  expectedROI: z.number().positive("Expected ROI must be positive").optional(),
})

// Nearby place validation
export const NearbyPlaceSchema = z.object({
  category: z.enum(["hospital", "school", "college", "university", "mall", "park", "mosque", "transport"]),
  name: BilingualTextSchema,
  distance: z.string().min(1, "Distance is required").max(50),
})

// Main project validation schema
export const RealEstateProjectSchema = z.object({
  id: z.string().min(1, "ID is required").regex(/^[a-z0-9-]+$/, "ID must be lowercase alphanumeric with hyphens"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  name: BilingualTextSchema,
  location: BilingualTextSchema,
  address: BilingualTextSchema,
  coordinates: CoordinatesSchema,
  status: z.enum(["handover", "ongoing", "upcoming"]),
  description: BilingualTextSchema,
  longDescription: BilingualTextSchema.optional(),
  image: z.string().url("Image must be a valid URL"),
  gallery: z.array(z.string().url("Gallery image must be a valid URL")).default([]),
  completionDate: z.string().optional(),
  progressPercent: z.number().min(0).max(100, "Progress must be between 0-100").optional(),
  flats: z.number().int().positive("Flats must be positive").optional(),
  floors: z.number().int().positive("Floors must be positive").optional(),
  specifications: SpecificationSchema.optional(),
  amenities: AmenitiesSchema.optional(),
  financials: FinancialsSchema.optional(),
  nearbyPlaces: z.array(NearbyPlaceSchema).default([]),
})

// Project form schema (without id/slug/timestamps)
export const ProjectFormSchema = RealEstateProjectSchema.omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
})

export type RealEstateProjectInput = z.infer<typeof ProjectFormSchema>
export type RealEstateProjectType = z.infer<typeof RealEstateProjectSchema>
