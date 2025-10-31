import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

const GALLERIES_COLLECTION = 'galleries'

// GET /api/galleries - Get all galleries with filters
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    
    // Get query parameters
    const category = searchParams.get('category')
    const propertyId = searchParams.get('propertyId')
    const featured = searchParams.get('featured')
    const isPublic = searchParams.get('public')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Build filter
    const filter: any = { isActive: true }
    
    if (category) {
      filter.category = category
    }
    
    if (propertyId) {
      filter.propertyId = propertyId
    }
    
    if (featured === 'true') {
      filter.isFeatured = true
    }

    if (isPublic === 'true') {
      filter.isPublic = true
    }

    // Get galleries with pagination
    const galleries = await db.collection(GALLERIES_COLLECTION)
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get total count
    const total = await db.collection(GALLERIES_COLLECTION).countDocuments(filter)

    return NextResponse.json({
      success: true,
      data: galleries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching galleries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch galleries' },
      { status: 500 }
    )
  }
}

// POST /api/galleries - Create new gallery
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Create gallery document
    const gallery = {
      ...body,
      slug,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection(GALLERIES_COLLECTION).insertOne(gallery)

    return NextResponse.json({
      success: true,
      data: { ...gallery, _id: result.insertedId }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating gallery:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create gallery' },
      { status: 500 }
    )
  }
}
