import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { withCache, CacheTTL, apiCache } from '@/lib/cache'

const INSIGHTS_COLLECTION = 'insights'

// GET /api/insights - Get all insights with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get query parameters
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const featured = searchParams.get('featured')
    const status = searchParams.get('status') || 'published'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build cache key
    const cacheKey = `insights:${category || 'all'}:${tag || 'all'}:${featured || 'all'}:${status}:${page}:${limit}`

    const result = await withCache(
      cacheKey,
      async () => {
        const { db } = await connectToDatabase()

        // Build filter
        const filter: any = { isActive: true }
        
        if (status) {
          filter.status = status
        }
        
        if (category) {
          filter.category = category
        }
        
        if (tag) {
          filter.tags = tag
        }
        
        if (featured === 'true') {
          filter.isFeatured = true
        }

        // Get insights with pagination
        const insights = await db.collection(INSIGHTS_COLLECTION)
          .find(filter)
          .sort({ publishedAt: -1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .toArray()

        // Get total count
        const total = await db.collection(INSIGHTS_COLLECTION).countDocuments(filter)

        return {
          insights,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      },
      CacheTTL.MEDIUM
    )

    const { insights, pagination } = result

    return NextResponse.json({
      success: true,
      data: insights,
      pagination
    })
  } catch (error) {
    console.error('Error fetching insights:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch insights' },
      { status: 500 }
    )
  }
}

// POST /api/insights - Create new insight
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Create insight document
    const insight = {
      ...body,
      slug,
      views: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: body.status === 'published' ? new Date() : null
    }

    const result = await db.collection(INSIGHTS_COLLECTION).insertOne(insight)

    // Clear cache for instant updates
    apiCache.clear()

    return NextResponse.json({
      success: true,
      data: { ...insight, _id: result.insertedId }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating insight:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create insight' },
      { status: 500 }
    )
  }
}
