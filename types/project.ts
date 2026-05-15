import type { BilingualText } from "@/types";

export interface Project {
  id: string;
  slug: string;
  name: BilingualText;
  location: BilingualText;
  address: BilingualText;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: "handover" | "ongoing" | "upcoming";
  description: BilingualText;
  longDescription: BilingualText;
  image: string;
  gallery: string[];
  completionDate: string;
  progressPercent: number;
  flats: number;
  floors: number;
  specifications: {
    totalAreaSqft: number;
    bedrooms: number;
    bathrooms: number;
    parkingSpaces: number;
    yearBuilt: number;
  };
  amenities: {
    interior: BilingualText[];
    exterior: BilingualText[];
    building: BilingualText[];
  };
  financials: {
    sharePrice: number;
    pricePerSqft: number;
    currency: string;
    expectedROI: number;
  };
  nearbyPlaces: {
    category: "hospital" | "school" | "college" | "university" | "mall" | "park" | "mosque" | "transport";
    name: BilingualText;
    distance: string;
  }[];
}
