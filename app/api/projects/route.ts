import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { PROJECTS_COLLECTION } from '@/lib/models/Project'
import { ObjectId } from 'mongodb'
import { withCache, CacheTTL, apiCache } from '@/lib/cache'

// GET /api/projects - List all projects
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    const page = searchParams.get('page') || '1'
    
    // Build cache key based on query params
    const cacheKey = `projects:${status || 'all'}:${featured || 'all'}:${limit || 'all'}:${page}`
    
    // Use cache with 5 minute TTL for project listings
    const projects = await withCache(
      cacheKey,
      async () => {
        const { db } = await connectToDatabase()
        
        // Build query filter
        const filter: any = {}
        if (status) filter.status = status
        if (featured) filter.featured = featured === 'true'
        
        // Optimize query with projection (only fetch needed fields for listings)
        const projection = {
          _id: 1,
          id: 1,
          title: 1,
          slug: 1,
          description: 1,
          status: 1,
          featured: 1,
          coverImage: 1,
          category: 1,
          location: 1,
          stats: 1,
          startDate: 1,
          completionDate: 1,
          createdAt: 1,
          updatedAt: 1,
        }
        
        let query = db
          .collection(PROJECTS_COLLECTION)
          .find(filter, { projection })
          .sort({ featured: -1, createdAt: -1 })
        
        // Apply pagination if limit is specified
        if (limit) {
          const limitNum = parseInt(limit)
          const skip = (parseInt(page) - 1) * limitNum
          query = query.skip(skip).limit(limitNum)
        }
        
        return await query.toArray()
      },
      CacheTTL.MEDIUM
    )

    return NextResponse.json({ success: true, data: projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()

    // Create project document
    const projectData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection(PROJECTS_COLLECTION).insertOne(projectData)

    // Invalidate cache when new project is created
    apiCache.clear()

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...projectData },
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
