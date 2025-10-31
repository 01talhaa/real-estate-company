import { NextResponse } from 'next/server'
import { initializeDatabase } from '@/lib/db-init'

/**
 * Initialize database indexes
 * POST /api/admin/db-init
 * This endpoint should be called once during deployment or when schema changes
 */
export async function POST() {
  try {
    await initializeDatabase()
    
    return NextResponse.json({
      success: true,
      message: 'Database indexes initialized successfully',
    })
  } catch (error) {
    console.error('Error initializing database:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to initialize database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Check database index status
 * GET /api/admin/db-init
 */
export async function GET() {
  try {
    const { connectToDatabase } = await import('@/lib/mongodb')
    const { PROPERTIES_COLLECTION } = await import('@/lib/models/Property')
    const { INSIGHTS_COLLECTION } = await import('@/lib/models/Insight')
    const { GALLERIES_COLLECTION } = await import('@/lib/models/Gallery')
    const { SERVICES_COLLECTION } = await import('@/lib/models/Service')
    const { TEAM_COLLECTION } = await import('@/lib/models/TeamMember')
    
    const { db } = await connectToDatabase()
    
    // Get index information for all collections
    const propertyIndexes = await db.collection(PROPERTIES_COLLECTION).indexes()
    const insightIndexes = await db.collection(INSIGHTS_COLLECTION).indexes()
    const galleryIndexes = await db.collection(GALLERIES_COLLECTION).indexes()
    const serviceIndexes = await db.collection(SERVICES_COLLECTION).indexes()
    const teamIndexes = await db.collection(TEAM_COLLECTION).indexes()
    
    return NextResponse.json({
      success: true,
      indexes: {
        properties: propertyIndexes,
        insights: insightIndexes,
        galleries: galleryIndexes,
        services: serviceIndexes,
        team: teamIndexes,
      },
    })
  } catch (error) {
    console.error('Error fetching database indexes:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch database indexes',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
