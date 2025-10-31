import { ObjectId } from 'mongodb'

export const TEAM_COLLECTION = 'team'

// Database indexes for optimal query performance
export const TEAM_INDEXES = [
  { key: { id: 1 }, unique: true },
  { key: { department: 1 } },
  { key: { order: 1 } },
  { key: { createdAt: -1 } },
  // Text index for search
  { key: { name: 'text', role: 'text', department: 'text', bio: 'text' } },
]

export interface Experience {
  title: string
  company: string
  period: string
  description: string
}

export interface Education {
  degree: string
  school: string
  year: string
}

export interface TeamMemberDocument {
  _id?: ObjectId
  id: string
  name: string
  role: string
  department: string
  bio: string
  image: string
  linkedin: string
  twitter: string
  email: string
  fullBio?: string
  expertise?: string[]
  experience?: Experience[]
  education?: Education[]
  awards?: string[]
  projects?: string[]
  createdAt?: Date
  updatedAt?: Date
}
