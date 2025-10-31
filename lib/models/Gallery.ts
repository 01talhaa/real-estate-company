import { ObjectId } from 'mongodb'

export interface GalleryImage {
  url: string
  title?: string
  description?: string
  order: number
  uploadedAt?: Date
}

export interface GalleryDocument {
  _id?: ObjectId
  id: string
  name: string
  description?: string
  
  // Association
  propertyId?: string // Link to specific property
  category: 'Property' | 'Project' | 'Office' | 'Team' | 'Events' | 'General'
  
  // Images
  images: GalleryImage[]
  coverImage?: string
  
  // Organization
  tags?: string[]
  isPublic: boolean
  featured?: boolean
  
  // Metadata
  createdAt?: Date
  updatedAt?: Date
  createdBy?: string
}

export const GALLERIES_COLLECTION = 'galleries'

// Database indexes for optimal query performance
export const GALLERY_INDEXES = [
  { key: { propertyId: 1 } },
  { key: { category: 1 } },
  { key: { featured: 1 } },
  { key: { isPublic: 1 } },
  { key: { createdAt: -1 } },
  // Compound indexes for common queries
  { key: { isPublic: 1, featured: -1, createdAt: -1 } },
  { key: { category: 1, isPublic: 1 } },
  { key: { propertyId: 1, category: 1 } },
]
