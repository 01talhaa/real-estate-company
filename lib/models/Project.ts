import { ObjectId } from 'mongodb'

export interface ProjectDocument {
  _id?: ObjectId
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
  metrics?: {
    label: string
    value: string
  }[]
  challenges?: string[]
  solutions?: string[]
  technologies?: string[]
  timeline?: {
    phase: string
    duration: string
    description: string
  }[]
  testimonial?: {
    quote: string
    author: string
    role: string
    avatar?: string
  }
  awards?: string[]
  links?: {
    label: string
    url: string
  }[]
  createdAt?: Date
  updatedAt?: Date
}

export const PROJECTS_COLLECTION = 'projects'

// Database indexes for optimal query performance
export const PROJECT_INDEXES = [
  { key: { id: 1 }, unique: true },
  { key: { status: 1 } },
  { key: { category: 1 } },
  { key: { year: 1 } },
  { key: { createdAt: -1 } },
  // Compound indexes for common queries
  { key: { status: 1, category: 1, year: -1 } },
  { key: { category: 1, createdAt: -1 } },
  // Text index for search
  { key: { title: 'text', description: 'text', tags: 'text' } },
]
