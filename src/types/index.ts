// Bilingual text support
export interface BilingualText {
  en: string
  bn: string
}

// ─── Real Estate Project Types ───────────────────────────────────────────────

export interface Specification {
  totalAreaSqft?: number
  bedrooms?: number
  bathrooms?: number
  parkingSpaces?: number
  yearBuilt?: number
}

export interface Amenity {
  en: string
  bn: string
}

export interface Amenities {
  interior: Amenity[]
  exterior: Amenity[]
  building: Amenity[]
}

export interface Financials {
  sharePrice?: number
  pricePerSqft?: number
  currency: string
  expectedROI?: number
}

export interface Coordinates {
  lat: number
  lng: number
}

export interface NearbyPlace {
  category: "hospital" | "school" | "college" | "university" | "mall" | "park" | "mosque" | "transport"
  name: BilingualText
  distance: string
}

export interface RealEstateProject {
  id: string
  slug: string
  name: BilingualText
  location: BilingualText
  address: BilingualText
  coordinates: Coordinates
  status: "handover" | "ongoing" | "upcoming"
  description: BilingualText
  longDescription?: BilingualText
  image: string
  gallery?: string[]
  completionDate?: string
  progressPercent?: number
  flats?: number
  floors?: number
  specifications?: Specification
  amenities?: Amenities
  financials?: Financials
  nearbyPlaces?: NearbyPlace[]
  createdAt?: string
  updatedAt?: string
}

// ─── Event Types ────────────────────────────────────────────────────────────

export type EventType = "launch" | "investor-meet" | "community" | "announcement"

export interface SabitEvent {
  id: string
  title: BilingualText
  date: string // ISO format
  location: BilingualText
  description: BilingualText
  type: EventType
  displayImage?: string
  registrationLink?: string
  isUpcoming: boolean
  createdAt?: string
  updatedAt?: string
}

// ─── Admin & Auth Types ──────────────────────────────────────────────────────

export interface AdminUser {
  id: string
  email: string
  name: string
  role: "admin" | "superadmin"
  createdAt: string
}

export interface GithubFileResponse {
  name: string
  path: string
  sha: string
  size: number
  type: string
  url: string
  html_url: string
  git_url: string
  download_url: string | null
  content: string // Base64 encoded
  encoding: string
  _links: {
    self: string
    git: string
    html: string
  }
}

export interface GithubCommitResponse {
  sha: string
  url: string
  html_url: string
  author: {
    name: string
    email: string
    date: string
  }
  message: string
  tree: {
    sha: string
    url: string
  }
  parents: Array<{
    sha: string
    url: string
    html_url: string
  }>
}

// ─── UI State Types ─────────────────────────────────────────────────────────

export interface FormState {
  isLoading: boolean
  error?: string
  success?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// ─── Portfolio Project Types ────────────────────────────────────────────────

export interface PortfolioMetric {
  label: string
  value: string
}

export interface PortfolioTimelinePhase {
  phase: string
  duration: string
  description: string
}

export interface PortfolioTestimonial {
  quote: string
  author: string
  role: string
  avatar?: string
}

export interface PortfolioLink {
  label: string
  url: string
}

export interface PortfolioProject {
  id: string
  title: string
  client: string
  category: string
  description: string
  longDescription?: string
  image: string
  images?: string[]
  video?: string
  tags: string[]
  year: string
  duration?: string
  budget?: string
  status?: "Completed" | "In Progress" | "On Hold"
  teamMembers?: string[]
  deliverables?: string[]
  results?: string[]
  metrics?: PortfolioMetric[]
  challenges?: string[]
  solutions?: string[]
  technologies?: string[]
  timeline?: PortfolioTimelinePhase[]
  testimonial?: PortfolioTestimonial
  awards?: string[]
  links?: PortfolioLink[]
}
