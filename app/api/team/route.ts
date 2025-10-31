import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { TEAM_COLLECTION, TeamMemberDocument } from '@/lib/models/TeamMember'
import { withCache, CacheTTL, apiCache } from '@/lib/cache'

// GET all team members
export async function GET() {
  try {
    // Cache team members with 30 minute TTL (team doesn't change often)
    const teamMembers = await withCache(
      'team:all',
      async () => {
        const { db } = await connectToDatabase()
        return await db
          .collection(TEAM_COLLECTION)
          .find({})
          .sort({ order: 1, createdAt: -1 })
          .toArray()
      },
      CacheTTL.LONG
    )

    return NextResponse.json({
      success: true,
      data: teamMembers,
    })
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members' },
      { status: 500 }
    )
  }
}

// POST create new team member
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()

    const teamMember: TeamMemberDocument = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection(TEAM_COLLECTION).insertOne(teamMember)

    // Invalidate cache when new team member is created
    apiCache.delete('team:all')

    return NextResponse.json({
      success: true,
      data: { ...teamMember, _id: result.insertedId },
    })
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create team member' },
      { status: 500 }
    )
  }
}
