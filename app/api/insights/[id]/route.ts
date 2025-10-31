import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

const INSIGHTS_COLLECTION = 'insights'

// GET /api/insights/[id] - Get single insight
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { db } = await connectToDatabase()
    const { id } = await params

    // Try to find by _id, id, or slug
    const filter: any = { 
      $or: [{ id: id }, { slug: id }],
      isActive: true
    }
    if (ObjectId.isValid(id)) {
      filter.$or.unshift({ _id: new ObjectId(id) })
    }

    const insight = await db.collection(INSIGHTS_COLLECTION).findOne(filter)

    if (!insight) {
      return NextResponse.json(
        { success: false, error: 'Insight not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await db.collection(INSIGHTS_COLLECTION).updateOne(
      { _id: insight._id },
      { $inc: { views: 1 } }
    )

    return NextResponse.json({
      success: true,
      data: { ...insight, views: insight.views + 1 }
    })
  } catch (error) {
    console.error('Error fetching insight:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch insight' },
      { status: 500 }
    )
  }
}

// PUT /api/insights/[id] - Update insight
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { db } = await connectToDatabase()
    const { id } = await params
    const body = await request.json()

    // Generate new slug if title changed
    if (body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }

    // Update publishedAt if status changed to published
    if (body.status === 'published' && !body.publishedAt) {
      body.publishedAt = new Date()
    }

    const updateData = {
      ...body,
      updatedAt: new Date()
    }

    const filter: any = { $or: [{ id: id }] }
    if (ObjectId.isValid(id)) {
      filter.$or.unshift({ _id: new ObjectId(id) })
    }

    const result = await db.collection(INSIGHTS_COLLECTION).findOneAndUpdate(
      filter,
      { $set: updateData },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Insight not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error updating insight:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update insight' },
      { status: 500 }
    )
  }
}

// DELETE /api/insights/[id] - Soft delete insight
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { db } = await connectToDatabase()
    const { id } = await params

    const filter: any = { $or: [{ id: id }] }
    if (ObjectId.isValid(id)) {
      filter.$or.unshift({ _id: new ObjectId(id) })
    }

    const result = await db.collection(INSIGHTS_COLLECTION).findOneAndUpdate(
      filter,
      { $set: { isActive: false, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Insight not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Insight deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting insight:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete insight' },
      { status: 500 }
    )
  }
}
