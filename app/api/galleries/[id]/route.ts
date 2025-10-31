import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

const GALLERIES_COLLECTION = 'galleries'

// GET /api/galleries/[id] - Get single gallery
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const { id } = params

    // Try to find by _id, id, or slug
    const filter: any = { 
      $or: [{ id: id }, { slug: id }],
      isActive: true
    }
    if (ObjectId.isValid(id)) {
      filter.$or.unshift({ _id: new ObjectId(id) })
    }

    const gallery = await db.collection(GALLERIES_COLLECTION).findOne(filter)

    if (!gallery) {
      return NextResponse.json(
        { success: false, error: 'Gallery not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: gallery
    })
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery' },
      { status: 500 }
    )
  }
}

// PUT /api/galleries/[id] - Update gallery
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const { id } = params
    const body = await request.json()

    // Generate new slug if title changed
    if (body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }

    const updateData = {
      ...body,
      updatedAt: new Date()
    }

    const filter: any = { $or: [{ id: id }] }
    if (ObjectId.isValid(id)) {
      filter.$or.unshift({ _id: new ObjectId(id) })
    }

    const result = await db.collection(GALLERIES_COLLECTION).findOneAndUpdate(
      filter,
      { $set: updateData },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Gallery not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error updating gallery:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update gallery' },
      { status: 500 }
    )
  }
}

// DELETE /api/galleries/[id] - Soft delete gallery
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const { id } = params

    const filter: any = { $or: [{ id: id }] }
    if (ObjectId.isValid(id)) {
      filter.$or.unshift({ _id: new ObjectId(id) })
    }

    const result = await db.collection(GALLERIES_COLLECTION).findOneAndUpdate(
      filter,
      { $set: { isActive: false, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Gallery not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Gallery deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting gallery:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete gallery' },
      { status: 500 }
    )
  }
}
