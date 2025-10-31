import { ObjectId } from 'mongodb'

export interface PropertyLocation {
  address: string
  city: string
  state: string
  country: string
  zipCode: string
  coordinates: {
    lat: number
    lng: number
  }
  neighborhood?: string
  landmarks?: string[]
}

export interface PropertyFinancials {
  purchasePrice?: number
  currentValue?: number
  rentalIncome?: number
  operatingExpenses?: number
  noi?: number // Net Operating Income
  capRate?: number
  cashOnCashReturn?: number
  irr?: number // Internal Rate of Return
  appreciationRate?: number
  occupancyRate?: number
}

export interface PropertySpecifications {
  totalArea: number // in sq ft or sq m
  builtUpArea?: number
  plotArea?: number
  floors?: number
  bedrooms?: number
  bathrooms?: number
  parkingSpaces?: number
  yearBuilt?: number
  yearRenovated?: number
  constructionType?: string
  condition?: 'Excellent' | 'Good' | 'Fair' | 'Needs Renovation'
}

export interface PropertyAmenities {
  interior?: string[] // e.g., "Central AC", "Modern Kitchen", "Hardwood Floors"
  exterior?: string[] // e.g., "Swimming Pool", "Garden", "Balcony"
  building?: string[] // e.g., "Gym", "Security", "Elevator", "Parking"
  nearby?: string[] // e.g., "School", "Hospital", "Shopping Mall"
}

export interface PropertyGallery {
  images: string[]
  floorPlans?: string[]
  videos?: string[]
  virtualTour?: string
  thumbnail?: string
}

export interface PropertyContact {
  agentName?: string
  agentEmail?: string
  agentPhone?: string
  agentImage?: string
}

export interface PropertyDocument {
  _id?: ObjectId
  id: string
  title: string
  slug: string
  description: string
  longDescription?: string
  
  // Property Classification
  type: 'Residential' | 'Commercial' | 'Industrial' | 'Mixed-Use' | 'Land' | 'Hospitality'
  subType?: string // e.g., "Apartment", "Office Building", "Warehouse", "Hotel"
  category: 'Sale' | 'Rent' | 'Lease' | 'Investment'
  status: 'Current' | 'Upcoming' | 'Completed' | 'Under Construction' | 'Off-Market'
  featured?: boolean
  
  // Location
  location: PropertyLocation
  
  // Specifications
  specifications: PropertySpecifications
  
  // Financial Information
  financials: PropertyFinancials
  
  // Amenities
  amenities: PropertyAmenities
  
  // Media
  gallery: PropertyGallery
  
  // Additional Details
  highlights?: string[]
  features?: string[]
  documents?: {
    name: string
    url: string
    type: string
  }[]
  
  // Project Timeline (for developments)
  timeline?: {
    phase: string
    date: string
    status: 'Completed' | 'In Progress' | 'Upcoming'
    description?: string
  }[]
  
  // Management Info
  managementStartDate?: Date
  managementEndDate?: Date
  portfolioId?: string
  clientId?: string
  
  // Contact
  contact?: PropertyContact
  
  // SEO & Marketing
  tags?: string[]
  seoTitle?: string
  seoDescription?: string
  
  // Metadata
  views?: number
  inquiries?: number
  lastUpdated?: Date
  createdAt?: Date
  updatedAt?: Date
  createdBy?: string
  isActive?: boolean
}

export const PROPERTIES_COLLECTION = 'properties'

// Database indexes for optimal query performance
export const PROPERTY_INDEXES = [
  { key: { slug: 1 }, unique: true },
  { key: { status: 1 } },
  { key: { type: 1 } },
  { key: { category: 1 } },
  { key: { featured: 1 } },
  { key: { isActive: 1 } },
  { key: { 'location.city': 1 } },
  { key: { 'location.state': 1 } },
  { key: { 'financials.price': 1 } },
  { key: { createdAt: -1 } },
  { key: { views: -1 } },
  // Compound indexes for common queries
  { key: { status: 1, isActive: 1, featured: -1 } },
  { key: { type: 1, category: 1, status: 1 } },
  { key: { 'location.city': 1, type: 1, status: 1 } },
  // Text index for search
  { key: { title: 'text', description: 'text', tags: 'text' } },
]
