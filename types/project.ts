export interface Project {
  id: string;
  slug: string;
  name: {
    en: string;
    bn: string;
  };
  location: {
    en: string;
    bn: string;
  };
  address: {
    en: string;
    bn: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  status: 'handover' | 'ongoing' | 'upcoming';
  description: {
    en: string;
    bn: string;
  };
  longDescription: {
    en: string;
    bn: string;
  };
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
    interior: string[];
    exterior: string[];
    building: string[];
  };
  financials: {
    sharePrice: number;
    pricePerSqft: number;
    currency: string;
    expectedROI: number;
  };
  nearbyPlaces: {
    name: string;
    distance: string;
  }[];
}
