import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { PROPERTIES_COLLECTION } from '@/lib/models/Property'
import { withCache, CacheTTL, apiCache } from '@/lib/cache'

// GET /api/properties - List properties with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')

    // Build cache key
    const cacheKey = `properties:${status || 'all'}:${type || 'all'}:${category || 'all'}:${featured || 'all'}:${skip}:${limit}`

    const result = await withCache(
      cacheKey,
      async () => {
        const { db } = await connectToDatabase()
        
        // Build filter
        const filter: any = { isActive: { $ne: false } }
        if (status) filter.status = status
        if (type) filter.type = type
        if (category) filter.category = category
        if (featured === 'true') filter.isFeatured = true

        const properties = await db
          .collection(PROPERTIES_COLLECTION)
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .toArray()

        const total = await db.collection(PROPERTIES_COLLECTION).countDocuments(filter)

        return {
          properties,
          pagination: {
            total,
            skip,
            limit,
            hasMore: skip + properties.length < total
          }
        }
      },
      CacheTTL.MEDIUM
    )

    const { properties, pagination } = result

    return NextResponse.json({ 
      success: true, 
      data: properties,
      pagination
    })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

// POST /api/properties - Create a new property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Create property document
    const propertyData = {
      ...body,
      slug,
      id: `prop-${Date.now()}`,
      views: 0,
      inquiries: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection(PROPERTIES_COLLECTION).insertOne(propertyData)

    // Clear cache for instant updates
    apiCache.clear()

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...propertyData },
    })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create property' },
      { status: 500 }
    )
  }
}
